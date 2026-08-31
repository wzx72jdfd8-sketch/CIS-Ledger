(function (root) {
  "use strict";

  function cell(v) {
    var s = v == null ? "" : String(v);
    if (/[",\n\r]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
    return s;
  }

  function row(cols) {
    return cols.map(cell).join(",");
  }

  function invoicesCsv(profile, contractors, invoices, helpers) {
    var calculate = helpers.calculate;
    var moneyPlain = helpers.moneyPlain;
    var formatUK = helpers.formatUK;
    var taxMonthFromDate = helpers.taxMonthFromDate;
    var byId = {};
    contractors.forEach(function (c) {
      byId[c.id] = c;
    });
    var lines = [];
    lines.push(
      row([
        "Invoice number",
        "Date",
        "Tax month ending",
        "Contractor legal name",
        "Contractor trading name",
        "Contractor UTR",
        "Job / site",
        "CIS rate %",
        "Labour GBP",
        "Materials GBP",
        "Plant hire GBP",
        "Other GBP",
        "Net GBP",
        "CIS base GBP",
        "CIS deducted GBP",
        "VAT rate %",
        "VAT GBP",
        "Amount due GBP",
        "Status",
      ])
    );
    invoices
      .slice()
      .sort(function (a, b) {
        return a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
      })
      .forEach(function (inv) {
        var co = byId[inv.contractorId] || {};
        var tot = calculate({
          lines: inv.lines || [],
          cisRate: inv.cisRate,
          chargeVat: !!inv.chargeVat,
          vatRate: inv.vatRate,
        });
        var tm = taxMonthFromDate(inv.date);
        lines.push(
          row([
            inv.number,
            formatUK(inv.date),
            tm ? formatUK(tm.endISO) : "",
            co.legalName || "",
            co.tradingName || "",
            co.utr || "",
            inv.job || "",
            tot.cisRate,
            moneyPlain(tot.labour),
            moneyPlain(tot.materials),
            moneyPlain(tot.plant),
            moneyPlain(tot.other),
            moneyPlain(tot.net),
            moneyPlain(tot.cisBase),
            moneyPlain(tot.cisDeduction),
            tot.vatRate,
            moneyPlain(tot.vat),
            moneyPlain(tot.amountDue),
            inv.status || "issued",
          ])
        );
      });
    var header =
      "CIS Ledger export for accountant\n" +
      "Subcontractor," +
      cell((profile && profile.legalName) || "") +
      "\n" +
      "Trading name," +
      cell((profile && profile.tradingName) || "") +
      "\n" +
      "UTR," +
      cell((profile && profile.utr) || "") +
      "\n" +
      "NOT HMRC-recognised tax software. Records only. Does not file CIS300 or Self Assessment.\n\n";
    return header + lines.join("\n") + "\n";
  }

  var api = { cell: cell, row: row, invoicesCsv: invoicesCsv };
  root.CISCsv = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
