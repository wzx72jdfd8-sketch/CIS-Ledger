(function (root) {
  "use strict";

  var DATA_KEY = "cis-ledger-v1";
  var AUTH_KEY = "cis-ledger-auth";
  var SESSION_KEY = "cis-ledger-session";
  var DEFAULT_USER = "demo";
  var DEFAULT_PASS = "cisledger";

  function storage(kind) {
    try {
      var s = kind === "session" ? root.sessionStorage : root.localStorage;
      if (!s) return null;
      return s;
    } catch (e) {
      return null;
    }
  }

  function readJson(store, key, fallback) {
    if (!store) return fallback;
    try {
      var raw = store.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }

  function writeJson(store, key, value) {
    if (!store) return false;
    try {
      store.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  }

  function getAuth() {
    var a = readJson(storage("local"), AUTH_KEY, null);
    if (a && a.user && a.pass) return a;
    return { user: DEFAULT_USER, pass: DEFAULT_PASS, isDefault: true };
  }

  function setAuth(user, pass) {
    return writeJson(storage("local"), AUTH_KEY, { user: String(user || "").trim(), pass: String(pass || "") });
  }

  function isUnlocked() {
    var s = storage("session");
    return !!(s && s.getItem(SESSION_KEY) === "1");
  }

  function unlock(user, pass) {
    var a = getAuth();
    var u = String(user || "").trim();
    var p = String(pass || "");
    if (u === a.user && p === a.pass) {
      var s = storage("session");
      if (s) s.setItem(SESSION_KEY, "1");
      return true;
    }
    return false;
  }

  function lock() {
    var s = storage("session");
    if (s) s.removeItem(SESSION_KEY);
  }

  function emptyState() {
    return {
      version: 1,
      seeded: false,
      profile: {
        legalName: "",
        tradingName: "",
        utr: "",
        ni: "",
        vatNumber: "",
        address: "",
        email: "",
        phone: "",
        bankName: "",
        sortCode: "",
        accountNumber: "",
        trade: "",
      },
      contractors: [],
      invoices: [],
      nextInvoiceNum: 1001,
    };
  }

  function load() {
    var data = readJson(storage("local"), DATA_KEY, null);
    if (!data || data.version !== 1) {
      var seeded = root.CISSeed ? root.CISSeed.demoState() : emptyState();
      save(seeded);
      return seeded;
    }
    if (!Array.isArray(data.contractors)) data.contractors = [];
    if (!Array.isArray(data.invoices)) data.invoices = [];
    if (!data.profile) data.profile = emptyState().profile;
    if (!data.nextInvoiceNum) data.nextInvoiceNum = 1001;
    return data;
  }

  function save(state) {
    return writeJson(storage("local"), DATA_KEY, state);
  }

  function resetDemo() {
    var seeded = root.CISSeed ? root.CISSeed.demoState() : emptyState();
    save(seeded);
    return seeded;
  }

  function exportJson(state) {
    return JSON.stringify(
      {
        app: "CIS Ledger",
        version: 1,
        exportedAt: new Date().toISOString(),
        data: state,
      },
      null,
      2
    );
  }

  function importJson(text) {
    var parsed = JSON.parse(text);
    var data = parsed.data || parsed;
    if (!data || typeof data !== "object") throw new Error("Not a CIS Ledger backup.");
    if (!data.profile || !Array.isArray(data.contractors) || !Array.isArray(data.invoices)) {
      throw new Error("Backup is missing profile, contractors or invoices.");
    }
    data.version = 1;
    save(data);
    return data;
  }

  var api = {
    DATA_KEY: DATA_KEY,
    DEFAULT_USER: DEFAULT_USER,
    DEFAULT_PASS: DEFAULT_PASS,
    getAuth: getAuth,
    setAuth: setAuth,
    isUnlocked: isUnlocked,
    unlock: unlock,
    lock: lock,
    emptyState: emptyState,
    load: load,
    save: save,
    resetDemo: resetDemo,
    exportJson: exportJson,
    importJson: importJson,
  };

  root.CISStore = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
