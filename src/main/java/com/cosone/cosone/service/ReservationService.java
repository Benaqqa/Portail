package com.cosone.cosone.service;

import com.cosone.cosone.model.*;
import com.cosone.cosone.repository.ReservationRepository;
import com.cosone.cosone.repository.CentreRepository;
import com.cosone.cosone.repository.TypeLogementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
public class ReservationService {
    
    @Autowired
    private ReservationRepository reservationRepository;
    
    @Autowired
    private CentreRepository centreRepository;
    
    @Autowired
    private TypeLogementRepository typeLogementRepository;
    
    @Autowired
    private EmailService emailService;
    
    @Autowired
    private SmsService smsService;
    
    /**
     * Créer une nouvelle réservation
     */
    @Transactional
    public Reservation creerReservation(Reservation reservation) throws Exception {
        // Validations
        validerReservation(reservation);
        
        // Vérifier la disponibilité
        if (!estDisponible(reservation)) {
            throw new Exception("Le logement n'est pas disponible pour cette période");
        }
        
        // Vérifier la règle des 10 jours
        if (!peutEtreReservee(reservation.getDateDebut())) {
            throw new Exception("Les réservations doivent être faites au moins 10 jours à l'avance");
        }
        
        // Vérifier la règle des weekends
        if (estWeekend(reservation.getDateDebut()) && !estDebutSemaine()) {
            throw new Exception("Les réservations de weekends doivent être faites au début de la semaine");
        }
        
        // Initialiser les dates
        reservation.setDateReservation(LocalDateTime.now());
        reservation.setDateLimitePaiement(LocalDateTime.now().plusHours(24));
        reservation.setStatut(StatutReservation.EN_ATTENTE_PAIEMENT);
        
        // Sauvegarder la réservation
        Reservation savedReservation = reservationRepository.save(reservation);
        
        // Envoyer email de confirmation
        envoyerEmailConfirmation(savedReservation);
        
        // Envoyer SMS de confirmation
        envoyerSmsConfirmation(savedReservation);
        
        return savedReservation;
    }
    
    /**
     * Valider une réservation
     */
    private void validerReservation(Reservation reservation) throws Exception {
        if (reservation.getMatricule() == null || reservation.getMatricule().trim().isEmpty()) {
            throw new Exception("Le matricule est obligatoire");
        }
        if (reservation.getCin() == null || reservation.getCin().trim().isEmpty()) {
            throw new Exception("Le CIN est obligatoire");
        }
        if (reservation.getTelephone() == null || reservation.getTelephone().trim().isEmpty()) {
            throw new Exception("Le téléphone est obligatoire");
        }
        if (reservation.getEmail() == null || reservation.getEmail().trim().isEmpty()) {
            throw new Exception("L'email est obligatoire");
        }
        if (reservation.getDateDebut() == null) {
            throw new Exception("La date de début est obligatoire");
        }
        if (reservation.getDateFin() == null) {
            throw new Exception("La date de fin est obligatoire");
        }
        if (reservation.getCentre() == null) {
            throw new Exception("Le centre est obligatoire");
        }
        if (reservation.getTypeLogement() == null) {
            throw new Exception("Le type de logement est obligatoire");
        }
        if (reservation.getNombrePersonnes() == null || reservation.getNombrePersonnes() <= 0) {
            throw new Exception("Le nombre de personnes est obligatoire et doit être positif");
        }
        if (reservation.getPersonnesAccompagnement() == null || reservation.getPersonnesAccompagnement().isEmpty()) {
            throw new Exception("Au moins une personne d'accompagnement est obligatoire");
        }
        
        // Valider les personnes d'accompagnement
        for (PersonneAccompagnement personne : reservation.getPersonnesAccompagnement()) {
            if (personne.getNom() == null || personne.getNom().trim().isEmpty()) {
                throw new Exception("Le nom de la personne d'accompagnement est obligatoire");
            }
            if (personne.getPrenom() == null || personne.getPrenom().trim().isEmpty()) {
                throw new Exception("Le prénom de la personne d'accompagnement est obligatoire");
            }
            if (personne.getCin() == null || personne.getCin().trim().isEmpty()) {
                throw new Exception("Le CIN de la personne d'accompagnement est obligatoire");
            }
            if (personne.getLienParente() == null || personne.getLienParente().trim().isEmpty()) {
                throw new Exception("Le lien de parenté est obligatoire");
            }
        }
    }
    
