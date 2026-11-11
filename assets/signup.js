/* Real App Club checklist signup.
 * Single opt-in. Loads the Nitrosend drop-in form script only when a public website key is set.
 * The form's data-source attribute is sent as `source` with each signup (consent record).
 * Use a public key (prefix wpkey_live_) only. Never put a secret key here.
 */
(function () {
  "use strict";
  var PUBLIC_KEY = ""; // TODO before launch: wpkey_live_... from the list's Website signup form panel
  var MSG_SUCCESS = "Thanks. You're on the list. You'll get the checklist and occasional updates. Unsubscribe anytime.";
  var MSG_ERROR = "Something went wrong. Please try again, or download the PDF above.";
  var MSG_OFF = "Email signup opens soon. The checklist is free to read and download on this page now.";

  var forms = document.querySelectorAll("form[data-nitro-form]");
  if (!forms.length) return;

  function msg(form, text, cls) {
    var el = form.querySelector("[data-nitro-message]");
    if (!el) return;
    el.textContent = text;
    el.className = "form-msg" + (cls ? " " + cls : "");
    el.removeAttribute("hidden");
  }

  if (!/^wpkey_live_/.test(PUBLIC_KEY)) {
    for (var i = 0; i < forms.length; i++) {
      var f = forms[i];
      var b = f.querySelector("button[type=submit]");
      if (b) b.disabled = true;
      msg(f, MSG_OFF, "off");
      f.addEventListener("submit", function (e) { e.preventDefault(); });
    }
    return;
  }

  // Replace the default messages with our own wording.
  document.addEventListener("nitro:success", function (e) {
    msg(e.target, MSG_SUCCESS);
    var next = e.target.getAttribute("data-thanks-url");
    if (next) window.location.href = next;
  });
  document.addEventListener("nitro:error", function (e) { msg(e.target, MSG_ERROR); });

  var s = document.createElement("script");
  s.src = "https://api.nitrosend.com/nitrosend-forms.js";
  s.setAttribute("data-public-key", PUBLIC_KEY);
  s.defer = true;
  document.head.appendChild(s);
})();
