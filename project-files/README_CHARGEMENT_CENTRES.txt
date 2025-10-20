╔══════════════════════════════════════════════════════════════╗
║  CHARGEMENT DES 69 CENTRES ONEE DANS LA BASE DE DONNÉES    ║
╚══════════════════════════════════════════════════════════════╝

✅ L'APPLICATION SPRING BOOT EST MAINTENANT CORRIGÉE ET DÉMARRE

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 MÉTHODE 1 : SCRIPT AUTOMATIQUE (RECOMMANDÉ - 1 minute)

1. Ouvrez PowerShell dans le dossier COSONE
2. Modifiez CHARGER_CENTRES_POSTGRESQL.ps1 :
   - Ligne 4 : mettez votre utilisateur PostgreSQL
   - Ligne 5 : mettez le nom de votre base de données
   
3. Exécutez :
   .\CHARGER_CENTRES_POSTGRESQL.ps1

4. Entrez votre mot de passe quand demandé

✨ C'est tout ! Les 69 centres seront chargés.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 MÉTHODE 2 : COMMANDE MANUELLE (2 minutes)

Dans PowerShell (dossier COSONE) :

1. Connectez-vous à PostgreSQL :
   psql -U postgres -d cosone_db
   (Remplacez postgres et cosone_db par vos valeurs)

2. Exécutez le script :
   \i insert_centres_from_csv.sql

3. Vérifiez :
   SELECT COUNT(*) FROM centres;
   (Devrait afficher : 69)

4. Quittez :
   \q

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 MÉTHODE 3 : LIGNE DE COMMANDE DIRECTE (30 secondes)

Dans PowerShell (dossier COSONE) :

psql -U postgres -d cosone_db -f insert_centres_from_csv.sql

(Vous devrez entrer votre mot de passe)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔍 VÉRIFICATION APRÈS CHARGEMENT

1. Ouvrez votre navigateur : http://localhost:8080/landing

2. Cliquez sur "Nos centres" dans le menu

3. Vous devriez voir les 69 centres ONEE

4. Cliquez sur "Page contact" pour voir les infos de Casablanca

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ PROBLÈMES COURANTS

Problème : "psql : command not found"
Solution : Ajoutez PostgreSQL au PATH Windows
          C:\Program Files\PostgreSQL\XX\bin

Problème : "insert_centres_from_csv.sql: No such file"
Solution : Assurez-vous d'être dans le dossier COSONE
          cd C:\Users\Asus\IdeaProjects\COSONE

Problème : "password authentication failed"
Solution : Vérifiez votre mot de passe PostgreSQL

Problème : "relation centres does not exist"
Solution : Créez d'abord les tables :
          psql -U postgres -d cosone_db -f create_reservation_tables.sql

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 CENTRES CHARGÉS

Total : 69 centres ONEE
Villes principales :
  • Casablanca : 5 centres
  • Rabat : 3 centres
  • Tanger : 3 centres
  • Agadir, Fès, Meknès, Marrakech, et bien d'autres...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 DOCUMENTATION COMPLÈTE

- GUIDE_RAPIDE_CHARGEMENT_CENTRES.md
- CHARGEMENT_CENTRES_CSV.md
- RESUME_CHARGEMENT_CENTRES.md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

