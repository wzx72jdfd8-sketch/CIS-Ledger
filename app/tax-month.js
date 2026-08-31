/**
 * UK CIS tax months run from the 6th of one calendar month to the 5th of the next.
 * Source: GOV.UK CIS 340 and contractor guidance — "If the tax month was
 * 6 May to 5 June, you must give the statement by 19 June."
 */
(function (root) {
  "use strict";

  var MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  var MONTHS_SHORT = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  function pad(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function parseISODate(iso) {
    if (!iso || typeof iso !== "string") return null;
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
    if (!m) return null;
    var y = Number(m[1]);
    var mo = Number(m[2]);
    var d = Number(m[3]);
    var dt = new Date(Date.UTC(y, mo - 1, d));
    if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== mo - 1 || dt.getUTCDate() !== d) {
      return null;
    }
    return { y: y, m: mo, d: d, date: dt };
  }

  function formatISO(y, m, d) {
    return y + "-" + pad(m) + "-" + pad(d);
  }

  function taxMonthFromDate(iso) {
    var p = parseISODate(iso);
    if (!p) return null;
    var endYear, endMonth;
    if (p.d >= 6) {
      if (p.m === 12) {
        endMonth = 1;
        endYear = p.y + 1;
      } else {
        endMonth = p.m + 1;
        endYear = p.y;
      }
    } else {
      endMonth = p.m;
      endYear = p.y;
    }
    var startMonth = endMonth === 1 ? 12 : endMonth - 1;
    var startYear = endMonth === 1 ? endYear - 1 : endYear;
    var startISO = formatISO(startYear, startMonth, 6);
    var endISO = formatISO(endYear, endMonth, 5);
    var dueDay = 19;
    var dueMonth = endMonth;
    var dueYear = endYear;
    var statementDueISO = formatISO(dueYear, dueMonth, dueDay);
    return {
      id: endISO,
      startISO: startISO,
      endISO: endISO,
      endDay: 5,
      endMonth: endMonth,
      endYear: endYear,
      label: "6 " + MONTHS_SHORT[startMonth - 1] + " " + startYear + " – 5 " + MONTHS_SHORT[endMonth - 1] + " " + endYear,
      longLabel: "6 " + MONTHS[startMonth - 1] + " " + startYear + " to 5 " + MONTHS[endMonth - 1] + " " + endYear,
      endingLabel: "tax month ending 5 " + MONTHS[endMonth - 1] + " " + endYear,
      shortLabel: MONTHS_SHORT[endMonth - 1] + " " + endYear,
      statementDueISO: statementDueISO,
      statementDueLabel: dueDay + " " + MONTHS[dueMonth - 1] + " " + dueYear,
    };
  }

  function formatUK(iso) {
    var p = parseISODate(iso);
    if (!p) return "";
    return pad(p.d) + "/" + pad(p.m) + "/" + p.y;
  }

  function formatUKLong(iso) {
    var p = parseISODate(iso);
    if (!p) return "";
    return p.d + " " + MONTHS[p.m - 1] + " " + p.y;
  }

  function todayISO(now) {
    var d = now || new Date();
    return formatISO(d.getFullYear(), d.getMonth() + 1, d.getDate());
  }

  function compareISO(a, b) {
    if (a === b) return 0;
    return a < b ? -1 : 1;
  }

  function inTaxMonth(iso, monthId) {
    var tm = taxMonthFromDate(iso);
    return tm ? tm.id === monthId : false;
  }

  var api = {
    MONTHS: MONTHS,
    MONTHS_SHORT: MONTHS_SHORT,
    parseISODate: parseISODate,
    taxMonthFromDate: taxMonthFromDate,
    formatUK: formatUK,
    formatUKLong: formatUKLong,
    todayISO: todayISO,
    compareISO: compareISO,
    inTaxMonth: inTaxMonth,
    formatISO: formatISO,
  };

  root.CISTaxMonth = api;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
