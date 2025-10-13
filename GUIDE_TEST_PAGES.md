# Guide de test - Pages "Qui sommes-nous" et "Nos activités"

## Comment tester les modifications

### 1. Démarrer l'application

```bash
cd COSONE
mvn spring-boot:run
```

### 2. Accéder aux pages

#### Page Landing (Navigation latérale)
1. Ouvrez votre navigateur et accédez à : `http://localhost:8080/landing`
2. Vous verrez une page avec un menu latéral à gauche
3. Cliquez sur **"Qui sommes-nous"** dans le menu
4. Cliquez sur **"Nos activités"** dans le menu

#### Page Home (Sections dépliables)
1. Accédez à : `http://localhost:8080/home` ou `http://localhost:8080/`
2. Faites défiler vers le bas jusqu'aux sections
3. Cliquez sur **"Qui sommes-nous"** pour déplier la section
4. Cliquez sur **"Nos activités"** pour déplier la section

## Checklist de vérification

### ✅ Section "Qui sommes-nous"

**Page Landing :**
- [ ] Le titre "Qui sommes-nous" s'affiche correctement
- [ ] Le texte de contexte et mission apparaît
- [ ] Les 3 piliers sont affichés (Rigueur de gestion, Innovation sociale, Proximité humaine)
- [ ] La vision est visible
- [ ] Les 3 icônes statistiques s'affichent (cœur, users, mains)

**Page Home :**
- [ ] La section se déplie au clic
- [ ] Le contexte et la mission sont affichés
- [ ] Les 3 cartes des piliers avec icônes sont visibles
- [ ] La carte de vision avec fond gris est présente

### ✅ Section "Nos activités"

**Page Landing :**
- [ ] Le titre "Nos activités" s'affiche
- [ ] Le message d'introduction est visible
- [ ] Les 5 cartes d'activités sont affichées :
  - [ ] Centres de vacances (icône parasol)
  - [ ] Clubs sportifs et culturels (icône course)
  - [ ] Service de restauration (icône couverts)
  - [ ] Soutien éducatif (icône graduation)
  - [ ] Accompagnement social (icône main avec cœur)
- [ ] Chaque carte a 3 points détaillés
- [ ] Le message de conclusion avec fond jaune est visible

**Page Home :**
- [ ] La section se déplie au clic
- [ ] Le message d'introduction avec fond gris est affiché
- [ ] Les 5 cartes d'activités avec icônes sont visibles
- [ ] Le message de conclusion avec fond jaune est présent

### ✅ Styles et Design

- [ ] Les couleurs correspondent au thème (bleu-violet, gris)
- [ ] Les icônes FontAwesome s'affichent correctement
- [ ] Les dégradés de couleurs fonctionnent
- [ ] Les bordures gauches colorées sont visibles
- [ ] Les cartes ont des ombres et effets au survol

### ✅ Responsive Design

**Desktop (> 1024px) :**
- [ ] Le menu latéral est fixe sur la gauche (page landing)
- [ ] Les grilles d'activités affichent plusieurs colonnes
- [ ] Le header est bien proportionné

**Tablette (768px - 1024px) :**
- [ ] Le menu latéral se rétracte
- [ ] Le toggle menu apparaît
- [ ] Les grilles s'adaptent à 2 colonnes

**Mobile (< 768px) :**
- [ ] Le menu devient un hamburger
- [ ] Les grilles passent en colonne unique
- [ ] Les textes restent lisibles
- [ ] Les boutons sont faciles à cliquer

### ✅ Navigation et Interactivité

**Page Landing :**
- [ ] Le clic sur le menu change de section
- [ ] L'élément de menu actif est surligné
- [ ] Les transitions sont fluides
- [ ] Le menu se ferme au clic à l'extérieur (mobile)

**Page Home :**
- [ ] Les sections se déplient/replient au clic
- [ ] L'icône de flèche tourne lors du dépliage
- [ ] Plusieurs sections peuvent être ouvertes simultanément

### ✅ Section "Nos centres"

- [ ] Les centres s'affichent depuis le CSV
- [ ] Chaque carte de centre affiche :
  - [ ] Le nom
  - [ ] L'adresse et la ville
  - [ ] Le téléphone
  - [ ] Le statut (Actif/Inactif)

## Tests de performance

- [ ] La page se charge en moins de 3 secondes
- [ ] Les animations sont fluides (60fps)
- [ ] Pas d'erreurs dans la console JavaScript
- [ ] Pas d'erreurs dans la console du navigateur

## Tests d'accessibilité

- [ ] Navigation au clavier fonctionne (Tab, Enter, Esc)
- [ ] Les contrastes de couleurs sont suffisants
- [ ] Les icônes ont des alternatives textuelles
- [ ] La navigation au clavier dans le menu fonctionne (flèches)

## Problèmes courants et solutions

### Le menu ne change pas de section
**Solution :** Vérifiez que le fichier `landing.js` est bien chargé dans la console du navigateur.

### Les icônes ne s'affichent pas
**Solution :** Vérifiez que FontAwesome est bien chargé. Regardez dans la console si le CDN est accessible.

### Les centres ne s'affichent pas
**Solution :** Vérifiez que le fichier CSV `output.csv` existe dans `src/main/resources/static/csv/`.

### Les styles ne s'appliquent pas
**Solution :** Videz le cache du navigateur (Ctrl+Shift+R ou Cmd+Shift+R).

### Le responsive ne fonctionne pas
**Solution :** Testez avec les outils de développement (F12) et activez le mode responsive.

## Commandes utiles

### Recompiler le projet
```bash
mvn clean install
```

### Redémarrer l'application
```bash
mvn spring-boot:run
```

### Nettoyer le cache Maven
```bash
mvn clean
```

### Vérifier les logs
```bash
tail -f logs/application.log
```

## Captures d'écran recommandées

Pour documenter les tests, prenez des captures d'écran de :
1. Page landing - Section "Qui sommes-nous"
2. Page landing - Section "Nos activités"
3. Page home - Sections dépliées
4. Vue mobile avec menu hamburger
5. Vue tablette avec grilles adaptées

## Support et documentation

- **Documentation complète** : `MISE_A_JOUR_CONTENU.md`
- **Guide de réservation** : `GUIDE_RESERVATION.md`
- **Documentation CMS** : `DOCUMENTATION_CMS.md`
- **Intégration WordPress** : `WORDPRESS_INTEGRATION_GUIDE.md`

## Remarques finales

- Les pages sont maintenant prêtes pour la production
- Le contenu peut être facilement modifié dans les templates HTML
- Les styles peuvent être personnalisés dans le fichier CSS
- L'intégration WordPress peut être ajoutée ultérieurement

---

**Date de création :** 13 octobre 2025  
**Version :** 1.0  
**Statut :** ✅ Prêt pour les tests

