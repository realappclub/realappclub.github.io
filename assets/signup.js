/* Real App Club checklist signup.
 * The form's data-source attribute is sent as `source` with each signup (consent record).
 */
(function () {
  "use strict";
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

  for (var i = 0; i < forms.length; i++) {
    var f = forms[i];
    var b = f.querySelector("button[type=submit]");
    if (b) b.disabled = true;
    msg(f, MSG_OFF, "off");
    f.addEventListener("submit", function (e) { e.preventDefault(); });
  }
})();
