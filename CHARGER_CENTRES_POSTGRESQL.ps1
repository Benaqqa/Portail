# Script PowerShell pour charger les centres dans PostgreSQL
# Modifiez les variables ci-dessous selon votre configuration

$PGUSER = "postgres"
$PGDATABASE = "cosone_db"
$PGHOST = "localhost"
$PGPORT = "5432"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Chargement des centres ONEE" -ForegroundColor Cyan
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
& psql -U $PGUSER -d $PGDATABASE -f insert_centres_from_csv.sql

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Vérification" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Vérifier le nombre de centres
& psql -U $PGUSER -d $PGDATABASE -c "SELECT COUNT(*) as total_centres FROM centres;"

Write-Host ""
Write-Host "Terminé !" -ForegroundColor Green
Write-Host ""

# Nettoyer la variable d'environnement
$env:PGPASSWORD = $null

Read-Host "Appuyez sur Entrée pour continuer"

