# Documentation CMS - Projet COSONE

## Vue d'ensemble du CMS

Le projet COSONE utilise **Spring Boot** comme framework principal avec **Thymeleaf** comme moteur de template pour la gestion de contenu et l'interface utilisateur.

## Architecture du CMS

### 1. Framework Principal : Spring Boot 3.5.4

**Spring Boot** est utilisé comme CMS backend avec les caractéristiques suivantes :
- **Version** : 3.5.4
- **Java** : Version 17
- **Architecture** : MVC (Model-View-Controller)
- **Injection de dépendances** : Automatique via annotations Spring

### 2. Moteur de Template : Thymeleaf

**Thymeleaf** est utilisé pour la génération des pages web :
- **Intégration** : `spring-boot-starter-thymeleaf`
- **Encodage** : UTF-8
- **Cache** : Désactivé en développement
- **Templates** : Stockés dans `src/main/resources/templates/`

### 3. Base de Données : PostgreSQL

**PostgreSQL** est utilisé comme SGBD :
- **Driver** : `org.postgresql:postgresql`
- **ORM** : JPA/Hibernate
- **Configuration** : `spring.jpa.hibernate.ddl-auto=update`

### 4. Sécurité : Spring Security

**Spring Security** gère l'authentification et l'autorisation :
- **Authentification** : Basée sur les utilisateurs en base
- **Rôles** : USER, ADMIN
- **Protection** : CSRF activé

## Structure du CMS

### Modèles de Données (Entités)

1. **User** - Gestion des utilisateurs
2. **Reservation** - Gestion des réservations
3. **Centre** - Centres de vacances
4. **TypeLogement** - Types de logements disponibles
5. **PersonneAccompagnement** - Personnes accompagnant les réservations
6. **ExternAuthCode** - Codes d'authentification externe
7. **PhoneVerificationCode** - Codes de vérification SMS

### Contrôleurs (Controllers)

1. **HomeController** - Page d'accueil et landing page
2. **AuthController** - Authentification et inscription
3. **ReservationController** - Gestion des réservations
4. **EspaceReservationController** - Espace personnel des utilisateurs

### Services

1. **ReservationService** - Logique métier des réservations
2. **EmailService** - Envoi d'emails
3. **SmsService** - Envoi de SMS
4. **WordPressService** - Intégration WordPress
5. **HomeContentService** - Gestion du contenu de la page d'accueil

### Repositories

Interface avec JPA pour l'accès aux données :
- **UserRepository**
- **ReservationRepository**
- **CentreRepository**
- **TypeLogementRepository**
- **ExternAuthCodeRepository**
- **PhoneVerificationCodeRepository**

## Fonctionnalités du CMS

### 1. Gestion des Utilisateurs
- Inscription avec code d'authentification externe
- Vérification par SMS
- Gestion des rôles (USER/ADMIN)
- Authentification sécurisée

### 2. Gestion des Réservations
- Création de réservations
- Gestion des statuts (EN_ATTENTE_PAIEMENT, PAYEE, CONFIRMEE, etc.)
- Calcul automatique des prix
- Vérification de disponibilité

### 3. Gestion des Centres
- CRUD des centres de vacances
- Import/Export CSV
- Gestion des types de logements

### 4. Intégration WordPress
- Récupération d'articles depuis WordPress
- Affichage dynamique du contenu
- API REST WordPress

## Configuration

### Fichier application.properties

```properties
# Base de données
spring.datasource.url=jdbc:postgresql://localhost:5432/cosone_db (temporaire)
spring.datasource.username=postgres
spring.datasource.password=12345678

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# Thymeleaf
spring.thymeleaf.encoding=UTF-8
spring.thymeleaf.cache=false

# WordPress API
wordpress.api.url=https://moubarakmimo-barit.wordpress.com/
wordpress.api.timeout=5000
```

## Avantages de cette Architecture

1. **Scalabilité** : Spring Boot permet une montée en charge facile
2. **Sécurité** : Spring Security offre une sécurité robuste
3. **Maintenabilité** : Architecture MVC claire et modulaire
4. **Flexibilité** : Thymeleaf permet des templates dynamiques
5. **Performance** : JPA/Hibernate optimise les requêtes
6. **Intégration** : Facile d'intégrer de nouveaux services

## Technologies Utilisées

- **Backend** : Spring Boot 3.5.4, Spring Security, Spring Data JPA
- **Frontend** : Thymeleaf, HTML5, CSS3, JavaScript
- **Base de données** : PostgreSQL
- **Build** : Maven
- **Java** : Version 17

Cette architecture CMS moderne et robuste permet une gestion efficace du système de réservation COSONE avec une interface utilisateur intuitive et une sécurité renforcée.
