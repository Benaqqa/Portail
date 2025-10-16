# Script PowerShell pour tester l'API de login
# Exécuter ce script pour vérifier si l'API fonctionne

Write-Host "=== Test de l'API Login COSONE ===" -ForegroundColor Cyan

# Attendre que Spring Boot démarre
Write-Host "Attente du démarrage de Spring Boot..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Test 1: Vérifier si Spring Boot répond
Write-Host "`n1. Test de disponibilité de l'API..." -ForegroundColor Green
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -ContentType "application/json" -Body '{"identifier":"test","password":"test"}' -TimeoutSec 5
    Write-Host "✅ API accessible - Code de réponse reçu" -ForegroundColor Green
} catch {
    Write-Host "❌ API non accessible: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Vérifiez que Spring Boot est démarré sur le port 8080" -ForegroundColor Yellow
    exit 1
}

# Test 2: Test de login avec utilisateur inexistant
Write-Host "`n2. Test login utilisateur inexistant..." -ForegroundColor Green
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -ContentType "application/json" -Body '{"identifier":"nonexistent","password":"test"}'
    Write-Host "❌ Erreur: Login a réussi alors qu'il ne devrait pas" -ForegroundColor Red
} catch {
    $errorResponse = $_.Exception.Response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($errorResponse)
    $errorBody = $reader.ReadToEnd()
    Write-Host "✅ Comportement attendu: $errorBody" -ForegroundColor Green
}

# Test 3: Test de login avec admin (si créé)
Write-Host "`n3. Test login avec admin..." -ForegroundColor Green
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -ContentType "application/json" -Body '{"identifier":"admin","password":"admin"}'
    Write-Host "✅ Login admin réussi!" -ForegroundColor Green
    Write-Host "Token reçu: $($response.token.Substring(0,20))..." -ForegroundColor Cyan
    Write-Host "Utilisateur: $($response.user.username) - Rôle: $($response.user.role)" -ForegroundColor Cyan
} catch {
    $errorResponse = $_.Exception.Response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($errorResponse)
    $errorBody = $reader.ReadToEnd()
    Write-Host "❌ Login admin échoué: $errorBody" -ForegroundColor Red
    Write-Host "Vérifiez que l'utilisateur admin existe dans la base de données" -ForegroundColor Yellow
}

# Test 4: Test de login avec matricule
Write-Host "`n4. Test login avec matricule M11113..." -ForegroundColor Green
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -ContentType "application/json" -Body '{"identifier":"M11113","password":"admin"}'
    Write-Host "✅ Login avec matricule réussi!" -ForegroundColor Green
    Write-Host "Token reçu: $($response.token.Substring(0,20))..." -ForegroundColor Cyan
    Write-Host "Utilisateur: $($response.user.username) - Rôle: $($response.user.role)" -ForegroundColor Cyan
} catch {
    $errorResponse = $_.Exception.Response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($errorResponse)
    $errorBody = $reader.ReadToEnd()
    Write-Host "❌ Login avec matricule échoué: $errorBody" -ForegroundColor Red
    Write-Host "Vérifiez que l'utilisateur M11113 existe dans la base de données" -ForegroundColor Yellow
}

Write-Host "`n=== Fin des tests ===" -ForegroundColor Cyan
Write-Host "Si des tests ont échoué, exécutez d'abord create_test_user.sql dans PostgreSQL" -ForegroundColor Yellow