    /**
     * Vérifier si une réservation peut être faite (règle des 10 jours)
     */
    private boolean peutEtreReservee(LocalDateTime dateDebut) {
        return dateDebut.isAfter(LocalDateTime.now().plusDays(10));
    }
    
    /**
     * Vérifier si c'est un weekend
     */
    private boolean estWeekend(LocalDateTime date) {
        int dayOfWeek = date.getDayOfWeek().getValue();
        return dayOfWeek == 6 || dayOfWeek == 7; // Samedi = 6, Dimanche = 7
    }
    
    /**
     * Vérifier si c'est le début de la semaine (Lundi)
     */
    private boolean estDebutSemaine() {
        return LocalDateTime.now().getDayOfWeek().getValue() == 1; // Lundi = 1
    }
    
    /**
     * Vérifier la disponibilité d'un logement
     */
    public boolean estDisponible(Reservation reservation) {
        List<StatutReservation> statutsConflictuels = List.of(
            StatutReservation.PAYEE, 
            StatutReservation.CONFIRMEE
        );
        
        Long count = reservationRepository.countReservationsConflitantes(
            reservation.getCentre().getId(),
            reservation.getTypeLogement().getId(),
            statutsConflictuels,
            reservation.getDateDebut(),
            reservation.getDateFin()
        );
        
        return count == 0;
    }
    
    /**
     * Confirmer le paiement d'une réservation
     */
    @Transactional
    public Reservation confirmerPaiement(Long reservationId, MethodePaiement methodePaiement, String referencePaiement) throws Exception {
        Optional<Reservation> optReservation = reservationRepository.findById(reservationId);
        if (optReservation.isEmpty()) {
            throw new Exception("Réservation non trouvée");
        }
        
        Reservation reservation = optReservation.get();
        
        if (reservation.getStatut() != StatutReservation.EN_ATTENTE_PAIEMENT) {
            throw new Exception("La réservation n'est pas en attente de paiement");
        }
        
        if (LocalDateTime.now().isAfter(reservation.getDateLimitePaiement())) {
            reservation.setStatut(StatutReservation.EXPIREE);
            reservationRepository.save(reservation);
            throw new Exception("Le délai de paiement a expiré, la réservation est annulée");
        }
        
        // Confirmer le paiement
        reservation.setStatut(StatutReservation.PAYEE);
        reservation.setDatePaiement(LocalDateTime.now());
        reservation.setMethodePaiement(methodePaiement);
        reservation.setReferencePaiement(referencePaiement);
        
        Reservation savedReservation = reservationRepository.save(reservation);
        
        // Envoyer confirmation de paiement
        envoyerConfirmationPaiement(savedReservation);
        
        return savedReservation;
    }
    
    /**
     * Annuler une réservation
     */
    @Transactional
    public Reservation annulerReservation(Long reservationId) throws Exception {
        Optional<Reservation> optReservation = reservationRepository.findById(reservationId);
        if (optReservation.isEmpty()) {
            throw new Exception("Réservation non trouvée");
        }
        
        Reservation reservation = optReservation.get();
        
        if (reservation.getStatut() == StatutReservation.ANNULEE) {
            throw new Exception("La réservation est déjà annulée");
        }
        
        if (reservation.getStatut() == StatutReservation.CONFIRMEE) {
            throw new Exception("Impossible d'annuler une réservation confirmée");
        }
        
        reservation.setStatut(StatutReservation.ANNULEE);
        
        return reservationRepository.save(reservation);
    }
    
    /**
     * Trouver les réservations en retard de paiement
     */
    public List<Reservation> trouverReservationsEnRetard() {
        return reservationRepository.findReservationsEnRetardPaiement(
            StatutReservation.EN_ATTENTE_PAIEMENT, 
            LocalDateTime.now()
        );
    }
    
