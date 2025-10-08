# Diagramme de Séquences - Projet COSONE

## Vue d'ensemble

Ce document présente les diagrammes de séquences du système COSONE, décrivant les interactions entre les différents composants pour les principales fonctionnalités.

## 1. Séquence d'Inscription Utilisateur

```mermaid
sequenceDiagram
    participant U as Utilisateur
    participant W as Web Browser
    participant AC as AuthController
    participant EAC as ExternAuthCodeRepository
    participant UR as UserRepository
    participant SS as SmsService
    participant PVR as PhoneVerificationCodeRepository

    U->>W: Accède à la page d'inscription
    W->>AC: GET /register
    AC->>W: Afficher formulaire d'inscription
    W->>AC: POST /register (code, infos)
    AC->>EAC: findByCodeAndUsedFalse(code)
    EAC-->>AC: Code trouvé
    AC->>EAC: marquerCodeCommeUtilise(code)
    AC->>UR: findByUsername(username)
    UR-->>AC: Utilisateur non trouvé
    AC->>UR: findByMatricule(matricule)
    UR-->>AC: Matricule non trouvé
    AC->>UR: findByPhoneNumber(phone)
    UR-->>AC: Téléphone non trouvé
    AC->>UR: save(nouvelUtilisateur)
    UR-->>AC: Utilisateur créé
    AC->>SS: genererCodeVerification()
    SS-->>AC: Code généré
    AC->>PVR: save(codeVerification)
    PVR-->>AC: Code sauvegardé
    AC->>SS: envoyerSms(phone, code)
    SS-->>AC: SMS envoyé
    AC->>W: Redirection vers vérification SMS
    W->>U: Afficher page de vérification
```

## 2. Séquence de Vérification SMS

```mermaid
sequenceDiagram
    participant U as Utilisateur
    participant W as Web Browser
    participant AC as AuthController
    participant PVR as PhoneVerificationCodeRepository
    participant UR as UserRepository

    U->>W: Saisit le code SMS reçu
    W->>AC: POST /verify-phone (phone, code)
    AC->>PVR: findByPhoneNumberAndUsedFalse(phone)
    PVR-->>AC: Code trouvé
    AC->>AC: verifierCodeExpiration(code)
    AC->>AC: verifierCodeValide(code, codeSaisi)
    AC->>PVR: marquerCodeCommeUtilise(code)
    PVR-->>AC: Code marqué comme utilisé
    AC->>UR: findByPhoneNumber(phone)
    UR-->>AC: Utilisateur trouvé
    AC->>UR: marquerTelephoneVerifie(utilisateur)
    UR-->>AC: Téléphone vérifié
    AC->>W: Redirection vers création de mot de passe
    W->>U: Afficher formulaire de mot de passe
```

## 3. Séquence de Création de Réservation

```mermaid
sequenceDiagram
    participant U as Utilisateur
    participant W as Web Browser
    participant RC as ReservationController
    participant CR as CentreRepository
    participant TLR as TypeLogementRepository
    participant RS as ReservationService
    participant RR as ReservationRepository

    U->>W: Accède à la page de réservation
    W->>RC: GET /reservation
    RC->>CR: findByActifTrueOrderByNom()
    CR-->>RC: Liste des centres
    RC->>TLR: findByActifTrueOrderByNom()
    TLR-->>RC: Liste des types de logement
    RC->>W: Afficher formulaire de réservation
    W->>U: Afficher centres et types disponibles
    U->>W: Remplit le formulaire de réservation
    W->>RC: POST /reservation/creer (données réservation)
    RC->>CR: findById(centreId)
    CR-->>RC: Centre trouvé
    RC->>TLR: findById(typeLogementId)
    TLR-->>RC: Type de logement trouvé
    RC->>RS: estDisponible(reservation)
    RS->>RR: findByCentreAndTypeLogement(centre, type)
    RR-->>RS: Réservations existantes
    RS->>RS: verifierConflitsDates(reservation, existantes)
    RS-->>RC: Disponible
    RC->>RS: creerReservation(reservation)
    RS->>RR: save(reservation)
    RR-->>RS: Réservation créée
    RS-->>RC: Réservation sauvegardée
    RC->>W: Redirection vers confirmation
    W->>U: Afficher page de confirmation
```

