# Configuration WordPress pour COSONE

## Vue d'ensemble

L'espace réservation de COSONE est maintenant configuré pour afficher des articles depuis un site WordPress via l'API REST WordPress. Le système inclut :

- Affichage d'articles avec images, titres, extraits et dates
- Filtrage par catégorie et recherche
- Interface moderne et responsive en français
- Données de démonstration en cas d'indisponibilité de l'API WordPress

## Configuration

### 1. Configuration WordPress

#### Activer l'API REST WordPress
L'API REST WordPress est activée par défaut dans WordPress 4.7+. Vérifiez que votre site WordPress est accessible via :
```
https://votre-site-wordpress.com/wp-json/wp/v2/posts
```

#### Permissions
Assurez-vous que les articles sont publics et accessibles via l'API REST.

### 2. Configuration de l'Application COSONE

#### Modifier application.properties
Mettez à jour le fichier `src/main/resources/application.properties` :

```properties
# WordPress API Configuration
wordpress.api.url=https://votre-site-wordpress.com/wp-json/wp/v2
wordpress.api.timeout=5000
```

Remplacez `https://votre-site-wordpress.com` par l'URL de votre site WordPress.

### 3. Catégories WordPress

Pour que le filtrage par catégorie fonctionne, créez ces catégories dans WordPress :
- **Actualités** (slug: `actualites`)
- **Réservation** (slug: `reservation`) 
- **Services** (slug: `services`)

Ou modifiez les options dans le template HTML selon vos catégories existantes.

## Fonctionnalités

### Affichage des Articles
- **Titre** : Titre de l'article WordPress
- **Extrait** : Extrait automatique (sans balises HTML)
- **Image à la une** : Image principale de l'article
- **Date de publication** : Date de publication au format français
- **Lien** : Lien vers l'article complet sur WordPress

### Filtrage
- **Par catégorie** : Filtre les articles par catégorie WordPress
- **Recherche** : Recherche dans le titre et le contenu des articles
- **Combinaison** : Possibilité de combiner catégorie et recherche

### Interface
- **Design responsive** : S'adapte aux mobiles et tablettes
- **Animations** : Effets de survol sur les cartes d'articles
- **États de chargement** : Indicateurs visuels pendant le chargement
- **Gestion d'erreurs** : Messages d'erreur en français

## Données de Démonstration

Si l'API WordPress n'est pas accessible, le système affiche automatiquement des articles de démonstration :
- Guide de Réservation en Ligne
- Nouveaux Services Disponibles  
- Maintenance Planifiée

## Développement

### Structure des Fichiers
```
src/main/java/com/cosone/cosone/
├── controller/
│   └── ReservationController.java          # Contrôleur de la page
├── model/
│   └── WordPressArticle.java              # Modèle d'article
├── service/
│   ├── WordPressService.java              # Interface du service
│   └── WordPressServiceImpl.java          # Implémentation du service
└── resources/templates/
    └── espace-reservation.html            # Template HTML
```

### Personnalisation

#### Modifier les Catégories
Éditez le fichier `espace-reservation.html` et modifiez les options du select :
```html
<select id="categoryFilter">
    <option value="">Toutes les catégories</option>
    <option value="votre-categorie">Votre Catégorie</option>
</select>
```

#### Modifier le Style
Le CSS est intégré dans le template HTML. Modifiez la section `<style>` pour personnaliser l'apparence.

#### Ajouter des Champs
Pour afficher d'autres champs WordPress, modifiez :
1. `WordPressArticle.java` - Ajoutez les propriétés
2. `WordPressServiceImpl.java` - Modifiez `parseArticle()`
3. `espace-reservation.html` - Ajoutez l'affichage

## Dépannage

### Problèmes Courants

#### API WordPress inaccessible
- Vérifiez l'URL dans `application.properties`
- Vérifiez que l'API REST est activée sur WordPress
- Vérifiez les permissions d'accès

#### Articles non affichés
- Vérifiez que les articles sont publiés (status: publish)
- Vérifiez que les articles sont publics
- Consultez les logs de l'application

#### Images non affichées
- Vérifiez que les articles ont une image à la une
- Vérifiez que l'API retourne les données `_embedded`

### Logs
Les logs de l'application incluent des informations détaillées sur :
- Les requêtes vers l'API WordPress
- Les erreurs de connexion
- Le nombre d'articles récupérés

## Sécurité

### Recommandations
- Utilisez HTTPS pour les communications avec WordPress
- Limitez l'accès à l'API WordPress si nécessaire
- Validez et nettoyez les données reçues de WordPress

### Rate Limiting
L'API WordPress peut avoir des limites de taux. Le système inclut une gestion d'erreur qui affiche les données de démonstration en cas de problème.

## Support

Pour toute question ou problème :
1. Vérifiez les logs de l'application
2. Testez l'API WordPress directement
3. Consultez la documentation WordPress REST API 