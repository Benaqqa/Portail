# Diagramme d'Activité - Projet COSONE

## Vue d'ensemble

Ce document présente les diagrammes d'activité du système COSONE, décrivant les flux de processus pour les principales fonctionnalités du système. Les diagrammes sont organisés par domaines fonctionnels pour une meilleure compréhension et une navigation facilitée.

## 1. Processus d'Authentification et Gestion des Utilisateurs

### 1.1 Processus d'Inscription des Utilisateurs Internes (Employés)

Le processus d'inscription des utilisateurs internes est divisé en trois sous-processus distincts pour une meilleure lisibilité :

#### 1.1.1 Première Connexion (Création du Compte)

```mermaid
flowchart TD
    Start([Début]) --> A[Utilisateur interne accède à la page de connexion]
    A --> B[Utilisateur sélectionne Connexion Interne]
    B --> C[Utilisateur clique sur Première connexion]
    C --> D[Utilisateur saisit son Matricule ou Num CIN]
    D --> E[Vérifier l'existence de l'utilisateur en base]
    E --> F{Utilisateur trouvé ?}
    F -->|Non| G[Afficher erreur - Matricule ou Num CIN introuvable]
    G --> D
    F -->|Oui| H{Utilisateur a déjà un mot de passe ?}
    H -->|Oui| I[Afficher erreur - Utilisateur a déjà un mot de passe]
    I --> D
    H -->|Non| J{Numéro de téléphone associé ?}
    J -->|Non| K[Afficher erreur - Aucun numéro de téléphone associé]
    K --> D
    J -->|Oui| L[Générer un code SMS de vérification]
    L --> M[Enregistrer le code en base avec expiration]
    M --> N[Envoyer SMS avec le code]
    N --> O[Rediriger vers la page de vérification SMS]
    O --> End([Fin - Passe au processus de vérification SMS])
```

**Description :** Ce sous-processus gère la première connexion d'un employé interne. Il vérifie l'existence de l'utilisateur, s'assure qu'il n'a pas déjà de mot de passe, et initie le processus de vérification SMS.

#### 1.1.2 Vérification SMS et Création du Mot de Passe

```mermaid
flowchart TD
    Start([Début]) --> A[Utilisateur arrive sur la page de vérification SMS]
    A --> B[Utilisateur saisit le code SMS reçu]
    B --> C{Code SMS valide et non expiré ?}
    C -->|Non| D[Afficher erreur - Code invalide ou expiré]
    D --> B
    C -->|Oui| E[Rediriger vers la création de mot de passe]
    E --> F[Utilisateur crée son mot de passe]
    F --> G[Valider la force du mot de passe]
    G --> H{Mot de passe valide ?}
    H -->|Non| I[Afficher erreur de validation]
    I --> F
    H -->|Oui| J[Enregistrer le mot de passe en base]
    J --> K[Connexion automatique réussie]
    K --> L[Redirection vers l'espace utilisateur]
    L --> End([Fin])
```

**Description :** Ce sous-processus gère la vérification SMS et la création du mot de passe. L'utilisateur doit saisir le code reçu par SMS, puis créer un mot de passe sécurisé pour finaliser son inscription.

#### 1.1.3 Connexion Régulière (Utilisateur Existant)

```mermaid
flowchart TD
    Start([Début]) --> A[Utilisateur interne accède à la page de connexion]
    A --> B[Utilisateur sélectionne Connexion Interne]
    B --> C[Utilisateur saisit son Matricule ou Num CIN]
    C --> D[Utilisateur saisit son mot de passe]
    D --> E[Vérifier les identifiants en base]
    E --> F{Identifiants corrects ?}
    F -->|Non| G[Afficher erreur de connexion]
    G --> C
    F -->|Oui| H[Authentification réussie]
    H --> I[Redirection vers l'espace utilisateur]
    I --> End([Fin])
```

**Description :** Ce sous-processus gère la connexion régulière des utilisateurs internes qui ont déjà un compte et un mot de passe. Il vérifie simplement les identifiants et authentifie l'utilisateur.

