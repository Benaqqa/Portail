# 📋 Guide de gestion des centres - Fichier CSV

## 🎯 Comment fonctionne l'intégration des centres

### Flux de données

```
📄 output.csv 
    ↓
⚙️ CentresCsvService (lit et parse)
    ↓
🎮 HomeController (charge en mémoire)
    ↓
🖼️ landing.html (affiche avec Thymeleaf)
```

---

## 📝 Format du fichier CSV

### Structure

**Fichier :** `src/main/resources/static/csv/output.csv`

```csv
name,description,rating,website,phone,featured_image,address
Centre 1,Description,4.5,http://site.com,0522-123456,http://image.jpg,"123 Rue, Ville"
```

### Colonnes

| Colonne | Type | Obligatoire | Description | Exemple |
|---------|------|-------------|-------------|---------|
| `name` | Texte | ✅ Oui | Nom du centre | "ONEE Casablanca" |
| `description` | Texte | ❌ Non | Description du centre | "Centre principal" |
| `rating` | Nombre | ❌ Non | Note de 0 à 5 | 4.5 |
| `website` | URL | ❌ Non | Site web du centre | http://www.one.ma |
| `phone` | Texte | ❌ Non | Téléphone | 0522-123456 |
| `featured_image` | URL | ❌ Non | URL de l'image | http://image.jpg |
| `address` | Texte | ✅ Oui | Adresse complète | "123 Rue, Rabat" |

---

## ➕ Ajouter un nouveau centre

### Étape 1 : Ouvrir le fichier CSV

```
COSONE/src/main/resources/static/csv/output.csv
```

### Étape 2 : Ajouter une ligne

```csv
name,description,rating,website,phone,featured_image,address
Centre Existant,Description,4.0,http://site.com,0522-111111,http://img1.jpg,"Adresse 1, Ville 1"
Nouveau Centre,Super centre,4.8,http://nouveau.com,0522-222222,http://img2.jpg,"Avenue X, Ville 2"
```

### Étape 3 : Sauvegarder

💾 Sauvegardez le fichier (Ctrl+S)

### Étape 4 : Redémarrer l'application

```bash
# Arrêter l'application (Ctrl+C)
mvn spring-boot:run
```

### Étape 5 : Vérifier

Ouvrez http://localhost:8080/landing et cliquez sur "Nos centres"

✅ Le nouveau centre devrait apparaître !

---

## ✏️ Modifier un centre existant

### Trouver le centre

Ouvrez `output.csv` et cherchez la ligne correspondante :

```csv
ONEE Casablanca,Description ancienne,3.0,http://old.com,0522-111111,,"Ancienne adresse"
```

### Modifier les informations

```csv
ONEE Casablanca,Nouvelle description,4.5,http://new.com,0522-999999,http://new-img.jpg,"Nouvelle adresse, Casablanca"
```

### Sauvegarder et redémarrer

```bash
mvn spring-boot:run
```

---

## 🗑️ Supprimer un centre

### Méthode simple

Supprimez la ligne complète du centre dans le CSV :

**Avant :**
```csv
Centre A,Description A,4.0,http://a.com,0522-111111,,"Adresse A"
Centre B,Description B,3.5,http://b.com,0522-222222,,"Adresse B"  ← À supprimer
Centre C,Description C,4.5,http://c.com,0522-333333,,"Adresse C"
```

**Après :**
```csv
Centre A,Description A,4.0,http://a.com,0522-111111,,"Adresse A"
Centre C,Description C,4.5,http://c.com,0522-333333,,"Adresse C"
```

---

## 📊 Exemples de centres

### Centre complet (toutes les informations)

```csv
ONEE Branche Electricite Rabat,Centre principal de distribution d'électricité pour la région de Rabat,4.5,http://www.one.org.ma,0537-717755,https://example.com/image.jpg,"Avenue Patrice Lumumba, Place Pietrie 6 Bis, Rabat 10000"
```

### Centre minimal (juste le nécessaire)

```csv
ONEE Casablanca,,,,,,"Rue Mohammed V, Casablanca"
```

### Centre sans image

```csv
ONEE Tanger,Centre de distribution,4.0,http://www.one.org.ma,0539-945958,,"Boulevard Principal, Tanger 90060"
```

---

## 🎨 Affichage sur la page

### Ce qui est affiché si présent

