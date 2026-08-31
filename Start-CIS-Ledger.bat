@echo off
setlocal EnableExtensions
cd /d "%~dp0"

echo.
echo CIS Ledger
echo Leave this window open while using CIS Ledger.
echo.

if not exist "app\index.html" (
  echo ERROR: Could not find app\index.html
  echo Unzip the whole CIS-Ledger folder and try again.
  echo.
  pause
  exit /b 1
)

set "PORT=8080"
set "PYCMD="

where py >nul 2>nul
if not errorlevel 1 (
  py -3 -c "import sys" >nul 2>nul
  if not errorlevel 1 set "PYCMD=py -3"
)

if not defined PYCMD (
  where python >nul 2>nul
  if not errorlevel 1 (
    python -c "import sys; raise SystemExit(0 if sys.version_info[0]>=3 else 1)" >nul 2>nul
    if not errorlevel 1 set "PYCMD=python"
  )
)

if not defined PYCMD (
  where python3 >nul 2>nul
  if not errorlevel 1 (
    python3 -c "import sys" >nul 2>nul
    if not errorlevel 1 set "PYCMD=python3"
  )
)

if not defined PYCMD (
  echo ERROR: Python 3 was not found.
  echo.
  echo 1. Download Python 3 from https://www.python.org/downloads/
  echo 2. Run the installer.
  echo 3. Tick "Add python.exe to PATH".
  echo 4. Close this window and double-click Start-CIS-Ledger.bat again.
  echo.
  pause
  exit /b 1
)

echo Starting CIS Ledger at http://127.0.0.1:%PORT%/
echo Using: %PYCMD%
echo.
echo Leave this window open while using CIS Ledger.
echo Close this window when you have finished.
echo.

start "" cmd /c "timeout /t 1 /nobreak >nul & start http://127.0.0.1:%PORT%/"

cd /d "%~dp0app"
%PYCMD% -m http.server %PORT% --bind 127.0.0.1
set "ERR=%ERRORLEVEL%"
cd /d "%~dp0"

if not "%ERR%"=="0" (
  echo.
  echo The server did not start. Port %PORT% may already be in use.
  echo Close any other CIS Ledger window and try again.
  echo See INSTALL.md for a different port.
  echo.
  pause
  exit /b 1
)

echo.
pause