**Flux Global :** Les trois sous-processus s'enchaînent selon le statut de l'utilisateur :
1. **Première connexion** → **Vérification SMS** → **Création mot de passe**
2. **Connexion régulière** (si l'utilisateur a déjà un compte)

### 1.2 Processus d'Inscription des Utilisateurs Externes (avec Code d'Authentification)

```mermaid
flowchart TD
    Start([Début]) --> A[Utilisateur externe accède à la page de connexion]
    A --> B[Utilisateur sélectionne Connexion Externe]
    B --> C[Utilisateur saisit le code d'authentification externe]
    C --> D[Utilisateur saisit son prénom]
    D --> E[Utilisateur saisit son nom]
    E --> F[Vérifier l'existence du code en base]
    F --> G{Code trouvé ?}
    G -->|Non| H[Afficher erreur - Code invalide]
    H --> C
    G -->|Oui| I{Code déjà utilisé ?}
    I -->|Oui| J[Afficher erreur - Code déjà utilisé]
    J --> C
    I -->|Non| K[Vérifier la correspondance des noms]
    K --> L{Noms correspondent ?}
    L -->|Non| M[Afficher erreur - Code invalide ou nom incorrect]
    M --> C
    L -->|Oui| N[Marquer le code comme utilisé]
    N --> O[Créer une session temporaire pour l'utilisateur externe]
    O --> P[Assigner le rôle EXTERN]
    P --> Q[Authentification automatique]
    Q --> R[Redirection vers l'espace utilisateur externe]
    R --> End([Fin])
```

**Description :** Ce processus gère l'authentification des utilisateurs externes via des codes d'authentification à usage unique. L'utilisateur externe n'a pas besoin de mot de passe permanent, mais doit fournir un code valide et ses informations personnelles (prénom/nom) qui correspondent à celles associées au code. Le code devient inutilisable après utilisation.

### 1.3 Processus de Gestion des Codes d'Authentification Externes

```mermaid
flowchart TD
    Start([Début]) --> A[Administrateur accède à la génération de codes]
    A --> B[Administrateur saisit le prénom de l'utilisateur externe]
    B --> C[Administrateur saisit le nom de l'utilisateur externe]
    C --> D[Générer un code unique aléatoirement]
    D --> E[Vérifier l'unicité du code en base]
    E --> F{Code unique ?}
    F -->|Non| G[Générer un nouveau code]
    G --> E
    F -->|Oui| H[Enregistrer le code en base avec prénom/nom]
    H --> I[Marquer le code comme non utilisé]
    I --> J[Afficher le code généré à l'administrateur]
    J --> K[Administrateur communique le code à l'utilisateur externe]
    K --> End([Fin])
```

**Description :** Ce processus permet aux administrateurs de générer des codes d'authentification uniques pour les utilisateurs externes. Chaque code est associé à un prénom et nom spécifiques et ne peut être utilisé qu'une seule fois. L'administrateur doit communiquer le code et les informations associées à l'utilisateur externe.

### 1.4 Comparaison des Processus d'Authentification

| Aspect | Utilisateurs Internes | Utilisateurs Externes |
|--------|----------------------|----------------------|
| **Identification** | Matricule ou Num CIN | Code d'authentification externe |
| **Mot de passe** | Obligatoire (créé lors de la première connexion) | Non requis |
| **Vérification SMS** | Oui (pour première connexion) | Non |
| **Persistance** | Session permanente avec mot de passe | Session temporaire |
| **Rôle système** | USER/ADMIN | EXTERN |
| **Numéro téléphone** | Obligatoire | Non requis |
| **Réutilisation** | Connexions multiples | Code à usage unique |
| **Gestion** | Par l'employeur (base de données) | Par l'administrateur (codes générés) |

**Règles de validation spécifiques :**
- **Internes** : Matricule/Num CIN unique, numéro de téléphone obligatoire, mot de passe sécurisé
- **Externes** : Code unique, prénom/nom correspondants, code non utilisé

## 2. Processus de Réservation et Gestion des Séjours

### 2.1 Processus de Création de Réservation

```mermaid
flowchart TD
    Start([Début]) --> A[Utilisateur connecté accède à la réservation]
    A --> B[Afficher la liste des centres disponibles]
    B --> C[Utilisateur sélectionne un centre]
    C --> D[Afficher les types de logement du centre]
    D --> E[Utilisateur sélectionne un type de logement]
    E --> F[Utilisateur choisit les dates de séjour]
    F --> G[Vérifier que les dates sont valides]
    G --> H{Dates valides ?}
    H -->|Non| I[Afficher erreur de dates]
    I --> F
    H -->|Oui| J[Vérifier la disponibilité]
    J --> K{Disponible ?}
    K -->|Non| L[Afficher message d'indisponibilité]
    L --> F
    K -->|Oui| M[Utilisateur saisit le nombre de personnes]
    M --> N[Vérifier la capacité du logement]
    N --> O{Capacité suffisante ?}
    O -->|Non| P[Afficher erreur de capacité]
    P --> M
    O -->|Oui| Q[Calculer le prix total]
    Q --> R[Afficher le récapitulatif et le prix]
    R --> S[Utilisateur ajoute les personnes d'accompagnement]
    S --> T[Utilisateur confirme la réservation]
    T --> U[Créer la réservation en base]
    U --> V[Générer la date limite de paiement]
    V --> W[Envoyer email de confirmation]
    W --> X[Afficher la page de confirmation]
    X --> End([Fin])
```

**Description :** Ce processus complet guide l'utilisateur depuis la sélection du centre jusqu'à la confirmation de sa réservation, en incluant toutes les validations nécessaires.

### 2.2 Processus de Vérification de Disponibilité

```mermaid
flowchart TD
    Start([Début]) --> A[Utilisateur sélectionne centre et type de logement]
    A --> B[Utilisateur choisit les dates]
    B --> C[Récupérer toutes les réservations existantes]
    C --> D[Filtrer les réservations par centre et type]
    D --> E[Vérifier les conflits de dates]
    E --> F{Conflit détecté ?}
    F -->|Oui| G[Calculer les créneaux disponibles]
    G --> H{Y a-t-il des créneaux libres ?}
    H -->|Non| I[Retourner : Non disponible]
    H -->|Oui| J[Retourner : Disponible avec créneaux]
    F -->|Non| K[Retourner : Totalement disponible]
    I --> End([Fin])
    J --> End
    K --> End
```

**Description :** Ce processus vérifie la disponibilité d'un logement pour des dates données, en tenant compte des réservations existantes et en calculant les créneaux libres.

### 2.3 Processus d'Annulation de Réservation

```mermaid
flowchart TD
    Start([Début]) --> A[Utilisateur accède à ses réservations]
    A --> B[Afficher la liste des réservations]
    B --> C[Utilisateur sélectionne une réservation à annuler]
    C --> D[Vérifier le statut de la réservation]
    D --> E{Peut être annulée ?}
    E -->|Non| F[Afficher message d'impossibilité d'annulation]
    F --> End([Fin])
    E -->|Oui| G[Afficher les détails de la réservation]
    G --> H[Demander confirmation d'annulation]
    H --> I{Utilisateur confirme ?}
    I -->|Non| J[Retour à la liste des réservations]
    J --> End
    I -->|Oui| K[Marquer la réservation comme annulée]
    K --> L[Libérer les créneaux de disponibilité]
    L --> M[Envoyer email de confirmation d'annulation]
    M --> N[Afficher confirmation d'annulation]
    N --> End
```

**Description :** Ce processus gère l'annulation des réservations en vérifiant les conditions d'annulation et en libérant les créneaux pour d'autres utilisateurs.

## 3. Processus de Paiement et Gestion Financière

### 3.1 Processus de Paiement

```mermaid
flowchart TD
    Start([Début]) --> A[Utilisateur accède à sa réservation]
    A --> B[Vérifier le statut de la réservation]
    B --> C{Statut = EN_ATTENTE_PAIEMENT ?}
    C -->|Non| D[Afficher message d'erreur]
    D --> End([Fin])
    C -->|Oui| E[Vérifier la date limite de paiement]
    E --> F{Date limite dépassée ?}
    F -->|Oui| G[Marquer la réservation comme expirée]
    G --> H[Afficher message d'expiration]
    H --> End
    F -->|Non| I[Afficher les méthodes de paiement disponibles]
    I --> J[Utilisateur sélectionne une méthode]
    J --> K[Utilisateur saisit la référence de paiement]
    K --> L[Valider la référence de paiement]
    L --> M{Référence valide ?}
    M -->|Non| N[Afficher erreur de référence]
    N --> K
    M -->|Oui| O[Enregistrer les informations de paiement]
    O --> P[Marquer la réservation comme payée]
    P --> Q[Envoyer email de confirmation de paiement]
    Q --> R[Afficher confirmation de paiement]
    R --> End
```

**Description :** Ce processus gère le paiement des réservations en vérifiant les conditions de paiement et en enregistrant les informations de transaction.

### 3.2 Processus de Calcul de Prix

```mermaid
flowchart TD
    Start([Début]) --> A[Récupérer le type de logement sélectionné]
    A --> B[Récupérer le prix par nuit]
    B --> C[Calculer le nombre de nuits]
    C --> D[Appliquer le prix de base]
    D --> E[Vérifier si c'est un weekend]
    E --> F{Weekend ?}
    F -->|Oui| G[Appliquer majoration weekend si applicable]
    F -->|Non| H[Conserver le prix de base]
    G --> I[Calculer le prix total]
    H --> I
    I --> J[Retourner le prix calculé]
    J --> End([Fin])
```

**Description :** Ce processus calcule le prix total d'une réservation en tenant compte du nombre de nuits, des majorations weekend et des tarifs spécifiques au type de logement.

## 4. Processus Système et Communications

### 4.1 Processus d'Envoi de SMS

```mermaid
flowchart TD
    Start([Début]) --> A[Demande d'envoi de SMS]
    A --> B[Générer un code de vérification]
    B --> C[Enregistrer le code en base avec expiration]
    C --> D[Formater le message SMS]
    D --> E[Appeler l'API SMS externe]
    E --> F{Envoi réussi ?}
    F -->|Non| G[Logger l'erreur]
    G --> H[Retourner échec]
    F -->|Oui| I[Marquer le SMS comme envoyé]
    I --> J[Retourner succès]
    H --> End([Fin])
    J --> End
```

**Description :** Ce processus gère l'envoi de SMS de vérification avec génération de codes uniques et gestion des échecs d'envoi.

### 4.2 Processus de Validation et Contrôles Système

Ce processus regroupe les différents contrôles et validations effectués par le système :

**Validations Temporelles :**
- Réservations : Minimum 10 jours à l'avance
- Paiement : Maximum 24h après création
- Codes SMS : Expiration après 10 minutes

**Validations de Capacité :**
- Logements : Nombre de personnes ≤ capacité maximale
- Centres : Vérification de l'activité du centre

**Validations de Données :**
- Unicité : CIN, matricule, numéro de téléphone
- Format : Validation des formats de données
- Cohérence : Dates de début < dates de fin

**Description :** Ces processus de validation assurent l'intégrité des données et le respect des règles métier à chaque étape du système.

## 5. Points de Contrôle et Gestion des Erreurs

### 5.1 Stratégies de Validation

Le système implémente plusieurs niveaux de validation pour assurer la cohérence et la sécurité :

**Validation en Temps Réel :**
- Vérification immédiate des données saisies
- Feedback instantané à l'utilisateur
- Prévention des erreurs avant soumission

**Validation Métier :**
- Respect des règles de gestion spécifiques au domaine
- Contrôles de cohérence entre les différentes entités
- Validation des droits d'accès et permissions

### 5.2 Gestion des Erreurs et Exceptions

**Types d'Erreurs Gérées :**

1. **Erreurs de Validation** : Données incorrectes ou incomplètes
2. **Erreurs de Conflit** : Conflits de disponibilité ou d'unicité
3. **Erreurs Système** : Problèmes techniques (SMS, base de données)
4. **Erreurs de Sécurité** : Tentatives d'accès non autorisé

**Mécanismes de Gestion :**

- **Messages d'erreur clairs** : Information précise pour l'utilisateur
- **Rollback automatique** : Annulation des opérations en cas d'échec
- **Logs détaillés** : Traçabilité pour le débogage et l'audit
- **Récupération gracieuse** : Continuation du service malgré les erreurs

### 5.3 Monitoring et Traçabilité

**Points de Contrôle :**
- Enregistrement de toutes les actions utilisateur
- Suivi des performances des processus critiques
- Monitoring de la disponibilité des services externes
- Alertes automatiques en cas de problème

**Tableaux de Bord :**
- Statistiques d'utilisation en temps réel
- Métriques de performance des processus
- Indicateurs de qualité du service
- Rapports d'activité pour l'administration
