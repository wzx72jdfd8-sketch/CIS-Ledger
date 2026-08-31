/**
 * A4 invoice / statement as HTML tables. Print dialog → Save as PDF.
 */
(function (root) {
  "use strict";

  var VERSION = "1.1.3";

  function esc(str, Format) {
    if (Format && typeof Format.escapeHtml === "function") return Format.escapeHtml(str);
    return String(str == null ? "" : str)
      .replace(/&/g, "&")
      .replace(/</g, "<")
      .replace(/>/g, ">")
      .replace(/"/g, """)
      .replace(/'/g, "&#39;");
  }

  function nl2br(str, Format) {
    if (Format && typeof Format.nl2br === "function") return Format.nl2br(str);
    return esc(str, Format).replace(/\n/g, "<br>");
  }

  function money(pence, Format) {
    return esc(Format && Format.money ? Format.money(pence) : String(pence), Format);
  }

  function lineAmount(line) {
    var math = root.CISMath;
    if (math && math.lineAmountPence) return math.lineAmountPence(line);
    if (!line) return 0;
    if (line.amountPence != null) return Math.round(Number(line.amountPence) || 0);
    var qty = Number(line.quantity == null ? 1 : line.quantity);
    if (!isFinite(qty)) qty = 0;
    return Math.round(qty * (Math.round(Number(line.unitPricePence) || 0)));
  }

  function css() {
    return "@page{size:A4;margin:12mm}" +
      "html,body{margin:0;padding:0;color:#071525;background:#fff;font-family:'Segoe UI','Helvetica Neue',Arial,sans-serif;font-size:10.5pt;line-height:1.35}" +
      "*{box-sizing:border-box}.banner{background:#0c2340;color:#fffdf8;padding:12px 16px;display:flex;justify-content:space-between;gap:16px}" +
      ".banner h1{margin:0;font-size:18pt;font-family:Georgia,Palatino,serif;color:#fffdf8}.wrap{padding:14px 4px 0}" +
      ".parties{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin:0 0 12px}.parties h2,.job .lab,.meta .lab,.pay h2,.notes h2{margin:0 0 6px;font-size:8pt;letter-spacing:.04em;text-transform:uppercase;color:#0c2340}" +
      "hr.rule{border:0;border-top:1.2pt solid #0c2340;margin:10px 0 12px}" +
      ".meta{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:12px}" +
      "table.lines,table.stmt{width:100%;border-collapse:collapse}table.lines thead th,table.stmt thead th{background:#0c2340;color:#fffdf8;font-size:8pt;text-align:left;padding:6px 8px}" +
      "table.lines td,table.stmt td{padding:5px 8px;border-bottom:.3pt solid #c9c2b4;vertical-align:top;font-size:9.5pt}" +
      "td.money,th.money{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}" +
      ".tot-label{text-align:right}.tot-row td{border-bottom:none}.lines tr.rule td{border-top:.8pt solid #0c2340}" +
      ".lines tr.due td{background:#0c2340;color:#fffdf8;font-weight:700}.hmrc,.doc-foot{margin-top:14px;font-size:8pt;color:#3d4a57}" +
      ".doc-foot{display:flex;justify-content:space-between;border-top:.6pt solid #0c2340;padding-top:6px}";
  }

  function shell(title, inner) {
    return "<!DOCTYPE html><html lang=\"en-GB\"><head><meta charset=\"utf-8\"><title>" + title +
      "</title><style>" + css() + "</style></head><body>" + inner + "</body></html>";
  }

  function partyBlock(heading, html) {
    return "<div><h2>" + heading + "</h2><p>" + html + "</p></div>";
  }

  function profileHtml(p, Format) {
    p = p || {};
    var bits = [];
    if (p.tradingName) bits.push("<strong>" + esc(p.tradingName, Format) + "</strong>");
    if (p.legalName) bits.push(esc(p.legalName, Format));
    if (p.address) bits.push(nl2br(p.address, Format));
    if (p.utr) bits.push("UTR " + esc(p.utr, Format));
    if (p.ni) bits.push("NI " + esc(p.ni, Format));
    if (p.vatNumber) bits.push("VAT " + esc(p.vatNumber, Format));
    if (p.phone) bits.push(esc(p.phone, Format));
    if (p.email) bits.push(esc(p.email, Format));
    return bits.join("<br>");
  }

  function contractorHtml(c, Format) {
    c = c || {};
    var bits = [];
    if (c.tradingName) bits.push("<strong>" + esc(c.tradingName, Format) + "</strong>");
    if (c.legalName) bits.push(esc(c.legalName, Format));
    if (c.address) bits.push(nl2br(c.address, Format));
    if (c.utr) bits.push("UTR " + esc(c.utr, Format));
    if (c.vatNumber) bits.push("VAT " + esc(c.vatNumber, Format));
    return bits.join("<br>");
  }

  function invoiceHtml(opts) {
    opts = opts || {};
    var Format = opts.Format;
    var Tax = opts.Tax;
    var p = opts.profile || {};
    var co = opts.contractor || {};
    var inv = opts.invoice || {};
    var tot = opts.totals || {};
    var tm = opts.taxMonth;
    var dateStr = Tax && Tax.formatUK ? Tax.formatUK(inv.date) : (inv.date || "");
    var monthStr = tm ? (tm.label || tm.longLabel || "") : "";
    var lines = (inv.lines || []).map(function (ln) {
      var cat = Format && Format.categoryLabel ? Format.categoryLabel(ln.category) : ln.category;
      var qty = (ln.quantity == null ? "" : String(ln.quantity)) + (ln.unit ? " " + ln.unit : "");
      return "<tr><td>" + esc(ln.description, Format) + "</td><td>" + esc(cat, Format) +
        "</td><td>" + esc(qty, Format) + "</td><td class=\"money\">" + money(ln.unitPricePence, Format) +
        "</td><td class=\"money\">" + money(lineAmount(ln), Format) + "</td></tr>";
    }).join("");
    var vatLabel = tot.vatRate ? ("VAT @ " + tot.vatRate + "%") : "VAT";
    var inner =
      "<div class=\"banner\"><div><div class=\"mark\" style=\"font-weight:700;letter-spacing:.08em\">CIS LEDGER</div>" +
      "<div class=\"sub\" style=\"font-size:9pt;opacity:.9;margin-top:4px\">" + esc(p.trade || "Subcontractor", Format) +
      "  ·  Construction Industry Scheme</div></div><div class=\"doc-title\" style=\"text-align:right\"><h1>Invoice</h1>" +
      "<div class=\"doc-no\" style=\"font-size:12pt;font-weight:700\">" + esc(inv.number, Format) + "</div></div></div>" +
      "<div class=\"wrap\"><div class=\"parties\">" +
      partyBlock("From (subcontractor)", profileHtml(p, Format)) +
      partyBlock("To (contractor)", contractorHtml(co, Format)) +
      "</div><hr class=\"rule\"><div class=\"meta\">" +
      "<div><div class=\"lab\">Date</div><div class=\"val\">" + esc(dateStr, Format) + "</div></div>" +
      "<div><div class=\"lab\">Tax month</div><div class=\"val\">" + esc(monthStr, Format) + "</div></div>" +
      "<div><div class=\"lab\">CIS rate</div><div class=\"val\">" + esc(String(tot.cisRate != null ? tot.cisRate : inv.cisRate), Format) + "%</div></div>" +
      "<div><div class=\"lab\">VAT</div><div class=\"val\">" + (inv.chargeVat ? "Charged" : "Not charged") + "</div></div></div>" +
      (inv.job ? "<div class=\"job\"><div class=\"lab\">Job / site</div><div>" + esc(inv.job, Format) + "</div></div>" : "") +
      "<table class=\"lines\"><thead><tr><th>Description</th><th>Type</th><th>Qty</th><th class=\"money\">Rate</th><th class=\"money\">Amount</th></tr></thead><tbody>" +
      lines +
      "<tr class=\"tot-row\"><td colspan=\"4\" class=\"tot-label\">Labour</td><td class=\"money\">" + money(tot.labour, Format) + "</td></tr>" +
      "<tr class=\"tot-row\"><td colspan=\"4\" class=\"tot-label\">Materials (no CIS)</td><td class=\"money\">" + money(tot.materials, Format) + "</td></tr>" +
      "<tr class=\"tot-row\"><td colspan=\"4\" class=\"tot-label\">Plant hire (no CIS)</td><td class=\"money\">" + money(tot.plant, Format) + "</td></tr>" +
      "<tr class=\"tot-row\"><td colspan=\"4\" class=\"tot-label\">Other (CIS-able)</td><td class=\"money\">" + money(tot.other, Format) + "</td></tr>" +
      "<tr class=\"tot-row rule\"><td colspan=\"4\" class=\"tot-label\">Net (ex VAT, ex CIS)</td><td class=\"money\">" + money(tot.net, Format) + "</td></tr>" +
      "<tr class=\"tot-row\"><td colspan=\"4\" class=\"tot-label\">" + esc(vatLabel, Format) + "</td><td class=\"money\">" + money(tot.vat, Format) + "</td></tr>" +
      "<tr class=\"tot-row\"><td colspan=\"4\" class=\"tot-label\">CIS @ " + esc(String(tot.cisRate), Format) + "% on " + money(tot.cisBase, Format) +
      "</td><td class=\"money\">-" + money(tot.cisDeduction, Format) + "</td></tr>" +
      "<tr class=\"tot-row due\"><td colspan=\"4\" class=\"tot-label\">Amount due</td><td class=\"money\">" + money(tot.amountDue, Format) + "</td></tr>" +
      "</tbody></table>" +
      "<div class=\"pay\"><h2>Please pay</h2><p>Account name &nbsp; " + esc(p.bankName, Format) +
      "</p><p>Sort code &nbsp; " + esc(p.sortCode, Format) + " &nbsp;&nbsp; Account &nbsp; " + esc(p.accountNumber, Format) +
      "</p><p><strong>Reference &nbsp; " + esc(inv.number, Format) + "</strong></p></div>" +
      (inv.notes ? "<div class=\"notes\" style=\"margin-top:12px\"><h2>Notes</h2><p>" + nl2br(inv.notes, Format) + "</p></div>" : "") +
      "<div class=\"hmrc\"><p>CIS is calculated on labour and other CIS-able work only, after taking off materials, plant hire and VAT (GOV.UK).</p>" +
      "<p>Keep this invoice. Your contractor must also give you a payment and deduction statement within 14 days of the tax month end.</p></div></div>" +
      "<div class=\"doc-foot\"><span>CIS Ledger v" + VERSION + " · not HMRC-recognised</span><span><a href=\"https://matthewbenton.com\">MB</a></span></div>";
    return shell("Invoice " + (inv.number || ""), inner);
  }

  function statementHtml(opts) {
    opts = opts || {};
    var Format = opts.Format;
    var Tax = opts.Tax;
    var p = opts.profile || {};
    var co = opts.contractor || {};
    var tm = opts.taxMonth || {};
    var rows = opts.rows || [];
    var net = 0, labour = 0, materials = 0, plant = 0, other = 0, cis = 0, vat = 0, due = 0;
    var body = rows.map(function (r) {
      var t = r.tot || {};
      net += t.net || 0; labour += t.labour || 0; materials += t.materials || 0;
      plant += t.plant || 0; other += t.other || 0; cis += t.cisDeduction || 0;
      vat += t.vat || 0; due += t.amountDue || 0;
      var d = Tax && Tax.formatUK ? Tax.formatUK(r.date) : r.date;
      return "<tr><td>" + esc(d, Format) + "</td><td>" + esc(r.number, Format) +
        "</td><td class=\"money\">" + money(t.net, Format) + "</td><td class=\"money\">" + money(t.cisDeduction, Format) +
        "</td><td class=\"money\">" + money(t.amountDue, Format) + "</td></tr>";
    }).join("");
    var inner =
      "<div class=\"banner\"><div><div class=\"mark\" style=\"font-weight:700;letter-spacing:.08em\">CIS LEDGER</div>" +
      "<div class=\"sub\" style=\"font-size:9pt;opacity:.9;margin-top:4px\">Payment and deduction record</div></div>" +
      "<div class=\"doc-title\" style=\"text-align:right\"><h1>Month record</h1></div></div>" +
      "<div class=\"wrap\"><div class=\"parties\">" +
      partyBlock("Subcontractor", profileHtml(p, Format)) +
      partyBlock("Contractor", contractorHtml(co, Format)) +
      "</div><hr class=\"rule\"><div class=\"meta\">" +
      "<div><div class=\"lab\">Tax month</div><div class=\"val\">" + esc(tm.longLabel || tm.label || "", Format) + "</div></div>" +
      "<div><div class=\"lab\">Statement due</div><div class=\"val\">" + esc(tm.statementDueLabel || "", Format) + "</div></div>" +
      "<div><div class=\"lab\">Invoices</div><div class=\"val\">" + String(rows.length) + "</div></div>" +
      "<div><div class=\"lab\">CIS deducted</div><div class=\"val\">" + money(cis, Format) + "</div></div></div>" +
      "<table class=\"stmt\"><thead><tr><th>Date</th><th>Invoice</th><th class=\"money\">Net</th><th class=\"money\">CIS</th><th class=\"money\">Due</th></tr></thead><tbody>" +
      body +
      "<tr><td colspan=\"2\"><strong>Totals</strong></td><td class=\"money\">" + money(net, Format) +
      "</td><td class=\"money\">" + money(cis, Format) + "</td><td class=\"money\">" + money(due, Format) + "</td></tr>" +
      "</tbody></table>" +
      "<p class=\"hmrc\">Labour " + money(labour, Format) + " · Materials " + money(materials, Format) +
      " · Plant " + money(plant, Format) + " · Other " + money(other, Format) + " · VAT " + money(vat, Format) + ".</p>" +
      "<p class=\"hmrc\">Your record only. Not a CIS300 and not a replacement for the contractor's official statement. Not HMRC-recognised tax software.</p></div>" +
      "<div class=\"doc-foot\"><span>CIS Ledger v" + VERSION + " · not HMRC-recognised</span><span><a href=\"https://matthewbenton.com\">MB</a></span></div>";
    return shell("CIS record " + (tm.shortLabel || ""), inner);
  }

  function printHtml(html) {
    var blob = new Blob([html], { type: "text/html;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var w = null;
    try { w = window.open(url, "_blank"); } catch (e) { w = null; }
    if (!w) {
      var frame = document.createElement("iframe");
      frame.setAttribute("aria-hidden", "true");
      frame.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0;";
      frame.src = url;
      document.body.appendChild(frame);
      var printed = false;
      function goFrame() {
        if (printed) return;
        printed = true;
        try { frame.contentWindow.focus(); frame.contentWindow.print(); } catch (err) {}
        setTimeout(function () {
          try { URL.revokeObjectURL(url); } catch (e2) {}
          if (frame.parentNode) frame.parentNode.removeChild(frame);
        }, 60000);
      }
      frame.onload = goFrame;
      setTimeout(goFrame, 700);
      return;
    }
    var printedWin = false;
    function goWin() {
      if (printedWin) return;
      printedWin = true;
      try { w.focus(); w.print(); } catch (err) {}
      try { w.onafterprint = function () { try { w.close(); } catch (e3) {} }; } catch (e4) {}
      setTimeout(function () { try { URL.revokeObjectURL(url); } catch (e5) {} }, 60000);
    }
    try { w.onload = goWin; } catch (e6) {}
    setTimeout(goWin, 600);
  }

  var api = { VERSION: VERSION, invoiceHtml: invoiceHtml, statementHtml: statementHtml, printHtml: printHtml };
  root.CISDocHtml = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
