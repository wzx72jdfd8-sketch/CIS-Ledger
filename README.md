# CIS Ledger

Invoices and Construction Industry Scheme (CIS) records for UK construction subcontractors (electricians, plumbers, carpenters, scaffolders, groundworkers).

**Version 1.1.3** · 31 August 2026 · Owner: [Matthew Benton](https://matthewbenton.com)

This is **not** HMRC-recognised tax software. It does not file CIS300 or Self Assessment. Your books stay on this computer.

## What it does

- Keep your details (name, UTR, bank, VAT)
- Keep a list of contractors
- Raise invoices with labour, materials, plant hire and other lines
- Work out CIS tax the GOV.UK way (0%, 20% or 30%)
- Save an A4 invoice PDF the contractor can pay
- Save a monthly payment-and-deduction record
- Export CSV for an accountant and a JSON backup of the whole book

Everything lives in **this browser, on this computer**. Nothing is sent to HMRC or to a website.

CIS Ledger is free under the [MIT Licence](LICENSE). No subscription, no card.

## Quick start

You do **not** need Node.js. You need Python 3 only to run the local starter.

1. Clone or unzip so you have a folder called `CIS-Ledger`.
2. Start it:
   - **Windows:** double-click `Start-CIS-Ledger.bat`
   - **Mac:** double-click `Start-CIS-Ledger.command`
   - **Linux:** `chmod +x start-cis-ledger.sh && ./start-cis-ledger.sh`
3. Browser should open [http://127.0.0.1:8080/](http://127.0.0.1:8080/). Click **Open the app**. 
4. Leave the starter window open while you use CIS Ledger.

Demo login:

- User: `demo`
- Password: `cisledger`

Then go to **Settings** and put in your own name, UTR, bank and VAT.

**Always use the starter.** Do not double-click `index.html` or `app.html`. Chrome and Edge often fail to save invoices if you open the files that way.

## Docs

| File | What it is |
| --- | --- |
| [START-HERE.txt](START-HERE.txt) | Five-step first run |
| [INSTALL.md](INSTALL.md) | Windows / Mac / Linux install and troubleshooting |
| [USER-GUIDE.md](USER-GUIDE.md) | Invoices, CIS maths, backups, tax months |
| [LEGAL.txt](LEGAL.txt) | What this software is and is not |
| [VERSION.txt](VERSION.txt) | Version stamp |

Sample invoice and statement layouts are in `app/sample-invoice.html` and `app/sample-statement.html`.

## Project layout

```
CIS-Ledger/
  Start-CIS-Ledger.bat      Windows starter
  Start-CIS-Ledger.command  macOS starter
  start-cis-ledger.sh       Mac / Linux starter
  app/                      Local website served on 127.0.0.1:8080
    index.html              Landing page
    app.html / app.js       The ledger UI
    cis.js, tax-month.js    CIS and UK tax-month rules
    store.js                localStorage book
    pdf.js, doc-html.js     A4 invoice / statement output
```

The starter runs Python’s built-in web server bound to **127.0.0.1 port 8080** and points it at the `app` folder. Nothing is uploaded. Nobody else on the internet can see your books from this.

## Legal

See [LEGAL.txt](LEGAL.txt) and [LICENSE](LICENSE).

You are responsible for the accuracy of names, UTRs, rates, line types, VAT and amounts. Check figures against the contractor’s statement and take advice from HMRC or a qualified accountant where you need it.

Website / support: [https://matthewbenton.com](https://matthewbenton.com)
