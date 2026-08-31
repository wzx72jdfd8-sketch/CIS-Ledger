# Install CIS Ledger

You do **not** need Node.js. You do **not** need the internet once this
folder is on your computer (except to install Python the first time).

CIS Ledger is a small website that runs on your machine. The starter
opens it at http://127.0.0.1:8080/ in your normal browser.

**Always use the starter.** Do not double-click `index.html` or
`app.html`. Chrome and Edge often fail to save your invoices if you
open the files that way.

---

## Windows

1. Unzip the download. You should see a folder named `CIS-Ledger`.
2. Open that folder.
3. Double-click **Start-CIS-Ledger.bat**.
4. If SmartScreen appears: **More info**, then **Run anyway**.
5. A black window opens. Leave it open. That window *is* the app server.
6. Your browser should open. If it does not, type this in the address bar:

   http://127.0.0.1:8080/

7. Click **Open the app**. Log in with `demo` / `cisledger` the first time.

### If it says Python was not found

1. Go to https://www.python.org/downloads/
2. Download Python 3 for Windows and run the installer.
3. On the first screen, tick **Add python.exe to PATH**.
4. Finish the install.
5. Close the black window if it is still open.
6. Double-click **Start-CIS-Ledger.bat** again.

The starter tries `py -3`, then `python`, then `python3`.

### If the window closes at once

- Python is missing (see above), or
- Port 8080 is already in use (see Troubleshooting below).

---

## Mac

1. Unzip the download. You should see a folder named `CIS-Ledger`.
2. Double-click **Start-CIS-Ledger.command**.
3. If macOS says it cannot open the file because it is from the internet:
   - Right-click (or Control-click) **Start-CIS-Ledger.command**
   - Choose **Open**, then **Open** again.
4. A Terminal window opens. Leave it open while you use the app.
5. Safari or Chrome should open http://127.0.0.1:8080/
6. Click **Open the app**.

### If it says Python was not found

Macs often already have `python3`. If not:

- Install from https://www.python.org/downloads/ or
- If you use Homebrew: `brew install python3`

Then double-click **Start-CIS-Ledger.command** again.

If the `.command` file will not run, open Terminal, drag
`start-cis-ledger.sh` into the window, press Return.

---

## Linux

1. Unzip the download.
2. Open a terminal in the `CIS-Ledger` folder.
3. Run:

       chmod +x start-cis-ledger.sh
       ./start-cis-ledger.sh

4. Leave that terminal open. Browse to http://127.0.0.1:8080/

If `python3` is missing (Debian / Ubuntu):

    sudo apt install python3

---

## What the starter does

It starts Python’s built-in web server on **this computer only**
(127.0.0.1, port 8080) and points it at the `app` folder. Nothing is
uploaded. Nobody else on the internet can see your books from this.

When you have finished, close the black / Terminal window. That stops
the server. Your invoices stay saved in the browser until you clear
site data. Keep a JSON backup from Settings anyway.

---

## Troubleshooting

**Port 8080 already in use**

Another CIS Ledger window may still be running. Close it. Or close
other apps that use 8080, then run the starter again.

If you need a different port, from a terminal in this folder:

    python3 -m http.server 8081 --bind 127.0.0.1 --directory app

Then open http://127.0.0.1:8081/

**The page is blank / login will not stick**

You opened the HTML file directly (`file://`). Use the starter instead
so the address starts with `http://127.0.0.1`.

**Browser did not open**

Paste http://127.0.0.1:8080/ into Chrome, Edge, Firefox or Safari.

**Firewall prompt**

The server is localhost only. You can deny LAN / public access. Allowing
private access is not required.

**I moved the folder**

That is fine. Run the starter from the new place. Browser data stays
tied to http://127.0.0.1:8080/ so your books should still be there.

**I want it on a second PC**

Copy the whole `CIS-Ledger` folder. On the second PC your books start
empty (data lives in that browser). Use **Settings → Download JSON
backup** on the first PC and **Import JSON backup** on the second.

More help: USER-GUIDE.md

---

## Support / website

https://matthewbenton.com
