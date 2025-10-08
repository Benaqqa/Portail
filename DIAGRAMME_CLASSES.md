# Diagramme de Classes - Projet COSONE

## Vue d'ensemble

Ce diagramme présente l'architecture des classes du système COSONE, montrant les entités, contrôleurs, services et repositories avec leurs relations.

## Diagramme de Classes UML

```mermaid
classDiagram
    %% Entités principales
    class User {
        -Long id
        -String username
        -String password
        -String numCin
        -String matricule
        -String phoneNumber
        -String role
        +getId() Long
        +setId(Long) void
        +getUsername() String
        +setUsername(String) void
        +getPassword() String
        +setPassword(String) void
        +getNumCin() String
        +setNumCin(String) void
        +getMatricule() String
        +setMatricule(String) void
        +getPhoneNumber() String
        +setPhoneNumber(String) void
        +getRole() String
        +setRole(String) void
    }

    class Reservation {
        -Long id
        -String matricule
        -String cin
        -String telephone
        -String email
        -LocalDateTime dateDebut
        -LocalDateTime dateFin
        -Centre centre
        -TypeLogement typeLogement
        -Integer nombrePersonnes
        -List~PersonneAccompagnement~ personnesAccompagnement
        -StatutReservation statut
        -LocalDateTime dateReservation
        -LocalDateTime dateLimitePaiement
        -LocalDateTime datePaiement
        -MethodePaiement methodePaiement
        -String referencePaiement
        -String commentaires
        +isEnRetardPaiement() boolean
        +peutEtreReservee() boolean
        +estWeekend() boolean
    }

    class Centre {
        -Long id
        -String nom
        -String adresse
        -String ville
        -String telephone
        -String email
        -String description
        -Boolean actif
        +toString() String
    }

    class TypeLogement {
        -Long id
        -String nom
        -String description
        -Integer capaciteMax
        -Double prixParNuit
        -Boolean actif
        +toString() String
    }

    class PersonneAccompagnement {
        -Long id
        -Reservation reservation
        -String nom
        -String prenom
        -String cin
        -String lienParente
        +toString() String
    }

    class ExternAuthCode {
        -Long id
        -String code
        -boolean used
        -LocalDateTime createdAt
        -String prenom
        -String nom
    }

    class PhoneVerificationCode {
        -Long id
        -String phoneNumber
        -String code
        -boolean used
        -LocalDateTime createdAt
        -LocalDateTime expiresAt
    }

    class WordPressArticle {
        -Long id
        -String title
        -String excerpt
        -String content
        -String link
        -String featuredImageUrl
        -LocalDateTime publishedDate
        -LocalDateTime modifiedDate
        -String author
        -List~String~ categories
        -List~String~ tags
        -String status
        -String slug
    }

    %% Enums
    class StatutReservation {
        <<enumeration>>
        EN_ATTENTE_PAIEMENT
        PAYEE
        CONFIRMEE
        ANNULEE
        EXPIREE
        +getLibelle() String
        +toString() String
    }

    class MethodePaiement {
        <<enumeration>>
        CARTE_BANCAIRE
        VIREMENT
        ESPECES
        CHEQUE
        MOBILE_MONEY
        AUTRE
        +getLibelle() String
        +toString() String
    }

    %% Contrôleurs
    class HomeController {
        -HomeContentService homeContentService
        -CentresCsvService centresCsvService
        +root() String
        +home(String, Model) String
        +landing(Model) String
    }

    class AuthController {
        -UserRepository userRepository
        -ExternAuthCodeRepository externAuthCodeRepository
        -PhoneVerificationCodeRepository phoneVerificationCodeRepository
        -SmsService smsService
        +showLogin(Model) String
        +showRegister(Model) String
        +login(String, String, Model) String
        +register(RegisterRequest, Model) String
        +verifyPhone(String, String, Model) String
        +createPassword(String, String, Model) String
    }

    class ReservationController {
        -ReservationService reservationService
        -CentreRepository centreRepository
        -TypeLogementRepository typeLogementRepository
        -ReservationRepository reservationRepository
        +afficherPageReservation(Model) String
        +creerReservation(Reservation, String, String, Long, Long, RedirectAttributes) String
        +afficherConfirmation(Long, Model) String
        +confirmerPaiement(Long, MethodePaiement, String, RedirectAttributes) String
        +annulerReservation(Long, RedirectAttributes) String
        +afficherDetails(Long, Model) String
        +verifierDisponibilite(Long, Long, String, String) String
        +calculerPrix(Long, String, String) String
    }

    class EspaceReservationController {
        -ReservationService reservationService
        -UserRepository userRepository
        +espaceReservation(Model) String
        +afficherReservations(Model) String
        +annulerReservation(Long, RedirectAttributes) String
    }

    %% Services
    class ReservationService {
        -ReservationRepository reservationRepository
        -CentreRepository centreRepository
        -TypeLogementRepository typeLogementRepository
        +creerReservation(Reservation) Reservation
        +trouverReservationsUtilisateur(String) List~Reservation~
        +confirmerPaiement(Long, MethodePaiement, String) Reservation
        +annulerReservation(Long) void
        +estDisponible(Reservation) boolean
        +calculerPrixTotal(Reservation) Double
    }

    class EmailService {
        +envoyerEmail(String, String, String) void
        +envoyerConfirmationReservation(Reservation) void
    }

    class SmsService {
        +envoyerSms(String, String) void
        +genererCodeVerification() String
    }

    class WordPressService {
        +recupererArticles() List~WordPressArticle~
        +recupererArticle(Long) WordPressArticle
    }

    class HomeContentService {
        -WordPressService wordPressService
        +getHomeContent() Map~String, Object~
    }

    class CentresCsvService {
        +loadCentresFromCsv() List~Map~String, Object~~
        +exportCentresToCsv(List~Centre~) void
    }

    %% Repositories
    class UserRepository {
        <<interface>>
        +findByUsername(String) Optional~User~
        +findByMatricule(String) Optional~User~
        +findByPhoneNumber(String) Optional~User~
        +findByNumCin(String) Optional~User~
    }

    class ReservationRepository {
        <<interface>>
        +findByMatricule(String) List~Reservation~
        +findByStatut(StatutReservation) List~Reservation~
        +findByDateDebutBetween(LocalDateTime, LocalDateTime) List~Reservation~
    }

    class CentreRepository {
        <<interface>>
        +findByActifTrueOrderByNom() List~Centre~
        +findByVille(String) List~Centre~
    }

    class TypeLogementRepository {
        <<interface>>
        +findByActifTrueOrderByNom() List~TypeLogement~
        +findByCapaciteMaxGreaterThanEqual(Integer) List~TypeLogement~
    }

    class ExternAuthCodeRepository {
        <<interface>>
        +findByCodeAndUsedFalse(String) Optional~ExternAuthCode~
        +findByUsedFalse() List~ExternAuthCode~
    }

    class PhoneVerificationCodeRepository {
        <<interface>>
        +findByPhoneNumberAndUsedFalse(String) Optional~PhoneVerificationCode~
        +findByExpiresAtBefore(LocalDateTime) List~PhoneVerificationCode~
    }

    %% Relations entre entités
    Reservation ||--o{ PersonneAccompagnement : "contient"
    Reservation }o--|| Centre : "appartient à"
    Reservation }o--|| TypeLogement : "utilise"
    Reservation ||--|| StatutReservation : "a un statut"
    Reservation ||--|| MethodePaiement : "méthode de paiement"

    %% Relations avec les contrôleurs
    HomeController --> HomeContentService : "utilise"
    HomeController --> CentresCsvService : "utilise"
    AuthController --> UserRepository : "utilise"
    AuthController --> ExternAuthCodeRepository : "utilise"
    AuthController --> PhoneVerificationCodeRepository : "utilise"
    AuthController --> SmsService : "utilise"
    ReservationController --> ReservationService : "utilise"
    ReservationController --> CentreRepository : "utilise"
    ReservationController --> TypeLogementRepository : "utilise"
    ReservationController --> ReservationRepository : "utilise"
    EspaceReservationController --> ReservationService : "utilise"
    EspaceReservationController --> UserRepository : "utilise"

    %% Relations avec les services
    ReservationService --> ReservationRepository : "utilise"
    ReservationService --> CentreRepository : "utilise"
    ReservationService --> TypeLogementRepository : "utilise"
    HomeContentService --> WordPressService : "utilise"

    %% Relations avec les repositories
    UserRepository --> User : "gère"
    ReservationRepository --> Reservation : "gère"
    CentreRepository --> Centre : "gère"
    TypeLogementRepository --> TypeLogement : "gère"
    ExternAuthCodeRepository --> ExternAuthCode : "gère"
    PhoneVerificationCodeRepository --> PhoneVerificationCode : "gère"
```

