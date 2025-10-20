@echo off
REM Script pour charger les centres dans PostgreSQL sous Windows
REM Modifiez les variables ci-dessous selon votre configuration

SET PGUSER=postgres
SET PGPASSWORD=votre_mot_de_passe
SET PGDATABASE=cosone_db
SET PGHOST=localhost
SET PGPORT=5432

echo ========================================
echo  Chargement des centres ONEE
echo ========================================
echo.
echo Base de données : %PGDATABASE%
echo Utilisateur     : %PGUSER%
echo.

REM Exécuter le script SQL
psql -U %PGUSER% -d %PGDATABASE% -f insert_centres_from_csv.sql

echo.
echo ========================================
echo  Vérification
echo ========================================
psql -U %PGUSER% -d %PGDATABASE% -c "SELECT COUNT(*) as total_centres FROM centres;"

echo.
echo Terminé !
pause

