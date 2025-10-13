# ✅ Vérification - Section "Nos centres"

## 📋 Checklist de vérification

### 🚀 Démarrage rapide

```bash
cd COSONE
mvn spring-boot:run
```

Puis ouvrez :
- **Page Landing** : http://localhost:8080/landing
- **Page Home** : http://localhost:8080/home

---

## 🔍 Tests de la page Landing

### Accéder à la section "Nos centres"
1. ✅ Cliquez sur "Nos centres" dans le menu latéral
2. ✅ La section s'affiche correctement

### Vérifier l'introduction et les statistiques
- [ ] Le texte d'introduction est affiché
- [ ] Le nombre total de centres s'affiche (devrait être 69)
- [ ] Les 3 boîtes de statistiques sont visibles :
  - "Centres disponibles" avec le nombre
  - "Couverture" avec "National"
  - "Disponibilité" avec "24/7"

### Vérifier la grille des centres
- [ ] Les centres s'affichent en grille
- [ ] Chaque carte de centre affiche :
  - [ ] Nom du centre
  - [ ] Adresse complète
  - [ ] Ville (si disponible)
  - [ ] Téléphone (si disponible) - lien cliquable
  - [ ] Site web (si disponible) - lien externe
  - [ ] Évaluation en étoiles (si > 0)
  - [ ] Statut "Actif" en vert avec icône

### Vérifier les images
- [ ] Les centres avec images affichent leurs photos
- [ ] Les centres sans image affichent l'icône de bâtiment
- [ ] Les images sont bien proportionnées

### Tester les interactions
- [ ] Survol d'une carte : effet d'élévation
- [ ] Clic sur téléphone : ouvre l'application de téléphone
- [ ] Clic sur site web : ouvre dans un nouvel onglet
- [ ] Les statistiques ont un effet hover

---

## 🔍 Tests de la page Home

### Accéder à la section "Nos centres"
1. ✅ Trouvez la section "Nos Centres"
2. ✅ Cliquez sur l'en-tête pour déplier
3. ✅ La section s'ouvre avec animation

### Vérifier le contenu
- [ ] Le texte d'introduction est affiché
- [ ] Les centres s'affichent dans des cartes
- [ ] Chaque carte montre :
  - [ ] Nom du centre
  - [ ] Adresse avec icône
  - [ ] Ville (si disponible)
  - [ ] Téléphone cliquable (si disponible)
  - [ ] Évaluation avec étoile (si > 0)
  - [ ] Lien site web (si disponible)

### Tester les interactions
- [ ] Le dépliage/repliage fonctionne
- [ ] L'icône de flèche tourne
- [ ] Les liens téléphoniques fonctionnent
- [ ] Les liens web s'ouvrent dans un nouvel onglet

---

## 📱 Tests Responsive

### Desktop (> 1024px)
- [ ] Grille multi-colonnes (3-4 centres par ligne)
- [ ] Statistiques sur une ligne
- [ ] Images bien proportionnées
- [ ] Textes lisibles

### Tablette (768px - 1024px)
- [ ] Grille 2 colonnes
- [ ] Statistiques ajustées
- [ ] Navigation accessible

### Mobile (< 768px)
- [ ] Grille 1 colonne
- [ ] Cartes empilées verticalement
- [ ] Statistiques empilées
- [ ] Boutons et liens facilement cliquables
- [ ] Images responsive

---

## 🎨 Tests visuels