- ✅ **Nom** : Toujours affiché (obligatoire)
- ✅ **Adresse** : Toujours affichée (obligatoire)
- 📍 **Ville** : Affichée si extraite de l'adresse
- ☎️ **Téléphone** : Affiché si présent (cliquable)
- 🌐 **Site web** : Affiché si présent (lien externe)
- ⭐ **Évaluation** : Affichée si > 0 (étoiles)
- 🖼️ **Image** : Affichée si URL valide, sinon icône
- 📝 **Description** : Affichée si présente
- ✅ **Statut** : Toujours "Actif"

### Exemple de carte de centre

```
┌──────────────────────────────┐
│ [Image ou 🏢]                │
├──────────────────────────────┤
│ ONEE Casablanca              │
│                              │
│ 📍 Rue Mohammed V, Casa      │
│ ☎️  0522-123456              │
│ ⭐⭐⭐⭐☆ 4.0/5               │
│ 🌐 Visiter le site web       │
│                              │
│          ✅ Actif            │
└──────────────────────────────┘
```

---

## 🔧 Gestion avancée

### Importer depuis une base de données

Si vous voulez charger les centres depuis une base de données au lieu du CSV :

1. Créer une entité `Centre.java`
2. Créer un `CentreRepository`
3. Modifier `CentresCsvService` ou créer `CentreDbService`
4. Modifier le `HomeController` pour utiliser le nouveau service

### Créer un CSV depuis Excel

1. Ouvrez Excel
2. Créez les colonnes : name, description, rating, website, phone, featured_image, address
3. Remplissez les données
4. Fichier → Enregistrer sous → CSV (séparateur : virgule)
5. Remplacez `output.csv`

### Valider le CSV

Utilisez un validateur CSV en ligne ou vérifiez :
- ✅ Pas de guillemets mal fermés
- ✅ Virgules correctement placées
- ✅ Ligne d'en-tête présente
- ✅ Encodage UTF-8

---

## 🐛 Problèmes courants

### Les centres ne s'affichent pas

**Cause possible 1 :** Fichier CSV mal formaté
```bash
# Vérifier les logs Spring Boot
# Chercher : "Error reading CSV file"
```

**Cause possible 2 :** Fichier au mauvais endroit
```
✅ Bon  : src/main/resources/static/csv/output.csv
❌ Mauvais : src/main/resources/output.csv
```

**Cause possible 3 :** Encodage incorrect
- Enregistrez le CSV en UTF-8
- Évitez les caractères spéciaux non échappés

### Le nombre de centres est faux

Vérifiez que chaque ligne :
- A un nom non vide
- Est correctement formatée
- N'a pas de virgules supplémentaires

### Les images ne s'affichent pas

- URLs d'images doivent être complètes : `http://...`
- Vérifiez que les URLs sont accessibles
- Si pas d'image, une icône 🏢 s'affiche automatiquement

---

## 📈 Statistiques

Le système affiche automatiquement :
- **Nombre total de centres** : Calculé dynamiquement depuis le CSV
- **Couverture** : "National" (fixe)
- **Disponibilité** : "24/7" (fixe)

---

## 🔄 Rechargement automatique

**Actuellement :** Le CSV est lu au **démarrage de l'application**

Pour voir les modifications :
```bash
# Redémarrer l'application
mvn spring-boot:run
```

**Future amélioration :** Recharger le CSV sans redémarrer
- Ajouter un endpoint `/admin/reload-centres`
- Ou recharger toutes les X minutes

---

## ✅ Checklist avant mise en production

- [ ] Fichier CSV bien formaté
- [ ] Toutes les lignes ont un nom
- [ ] Toutes les lignes ont une adresse
- [ ] URLs des images valides (ou vides)
- [ ] Numéros de téléphone au bon format
- [ ] Évaluations entre 0 et 5
- [ ] Encodage UTF-8
- [ ] Testé en local
- [ ] 69 centres affichés correctement

---

## 📞 Support

Pour des questions sur la gestion des centres :
- Documentation : `MISE_A_JOUR_CONTENU.md`
- Tests : `VERIFICATION_CENTRES.md`
- Dépannage : `SOLUTION_NAVIGATION.md`

---

**Fichier actuel :** `src/main/resources/static/csv/output.csv`  
**Centres actuels :** 69 centres de l'ONEE  
**Format :** CSV avec virgules  
**Encodage :** UTF-8  
**Rechargement :** Au démarrage de l'application

