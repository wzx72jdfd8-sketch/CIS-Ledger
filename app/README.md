# App folder

The GitHub connector used to publish this repo accepts text files in the API payload. `app.js` from the original zip is ~34 KB of UI code and was not copied automatically.

**Add it once:**

1. Open the original `CIS-Ledger-v1.1.3.zip`.
2. Take `CIS-Ledger/app/app.js`.
3. On GitHub: **Add file → Upload files**, path `app/app.js`.

Until that file is present the landing page works but **Open the app** will sit on “Loading…”.

Sample invoice/statement HTML and the binary sample PDFs from the zip can be added the same way if you want them in the repo. Print/PDF in the running app uses `doc-html.js` (browser Save as PDF), so the sample PDFs are optional.
