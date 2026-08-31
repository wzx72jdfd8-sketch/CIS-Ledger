#!/bin/sh
# CIS Ledger starter for Mac and Linux.
# Double-click Start-CIS-Ledger.command on a Mac, or run this file.

ROOT=$(CDPATH= cd -- "$(dirname "$0")" && pwd)
cd "$ROOT" || exit 1

echo
echo "CIS Ledger"
echo "Leave this window open while using CIS Ledger."
echo

if [ ! -f "app/index.html" ]; then
  echo "ERROR: Could not find app/index.html"
  echo "Unzip the whole CIS-Ledger folder and try again."
  echo
  if [ -t 0 ]; then
    printf "Press Enter to close..."
    read dummy
  fi
  exit 1
fi

PORT=8080
PY=""

if command -v python3 >/dev/null 2>&1; then
  PY=python3
elif command -v python >/dev/null 2>&1; then
  if python -c 'import sys; raise SystemExit(0 if sys.version_info[0] >= 3 else 1)' 2>/dev/null; then
    PY=python
  fi
fi

if [ -z "$PY" ]; then
  echo "ERROR: Python 3 was not found."
  echo
  echo "Install Python 3, then run this starter again."
  echo "  Mac:   https://www.python.org/downloads/   or: brew install python3"
  echo "  Linux: sudo apt install python3    (Debian / Ubuntu)"
  echo
  if [ -t 0 ]; then
    printf "Press Enter to close..."
    read dummy
  fi
  exit 1
fi

echo "Starting CIS Ledger at http://127.0.0.1:$PORT/"
echo "Using: $PY"
echo
echo "Leave this window open while using CIS Ledger."
echo "Close this window when you have finished."
echo

(
  sleep 1
  if command -v open >/dev/null 2>&1; then
    open "http://127.0.0.1:$PORT/" >/dev/null 2>&1 || true
  elif command -v xdg-open >/dev/null 2>&1; then
    xdg-open "http://127.0.0.1:$PORT/" >/dev/null 2>&1 || true
  fi
) &

cd "$ROOT/app" || exit 1
"$PY" -m http.server "$PORT" --bind 127.0.0.1
STATUS=$?

echo
if [ "$STATUS" -ne 0 ]; then
  echo "The server did not start. Port $PORT may already be in use."
  echo "Close any other CIS Ledger window and try again."
  echo "See INSTALL.md for a different port."
fi

if [ -t 0 ]; then
  printf "Press Enter to close..."
  read dummy
fi
exit "$STATUS"
