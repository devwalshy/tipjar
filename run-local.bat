@echo off
echo ===================================
echo TipJar Local Setup and Startup
echo ===================================

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ERROR: Node.js is not installed or not in your PATH
    echo Please install Node.js from https://nodejs.org/
    exit /b 1
)

:: Display Node version
echo Using Node.js version:
node --version

:: Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ERROR: npm is not installed or not in your PATH
    echo Please ensure npm is installed with Node.js
    exit /b 1
)

:: Install dependencies if node_modules doesn't exist
if not exist node_modules (
    echo Installing dependencies...
    call npm install
    if %ERRORLEVEL% neq 0 (
        echo ERROR: Failed to install dependencies
        exit /b 1
    )
)

:: Build the project if not in development mode
echo Building project...
call npm run build
if %ERRORLEVEL% neq 0 (
    echo ERROR: Build failed
    exit /b 1
)

:: Set environment variable for development
set NODE_ENV=development

:: Start the server
echo Starting TipJar application...
echo Application will be available at http://localhost:5000
npx tsx server/index.ts

echo Application has stopped
pause