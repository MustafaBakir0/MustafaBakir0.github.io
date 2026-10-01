/* ============================================================
   contact.js — async Formspree submit + inline status
   ============================================================ */

(function () {
  "use strict";

  var form = document.getElementById("contact-form");
  if (!form) return;

  var status = form.querySelector(".form-status");
  var submitBtn = form.querySelector('button[type="submit"]');
  var defaultLabel = submitBtn ? submitBtn.textContent : "Send message";

  function setStatus(msg, kind) {
    if (!status) return;
    status.textContent = msg;
    status.className = "form-status" + (kind ? " " + kind : "");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    setStatus("Sending…", "");
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Sending…"; }

    fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" }
    })
      .then(function (res) {
        if (res.ok) {
          form.reset();
          setStatus("Thanks — your message is on its way. I'll reply soon.", "ok");
        } else {
          return res.json().then(function (data) {
            var msg = data && data.errors
              ? data.errors.map(function (x) { return x.message; }).join(", ")
              : "Something went wrong. Please email mb9457@nyu.edu instead.";
            setStatus(msg, "err");
          });
        }
      })
      .catch(function () {
        setStatus("Network error. Please email mb9457@nyu.edu instead.", "err");
      })
      .finally(function () {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = defaultLabel; }
      });
  });
})();
