# Azure Deployment Scripts for Pholio
# Run these commands in PowerShell

# ============================================
# STEP 1: Prerequisites Check
# ============================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Pholio Azure Deployment Script   " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Check if Azure CLI is installed
$azVersion = az version 2>$null
if (-not $azVersion) {
    Write-Host "❌ Azure CLI not found. Installing..." -ForegroundColor Red
    Write-Host "Run: winget install Microsoft.AzureCLI" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ Azure CLI installed" -ForegroundColor Green

# Check if logged in
$account = az account show 2>$null | ConvertFrom-Json
if (-not $account) {
    Write-Host "🔐 Not logged in. Logging in to Azure..." -ForegroundColor Yellow
    az login
    $account = az account show | ConvertFrom-Json
}
Write-Host "✅ Logged in as: $($account.user.name)" -ForegroundColor Green
Write-Host "   Subscription: $($account.name)" -ForegroundColor Gray

# ============================================
# STEP 2: Configuration
# ============================================

$config = @{
    ResourceGroup = "rg-louay-portfolio"
    AppName = "louay-portfolio"
    Location = "westeurope"
    GitHubRepo = "https://github.com/louay-ouledali/reactfolio-master"
    Branch = "main"
}

Write-Host "`n📋 Configuration:" -ForegroundColor Cyan
Write-Host "   Resource Group: $($config.ResourceGroup)"
Write-Host "   App Name: $($config.AppName)"
Write-Host "   Location: $($config.Location)"
Write-Host "   GitHub Repo: $($config.GitHubRepo)"

# ============================================
# STEP 3: Create Resource Group
# ============================================

Write-Host "`n🏗️  Creating Resource Group..." -ForegroundColor Cyan
az group create `
    --name $config.ResourceGroup `
    --location $config.Location `
    --output none

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Resource Group created/verified" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to create Resource Group" -ForegroundColor Red
    exit 1
}

# ============================================
# STEP 4: Create Static Web App
# ============================================

Write-Host "`n🌐 Creating Azure Static Web App..." -ForegroundColor Cyan
Write-Host "   This will link to your GitHub repo and set up CI/CD" -ForegroundColor Gray

# Check if app already exists
$existingApp = az staticwebapp show --name $config.AppName --resource-group $config.ResourceGroup 2>$null
if ($existingApp) {
    Write-Host "ℹ️  Static Web App already exists. Skipping creation." -ForegroundColor Yellow
} else {
    az staticwebapp create `
        --name $config.AppName `
        --resource-group $config.ResourceGroup `
        --source $config.GitHubRepo `
        --location $config.Location `
        --branch $config.Branch `
        --app-location "/" `
        --api-location "api" `
        --output-location "build" `
        --sku Free `
        --login-with-github

    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Static Web App created!" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to create Static Web App" -ForegroundColor Red
        Write-Host "   You may need to create it manually in Azure Portal" -ForegroundColor Yellow
        exit 1
    }
}

# ============================================
# STEP 5: Get Deployment Token
# ============================================

Write-Host "`n🔑 Getting deployment token..." -ForegroundColor Cyan
$token = az staticwebapp secrets list `
    --name $config.AppName `
    --resource-group $config.ResourceGroup `
    --query "properties.apiKey" -o tsv

if ($token) {
    Write-Host "✅ Deployment token retrieved" -ForegroundColor Green
    Write-Host "`n⚠️  IMPORTANT: Add this token to GitHub Secrets!" -ForegroundColor Yellow
    Write-Host "   Secret Name: AZURE_STATIC_WEB_APPS_API_TOKEN" -ForegroundColor Yellow
    Write-Host "   Token: $token" -ForegroundColor Gray
    Write-Host "`n   Go to: https://github.com/louay-ouledali/reactfolio-master/settings/secrets/actions" -ForegroundColor Cyan
}

# ============================================
# STEP 6: Get App URL
# ============================================

Write-Host "`n🌍 Getting app URL..." -ForegroundColor Cyan
$appInfo = az staticwebapp show `
    --name $config.AppName `
    --resource-group $config.ResourceGroup | ConvertFrom-Json

if ($appInfo) {
    Write-Host "✅ Your app will be available at:" -ForegroundColor Green
    Write-Host "   https://$($appInfo.defaultHostname)" -ForegroundColor Cyan
}

# ============================================
# STEP 7: Environment Variables Reminder
# ============================================

Write-Host "`n📝 Required GitHub Secrets:" -ForegroundColor Yellow
Write-Host "   Add these in GitHub repo > Settings > Secrets > Actions:" -ForegroundColor Gray
Write-Host ""
Write-Host "   AZURE_STATIC_WEB_APPS_API_TOKEN = (token above)" -ForegroundColor White
Write-Host "   REACT_APP_FIREBASE_API_KEY = your_key" -ForegroundColor White
Write-Host "   REACT_APP_FIREBASE_AUTH_DOMAIN = your_domain" -ForegroundColor White
Write-Host "   REACT_APP_FIREBASE_PROJECT_ID = your_project" -ForegroundColor White
Write-Host "   REACT_APP_FIREBASE_STORAGE_BUCKET = your_bucket" -ForegroundColor White
Write-Host "   REACT_APP_FIREBASE_MESSAGING_SENDER_ID = your_id" -ForegroundColor White
Write-Host "   REACT_APP_FIREBASE_APP_ID = your_app_id" -ForegroundColor White
Write-Host "   REACT_APP_CLOUDINARY_CLOUD_NAME = your_cloud" -ForegroundColor White
Write-Host "   REACT_APP_CLOUDINARY_UPLOAD_PRESET = your_preset" -ForegroundColor White
Write-Host "   GROQ_API_KEY = your_groq_key" -ForegroundColor White
Write-Host "   GEMINI_API_KEY = your_gemini_key" -ForegroundColor White

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Deployment Setup Complete! 🎉        " -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "`nNext steps:"
Write-Host "1. Add the secrets to GitHub"
Write-Host "2. Push your code to trigger the workflow"
Write-Host "3. Check GitHub Actions for build status"
Write-Host "4. Visit your live site!"
