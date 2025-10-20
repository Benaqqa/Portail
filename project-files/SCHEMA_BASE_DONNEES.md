# Schéma de Base de Données - Projet COSONE

## Vue d'ensemble

Le projet COSONE utilise une base de données **PostgreSQL** avec une architecture relationnelle basée sur les entités JPA. Le schéma comprend 7 tables principales pour la gestion des utilisateurs, réservations, centres et authentification.

## Diagramme de Base de Données

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                COSONE DATABASE                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐             │
│  │     USERS       │    │    CENTRES      │    │ TYPES_LOGEMENT  │             │
│  ├─────────────────┤    ├─────────────────┤    ├─────────────────┤             │
│  │ id (PK)         │    │ id (PK)         │    │ id (PK)         │             │
│  │ username        │    │ nom             │    │ nom             │             │
│  │ password        │    │ adresse         │    │ description     │             │
│  │ num_cin         │    │ ville           │    │ capacite_max    │             │
│  │ matricule       │    │ telephone       │    │ prix_par_nuit   │             │
│  │ phone_number    │    │ email           │    │ actif           │             │
│  │ role            │    │ description     │    └─────────────────┘             │
│  └─────────────────┘    │ actif           │                                    │
│                         └─────────────────┘                                    │
│                                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐             │
│  │  RESERVATIONS   │    │PERSONNES_ACCOMP.│    │EXTERN_AUTH_CODES│             │
│  ├─────────────────┤    ├─────────────────┤    ├─────────────────┤             │
│  │ id (PK)         │    │ id (PK)         │    │ id (PK)         │             │
│  │ matricule       │    │ reservation_id  │    │ code            │             │
│  │ cin             │    │ nom             │    │ used            │             │
│  │ telephone       │    │ prenom          │    │ created_at      │             │
│  │ email           │    │ cin             │    │ prenom          │             │
│  │ date_debut      │    │ lien_parente    │    │ nom             │             │
│  │ date_fin        │    └─────────────────┘    └─────────────────┘             │
│  │ centre_id (FK)  │           │                                               │
│  │ type_logement_id│           │                                               │
│  │ nombre_personnes│           │                                               │
│  │ statut          │           │                                               │
│  │ date_reservation│           │                                               │
│  │ date_limite_paiement│       │                                               │
│  │ date_paiement   │           │                                               │
│  │ methode_paiement│           │                                               │
│  │ reference_paiement│         │                                               │
│  │ commentaires    │           │                                               │
│  └─────────────────┘           │                                               │
│           │                    │                                               │
│           │                    │                                               │
│           └────────────────────┘                                               │
│                                                                                 │
│  ┌─────────────────┐                                                           │
│  │PHONE_VERIF_CODES│                                                           │
│  ├─────────────────┤                                                           │
│  │ id (PK)         │                                                           │
│  │ phone_number    │                                                           │
│  │ code            │                                                           │
│  │ used            │                                                           │
│  │ created_at      │                                                           │
│  │ expires_at      │                                                           │
│  └─────────────────┘                                                           │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Description Détaillée des Tables

### 1. Table `users`
**Description** : Stocke les informations des utilisateurs du système

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | BIGSERIAL | PRIMARY KEY | Identifiant unique |
| username | VARCHAR | NOT NULL, UNIQUE | Nom d'utilisateur |
| password | VARCHAR | NULL | Mot de passe (peut être null) |
| num_cin | VARCHAR | NOT NULL, UNIQUE | Numéro CIN |
| matricule | VARCHAR | NOT NULL, UNIQUE | Matricule employé |
| phone_number | VARCHAR | NOT NULL, UNIQUE | Numéro de téléphone |
| role | VARCHAR | NOT NULL, DEFAULT 'USER' | Rôle utilisateur (USER/ADMIN) |

### 2. Table `centres`
**Description** : Informations sur les centres de vacances

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | BIGSERIAL | PRIMARY KEY | Identifiant unique |
| nom | VARCHAR | NOT NULL, UNIQUE | Nom du centre |
| adresse | VARCHAR | NOT NULL | Adresse du centre |
| ville | VARCHAR | NOT NULL | Ville |
| telephone | VARCHAR | NOT NULL | Téléphone du centre |
| email | VARCHAR | NOT NULL | Email du centre |
| description | TEXT | NULL | Description du centre |
| actif | BOOLEAN | NOT NULL, DEFAULT true | Centre actif/inactif |

### 3. Table `types_logement`
**Description** : Types de logements disponibles

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | BIGSERIAL | PRIMARY KEY | Identifiant unique |
| nom | VARCHAR | NOT NULL, UNIQUE | Nom du type |
| description | VARCHAR | NOT NULL | Description |
| capacite_max | INTEGER | NOT NULL | Capacité maximale |
| prix_par_nuit | DECIMAL | NOT NULL | Prix par nuit |
| actif | BOOLEAN | NOT NULL, DEFAULT true | Type actif/inactif |

