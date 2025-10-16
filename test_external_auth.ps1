# PowerShell script to test external authentication endpoint
# Make sure the Spring Boot application is running on localhost:8080

Write-Host "Testing External Authentication API..." -ForegroundColor Green

# Test data
$testData = @{
    authCode = "TEST123"
    prenom = "John"
    nom = "Doe"
} | ConvertTo-Json

Write-Host "Test data: $testData" -ForegroundColor Yellow

try {
    # Test external login endpoint
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/external" -Method POST -Body $testData -ContentType "application/json"
    
    Write-Host "✅ External login test successful!" -ForegroundColor Green
    Write-Host "Response: $($response | ConvertTo-Json -Depth 3)" -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ External login test failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $errorStream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorStream)
        $errorBody = $reader.ReadToEnd()
        Write-Host "Error details: $errorBody" -ForegroundColor Red
    }
}

Write-Host "`nTesting Admin Code Generation API..." -ForegroundColor Green

# Test admin code generation (requires admin token)
$adminTestData = @{
    code = "ADMIN123"
    prenom = "Admin"
    nom = "User"
    matricule = "ADM001"
    numCin = "AB123456"
    phoneNumber = "0612345678"
    expirationHours = 48
    oneTimeOnly = $true
} | ConvertTo-Json

Write-Host "Admin test data: $adminTestData" -ForegroundColor Yellow

try {
    # Note: This will fail without admin authentication, but it tests the endpoint structure
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/codes" -Method POST -Body $adminTestData -ContentType "application/json"
    
    Write-Host "✅ Admin code generation test successful!" -ForegroundColor Green
    Write-Host "Response: $($response | ConvertTo-Json -Depth 3)" -ForegroundColor Cyan
    
} catch {
    Write-Host "⚠️ Admin code generation test failed (expected without auth): $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host "`nTesting API endpoints availability..." -ForegroundColor Green

# Test if endpoints are available
$endpoints = @(
    "http://localhost:8080/api/auth/external",
    "http://localhost:8080/api/auth/first-login", 
    "http://localhost:8080/api/admin/codes"
)

foreach ($endpoint in $endpoints) {
    try {
        $response = Invoke-WebRequest -Uri $endpoint -Method OPTIONS -TimeoutSec 5
        Write-Host "✅ $endpoint - Available" -ForegroundColor Green
    } catch {
        Write-Host "❌ $endpoint - Not available: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`nTest completed!" -ForegroundColor Green
