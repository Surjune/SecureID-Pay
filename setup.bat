@echo off
REM SecureID-Pay Setup Script for Windows

color 0A
echo.
echo ========================================
echo SecureID-Pay MVP - Complete Setup
echo ========================================
echo.

REM Check Python
echo Checking Python installation...
python --version >nul 2>&1
if errorlevel 1 (
    color 0C
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.10+ from https://www.python.org
    echo Make sure to check "Add Python to PATH" during installation
    pause
    exit /b 1
)
python --version
echo OK

REM Check Node.js
echo.
echo Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    color 0C
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js 16+ from https://nodejs.org
    pause
    exit /b 1
)
node --version
echo OK

REM Setup Backend
echo.
echo ========================================
echo Setting up BACKEND
echo ========================================
echo.

cd backend
echo Installing Python dependencies...
python -m pip install -q -r requirements.txt
if errorlevel 1 (
    color 0C
    echo ERROR: Failed to install Python dependencies
    pause
    exit /b 1
)
echo Backend dependencies installed. OK
cd ..

REM Setup Frontend
echo.
echo ========================================
echo Setting up FRONTEND
echo ========================================
echo.

cd frontend
echo Installing Node.js dependencies...
call npm install --silent
if errorlevel 1 (
    color 0C
    echo ERROR: Failed to install Node.js dependencies
    pause
    exit /b 1
)
echo Frontend dependencies installed. OK
cd ..

REM Success message
echo.
echo ========================================
echo SETUP COMPLETE!
echo ========================================
echo.
echo To start the application:
echo.
echo STEP 1: Open PowerShell and run:
echo   cd backend
echo   python -m uvicorn app.main:app --reload --port 8000
echo.
echo STEP 2: Open another PowerShell window and run:
echo   cd frontend
echo   npm run dev
echo.
echo STEP 3: Open your browser to:
echo   Frontend: http://localhost:5173
echo   Backend API Docs: http://localhost:8000/docs
echo.
echo For detailed instructions, see QUICKSTART.md
echo.
pause
