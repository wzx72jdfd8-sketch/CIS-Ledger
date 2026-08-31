(function (root) {
  "use strict";

  function uid(prefix) {
    return prefix + "-" + Math.random().toString(36).slice(2, 10);
  }

  function demoState() {
    var northridge = {
      id: "co-northridge",
      legalName: "Northridge Construction Ltd",
      tradingName: "Northridge",
      utr: "8214763095",
      vatNumber: "GB 112233445",
      cisRate: 20,
      address: "Unit 4, Canal Wharf\nYork Road\nLeeds\nLS9 0RD",
      notes: "Site QS: Priya Shah. CIS 20% after verification.",
    };
    var hale = {
      id: "co-hale",
      legalName: "Hale & Partners Building Contractors Ltd",
      tradingName: "Hale & Partners",
      utr: "5093182746",
      vatNumber: "GB 556677889",
      cisRate: 20,
      address: "Hale Yard, Dewsbury Road\nWakefield\nWF2 8AA",
      notes: "Gross payment not held. Standard 20%.",
    };
    return {
      version: 1,
      seeded: true,
      profile: {
        legalName: "James Okafor",
        tradingName: "Okafor Electrical",
        utr: "7348291056",
        ni: "QQ123456C",
        vatNumber: "",
        address: "14 Station Road\nLeeds\nLS1 4DY",
        email: "james@okafor-electrical.example",
        phone: "0113 496 0123",
        bankName: "Okafor Electrical",
        sortCode: "12-34-56",
        accountNumber: "12345678",
        trade: "Electrician",
      },
      contractors: [northridge, hale],
      invoices: [
        {
          id: "inv-1001",
          number: "INV-1001",
          date: "2026-07-12",
          contractorId: northridge.id,
          job: "Plot 12, Manor Fields, Garforth — first fix",
          cisRate: 20,
          chargeVat: false,
          vatRate: 20,
          status: "issued",
          notes: "CIS 20%. Materials at cost; receipts available.",
          lines: [
            { id: "l1", description: "First-fix wiring, 3-bed plot (days on site)", category: "labour", quantity: 4, unit: "day", unitPricePence: 28000 },
            { id: "l2", description: "SWA cable, back boxes, clips — bought for this job", category: "materials", quantity: 1, unit: "lot", unitPricePence: 18650 }
          ]
        },
        {
          id: "inv-1002",
          number: "INV-1002",
          date: "2026-07-28",
          contractorId: hale.id,
          job: "22 Queen Street, Wakefield — consumer unit",
          cisRate: 20,
          chargeVat: false,
          vatRate: 20,
          status: "issued",
          notes: "Labour only. Board supplied by contractor.",
          lines: [
            { id: "l3", description: "Replace consumer unit and test (18th Edition)", category: "labour", quantity: 2, unit: "day", unitPricePence: 32000 },
            { id: "l4", description: "EICR and certification", category: "labour", quantity: 1, unit: "item", unitPricePence: 18000 }
          ]
        },
        {
          id: "inv-1003",
          number: "INV-1003",
          date: "2026-08-08",
          contractorId: northridge.id,
          job: "Plot 14, Manor Fields, Garforth — second fix + hire",
          cisRate: 20,
          chargeVat: false,
          vatRate: 20,
          status: "issued",
          notes: "MEWP hired for landing lights. Hire invoice attached to pack.",
          lines: [
            { id: "l5", description: "Second-fix sockets, switches, lights", category: "labour", quantity: 5, unit: "day", unitPricePence: 28000 },
            { id: "l6", description: "White goods circuit accessories (direct cost)", category: "materials", quantity: 1, unit: "lot", unitPricePence: 24200 },
            { id: "l7", description: "MEWP hire for this job (third-party)", category: "plant", quantity: 1, unit: "day", unitPricePence: 14500 }
          ]
        },
        {
          id: "inv-1004",
          number: "INV-1004",
          date: "2026-08-18",
          contractorId: hale.id,
          job: "Hale Yard welfare block — data and power",
          cisRate: 20,
          chargeVat: false,
          vatRate: 20,
          status: "issued",
          notes: "",
          lines: [
            { id: "l8", description: "Containment, power and data to welfare", category: "labour", quantity: 3, unit: "day", unitPricePence: 30000 },
            { id: "l9", description: "Cat6, trunking, sockets — bought for this job", category: "materials", quantity: 1, unit: "lot", unitPricePence: 31750 }
          ]
        },
        {
          id: "inv-1005",
          number: "INV-1005",
          date: "2026-08-25",
          contractorId: northridge.id,
          job: "Plots 12–14 snagging",
          cisRate: 20,
          chargeVat: false,
          vatRate: 20,
          status: "issued",
          notes: "Snagging list from site manager 22 Aug.",
          lines: [
            { id: "l10", description: "Snagging and retest", category: "labour", quantity: 1, unit: "day", unitPricePence: 28000 },
            { id: "l11", description: "Attendance / extra visit (CIS-able)", category: "other", quantity: 1, unit: "item", unitPricePence: 7500 }
          ]
        }
      ],
      nextInvoiceNum: 1006
    };
  }

  var api = { demoState: demoState, uid: uid };
  root.CISSeed = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