## Description des Classes

### Entités (Model)

1. **User** : Représente un utilisateur du système avec ses informations d'authentification
2. **Reservation** : Entité centrale pour les réservations avec logique métier intégrée
3. **Centre** : Informations sur les centres de vacances
4. **TypeLogement** : Types de logements disponibles avec tarification
5. **PersonneAccompagnement** : Personnes accompagnant les réservations
6. **ExternAuthCode** : Codes d'authentification externe pour l'inscription
7. **PhoneVerificationCode** : Codes de vérification SMS
8. **WordPressArticle** : Articles récupérés depuis WordPress

### Enums

1. **StatutReservation** : Statuts possibles d'une réservation
2. **MethodePaiement** : Méthodes de paiement acceptées

### Contrôleurs (Controller)

1. **HomeController** : Gestion de la page d'accueil et landing page
2. **AuthController** : Authentification, inscription et vérification
3. **ReservationController** : Gestion complète des réservations
4. **EspaceReservationController** : Espace personnel des utilisateurs

### Services

1. **ReservationService** : Logique métier des réservations
2. **EmailService** : Envoi d'emails
3. **SmsService** : Envoi de SMS
4. **WordPressService** : Intégration WordPress
5. **HomeContentService** : Gestion du contenu de la page d'accueil
6. **CentresCsvService** : Import/Export CSV des centres

### Repositories

Interfaces JPA pour l'accès aux données avec méthodes de requête personnalisées.

## Principes de Design

- **Séparation des responsabilités** : Chaque classe a une responsabilité claire
- **Inversion de dépendance** : Les contrôleurs dépendent des services, pas des repositories
- **Encapsulation** : Données privées avec accesseurs publics
- **Cohésion** : Classes fortement cohésives
- **Couplage faible** : Dépendances minimisées entre les classes
