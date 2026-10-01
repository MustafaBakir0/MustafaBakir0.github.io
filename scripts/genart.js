/* ============================================================
   genart.js — generative-art engine + the sketch family
   Engine enforces the house perf rules for every sketch:
     • DPR-aware sizing
     • continuous clock, paused when tab hidden or off-screen
     • prefers-reduced-motion → one static frame, no loop
   A sketch is: { setup(ctx, env), frame(ctx, env, t), reducedT? }
   env = { w, h, dpr, reduced, pointer:{x,y,inside}, vel:{x,y}, dt, scroll }

   Sketch family (each its own rule-set + primitive):
     1. flow-field divider   → streamlines (lines/trails)
     2. about dot-field      → dot grid, driven by scroll
     3. work schematic       → orthogonal node/edge graph, hover-seeded
     4. contact kinetic type → drifting mono glyphs, cursor-repelled
   ============================================================ */

(function () {
  "use strict";

  var REDUCED = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function debounce(fn, ms) {
    var t;
    return function () { clearTimeout(t); t = setTimeout(fn, ms); };
  }

  function mount(canvas, sketch) {
    if (!canvas || !canvas.getContext) return null;
    var ctx = canvas.getContext("2d");

    var env = {
      w: 0, h: 0, dpr: 1, reduced: REDUCED, dt: 0, scroll: 0,
      pointer: { x: 0, y: 0, inside: false },
      vel: { x: 0, y: 0 }
    };

    var running = false, raf = 0, acc = 0, playStart = 0, lastNow = 0;
    var visible = !document.hidden, onscreen = true, ready = false;

    function resize() {
      var w = canvas.clientWidth, h = canvas.clientHeight;
      if (!w || !h) return;
      env.dpr = Math.min(window.devicePixelRatio || 1, 2);
      env.w = w; env.h = h;
      canvas.width = Math.round(w * env.dpr);
      canvas.height = Math.round(h * env.dpr);
      ctx.setTransform(env.dpr, 0, 0, env.dpr, 0, 0);
      if (sketch.setup) sketch.setup(ctx, env);
      ready = true;
      if (REDUCED) staticFrame();
    }

    function staticFrame() {
      var t = sketch.reducedT != null ? sketch.reducedT : 2.6;
      (sketch.reducedFrame || sketch.frame)(ctx, env, t);
    }

    function loop(now) {
      if (!running) return;
      env.dt = Math.min((now - lastNow) / 1000, 0.05);
      lastNow = now;
      var t = (acc + (now - playStart)) / 1000;
      sketch.frame(ctx, env, t);
      raf = requestAnimationFrame(loop);
    }

    function play() {
      if (running || REDUCED || !visible || !onscreen || !ready) return;
      running = true;
      playStart = performance.now();
      lastNow = playStart;
      raf = requestAnimationFrame(loop);
    }

    function pause() {
      if (!running) return;
      acc += performance.now() - playStart;
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    }

    if (!REDUCED) {
      canvas.addEventListener("pointermove", function (e) {
        var r = canvas.getBoundingClientRect();
        var nx = e.clientX - r.left, ny = e.clientY - r.top;
        env.vel.x = nx - env.pointer.x;
        env.vel.y = ny - env.pointer.y;
        env.pointer.x = nx; env.pointer.y = ny; env.pointer.inside = true;
      }, { passive: true });
      canvas.addEventListener("pointerleave", function () { env.pointer.inside = false; });
    }

    document.addEventListener("visibilitychange", function () {
      visible = !document.hidden;
      if (visible) play(); else pause();
    });

    window.addEventListener("scroll", function () {
      env.scroll = window.scrollY;
    }, { passive: true });

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) {
        onscreen = es[0].isIntersecting;
        if (onscreen) play(); else pause();
      }, { threshold: 0.01 }).observe(canvas);
    }

    window.addEventListener("resize", debounce(resize, 150));

    resize();
    if (!REDUCED) play();

    return { play: play, pause: pause, resize: resize, env: env, sketch: sketch };
  }

  // seeded RNG (mulberry32) — shared helper for deterministic sketches
  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // cheap smooth field (layered trig) — avoids a full Perlin dependency
  function field(x, y, t) {
    return Math.sin(x * 0.011 + t * 0.35) +
           Math.cos(y * 0.017 - t * 0.28) +
           Math.sin((x + y) * 0.008 + t * 0.18);
  }

  window.GenArt = { mount: mount, reduced: REDUCED, rng: rng, field: field };
})();

/* ============================================================
   The sketches
   ============================================================ */
