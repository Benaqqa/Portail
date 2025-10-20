# Script PowerShell pour charger les types de logement dans PostgreSQL
# Configuration (ajustez selon votre environnement)

$PGUSER = "postgres"
$PGDATABASE = "cosone_db"
$PGHOST = "localhost"
$PGPORT = "5432"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Chargement des Types de Logement" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Base de données : $PGDATABASE" -ForegroundColor Yellow
Write-Host "Utilisateur     : $PGUSER" -ForegroundColor Yellow
Write-Host ""

# Demander le mot de passe
$PGPASSWORD = Read-Host "Entrez le mot de passe PostgreSQL" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($PGPASSWORD)
$PlainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

# Définir la variable d'environnement
$env:PGPASSWORD = $PlainPassword

Write-Host ""
Write-Host "Exécution du script SQL..." -ForegroundColor Green

# Exécuter le script SQL
& psql -U $PGUSER -d $PGDATABASE -f insert_types_logement.sql

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Vérification" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Vérifier le nombre de types de logement
& psql -U $PGUSER -d $PGDATABASE -c "SELECT nom, capacite_max, prix_par_nuit FROM types_logement ORDER BY capacite_max;"

Write-Host ""
Write-Host "✅ Types de logement chargés avec succès !" -ForegroundColor Green
Write-Host ""

# Nettoyer la variable d'environnement
$env:PGPASSWORD = $null

Read-Host "Appuyez sur Entrée pour continuer"

