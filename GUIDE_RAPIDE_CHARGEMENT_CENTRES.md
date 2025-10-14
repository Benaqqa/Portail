# Guide Rapide - Chargement des Centres

## 🚀 Méthode Recommandée : Script SQL (2 minutes)

### Étape 1 : Ouvrir PostgreSQL
```bash
psql -U postgres -d cosone_db
```
*(Remplacez `postgres` et `cosone_db` par vos identifiants)*

### Étape 2 : Exécuter le script
```sql
\i insert_centres_from_csv.sql
```

### Étape 3 : Vérifier
```sql
SELECT COUNT(*) FROM centres;
-- Devrait afficher: 69
```

**C'est tout !** ✅

---

## 🔧 Méthode Alternative : Via l'application Java

### Option A : Chargement automatique au démarrage

1. Ouvrez `src/main/java/com/cosone/cosone/service/CentresDataLoader.java`
2. Décommentez ces 2 lignes (ligne 7 et 18) :
   ```java
   import org.springframework.stereotype.Component;
   
   @Component
   ```
3. Redémarrez l'application :
   ```bash
   mvn spring-boot:run
   ```
4. Vérifiez dans les logs : `✓ 69 centres ont été chargés`

### Option B : Via API REST (Admin seulement)

```bash
# POST request pour charger les centres
curl -X POST http://localhost:8080/api/admin/centres/load-from-csv \
  -H "Authorization: Bearer VOTRE_TOKEN_ADMIN"
```

---

## 📊 Résultat attendu

Après le chargement, vous aurez **69 centres ONEE** dans votre base :
- Casablanca : 5 centres
- Rabat : 3 centres  
- Tanger : 3 centres
- Agadir, Fès, Meknès, Marrakech, et bien d'autres...

---

## ❓ Problèmes ?

### "Table centres n'existe pas"
→ Exécutez d'abord `create_reservation_tables.sql`

### "Duplicate key violation"
→ Les centres existent déjà. Pour les réinitialiser :
```sql
TRUNCATE TABLE centres CASCADE;
```

### "Permission denied"
→ Vérifiez vos droits d'accès PostgreSQL

---

## 📖 Documentation complète
Consultez `CHARGEMENT_CENTRES_CSV.md` pour plus de détails.

