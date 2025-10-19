@echo off
REM Atlassian Auth App Setup Script for Windows

echo 🚀 Setting up Atlassian Authentication Demo...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are installed

REM Install root dependencies
echo 📦 Installing root dependencies...
npm install

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend
npm install

REM Create .env file if it doesn't exist
if not exist .env (
    echo 📝 Creating .env file from template...
    copy env.example .env
    echo ⚠️  Please update the .env file with your actual Atlassian credentials
)

cd ..

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd frontend
npm install

cd ..

echo.
echo 🎉 Setup complete!
echo.
echo Next steps:
echo 1. Update backend\.env with your Atlassian credentials
echo 2. Configure your Atlassian OAuth app with callback URL: http://localhost:3000/auth/callback
echo 3. Run 'npm run dev' to start the application
echo.
echo 📚 See README.md for detailed instructions
pause