### Couleurs et styles
- [ ] Badges "Actif" en vert avec ombre
- [ ] Étoiles dorées pour les évaluations
- [ ] Icônes bleues (#667eea)
- [ ] Fond gris clair pour l'introduction
- [ ] Effets hover fonctionnent

### Typographie
- [ ] Titres des centres lisibles (1.3em)
- [ ] Textes de détails lisibles
- [ ] Pas de débordement de texte

### Espacement
- [ ] Espacement cohérent entre les cartes
- [ ] Padding approprié dans les cartes
- [ ] Marges correctes

---

## 🔧 Tests techniques

### Chargement des données
- [ ] Les 69 centres sont chargés depuis le CSV
- [ ] Aucune erreur dans la console navigateur
- [ ] Aucune erreur dans les logs Spring Boot
- [ ] Temps de chargement < 2 secondes

### Gestion des données manquantes
- [ ] Centres sans téléphone : champ masqué
- [ ] Centres sans site web : lien masqué
- [ ] Centres sans description : section masquée
- [ ] Centres sans évaluation : étoiles masquées
- [ ] Centres sans image : icône de fallback affichée

### Liens et interactions
- [ ] Format des liens téléphoniques : `tel:+XXX`
- [ ] Liens externes avec `target="_blank"`
- [ ] Liens externes avec `rel="noopener noreferrer"`
- [ ] Pas de liens cassés

---

## 🐛 Problèmes courants et solutions

### Les centres ne s'affichent pas
**Cause** : Fichier CSV non chargé ou vide  
**Solution** :
1. Vérifiez que `output.csv` existe dans `src/main/resources/static/csv/`
2. Vérifiez les logs : `ERROR reading CSV file`
3. Redémarrez l'application : `mvn spring-boot:run`

### Les images ne s'affichent pas
**Cause** : URLs d'images invalides ou inaccessibles  
**Solution** :
- C'est normal si les URLs Google sont expirées
- L'icône de fallback devrait s'afficher
- Pas d'action nécessaire

### Le nombre de centres est 0
**Cause** : Problème de parsing CSV  
**Solution** :
1. Vérifiez le format du CSV (virgules, guillemets)
2. Consultez les logs Spring Boot
3. Vérifiez le service `CentresCsvService`

### Les statistiques ne s'affichent pas
**Cause** : Variable `centres` non passée au modèle  
**Solution** :
1. Vérifiez `HomeController.java`
2. Assurez-vous que `model.addAttribute("centres", centres)` est présent
3. Redémarrez l'application

### Les liens téléphoniques ne fonctionnent pas
**Cause** : Format de téléphone incorrect  
**Solution** :
- Les liens sont au format `tel:XXXXXXXXX`
- Sur desktop, cela peut ne pas ouvrir d'application
- Testez sur mobile pour confirmation

---

## 📊 Résultats attendus

| Élément | Attendu |
|---------|---------|
| **Nombre de centres** | 69 |
| **Centres avec téléphone** | ~45 |
| **Centres avec site web** | ~20 |
| **Centres avec évaluation** | ~35 |
| **Centres avec images** | ~25 |
| **Temps de chargement** | < 2s |

---

## ✅ Validation finale

Une fois tous les tests effectués, validez que :

- [x] Les 69 centres sont affichés
- [x] Les cartes sont bien formatées
- [x] Les liens fonctionnent
- [x] Le responsive fonctionne
- [x] Aucune erreur dans la console
- [x] Performance acceptable

---

## 📸 Captures d'écran recommandées

Pour documenter, prenez des captures de :

1. **Vue d'ensemble** - Landing page, section centres
2. **Détail d'un centre** - Carte avec toutes les informations
3. **Statistiques** - Boîtes de statistiques en haut
4. **Vue mobile** - Grille responsive sur mobile
5. **Page Home** - Section centres dépliée

---

## 🆘 Support

Si vous rencontrez des problèmes :

1. **Vérifiez les logs** : Consultez la sortie de `mvn spring-boot:run`
2. **Console navigateur** : Ouvrez les DevTools (F12)
3. **Fichier CSV** : Vérifiez `src/main/resources/static/csv/output.csv`
4. **Documentation** : Consultez `MISE_A_JOUR_CONTENU.md`

---

**Date** : 13 octobre 2025  
**Version** : 1.0  
**Statut** : ✅ Prêt pour les tests

