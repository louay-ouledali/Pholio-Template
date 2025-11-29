# Local Development with Azure Static Web Apps CLI
# This emulates the Azure environment locally

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Local Azure SWA Development Server   " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Check if SWA CLI is installed
$swaVersion = swa --version 2>$null
if (-not $swaVersion) {
    Write-Host "❌ SWA CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g @azure/static-web-apps-cli
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install SWA CLI" -ForegroundColor Red
        exit 1
    }
}
Write-Host "✅ SWA CLI version: $swaVersion" -ForegroundColor Green

# Navigate to project root
$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot
Write-Host "📂 Project root: $projectRoot" -ForegroundColor Gray

# Check if build folder exists
if (-not (Test-Path "build")) {
    Write-Host "⚙️  Build folder not found. Building React app..." -ForegroundColor Yellow
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Build failed" -ForegroundColor Red
        exit 1
    }
}

# Check API dependencies
if (-not (Test-Path "api/node_modules")) {
    Write-Host "⚙️  Installing API dependencies..." -ForegroundColor Yellow
    Set-Location api
    npm install
    Set-Location ..
}

Write-Host "`n🚀 Starting local Azure SWA emulator..." -ForegroundColor Cyan
Write-Host "   Frontend: build/" -ForegroundColor Gray
Write-Host "   API: api/" -ForegroundColor Gray
Write-Host "`n   Access at: http://localhost:4280" -ForegroundColor Green
Write-Host "   API endpoints: http://localhost:4280/api/*" -ForegroundColor Green
Write-Host "`n   Press Ctrl+C to stop" -ForegroundColor Yellow

# Start SWA CLI
swa start build --api-location api
