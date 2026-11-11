/* Real App Club checklist signup, Worker variant (double opt-in).
 * Used only when the site is built with --signup-worker=<url> (or --signup-test=<url>). build.py fills in WORKER_URL.
 * Posts the form to the signup Worker. The Worker queues the address and a confirm email follows.
 * The consent version is set by the Worker, not here.
 * No keys or secrets here.
 */
(function () {
  "use strict";
  var WORKER_URL = "https://rac-signup.realappclub.workers.dev";
  var MSG_SUCCESS = "Thanks. Check your inbox for a confirm link.";
  var MSG_ERROR = "Something went wrong. Please try again, or download the PDF above.";
  var MSG_EMAIL = "Please enter a valid email address.";

  var forms = document.querySelectorAll("form[data-nitro-form]");
  if (!forms.length) return;

  function msg(form, text, cls) {
    var el = form.querySelector("[data-nitro-message]");
    if (!el) return;
    el.textContent = text;
    el.className = "form-msg" + (cls ? " " + cls : "");
    el.removeAttribute("hidden");
  }

  function field(form, name) {
    var el = form.querySelector("[name=" + name + "]");
    return el ? el.value : "";
  }

  for (var i = 0; i < forms.length; i++) {
    forms[i].addEventListener("submit", function (e) {
      e.preventDefault();
      var form = e.target;
      var email = field(form, "email").trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { msg(form, MSG_EMAIL); return; }
      var btn = form.querySelector("button[type=submit]");
      if (btn) btn.disabled = true;
      // Form-encoded body keeps this a simple CORS request (no preflight).
      var body = new URLSearchParams({
        email: email,
        first_name: field(form, "first_name"),
        company: field(form, "company"), // honeypot
        source: form.getAttribute("data-source") || "",
        page: location.pathname
      });
      fetch(WORKER_URL + "/signup", { method: "POST", body: body, credentials: "omit" })
        .then(function (res) {
          if (res.status === 400) { msg(form, MSG_EMAIL); if (btn) btn.disabled = false; return; }
          if (!res.ok) throw new Error("status " + res.status);
          msg(form, MSG_SUCCESS);
          var next = form.getAttribute("data-thanks-url");
          if (next) window.location.href = next;
        })
        .catch(function () {
          msg(form, MSG_ERROR);
          if (btn) btn.disabled = false;
        });
    });
  }
})();
