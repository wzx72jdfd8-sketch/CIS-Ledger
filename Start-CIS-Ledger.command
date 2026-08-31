#!/bin/sh
# Double-click this file on a Mac to start CIS Ledger.
ROOT=$(CDPATH= cd -- "$(dirname "$0")" && pwd)
exec /bin/sh "$ROOT/start-cis-ledger.sh"