## 4. Séquence de Vérification de Disponibilité

```mermaid
sequenceDiagram
    participant U as Utilisateur
    participant W as Web Browser
    participant RC as ReservationController
    participant RS as ReservationService
    participant RR as ReservationRepository
    participant CR as CentreRepository
    participant TLR as TypeLogementRepository

    U->>W: Sélectionne centre, type et dates
    W->>RC: POST /reservation/verifier-disponibilite
    RC->>CR: findById(centreId)
    CR-->>RC: Centre trouvé
    RC->>TLR: findById(typeLogementId)
    TLR-->>RC: Type de logement trouvé
    RC->>RS: estDisponible(reservation)
    RS->>RR: findByCentreAndTypeLogement(centre, type)
    RR-->>RS: Réservations existantes
    RS->>RS: verifierConflitsDates(reservation, existantes)
    RS-->>RC: Résultat disponibilité
    RC->>W: Retourner statut disponibilité
    W->>U: Afficher statut de disponibilité
```

## 5. Séquence de Confirmation de Paiement

```mermaid
sequenceDiagram
    participant U as Utilisateur
    participant W as Web Browser
    participant RC as ReservationController
    participant RS as ReservationService
    participant RR as ReservationRepository
    participant ES as EmailService

    U->>W: Accède à la confirmation de réservation
    W->>RC: GET /reservation/confirmation/{id}
    RC->>RR: findById(id)
    RR-->>RC: Réservation trouvée
    RC->>W: Afficher détails et options de paiement
    W->>U: Afficher formulaire de paiement
    U->>W: Saisit méthode et référence de paiement
    W->>RC: POST /reservation/paiement/{id}
    RC->>RS: confirmerPaiement(id, methode, reference)
    RS->>RR: findById(id)
    RR-->>RS: Réservation trouvée
    RS->>RS: verifierStatutReservation(reservation)
    RS->>RS: verifierDateLimitePaiement(reservation)
    RS->>RR: updateStatutEtPaiement(reservation)
    RR-->>RS: Réservation mise à jour
    RS-->>RC: Paiement confirmé
    RC->>ES: envoyerConfirmationPaiement(reservation)
    ES-->>RC: Email envoyé
    RC->>W: Redirection vers confirmation
    W->>U: Afficher confirmation de paiement
```

## 6. Séquence d'Annulation de Réservation

```mermaid
sequenceDiagram
    participant U as Utilisateur
    participant W as Web Browser
    participant ERC as EspaceReservationController
    participant RS as ReservationService
    participant RR as ReservationRepository
    participant ES as EmailService

    U->>W: Accède à son espace réservation
    W->>ERC: GET /espace-reservation
    ERC->>RS: trouverReservationsUtilisateur(matricule)
    RS->>RR: findByMatricule(matricule)
    RR-->>RS: Liste des réservations
    RS-->>ERC: Réservations de l'utilisateur
    ERC->>W: Afficher liste des réservations
    W->>U: Afficher réservations avec options
    U->>W: Clique sur "Annuler" pour une réservation
    W->>ERC: POST /espace-reservation/annuler/{id}
    ERC->>RS: annulerReservation(id)
    RS->>RR: findById(id)
    RR-->>RS: Réservation trouvée
    RS->>RS: verifierPossibiliteAnnulation(reservation)
    RS->>RR: updateStatut(reservation, ANNULEE)
    RR-->>RS: Réservation annulée
    RS-->>ERC: Annulation confirmée
    ERC->>ES: envoyerConfirmationAnnulation(reservation)
    ES-->>ERC: Email envoyé
    ERC->>W: Redirection avec message de succès
    W->>U: Afficher confirmation d'annulation
```

