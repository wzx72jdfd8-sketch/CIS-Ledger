# CIS Ledger user guide

For UK construction subcontractors. Written in plain English.

This guide matches version 1.1.3 (31 August 2026).

---

## 1. What this is

CIS Ledger helps you keep your details, contractors, invoices, CIS deductions, A4 PDFs, monthly records, CSV for an accountant, and a JSON backup. Everything lives in this browser on this computer.

CIS Ledger is free (MIT Licence). It is **not HMRC-recognised tax software**. It does not file CIS300 or Self Assessment, talk to HMRC, verify you, or replace the contractor’s official statement.

GOV.UK pages (checked 31 August 2026):

- https://www.gov.uk/what-you-must-do-as-a-cis-subcontractor/get-paid
- https://www.gov.uk/what-you-must-do-as-a-cis-contractor/make-deductions-and-pay-subcontractors
- https://www.gov.uk/government/publications/construction-industry-scheme-cis-340/construction-industry-scheme-a-guide-for-contractors-and-subcontractors-cis-340

## 2. First launch and demo login

Start with **Start-CIS-Ledger.bat** (Windows) or **Start-CIS-Ledger.command** (Mac). See INSTALL.md if you are stuck.

Unlock with user **demo** and password **cisledger**. The first open loads a demo book (Okafor Electrical). Change the PIN in Settings if you want a reminder, not a lock.

Sample layouts are in `app/sample-invoice.html` and `app/sample-statement.html`.

## 3. Replace the demo with your real profile

Open **Settings** and fill legal name, trading name, trade, UTR, NI, VAT, email, phone, address, and bank details. Click **Save profile**.

## 4. Add contractors and the CIS rate

Add legal name, trading name, UTR, VAT, address, and default CIS rate:

- **20%** registered and verifiable (usual)
- **30%** not registered or not verifiable
- **0%** gross payment status

HMRC tells the *contractor* the rate. Put the rate they actually use.

## 5. Create an invoice

New invoice: number, date (sets the tax month, 6th to 5th), contractor, CIS rate, VAT yes/no, job/site, notes, line items (description, type, qty, unit, rate). Save.

| Type | CIS taken? | Use it for |
| --- | --- | --- |
| Labour | Yes | Days on site, fitting, testing, certification labour |
| Materials | No | Cable, fittings, boards you bought for the job |
| Plant hire | No | Hired plant for the job |
| Other | Yes | Attendance, extras, travel fuel, other construction work that is not materials or plant |

## 6. How CIS maths works

Start with the invoice net. Strip VAT, materials and plant hire. Apply 0/20/30% to labour + other. VAT is 20% of full net if charged. CIS is never taken from VAT.

Worked example: labour £1,000, materials £500, plant £200, other £100, CIS 20%, VAT off.

- Net = £1,800
- CIS base = £1,100
- CIS deducted = £220
- Amount due = £1,580

With 20% VAT: VAT £360, amount due £1,940.

A CIS tax month runs 6th to 5th. The contractor’s statement is due by the 19th.

## 7–8. PDFs

On the invoice or Statements screen click **Save PDF…**. Choose Save as PDF / Microsoft Print to PDF, A4.

## 9. Dashboard

Shows this tax month totals, statement due date, and recent invoices.

## 10. Backup

Settings → Download JSON backup / Import JSON backup / CSV for accountant / Reload demo data / Lock.

## 11. Changing the PIN

Settings → Unlock PIN. This is not encryption. There is no email reset.

## 12. Troubleshooting

Always use the starter so the address is `http://127.0.0.1:8080/`. Do not open files as `file://`. Leave only one starter window open. Allow pop-ups for Save PDF.

## 13. Support

https://matthewbenton.com — include the version from VERSION.txt.

## 14. Quick checklist

1. Use the starter.
2. Settings: name, UTR, bank, VAT.
3. Add contractor and their CIS rate.
4. New invoice, tag lines, Save.
5. Save PDF and send it yourself.
6. Month end: statement PDF, check by the 19th.
7. Download a JSON backup.
