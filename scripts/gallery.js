/* ============================================================
   gallery.js — lightbox for project detail galleries
   ============================================================ */

(function () {
  "use strict";

  var gallery = document.querySelector("[data-gallery]");
  if (!gallery) return;

  var figures = Array.prototype.slice.call(gallery.querySelectorAll("figure"));
  if (!figures.length) return;

  var sources = figures.map(function (fig) {
    var img = fig.querySelector("img");
    return { src: img.getAttribute("src"), alt: img.getAttribute("alt") || "" };
  });

  // build lightbox
  var lb = document.createElement("div");
  lb.className = "lightbox";
  lb.setAttribute("role", "dialog");
  lb.setAttribute("aria-modal", "true");
  lb.setAttribute("aria-label", "Image viewer");
  lb.innerHTML =
    '<button class="lb-btn lb-close" aria-label="Close">✕</button>' +
    '<button class="lb-btn lb-prev" aria-label="Previous image">‹</button>' +
    '<img alt="">' +
    '<button class="lb-btn lb-next" aria-label="Next image">›</button>' +
    '<div class="lb-count"></div>';
  document.body.appendChild(lb);

  var lbImg = lb.querySelector("img");
  var lbCount = lb.querySelector(".lb-count");
  var current = 0;
  var lastFocus = null;

  function show(i) {
    current = (i + sources.length) % sources.length;
    lbImg.setAttribute("src", sources[current].src);
    lbImg.setAttribute("alt", sources[current].alt);
    lbCount.textContent = (current + 1) + " / " + sources.length;
  }

  function open(i) {
    lastFocus = document.activeElement;
    show(i);
    lb.classList.add("is-open");
    document.body.style.overflow = "hidden";
    lb.querySelector(".lb-close").focus();
  }

  function close() {
    lb.classList.remove("is-open");
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  figures.forEach(function (fig, i) {
    fig.setAttribute("tabindex", "0");
    fig.setAttribute("role", "button");
    fig.setAttribute("aria-label", "View image " + (i + 1) + " larger");
    fig.addEventListener("click", function () { open(i); });
    fig.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(i); }
    });
  });

  lb.querySelector(".lb-close").addEventListener("click", close);
  lb.querySelector(".lb-prev").addEventListener("click", function () { show(current - 1); });
  lb.querySelector(".lb-next").addEventListener("click", function () { show(current + 1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) close(); });

  document.addEventListener("keydown", function (e) {
    if (!lb.classList.contains("is-open")) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowLeft") show(current - 1);
    else if (e.key === "ArrowRight") show(current + 1);
  });
})();
