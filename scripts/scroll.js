/* ============================================================
   scroll.js — RAF-driven scroll motion engine
   All scroll-linked motion reads scrollY inside a single
   requestAnimationFrame loop (frame-synced, never jittery)
   instead of reacting to scroll events directly.

   Systems:
     1. reveal-on-scroll (IntersectionObserver, one-shot)
     2. hero pin scrub — first stretch of scroll fades/translates
        the pinned hero's inner content 1:1 with scroll, then the
        page slides over it (two-phase hand-off)
     3. viewport scaling — tagged elements scale in from the
        bottom and back out at the top; scale = min(enter, exit),
        transform-origin varied by which half they sit in
     4. outro — past the content's end, a back-to-top pill scales
        0→1 and the footer fades, driven by one clamped progress
   ============================================================ */

(function () {
  "use strict";

  var reduce = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. reveal-on-scroll ---------- */
  var els = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    els.forEach(function (el) { el.classList.add("is-visible"); });
  } else if (els.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("is-visible");
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  }

  if (reduce) return; // everything below is motion — static site from here

  var clamp01 = function (v) { return v < 0 ? 0 : v > 1 ? 1 : v; };

  /* ---------- 2. hero pin scrub ---------- */
  var heroPin = document.querySelector(".hero-pin");
  var heroInner = document.querySelector(".hero-inner");
  var heroScrollHint = document.querySelector(".hero-scroll");
  if (heroInner) heroInner.style.willChange = "transform, opacity";

  /* ---------- 3. viewport scaling ---------- */
  // full 0→1 scale for gallery figures; subtle for index rows
  var scaled = [];
  document.querySelectorAll(".gallery figure").forEach(function (el) {
    scaled.push({ el: el, min: 0 });
  });
  document.querySelectorAll(".index-row").forEach(function (el) {
    scaled.push({ el: el, min: 0.9 });
  });
  scaled.forEach(function (s) {
    s.el.style.willChange = "transform";
    // directional origins: left-half elements scale from bottom-right,
    // right-half from bottom-left, so motion points toward the center
    var r = s.el.getBoundingClientRect();
    var mid = window.innerWidth / 2;
    s.el.style.transformOrigin =
      (r.left + r.width / 2) < mid ? "100% 100%" : "0% 100%";
  });

  /* ---------- 4. outro (injected back-to-top pill) ---------- */
  var toTop = null, footer = document.querySelector(".footer");
  if (document.documentElement.scrollHeight > window.innerHeight * 1.6) {
    toTop = document.createElement("button");
    toTop.className = "to-top";
    toTop.setAttribute("aria-label", "Back to top");
    toTop.innerHTML = "&uarr;";
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    document.body.appendChild(toTop);
  }

  /* ---------- the one RAF loop ---------- */
  var lastY = -1, ticking = true;

  function frame() {
    var y = window.scrollY;
    var vh = window.innerHeight;

    // skip all work when nothing moved (cheap idle)
    if (y !== lastY) {
      lastY = y;

      // hero scrub: over the pin's extra scroll room, inner content
      // drifts up and fades 1:1 with scroll (scrub, not timed)
      if (heroPin && heroInner) {
        var room = heroPin.offsetHeight - vh;
        if (room > 40) {
          var p = clamp01(y / room);
          heroInner.style.transform = "translateY(" + (-p * vh * 0.12) + "px)";
          heroInner.style.opacity = String(1 - p * 0.85);
          if (heroScrollHint) heroScrollHint.style.opacity = String(1 - p * 2);
        }
      }

      // viewport scaling — measured from layout offsets, not rects,
      // so the element's own scale never feeds back into the math
      for (var i = 0; i < scaled.length; i++) {
        var s = scaled[i];
        var el = s.el, docTop = 0, n = el;
        while (n) { docTop += n.offsetTop; n = n.offsetParent; }
        var top = docTop - y;               // viewport-relative, untransformed
        var bottom = top + el.offsetHeight;
        var sc;
        if (bottom <= 0 || top >= vh) {
          sc = s.min; // fully outside — park at min, no fancy math
        } else {
          // enters: top edge from bottom of viewport → 60% vh
          var enter = clamp01((vh - top) / (vh * 0.4));
          // exits: bottom edge from 40% vh → top of viewport
          var exit = clamp01(bottom / (vh * 0.4));
          sc = s.min + (1 - s.min) * Math.min(enter, exit);
        }
        el.style.transform = "scale(" + sc.toFixed(4) + ")";
        if (s.min === 0) el.style.opacity = String(clamp01(sc * 1.6));
      }

      // outro progress: (y - contentEnd) / lastViewport, clamped
      var docH = document.documentElement.scrollHeight;
      var op = clamp01((y - (docH - vh * 1.6)) / (vh * 0.6));
      if (toTop) {
        toTop.style.transform = "scale(" + op.toFixed(3) + ")";
        toTop.classList.toggle("is-live", op > 0.05);
      }
      if (footer) footer.style.opacity = String(0.25 + 0.75 * op);
    }

    if (ticking) requestAnimationFrame(frame);
  }

  // pause the loop when the tab is hidden
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) { ticking = false; }
    else if (!ticking) { ticking = true; lastY = -1; requestAnimationFrame(frame); }
  });

  lastY = -1;
  requestAnimationFrame(frame);
})();