### 4. Table `reservations`
**Description** : Réservations des utilisateurs

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | BIGSERIAL | PRIMARY KEY | Identifiant unique |
| matricule | VARCHAR | NOT NULL | Matricule du réservant |
| cin | VARCHAR | NOT NULL | CIN du réservant |
| telephone | VARCHAR | NOT NULL | Téléphone du réservant |
| email | VARCHAR | NOT NULL | Email du réservant |
| date_debut | TIMESTAMP | NOT NULL | Date de début |
| date_fin | TIMESTAMP | NOT NULL | Date de fin |
| centre_id | BIGINT | NOT NULL, FK | Référence au centre |
| type_logement_id | BIGINT | NOT NULL, FK | Référence au type de logement |
| nombre_personnes | INTEGER | NOT NULL | Nombre de personnes |
| statut | VARCHAR | NOT NULL | Statut de la réservation |
| date_reservation | TIMESTAMP | NOT NULL | Date de création |
| date_limite_paiement | TIMESTAMP | NOT NULL | Date limite de paiement |
| date_paiement | TIMESTAMP | NULL | Date de paiement |
| methode_paiement | VARCHAR | NULL | Méthode de paiement |
| reference_paiement | VARCHAR | NULL | Référence de paiement |
| commentaires | TEXT | NULL | Commentaires |

### 5. Table `personnes_accompagnement`
**Description** : Personnes accompagnant les réservations

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | BIGSERIAL | PRIMARY KEY | Identifiant unique |
| reservation_id | BIGINT | NOT NULL, FK | Référence à la réservation |
| nom | VARCHAR | NOT NULL | Nom de famille |
| prenom | VARCHAR | NOT NULL | Prénom |
| cin | VARCHAR | NOT NULL | Numéro CIN |
| lien_parente | VARCHAR | NOT NULL | Lien de parenté |

### 6. Table `extern_auth_codes`
**Description** : Codes d'authentification externe

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | BIGSERIAL | PRIMARY KEY | Identifiant unique |
| code | VARCHAR | NOT NULL, UNIQUE | Code d'authentification |
| used | BOOLEAN | NOT NULL, DEFAULT false | Code utilisé ou non |
| created_at | TIMESTAMP | NOT NULL | Date de création |
| prenom | VARCHAR | NOT NULL | Prénom associé |
| nom | VARCHAR | NOT NULL | Nom associé |

### 7. Table `phone_verification_codes`
**Description** : Codes de vérification SMS

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | BIGSERIAL | PRIMARY KEY | Identifiant unique |
| phone_number | VARCHAR | NOT NULL | Numéro de téléphone |
| code | VARCHAR | NOT NULL | Code de vérification |
| used | BOOLEAN | NOT NULL, DEFAULT false | Code utilisé ou non |
| created_at | TIMESTAMP | NOT NULL | Date de création |
| expires_at | TIMESTAMP | NOT NULL | Date d'expiration |

## Relations entre Tables

### Relations Principales

1. **Reservations → Centres** (Many-to-One)
   - `reservations.centre_id` → `centres.id`
   - Une réservation appartient à un centre

2. **Reservations → Types de Logement** (Many-to-One)
   - `reservations.type_logement_id` → `types_logement.id`
   - Une réservation concerne un type de logement

3. **Personnes Accompagnement → Reservations** (One-to-Many)
   - `personnes_accompagnement.reservation_id` → `reservations.id`
   - Une réservation peut avoir plusieurs personnes d'accompagnement

### Contraintes d'Intégrité

- **Clés étrangères** : Toutes les références sont validées
- **Unicité** : Username, CIN, matricule, numéro de téléphone uniques
- **Non-nullité** : Champs obligatoires définis
- **Cohérence temporelle** : Dates de début < dates de fin

## Index Recommandés

```sql
-- Index pour les recherches fréquentes
CREATE INDEX idx_reservations_matricule ON reservations(matricule);
CREATE INDEX idx_reservations_dates ON reservations(date_debut, date_fin);
CREATE INDEX idx_reservations_statut ON reservations(statut);
CREATE INDEX idx_users_matricule ON users(matricule);
CREATE INDEX idx_phone_codes_expires ON phone_verification_codes(expires_at);
```

## Scripts de Création

Le schéma est automatiquement généré par Hibernate avec la configuration :
```properties
spring.jpa.hibernate.ddl-auto=update
```

Cette configuration permet la mise à jour automatique du schéma lors des modifications des entités JPA.

## Sécurité et Performance

- **Chiffrement** : Les mots de passe sont chiffrés par Spring Security
- **Validation** : Contraintes de validation au niveau base et application
- **Performance** : Index sur les colonnes fréquemment utilisées
- **Sauvegarde** : Recommandation de sauvegardes régulières PostgreSQL