## 7. Séquence de Connexion Utilisateur

```mermaid
sequenceDiagram
    participant U as Utilisateur
    participant W as Web Browser
    participant AC as AuthController
    participant UR as UserRepository
    participant SC as SecurityContext

    U->>W: Accède à la page de connexion
    W->>AC: GET /login
    AC->>W: Afficher formulaire de connexion
    W->>U: Afficher formulaire
    U->>W: Saisit username et password
    W->>AC: POST /login (username, password)
    AC->>UR: findByUsername(username)
    UR-->>AC: Utilisateur trouvé
    AC->>AC: verifierMotDePasse(password, hash)
    AC->>SC: setAuthentication(utilisateur)
    SC-->>AC: Utilisateur authentifié
    AC->>W: Redirection vers page d'accueil
    W->>U: Afficher page d'accueil connecté
```

## 8. Séquence de Génération de Code d'Authentification (Admin)

```mermaid
sequenceDiagram
    participant A as Administrateur
    participant W as Web Browser
    participant AC as AuthController
    participant EAC as ExternAuthCodeRepository

    A->>W: Accède à la génération de codes
    W->>AC: GET /admin/generate-code
    AC->>W: Afficher formulaire de génération
    W->>A: Afficher formulaire
    A->>W: Saisit informations employé
    W->>AC: POST /admin/generate-code (prenom, nom)
    AC->>AC: genererCodeUnique()
    AC->>EAC: findByCode(code)
    EAC-->>AC: Code non trouvé (unique)
    AC->>EAC: save(nouveauCode)
    EAC-->>AC: Code sauvegardé
    AC->>W: Afficher code généré
    W->>A: Afficher code à communiquer
```

## 9. Séquence de Chargement de la Page d'Accueil

```mermaid
sequenceDiagram
    participant U as Utilisateur
    participant W as Web Browser
    participant HC as HomeController
    participant HCS as HomeContentService
    participant WS as WordPressService
    participant CCS as CentresCsvService

    U->>W: Accède à la page d'accueil
    W->>HC: GET /home
    HC->>HCS: getHomeContent()
    HCS->>WS: recupererArticles()
    WS-->>HCS: Articles WordPress
    HCS->>CCS: loadCentresFromCsv()
    CCS-->>HCS: Données des centres
    HCS-->>HC: Contenu de la page
    HC->>W: Afficher landing page
    W->>U: Afficher page d'accueil avec contenu
```

## 10. Séquence d'Envoi de SMS

```mermaid
sequenceDiagram
    participant SS as SmsService
    participant API as API SMS Externe
    participant PVR as PhoneVerificationCodeRepository

    SS->>SS: genererCodeVerification()
    SS->>PVR: save(codeVerification)
    PVR-->>SS: Code sauvegardé
    SS->>SS: formaterMessageSMS(phone, code)
    SS->>API: envoyerSMS(phone, message)
    API-->>SS: Statut envoi
    alt Envoi réussi
        SS->>SS: loggerSucces()
        SS-->>Appelant: Succès
    else Échec envoi
        SS->>SS: loggerErreur()
        SS-->>Appelant: Échec
    end
```

## Points Clés des Interactions

### Gestion des Erreurs
- Chaque interaction inclut des vérifications de validité
- Les erreurs sont propagées avec des messages explicites
- Les rollbacks sont effectués en cas d'échec

### Sécurité
- Authentification requise pour les opérations sensibles
- Validation des données à chaque étape
- Gestion des sessions utilisateur

### Performance
- Utilisation de repositories pour l'accès aux données
- Mise en cache des données fréquemment utilisées
- Optimisation des requêtes de base de données

### Traçabilité
- Logging des opérations importantes
- Suivi des modifications d'état
- Historique des actions utilisateur
