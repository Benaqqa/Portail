# Chargement des Centres depuis output.csv

Ce document explique comment charger les données des centres ONEE depuis le fichier `output.csv` dans la base de données.

## 📋 Solutions disponibles

### Solution 1 : Script SQL (Recommandée)

**Avantages** : Rapide, directe, ne nécessite pas de redémarrage de l'application

**Étapes** :

1. Assurez-vous que votre base de données PostgreSQL est en cours d'exécution
2. Connectez-vous à votre base de données :
   ```bash
   psql -U votre_utilisateur -d votre_base_de_donnees
   ```
   
3. Exécutez le script SQL :
   ```bash
   \i insert_centres_from_csv.sql
   ```
   
   Ou depuis la ligne de commande :
   ```bash
   psql -U votre_utilisateur -d votre_base_de_donnees -f insert_centres_from_csv.sql
   ```

4. Vérifiez que les centres ont été insérés :
   ```sql
   SELECT COUNT(*) FROM centres;
   SELECT nom, ville, telephone FROM centres LIMIT 10;
   ```

### Solution 2 : Chargement Java au démarrage

**Avantages** : Automatique au démarrage de l'application, plus flexible

**Étapes** :

1. Ouvrez le fichier `src/main/java/com/cosone/cosone/service/CentresDataLoader.java`

2. Décommentez la ligne `@Component` :
   ```java
   @Component  // <-- Décommentez cette ligne
   public class CentresDataLoader implements CommandLineRunner {
   ```

3. Redémarrez votre application Spring Boot :
   ```bash
   mvn spring-boot:run
   ```

4. Les centres seront automatiquement chargés au démarrage si la table est vide

5. Vérifiez dans les logs :
   ```
   ✓ 69 centres ont été chargés avec succès dans la base de données.
   ```

**Important** : Une fois le chargement effectué, il est recommandé de re-commenter `@Component` pour éviter les tentatives de rechargement à chaque démarrage.

## 📊 Données chargées

Le script charge **69 centres ONEE** répartis dans tout le Maroc, incluant :

- **Casablanca** : 5 centres dont le siège ONEE
- **Rabat** : 3 centres
- **Tanger** : 3 centres
- **Agadir** : 1 centre
- **Marrakech** : Données disponibles
- Et de nombreux autres centres régionaux

### Structure des données

Chaque centre contient :
- `nom` : Nom du centre ONEE
- `adresse` : Adresse complète
- `ville` : Ville de localisation
- `telephone` : Numéro de téléphone (certains marqués "N/A")
- `email` : Email généré au format ville@cosone.ma
- `description` : Description (peut être vide)
- `actif` : Statut actif (true par défaut)

## 🔧 Modifications après chargement

Si vous souhaitez mettre à jour les données après le chargement initial :

### Mettre à jour un email
```sql
UPDATE centres 
SET email = 'nouveau.email@cosone.ma' 
WHERE nom = 'Nom du centre';
```

### Mettre à jour un numéro de téléphone
```sql
UPDATE centres 
SET telephone = '+212 5XX-XXXXXX' 
WHERE ville = 'Casablanca';
```

### Ajouter une description
```sql
UPDATE centres 
SET description = 'Description complète du centre' 
WHERE nom = 'Siege ONEE - Branche electricite Casablanca';
```

### Désactiver un centre
```sql
UPDATE centres 
SET actif = false 
WHERE nom = 'Nom du centre';
```

## 🧹 Nettoyage

Pour supprimer tous les centres et recommencer :
```sql
TRUNCATE TABLE centres CASCADE;
```

**Attention** : Cette commande supprime toutes les réservations associées aux centres !

Pour supprimer seulement les centres sans réservations :
```sql
DELETE FROM centres WHERE id NOT IN (SELECT DISTINCT centre_id FROM reservations);
```

## 🔍 Vérification

Après le chargement, vérifiez les données avec ces requêtes :

```sql
-- Nombre total de centres
SELECT COUNT(*) as total_centres FROM centres;

-- Centres par ville
SELECT ville, COUNT(*) as nombre 
FROM centres 
GROUP BY ville 
ORDER BY nombre DESC;

-- Centres avec téléphones valides
SELECT COUNT(*) as avec_telephone 
FROM centres 
WHERE telephone != 'N/A';

-- Centres actifs
SELECT COUNT(*) as centres_actifs 
FROM centres 
WHERE actif = true;

-- Liste des 10 premiers centres
SELECT id, nom, ville, telephone, email 
FROM centres 
ORDER BY ville, nom 
LIMIT 10;
```

## 📞 Support

En cas de problème :
1. Vérifiez que la table `centres` existe dans votre base de données
2. Vérifiez les contraintes de la table (nom doit être unique)
3. Consultez les logs de l'application pour plus de détails
4. Vérifiez les permissions de votre utilisateur PostgreSQL

## 🎯 Prochaines étapes

Après le chargement des centres :
1. Mettre à jour les numéros de téléphone manquants (marqués "N/A")
2. Ajouter des descriptions détaillées pour chaque centre
3. Compléter les emails si nécessaire
4. Ajouter des images pour chaque centre
5. Configurer les types de logement disponibles pour chaque centre

