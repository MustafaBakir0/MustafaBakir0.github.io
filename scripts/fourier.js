/* ============================================================
   fourier.js — the signature hero
   Rotating epicycles (a Fourier series) trace a looping
   signature curve. Nods to Mustafa's own "Drawing with
   Fourier Transform" and FFT audio-visualization work.
   Pure Canvas 2D — no libraries.
   ============================================================ */

(function () {
  "use strict";

  var canvas = document.getElementById("fourier-canvas");
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext("2d");

  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var CYAN = "#45E0C8";
  var VIOLET = "#8B7CFF";

  /* ---- 1. Build the signature path (a smooth closed flourish) ---- */
  function buildPath(samples) {
    var pts = [];
    for (var i = 0; i < samples; i++) {
      var th = (i / samples) * Math.PI * 2;
      // a few harmonics → an elegant, hand-drawn looking loop
      var x = Math.cos(th)
            + 0.42 * Math.cos(3 * th + 0.9)
            + 0.16 * Math.cos(7 * th)
            - 0.10 * Math.sin(2 * th);
      var y = Math.sin(th)
            + 0.42 * Math.sin(3 * th + 0.9)
            - 0.16 * Math.sin(5 * th)
            + 0.10 * Math.cos(2 * th);
      pts.push({ x: x, y: y });
    }
    return pts;
  }

  /* ---- 2. Discrete Fourier Transform → epicycles ---- */
  function dft(points) {
    var N = points.length;
    var out = [];
    for (var k = 0; k < N; k++) {
      var re = 0, im = 0;
      for (var n = 0; n < N; n++) {
        var phi = (2 * Math.PI * k * n) / N;
        var cos = Math.cos(phi), sin = Math.sin(phi);
        re += points[n].x * cos + points[n].y * sin;
        im += points[n].y * cos - points[n].x * sin;
      }
      re /= N; im /= N;
      out.push({
        freq: k,
        amp: Math.sqrt(re * re + im * im),
        phase: Math.atan2(im, re)
      });
    }
    out.sort(function (a, b) { return b.amp - a.amp; });
    return out;
  }

  var SAMPLES = 360;
  var rawPath = buildPath(SAMPLES);
  var epicycles = dft(rawPath);
  var MAX_EPI = Math.min(epicycles.length, 140); // approximation depth

  /* ---- 3. Sizing ---- */
  var W = 0, H = 0, DPR = 1;
  var cx = 0, cy = 0, scale = 1;
  var mouse = { x: 0, y: 0, active: false };
  var offset = { x: 0, y: 0 }; // eased parallax

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth;
    H = canvas.clientHeight;
    canvas.width = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    if (W > 900) {
      cx = W * 0.66; cy = H * 0.50;
      scale = Math.min(W * 0.26, H * 0.40);
    } else {
      cx = W * 0.5; cy = H * 0.44;
      scale = Math.min(W * 0.40, H * 0.30);
    }
    mouse.x = cx; mouse.y = cy;
  }

  /* precompute screen-space full path for the faint guide stroke */
  function screenPath() {
    var p = [];
    for (var i = 0; i < rawPath.length; i++) {
      p.push({
        x: cx + offset.x + rawPath[i].x * scale,
        y: cy + offset.y + rawPath[i].y * scale
      });
    }
    return p;
  }

  /* ---- 4. Drawing helpers ---- */
  function strokeCurve(path, from, to, styleFn) {
    if (to - from < 1) return;
    ctx.beginPath();
    ctx.moveTo(path[from].x, path[from].y);
    for (var i = from + 1; i <= to; i++) {
      var idx = i % path.length;
      ctx.lineTo(path[idx].x, path[idx].y);
    }
    styleFn();
    ctx.stroke();
  }

  function tipAt(t) {
    var x = cx + offset.x, y = cy + offset.y;
    for (var i = 0; i < MAX_EPI; i++) {
      var e = epicycles[i];
      var r = e.amp * scale;
      var ang = e.freq * t + e.phase;
      x += r * Math.cos(ang);
      y += r * Math.sin(ang);
    }
    return { x: x, y: y };
  }

  function drawEpicycles(t) {
    var x = cx + offset.x, y = cy + offset.y;
    ctx.lineWidth = 1;
    for (var i = 0; i < MAX_EPI; i++) {
      var e = epicycles[i];
      var r = e.amp * scale;
      if (r < 0.6) continue;
      var ang = e.freq * t + e.phase;
      var nx = x + r * Math.cos(ang);
      var ny = y + r * Math.sin(ang);
      // faint circle
      if (i < 60 && r > 2) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(138,148,166,0.10)";
        ctx.stroke();
      }
      // radius line
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(nx, ny);
      ctx.strokeStyle = "rgba(138,148,166,0.14)";
      ctx.stroke();
      x = nx; y = ny;
    }
    return { x: x, y: y };
  }

  /* ---- 5. Animation ---- */
  var t = 0;                     // epicycle phase 0..2π
  var speed = (Math.PI * 2) / (SAMPLES * 1.2); // radians per frame
  var trail = [];                // recent tip positions (comet)
  var MAX_TRAIL = 120;
  var cyclesDone = 0;
  var running = true;

  function drawGuide(revealTo) {
    var path = screenPath();
    var grad = ctx.createLinearGradient(cx - scale, cy - scale, cx + scale, cy + scale);
    grad.addColorStop(0, "rgba(69,224,200,0.22)");
    grad.addColorStop(1, "rgba(139,124,255,0.22)");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 1.4;
    strokeCurve(path, 0, revealTo, function () { ctx.strokeStyle = grad; });
  }

  function drawComet() {
    if (trail.length < 2) return;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (var i = 1; i < trail.length; i++) {
      var a = i / trail.length;             // 0 tail → 1 head
      var p0 = trail[i - 1], p1 = trail[i];
      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.lineTo(p1.x, p1.y);
      // cyan→violet along the comet
      ctx.strokeStyle = i > trail.length * 0.5
        ? "rgba(139,124,255," + a + ")"
        : "rgba(69,224,200," + a + ")";
      ctx.lineWidth = 1 + a * 2.4;
      ctx.stroke();
    }
    // glowing head
    var head = trail[trail.length - 1];
    ctx.shadowBlur = 18;
    ctx.shadowColor = VIOLET;
    ctx.beginPath();
    ctx.arc(head.x, head.y, 3.2, 0, Math.PI * 2);
    ctx.fillStyle = "#EAF7F4";
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  function frame() {
    if (!running) return;
    ctx.clearRect(0, 0, W, H);

    var revealFrac = cyclesDone >= 1 ? 1 : (t / (Math.PI * 2));
    var revealTo = Math.floor(revealFrac * (rawPath.length - 1));
    drawGuide(revealTo);

    var tip = drawEpicycles(t);
    trail.push(tip);
    if (trail.length > MAX_TRAIL) trail.shift();
    drawComet();

    // ease parallax offset toward pointer
    var tx = (mouse.x - cx) * 0.05;
    var ty = (mouse.y - cy) * 0.05;
    offset.x += (tx - offset.x) * 0.06;
    offset.y += (ty - offset.y) * 0.06;

    t += speed;
    if (t >= Math.PI * 2) { t -= Math.PI * 2; cyclesDone++; }

    requestAnimationFrame(frame);
  }

  /* ---- 6. Reduced motion: draw the finished curve once ---- */
  function drawStatic() {
    ctx.clearRect(0, 0, W, H);
    var path = screenPath();
    var grad = ctx.createLinearGradient(cx - scale, cy - scale, cx + scale, cy + scale);
    grad.addColorStop(0, CYAN);
    grad.addColorStop(1, VIOLET);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.8;
    strokeCurve(path, 0, path.length - 1, function () { ctx.strokeStyle = grad; });
    // close the loop
    ctx.beginPath();
    ctx.moveTo(path[path.length - 1].x, path[path.length - 1].y);
    ctx.lineTo(path[0].x, path[0].y);
    ctx.strokeStyle = grad;
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  /* ---- 7. Events ---- */
  window.addEventListener("resize", function () {
    resize();
    if (reduceMotion) drawStatic();
  });

  var heroEl = canvas.closest(".hero") || document.body;
  heroEl.addEventListener("pointermove", function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY - canvas.getBoundingClientRect().top;
    mouse.active = true;
  });
  heroEl.addEventListener("pointerleave", function () {
    mouse.x = cx; mouse.y = cy;
  });

  // pause when hero scrolled out of view or the tab is hidden (save CPU)
  var onscreen = true, visible = !document.hidden;
  function sync() {
    var shouldRun = onscreen && visible;
    if (shouldRun && !running) { running = true; requestAnimationFrame(frame); }
    else if (!shouldRun) { running = false; }
  }
  if (!reduceMotion) {
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        onscreen = entries[0].isIntersecting;
        sync();
      }, { threshold: 0.02 }).observe(heroEl);
    }
    document.addEventListener("visibilitychange", function () {
      visible = !document.hidden;
      sync();
    });
  }

  /* ---- 8. Go ---- */
  resize();
  if (reduceMotion) {
    drawStatic();
  } else {
    requestAnimationFrame(frame);
  }
})();