    /**
     * Annuler automatiquement les réservations expirées
     */
    @Transactional
    public void annulerReservationsExpirees() {
        List<Reservation> reservationsEnRetard = trouverReservationsEnRetard();
        
        for (Reservation reservation : reservationsEnRetard) {
            reservation.setStatut(StatutReservation.EXPIREE);
            reservationRepository.save(reservation);
            
            // Envoyer notification d'annulation
            envoyerNotificationAnnulation(reservation);
        }
    }
    
    /**
     * Envoyer email de confirmation
     */
    private void envoyerEmailConfirmation(Reservation reservation) {
        try {
            String sujet = "Confirmation de réservation - COSONE";
            String contenu = "Votre réservation a été créée avec succès. " +
                           "Vous avez 24h pour effectuer le paiement. " +
                           "Référence: " + reservation.getId();
            
            emailService.envoyerEmail(reservation.getEmail(), sujet, contenu);
        } catch (Exception e) {
            // Log l'erreur mais ne pas faire échouer la réservation
            System.err.println("Erreur lors de l'envoi de l'email: " + e.getMessage());
        }
    }
    
    /**
     * Envoyer SMS de confirmation
     */
    private void envoyerSmsConfirmation(Reservation reservation) {
        try {
            String message = "Votre réservation COSONE a été créée. " +
                           "Paiement dans 24h. Ref: " + reservation.getId();
            
            smsService.sendSms(reservation.getTelephone(), message);
        } catch (Exception e) {
            // Log l'erreur mais ne pas faire échouer la réservation
            System.err.println("Erreur lors de l'envoi du SMS: " + e.getMessage());
        }
    }
    
    /**
     * Envoyer confirmation de paiement
     */
    private void envoyerConfirmationPaiement(Reservation reservation) {
        try {
            // Email de confirmation
            String sujet = "Paiement confirmé - COSONE";
            String contenu = "Votre paiement a été confirmé. " +
                           "Votre réservation est maintenant confirmée. " +
                           "Référence: " + reservation.getId();
            
            emailService.envoyerEmail(reservation.getEmail(), sujet, contenu);
            
            // SMS de confirmation
            String message = "Paiement confirmé. Réservation validée. " +
                           "Ref: " + reservation.getId();
            
            smsService.sendSms(reservation.getTelephone(), message);
        } catch (Exception e) {
            System.err.println("Erreur lors de l'envoi de la confirmation: " + e.getMessage());
        }
    }
    
    /**
     * Envoyer notification d'annulation
     */
    private void envoyerNotificationAnnulation(Reservation reservation) {
        try {
            String sujet = "Réservation annulée - COSONE";
            String contenu = "Votre réservation a été annulée car le délai de paiement a expiré. " +
                           "Référence: " + reservation.getId();
            
            emailService.envoyerEmail(reservation.getEmail(), sujet, contenu);
            
            String message = "Réservation annulée - délai expiré. Ref: " + reservation.getId();
            smsService.sendSms(reservation.getTelephone(), message);
        } catch (Exception e) {
            System.err.println("Erreur lors de l'envoi de la notification d'annulation: " + e.getMessage());
        }
    }
    
    /**
     * Calculer le prix total d'une réservation
     */
    public double calculerPrixTotal(Reservation reservation) {
        long nombreNuits = ChronoUnit.DAYS.between(reservation.getDateDebut(), reservation.getDateFin());
        return nombreNuits * reservation.getTypeLogement().getPrixParNuit();
    }
    
    /**
     * Trouver toutes les réservations d'un utilisateur
     */
    public List<Reservation> trouverReservationsUtilisateur(String matricule) {
        return reservationRepository.findByMatriculeOrderByDateReservationDesc(matricule);
    }
    
    /**
     * Trouver toutes les réservations d'un centre
     */
    public List<Reservation> trouverReservationsCentre(Long centreId) {
        return reservationRepository.findByCentreIdOrderByDateDebutAsc(centreId);
    }
} 