/**
 * CIS Ledger — Construction Industry Scheme calculation.
 *
 * Rules taken from GOV.UK (checked 31 August 2026):
 * - https://www.gov.uk/what-you-must-do-as-a-cis-subcontractor/get-paid
 * - https://www.gov.uk/what-you-must-do-as-a-cis-contractor/make-deductions-and-pay-subcontractors
 *
 * Deduction rates:
 *   20%  registered subcontractor, contractor can verify
 *   30%  not registered, or contractor cannot verify
 *    0%  gross payment status
 *
 * How to make a CIS deduction (contractor guidance, mirrored here so the
 * subcontractor's invoice matches what the contractor should do):
 *   1. Start with the total (gross) amount of the invoice.
 *   2. Take away VAT, consumable stores, plant hire, manufacturing /
 *      prefabricating materials, and materials paid for directly.
 *   3. Apply the CIS rate to what is left.
 *
 * In this app, line items are tagged:
 *   labour    — CIS applies
 *   materials — excluded (materials paid for directly / prefabrication)
 *   plant     — excluded (plant hired for the job)
 *   other     — CIS applies (remainder after the GOV.UK exclusions).
 *               Spec originally said "never deduct from other"; GOV.UK
 *               says CIS is on everything that is not in the exclusion
 *               list, so "other" is treated as CIS-able (attendance,
 *               travel fuel, extras that are construction work). If a
 *               cost is plant hire or materials, tag it as such.
 *
 * VAT is never part of the CIS base. If VAT is charged, it is added
 * after the CIS-able net is calculated, and CIS is not taken from it.
 *
 * Money is integer pence to avoid floating-point drift.
 */
(function (root) {
  "use strict";

  var CATEGORIES = ["labour", "materials", "plant", "other"];
  var CIS_RATES = [0, 20, 30];
  var VAT_STANDARD_RATE = 20;

  function isInt(n) {
    return typeof n === "number" && isFinite(n) && Math.round(n) === n;
  }

  function pence(n) {
    if (typeof n === "string") n = n.trim() === "" ? 0 : Number(n);
    if (typeof n !== "number" || !isFinite(n)) return 0;
    return Math.round(n);
  }

  function poundsToPence(pounds) {
    if (typeof pounds === "string") {
      pounds = pounds.replace(/£/g, "").replace(/,/g, "").trim();
      if (pounds === "") return 0;
      pounds = Number(pounds);
    }
    if (typeof pounds !== "number" || !isFinite(pounds)) return 0;
    return Math.round(pounds * 100);
  }

  function emptyTotals() {
    return {
      labour: 0,
      materials: 0,
      plant: 0,
      other: 0,
      net: 0,
      cisBase: 0,
      cisRate: 0,
      cisDeduction: 0,
      vatRate: 0,
      vat: 0,
      amountDue: 0,
    };
  }

  function calculate(input) {
    var totals = emptyTotals();
    if (!input || typeof input !== "object") return totals;

    var rate = Number(input.cisRate);
    if (CIS_RATES.indexOf(rate) === -1) {
      throw new Error("CIS rate must be 0, 20 or 30. HMRC sets the rate when the contractor verifies you.");
    }
    totals.cisRate = rate;

    var vatRate = input.chargeVat ? Number(input.vatRate == null ? VAT_STANDARD_RATE : input.vatRate) : 0;
    if (input.chargeVat && vatRate < 0) {
      throw new Error("VAT rate cannot be negative.");
    }
    totals.vatRate = vatRate;

    var lines = Array.isArray(input.lines) ? input.lines : [];
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i] || {};
      var cat = line.category;
      if (CATEGORIES.indexOf(cat) === -1) {
        throw new Error("Line category must be labour, materials, plant or other.");
      }
      var amount;
      if (line.amountPence != null) {
        amount = pence(line.amountPence);
      } else {
        var qty = Number(line.quantity == null ? 1 : line.quantity);
        if (!isFinite(qty)) qty = 0;
        amount = Math.round(qty * pence(line.unitPricePence || 0));
      }
      totals[cat] += amount;
    }

    totals.net = totals.labour + totals.materials + totals.plant + totals.other;
    totals.cisBase = totals.labour + totals.other;
    totals.cisDeduction = Math.round((totals.cisBase * rate) / 100);
    totals.vat = Math.round((totals.net * vatRate) / 100);
    totals.amountDue = totals.net + totals.vat - totals.cisDeduction;
    return totals;
  }

  function lineAmountPence(line) {
    if (!line) return 0;
    if (line.amountPence != null) return pence(line.amountPence);
    var qty = Number(line.quantity == null ? 1 : line.quantity);
    if (!isFinite(qty)) qty = 0;
    return Math.round(qty * pence(line.unitPricePence || 0));
  }

  var api = {
    CATEGORIES: CATEGORIES,
    CIS_RATES: CIS_RATES,
    VAT_STANDARD_RATE: VAT_STANDARD_RATE,
    pence: pence,
    poundsToPence: poundsToPence,
    calculate: calculate,
    lineAmountPence: lineAmountPence,
    emptyTotals: emptyTotals,
  };

  root.CISMath = api;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
