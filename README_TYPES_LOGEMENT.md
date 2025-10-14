# Types de Logement COSONE

## 📋 Types de Logement Disponibles

Ce document décrit les 3 types de logement disponibles dans les centres de vacances COSONE.

### 1. 🏠 Studio 2 personnes
- **Capacité** : 2 personnes
- **Prix** : 200 DH/nuit
- **Description** : Studio confortable avec kitchenette équipée, salle de bain privée et balcon
- **Équipements** :
  - Climatisation
  - Wifi
  - TV
  - Réfrigérateur
  - Micro-ondes
- **Idéal pour** : Couples ou voyageurs individuels

---

### 2. 🏡 Appartement Familial 4 personnes
- **Capacité** : 4 personnes
- **Prix** : 350 DH/nuit
- **Description** : Appartement spacieux avec 2 chambres, salon séparé et cuisine complète
- **Équipements** :
  - Climatisation
  - Wifi
  - TV
  - Cuisine complète
  - Balcon avec vue
- **Idéal pour** : Petites familles

---

### 3. 🏰 Villa 6 personnes
- **Capacité** : 6 personnes
- **Prix** : 500 DH/nuit
- **Description** : Villa indépendante avec 3 chambres, grand salon, jardin privé et terrasse
- **Équipements** :
  - Climatisation
  - Wifi
  - TV
  - Cuisine complète
  - Espace extérieur
  - Parking privé
  - 2 salles de bain
- **Idéal pour** : Grandes familles ou groupes

---

## 🚀 Comment Charger les Types de Logement

### Méthode 1 : Commande Directe (Recommandée)

```powershell
cd C:\Users\Asus\IdeaProjects\COSONE
psql -U postgres -d cosone_db -f insert_types_logement.sql
```

**Mot de passe** : `12345678`

---

### Méthode 2 : Script PowerShell Automatique

```powershell
.\CHARGER_TYPES_LOGEMENT.ps1
```

---

### Méthode 3 : Mode Interactif

```bash
psql -U postgres -d cosone_db
\i insert_types_logement.sql
\q
```

---

### Méthode 4 : Avec Variable d'Environnement

```powershell
$env:PGPASSWORD='12345678'; psql -U postgres -d cosone_db -f insert_types_logement.sql
```

---

## ✅ Vérification

Après l'exécution, vérifiez que les types de logement sont bien insérés :

```sql
SELECT * FROM types_logement;
```

Vous devriez voir 3 lignes :
- Studio 2 personnes (200 DH)
- Appartement Familial 4 personnes (350 DH)
- Villa 6 personnes (500 DH)

---

## 🌐 Vérification dans l'Application

1. Ouvrez votre navigateur : `http://localhost:8080/espace-reservation`
2. Les 3 types de logement devraient s'afficher
3. Chaque type doit montrer :
   - Nom
   - Description
   - Capacité maximale
   - Prix par nuit

---

## 📊 Structure de la Table

```sql
CREATE TABLE types_logement (
    id BIGSERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    capacite_max INTEGER NOT NULL,
    prix_par_nuit DECIMAL(10,2) NOT NULL,
    actif BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔧 Modification des Prix

Si vous souhaitez modifier les prix :

```sql
-- Modifier le prix du Studio
UPDATE types_logement 
SET prix_par_nuit = 250.00 
WHERE nom = 'Studio 2 personnes';

-- Modifier le prix de l'Appartement
UPDATE types_logement 
SET prix_par_nuit = 400.00 
WHERE nom = 'Appartement Familial 4 personnes';

-- Modifier le prix de la Villa
UPDATE types_logement 
SET prix_par_nuit = 550.00 
WHERE nom = 'Villa 6 personnes';
```

---

## 📝 Ajouter un Nouveau Type de Logement

```sql
INSERT INTO types_logement (nom, description, capacite_max, prix_par_nuit, actif) 
VALUES (
    'Chalet 8 personnes',
    'Chalet de montagne spacieux avec cheminée et vue panoramique',
    8,
    700.00,
    true
);
```

---

## ❌ Désactiver un Type de Logement

Pour désactiver temporairement un type sans le supprimer :

```sql
UPDATE types_logement 
SET actif = false 
WHERE nom = 'Studio 2 personnes';
```

---

## 🗑️ Supprimer un Type de Logement

**Attention** : Cela supprimera toutes les réservations associées !

```sql
-- Voir d'abord s'il y a des réservations
SELECT COUNT(*) 
FROM reservations 
WHERE type_logement_id = 1;

-- Si aucune réservation, vous pouvez supprimer
DELETE FROM types_logement 
WHERE id = 1;
```

---

## 📈 Statistiques

Requêtes utiles :

```sql
-- Prix moyen par nuit
SELECT AVG(prix_par_nuit) as prix_moyen 
FROM types_logement 
WHERE actif = true;

-- Capacité totale
SELECT SUM(capacite_max) as capacite_totale 
FROM types_logement 
WHERE actif = true;

-- Type le plus réservé
SELECT 
    tl.nom,
    COUNT(r.id) as nombre_reservations
FROM types_logement tl
LEFT JOIN reservations r ON tl.id = r.type_logement_id
GROUP BY tl.nom
ORDER BY nombre_reservations DESC;
```

---

## 🎯 Intégration avec les Centres

Chaque centre peut proposer différents types de logement. Pour gérer cela, vous pourriez créer une table de liaison `centre_type_logement` :

```sql
CREATE TABLE centre_type_logement (
    centre_id BIGINT REFERENCES centres(id),
    type_logement_id BIGINT REFERENCES types_logement(id),
    nombre_unites INTEGER NOT NULL,
    PRIMARY KEY (centre_id, type_logement_id)
);
```

---

## 💡 Recommandations

1. **Tarification Saisonnière** : Envisagez d'ajouter des colonnes pour les prix haute/basse saison
2. **Photos** : Ajoutez une colonne pour les URLs des photos
3. **Équipements** : Créez une table séparée pour les équipements
4. **Disponibilité** : Gérez un calendrier de disponibilité par type et par centre

---

## 📞 Support

En cas de problème :
- Vérifiez que la table `types_logement` existe : `\dt types_logement`
- Vérifiez les contraintes : `\d types_logement`
- Consultez les logs de l'application Spring Boot

