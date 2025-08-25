# Guide d'Utilisation du Système de Réservation COSONE

## 🎯 Vue d'ensemble

Le système de réservation COSONE permet aux utilisateurs de réserver des séjours dans les centres de vacances de l'organisation. Le système respecte toutes les règles métier spécifiées et offre une interface moderne et intuitive.

## 🚀 Fonctionnalités Principales

### ✅ Champs Obligatoires
- **Matricule** : Identifiant unique de l'utilisateur
- **CIN** : Carte d'identité nationale
- **Téléphone** : Numéro de contact
- **Email** : Adresse électronique
- **Date début et fin** : Période de séjour
- **Centre choisi** : Lieu de séjour
- **Type de logement** : Catégorie d'hébergement
- **Nombre de personnes** : Capacité du groupe
- **Personnes d'accompagnement** : Détails complets (nom, prénom, CIN, lien de parenté)

### ⏰ Règles Métier Implémentées

#### 1. **Règle des 10 jours**
- Les réservations doivent être faites au moins 10 jours avant le début du séjour
- Validation automatique côté client et serveur

#### 2. **Règle des weekends**
- Les réservations de weekends doivent être faites au début de la semaine (lundi)
- Vérification automatique des dates

#### 3. **Délai de paiement**
- Chaque réservation a un délai de paiement de 24 heures
- Après expiration, la réservation est automatiquement annulée
- Notifications automatiques envoyées

#### 4. **Vérification de disponibilité**
- Contrôle en temps réel de la disponibilité des logements
- Prévention des doubles réservations
- Gestion des conflits de dates

## 🗄️ Structure de la Base de Données

### Tables Principales

#### `centres`
- Informations sur les centres de vacances
- Adresse, ville, téléphone, email
- Statut actif/inactif

#### `types_logement`
- Catégories d'hébergement disponibles
- Capacité maximale et prix par nuit
- Description détaillée

#### `reservations`
- Réservations des utilisateurs
- Statuts multiples (en attente, payée, confirmée, annulée, expirée)
- Gestion des délais de paiement

#### `personnes_accompagnement`
- Détails des personnes accompagnant le demandeur principal
- Informations complètes (nom, prénom, CIN, lien de parenté)

### Index et Performance
- Index sur les champs de recherche fréquents
- Contraintes de validation au niveau base de données
- Triggers pour la mise à jour automatique des timestamps

## 🔧 Installation et Configuration

### 1. **Base de Données**
```sql
-- Exécuter le script SQL
psql -U votre_utilisateur -d votre_base -f create_reservation_tables.sql
```

### 2. **Configuration Spring Boot**
- Vérifier la configuration de la base de données dans `application.properties`
- Les entités JPA sont automatiquement créées au démarrage

### 3. **Démarrage de l'Application**
```bash
mvn spring-boot:run
```

## 📱 Utilisation de l'Interface

### 1. **Accès à la Réservation**
- URL : `/reservation`
- Accessible sans authentification
- Interface responsive et moderne

### 2. **Processus de Réservation**

#### Étape 1 : Informations Personnelles
- Remplir matricule, CIN, téléphone, email
- Tous les champs sont obligatoires

#### Étape 2 : Détails du Séjour
- Sélectionner les dates (début et fin)
- Choisir le centre de destination
- Sélectionner le type de logement
- Spécifier le nombre de personnes

#### Étape 3 : Personnes d'Accompagnement
- Ajouter au moins une personne
- Remplir nom, prénom, CIN, lien de parenté
- Possibilité d'ajouter plusieurs personnes

#### Étape 4 : Validation et Paiement
- Vérification automatique de la disponibilité
- Calcul automatique du prix
- Création de la réservation
- Délai de 24h pour le paiement

### 3. **Fonctionnalités Interactives**

#### Vérification de Disponibilité
- Contrôle en temps réel
- Affichage du statut (disponible/non disponible)
- Prévention des réservations impossibles

#### Calcul de Prix
- Prix automatique basé sur le nombre de nuits
- Affichage en temps réel
- Transparence des coûts

## 🔐 Sécurité et Validation

### 1. **Validation Côté Client**
- Vérification des dates (10 jours minimum)
- Validation des formats (email, téléphone)
- Contrôle des champs obligatoires

### 2. **Validation Côté Serveur**
- Double vérification de toutes les règles métier
- Protection contre les injections SQL
- Validation des données d'entrée

### 3. **Gestion des Erreurs**
- Messages d'erreur clairs et informatifs
- Redirection appropriée en cas d'échec
- Logs détaillés pour le débogage

## 📧 Notifications Automatiques

### 1. **Email de Confirmation**
- Envoi automatique lors de la création
- Détails de la réservation
- Instructions pour le paiement

### 2. **SMS de Confirmation**
- Notification par SMS
- Informations essentielles
- Numéro de référence

### 3. **Notifications de Paiement**
- Confirmation de paiement
- Changement de statut
- Détails de la transaction

## 🚨 Gestion des Annulations

### 1. **Annulation Automatique**
- Expiration du délai de paiement (24h)
- Annulation des réservations en retard
- Notifications automatiques

### 2. **Annulation Manuelle**
- Possibilité d'annuler avant paiement
- Contrôle des droits d'annulation
- Historique des modifications

## 📊 Monitoring et Maintenance

### 1. **Tâches Automatiques**
- Nettoyage des réservations expirées
- Envoi des notifications de rappel
- Mise à jour des statuts

### 2. **Logs et Audit**
- Traçabilité complète des actions
- Historique des modifications
- Statistiques d'utilisation

## 🔮 Évolutions Futures

### 1. **Intégration Paiement**
- Intégration avec des passerelles de paiement
- Support de multiples moyens de paiement
- Sécurisation des transactions

### 2. **API REST**
- Endpoints pour applications mobiles
- Intégration avec d'autres systèmes
- Documentation OpenAPI

### 3. **Tableau de Bord**
- Interface d'administration avancée
- Statistiques en temps réel
- Gestion des centres et logements

## 🆘 Dépannage

### Problèmes Courants

#### 1. **Erreur de Connexion Base de Données**
- Vérifier les paramètres de connexion
- Contrôler l'état du service PostgreSQL
- Vérifier les permissions utilisateur

#### 2. **Erreur de Validation des Dates**
- Vérifier le format des dates
- Contrôler la règle des 10 jours
- Vérifier la règle des weekends

#### 3. **Problème d'Envoi d'Email/SMS**
- Vérifier la configuration des services
- Contrôler les logs d'erreur
- Tester la connectivité

## 📞 Support

Pour toute question ou problème :
- Consulter les logs de l'application
- Vérifier la documentation technique
- Contacter l'équipe de développement

---

**Version** : 1.0  
**Date** : Décembre 2024  
**Auteur** : Équipe COSONE 