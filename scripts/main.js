/* ============================================================
   main.js — navigation, scroll state, active links, toggles
   ============================================================ */

(function () {
  "use strict";

  var nav = document.querySelector(".nav");
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.querySelector(".nav-menu");

  /* --- mobile menu --- */
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      toggle.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest(".nav-link")) {
        menu.classList.remove("is-open");
        toggle.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* --- nav background on scroll --- */
  function onScroll() {
    if (nav) nav.classList.toggle("is-scrolled", window.scrollY > 24);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* --- active section link (index page only) --- */
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav-link[href^="#"]'));
  var sections = links
    .map(function (l) {
      var id = l.getAttribute("href").slice(1);
      return id ? document.getElementById(id) : null;
    })
    .filter(Boolean);

  if (sections.length && "IntersectionObserver" in window) {
    var byId = {};
    links.forEach(function (l) { byId[l.getAttribute("href").slice(1)] = l; });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (l) { l.classList.remove("is-active"); });
          var active = byId[en.target.id];
          if (active) active.classList.add("is-active");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

    sections.forEach(function (s) { io.observe(s); });
  }

  /* --- Work split-index: hover/focus updates the preview pane --- */
  var preview = document.querySelector(".work-preview");
  if (preview) {
    var pImg = preview.querySelector(".preview-img");
    var pName = preview.querySelector(".preview-name");
    var pKind = preview.querySelector(".preview-kind");
    var pCount = preview.querySelector(".preview-count");
    var pDock = preview.querySelector(".preview-dock");
    var rows = Array.prototype.slice.call(document.querySelectorAll(".index-row"));
    var pad = function (n) { return (n < 10 ? "0" : "") + n; };
    var scrub = { imgs: [], idx: 0, busy: false };

    function activate(row) {
      var i = +row.getAttribute("data-index");
      rows.forEach(function (r) { r.classList.remove("is-active"); });
      row.classList.add("is-active");
      var img = row.getAttribute("data-img");
      var imgs = row.getAttribute("data-imgs");
      scrub.imgs = imgs ? imgs.split(",") : (img ? [img] : []);
      scrub.idx = 0;
      if (img) {
        pImg.src = img;
        pImg.alt = row.getAttribute("data-title");
        preview.classList.remove("no-img");
      } else {
        preview.classList.add("no-img");
      }
      if (pName) pName.textContent = row.getAttribute("data-title");
      if (pKind) pKind.textContent = row.getAttribute("data-kind") + " · " + row.getAttribute("data-year");
      if (pCount) pCount.textContent = pad(i + 1) + " / " + pad(rows.length);
      if (window.WorkSchematic) window.WorkSchematic.reseed(i);
    }

    rows.forEach(function (row) {
      row.addEventListener("mouseenter", function () { activate(row); });
      row.addEventListener("focus", function () { activate(row); });
    });
    if (rows.length) activate(rows[0]);

    /* Cursor-scrubbed preview (desktop pointers only): horizontal cursor
       position inside the dock scrubs through the project's image sequence.
       A dead zone around the center holds the current frame, and a new
       frame isn't requested until the previous one has decoded. */
    var finePointer = window.matchMedia && window.matchMedia("(pointer: fine)").matches;
    var noMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (pDock && finePointer && !noMotion) {
      pDock.addEventListener("pointermove", function (e) {
        var n = scrub.imgs.length;
        if (n < 2 || scrub.busy) return;
        var r = pDock.getBoundingClientRect();
        var mid = r.left + r.width / 2;
        var dz = Math.max(r.width * 0.05, 30);      // center dead zone
        var dx = e.clientX - mid;
        if (Math.abs(dx) < dz) return;               // inside — hold
        // map distance past the dead-zone edge → 0..1 across the half
        var half = r.width / 2 - dz;
        var p = (Math.abs(dx) - dz) / half;
        p = p < 0 ? 0 : p > 1 ? 1 : p;
        var prog = dx < 0 ? 0.5 - p * 0.5 : 0.5 + p * 0.5; // full 0..1 sweep
        var idx = Math.round(prog * (n - 1));
        if (idx === scrub.idx) return;
        scrub.busy = true;
        var next = new Image();
        next.onload = function () {
          scrub.idx = idx;
          pImg.src = scrub.imgs[idx];
          scrub.busy = false;
        };
        next.onerror = function () { scrub.busy = false; };
        next.src = scrub.imgs[idx];
      }, { passive: true });
    }
  }

  /* --- "show more" toggles (experience / projects) --- */
  document.querySelectorAll("[data-toggle]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var target = document.querySelector(btn.getAttribute("data-toggle"));
      if (!target) return;
      var expanded = target.classList.toggle("is-expanded");
      btn.setAttribute("aria-expanded", expanded ? "true" : "false");
      btn.textContent = expanded
        ? btn.getAttribute("data-less") || "Show less"
        : btn.getAttribute("data-more") || "Show more";
    });
  });
})();