(function () {
  "use strict";
  if (!window.GenArt) return;

  var CYAN = [69, 224, 200];
  var VIOLET = [139, 124, 255];
  var field = GenArt.field;

  function mix(a, b, t) {
    return [Math.round(a[0] + (b[0] - a[0]) * t),
            Math.round(a[1] + (b[1] - a[1]) * t),
            Math.round(a[2] + (b[2] - a[2]) * t)];
  }
  function rgba(c, a) { return "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + a + ")"; }

  /* --- 1. FLOW-FIELD DIVIDER — streamlines combed by a vector field --- */
  function makeFlow() {
    var ps = [];
    return {
      setup: function (ctx, env) {
        var n = Math.max(18, Math.min(110, Math.round(env.w / 14)));
        ps = [];
        for (var i = 0; i < n; i++) {
          ps.push({
            x: Math.random() * env.w, y: Math.random() * env.h,
            px: 0, py: 0, life: Math.random() * 100
          });
        }
        ctx.clearRect(0, 0, env.w, env.h);
      },
      frame: function (ctx, env, t) {
        ctx.fillStyle = "rgba(11,14,20,0.14)";
        ctx.fillRect(0, 0, env.w, env.h);
        ctx.lineWidth = 1;
        for (var i = 0; i < ps.length; i++) {
          var p = ps[i];
          p.px = p.x; p.py = p.y;
          var a = field(p.x, p.y, t) * Math.PI;
          p.x += Math.cos(a) * 1.1;
          p.y += Math.sin(a) * 1.1;
          p.life -= 1;
          if (p.x < 0 || p.x > env.w || p.y < 0 || p.y > env.h || p.life < 0) {
            p.x = Math.random() * env.w; p.y = Math.random() * env.h;
            p.px = p.x; p.py = p.y; p.life = 60 + Math.random() * 90;
            continue;
          }
          var c = mix(CYAN, VIOLET, p.x / env.w);
          ctx.strokeStyle = rgba(c, 0.5);
          ctx.beginPath();
          ctx.moveTo(p.px, p.py);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        }
      },
      reducedFrame: function (ctx, env) {
        ctx.clearRect(0, 0, env.w, env.h);
        ctx.lineWidth = 1;
        for (var y = 8; y < env.h; y += 16) {
          for (var x = 8; x < env.w; x += 22) {
            var a = field(x, y, 2.0) * Math.PI;
            var c = mix(CYAN, VIOLET, x / env.w);
            ctx.strokeStyle = rgba(c, 0.4);
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + Math.cos(a) * 9, y + Math.sin(a) * 9);
            ctx.stroke();
          }
        }
      }
    };
  }

  /* --- 2. ABOUT DOT-FIELD — dot lattice driven mostly by scroll --- */
  function makeDots(canvas) {
    var pts = [], step = 26;
    function progress() {
      var r = canvas.getBoundingClientRect();
      var vh = window.innerHeight || 800;
      return Math.max(0, Math.min(1, (vh * 0.55 - r.top) / (r.height + vh * 0.5)));
    }
    return {
      reducedT: 0,
      setup: function (ctx, env) {
        step = env.w < 480 ? 22 : 28;
        pts = [];
        for (var y = step / 2; y < env.h; y += step)
          for (var x = step / 2; x < env.w; x += step)
            pts.push({ x: x, y: y });
      },
      frame: function (ctx, env, t) {
        ctx.clearRect(0, 0, env.w, env.h);
        var phase = progress() * 7 + t * 0.22;
        for (var i = 0; i < pts.length; i++) {
          var p = pts[i];
          var v = (field(p.x * 1.4, p.y * 1.4, phase) + 3) / 6;
          var r = 0.6 + v * v * 3.1;
          var c = mix(CYAN, VIOLET, Math.min(1, (p.y / env.h) * 0.6 + v * 0.5));
          ctx.fillStyle = rgba(c, 0.12 + v * 0.55);
          ctx.beginPath();
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };
  }

  /* --- 3. WORK SCHEMATIC — seeded orthogonal node/edge graph --- */
  function makeSchematic() {
    var nodes = [], edges = [], appear = 1, seed = 1, W = 0, H = 0;

    function build(env) {
      W = env.w; H = env.h;
      var rand = GenArt.rng(seed * 2654435761);
      var cols = 4, rows = 5;
      var cw = env.w / cols, ch = env.h / rows;
      nodes = [];
      for (var gy = 0; gy < rows; gy++) {
        for (var gx = 0; gx < cols; gx++) {
          if (rand() < 0.32) continue;
          nodes.push({
            x: cw * (gx + 0.5) + (rand() - 0.5) * cw * 0.4,
            y: ch * (gy + 0.5) + (rand() - 0.5) * ch * 0.4,
            r: rand() < 0.25 ? 3.4 : 2
          });
        }
      }
      edges = [];
      for (var i = 0; i < nodes.length; i++) {
        var best = -1, bd = 1e9;
        for (var j = 0; j < nodes.length; j++) {
          if (i === j) continue;
          var dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
          var d = dx * dx + dy * dy;
          if (d < bd) { bd = d; best = j; }
        }
        if (best >= 0 && i < best) edges.push([i, best, rand()]);
      }
    }

    return {
      reducedT: 1.5,
      setup: function (ctx, env) { build(env); },
      reseed: function (env, s) { seed = s; appear = 0; build(env); },
      frame: function (ctx, env, t) {
        if (env.w !== W || env.h !== H) build(env);
        appear = Math.min(1, appear + env.dt * 2.4);
        ctx.clearRect(0, 0, env.w, env.h);

        for (var e = 0; e < edges.length; e++) {
          var a = nodes[edges[e][0]], b = nodes[edges[e][1]];
          if (!a || !b) continue;
          ctx.strokeStyle = rgba(mix(CYAN, VIOLET, a.x / env.w), 0.28 * appear);
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
          var seg = edges[e][2];
          var phase = (t * 0.35 + seg) % 1;
          var lenH = Math.abs(b.x - a.x), lenV = Math.abs(b.y - a.y);
          var total = lenH + lenV, along = phase * total, px, py;
          if (along < lenH) { px = a.x + Math.sign(b.x - a.x) * along; py = a.y; }
          else { px = b.x; py = a.y + Math.sign(b.y - a.y) * (along - lenH); }
          ctx.fillStyle = rgba(CYAN, 0.8 * appear);
          ctx.fillRect(px - 1, py - 1, 2, 2);
        }
        for (var n = 0; n < nodes.length; n++) {
          var nd = nodes[n];
          var pulse = 1 + Math.sin(t * 1.6 + n) * 0.12;
          ctx.strokeStyle = rgba(VIOLET, 0.55 * appear);
          ctx.fillStyle = "rgba(11,14,20,1)";
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(nd.x, nd.y, nd.r * pulse, 0, Math.PI * 2);
          ctx.fill(); ctx.stroke();
        }
      }
    };
  }

  /* --- 4. CONTACT KINETIC TYPE — drifting glyphs, cursor-repelled --- */
  function makeType() {
    var GLYPHS = "01<>/{}#*+=;·—".split("");
    var ps = [];
    return {
      setup: function (ctx, env) {
        var n = Math.max(14, Math.min(60, Math.round(env.w / 26)));
        ps = [];
        for (var i = 0; i < n; i++) {
          ps.push({
            x: Math.random() * env.w, y: Math.random() * env.h,
            vx: (Math.random() - 0.5) * 12, vy: (Math.random() - 0.5) * 12,
            ch: GLYPHS[(Math.random() * GLYPHS.length) | 0],
            s: 10 + Math.random() * 12, tone: Math.random()
          });
        }
      },
      frame: function (ctx, env, t) {
        ctx.clearRect(0, 0, env.w, env.h);
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        for (var i = 0; i < ps.length; i++) {
          var p = ps[i];
          if (env.pointer.inside) {
            var dx = p.x - env.pointer.x, dy = p.y - env.pointer.y;
            var d2 = dx * dx + dy * dy;
            if (d2 < 9000 && d2 > 0.01) {
              var f = (9000 - d2) / 9000 * 46;
              var d = Math.sqrt(d2);
              p.vx += (dx / d) * f * env.dt * 6;
              p.vy += (dy / d) * f * env.dt * 6;
            }
          }
          p.vx *= 0.96; p.vy *= 0.96;
          p.x += p.vx * env.dt * 10;
          p.y += p.vy * env.dt * 10;
          if (p.x < -10) p.x = env.w + 10; if (p.x > env.w + 10) p.x = -10;
          if (p.y < -10) p.y = env.h + 10; if (p.y > env.h + 10) p.y = -10;
          var c = p.tone < 0.5 ? CYAN : VIOLET;
          ctx.fillStyle = rgba(c, 0.22 + p.tone * 0.4);
          ctx.font = p.s + "px 'JetBrains Mono', monospace";
          ctx.fillText(p.ch, p.x, p.y);
        }
      },
      reducedFrame: function (ctx, env) {
        ctx.clearRect(0, 0, env.w, env.h);
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        for (var i = 0; i < ps.length; i++) {
          var p = ps[i];
          var c = p.tone < 0.5 ? CYAN : VIOLET;
          ctx.fillStyle = rgba(c, 0.3 + p.tone * 0.35);
          ctx.font = p.s + "px 'JetBrains Mono', monospace";
          ctx.fillText(p.ch, p.x, p.y);
        }
      }
    };
  }

  /* --- Mounts --- */
  function init() {
    Array.prototype.forEach.call(document.querySelectorAll(".divider-canvas"), function (c) {
      GenArt.mount(c, makeFlow());
    });

    var about = document.getElementById("about-canvas");
    if (about) GenArt.mount(about, makeDots(about));

    var sch = document.getElementById("work-schematic");
    if (sch) {
      var s = makeSchematic();
      var ctrl = GenArt.mount(sch, s);
      window.WorkSchematic = {
        reseed: function (i) { if (ctrl && s.reseed) s.reseed(ctrl.env, (i + 1) * 97 + 13); }
      };
    }

    var contact = document.getElementById("contact-canvas");
    if (contact) {
      var cc = GenArt.mount(contact, makeType());
      // canvas is pointer-events:none (form must stay usable), so feed the
      // pointer from the window and map it into canvas space.
      if (cc && !GenArt.reduced) {
        window.addEventListener("pointermove", function (e) {
          var r = contact.getBoundingClientRect();
          cc.env.pointer.x = e.clientX - r.left;
          cc.env.pointer.y = e.clientY - r.top;
          cc.env.pointer.inside =
            e.clientX >= r.left && e.clientX <= r.right &&
            e.clientY >= r.top && e.clientY <= r.bottom;
        }, { passive: true });
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else { init(); }
})();
