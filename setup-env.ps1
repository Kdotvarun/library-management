# PowerShell script to set up environment variables for local development
# Run this script: .\setup-env.ps1

Write-Host "🔧 Setting up environment variables for Library Management System..." -ForegroundColor Green

# Create .env.local file
$envContent = @"
# Environment Variables for Library Management System
# This file is for local development

# MongoDB Connection
MONGODB_URI=mongodb+srv://kvarun206cr_db_user:kvarun_200630@library-management-clus.bvs4xdj.mongodb.net/?retryWrites=true&w=majority&appName=library-management-cluster

# NextAuth Configuration
NEXTAUTH_SECRET=your-super-secret-key-for-nextauth-jwt-tokens-change-this-in-production
NEXTAUTH_URL=http://localhost:3000

# Optional: For production deployment
# NEXTAUTH_URL=https://yourdomain.com
"@

$envContent | Out-File -FilePath ".env.local" -Encoding UTF8

Write-Host "✅ Created .env.local file" -ForegroundColor Green
Write-Host "📝 Environment variables configured:" -ForegroundColor Yellow
Write-Host "   - MONGODB_URI: Connected to your MongoDB Atlas cluster" -ForegroundColor White
Write-Host "   - NEXTAUTH_SECRET: Set for JWT authentication" -ForegroundColor White
Write-Host "   - NEXTAUTH_URL: Set for local development" -ForegroundColor White

Write-Host "`n🚀 Ready to run the application!" -ForegroundColor Green
Write-Host "Run: npm run dev" -ForegroundColor Cyan
