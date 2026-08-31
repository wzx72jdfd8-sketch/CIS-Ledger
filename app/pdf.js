/**
 * Optional low-level PDF writer. v1.1.3 prints via CISDocHtml (browser Save as PDF).
 * Kept so app.html script order stays the same as the original zip.
 */
(function (root) {
  "use strict";
  root.CISPdf = {
    available: false,
    reason: "Use CISDocHtml.printHtml — browser print dialog to Save as PDF.",
  };
  if (typeof module !== "undefined" && module.exports) module.exports = root.CISPdf;
})(typeof globalThis !== "undefined" ? globalThis : this);
