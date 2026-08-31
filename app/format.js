(function (root) {
  "use strict";

  function money(pence) {
    var n = Number(pence);
    if (!isFinite(n)) n = 0;
    var sign = n < 0 ? "-" : "";
    n = Math.abs(Math.round(n));
    var pounds = Math.floor(n / 100);
    var p = n % 100;
    var pStr = p < 10 ? "0" + p : String(p);
    var s = String(pounds);
    var out = "";
    while (s.length > 3) {
      out = "," + s.slice(-3) + out;
      s = s.slice(0, -3);
    }
    return sign + "£" + s + out + "." + pStr;
  }

  function moneyPlain(pence) {
    var n = Number(pence);
    if (!isFinite(n)) n = 0;
    var sign = n < 0 ? "-" : "";
    n = Math.abs(Math.round(n));
    var pounds = Math.floor(n / 100);
    var p = n % 100;
    return sign + pounds + "." + (p < 10 ? "0" + p : String(p));
  }

  function cisRateLabel(rate) {
    rate = Number(rate);
    if (rate === 0) return "0% — gross payment status";
    if (rate === 20) return "20% — registered (standard)";
    if (rate === 30) return "30% — higher rate (unverified / not registered)";
    return String(rate) + "%";
  }

  function categoryLabel(cat) {
    if (cat === "labour") return "Labour";
    if (cat === "materials") return "Materials";
    if (cat === "plant") return "Plant hire";
    if (cat === "other") return "Other";
    return cat || "";
  }

  function escapeHtml(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&")
      .replace(/</g, "<")
      .replace(/>/g, ">")
      .replace(/"/g, """)
      .replace(/'/g, "&#39;");
  }

  function nl2br(str) {
    return escapeHtml(str).replace(/\n/g, "<br>");
  }

  var api = {
    money: money,
    moneyPlain: moneyPlain,
    cisRateLabel: cisRateLabel,
    categoryLabel: categoryLabel,
    escapeHtml: escapeHtml,
    nl2br: nl2br,
  };

  root.CISFormat = api;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
