package com.cosone.cosone.controller.api;

import com.cosone.cosone.model.*;
import com.cosone.cosone.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "http://localhost:3000")
public class ReservationRestController {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private CentreRepository centreRepository;

    @Autowired
    private TypeLogementRepository typeLogementRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PersonneAccompagnementRepository personneAccompagnementRepository;

    /**
     * Créer une nouvelle réservation
     */
    @PostMapping
    public ResponseEntity<?> createReservation(@RequestBody Map<String, Object> reservationData, Authentication auth) {
        try {
            // Récupérer l'utilisateur connecté
            String matricule = (String) reservationData.get("matricule");
            
            // Créer la réservation
            Reservation reservation = new Reservation();
            reservation.setMatricule(matricule);
            reservation.setCin((String) reservationData.get("cin"));
            reservation.setTelephone((String) reservationData.get("telephone"));
            reservation.setEmail((String) reservationData.get("email"));
            
            // Dates
            String dateDebutStr = (String) reservationData.get("dateDebut");
            String dateFinStr = (String) reservationData.get("dateFin");
            reservation.setDateDebut(LocalDateTime.parse(dateDebutStr));
            reservation.setDateFin(LocalDateTime.parse(dateFinStr));
            
            // Centre et type de logement
            Long centreId = Long.valueOf(reservationData.get("centreId").toString());
            Long typeLogementId = Long.valueOf(reservationData.get("typeLogementId").toString());
            
            Centre centre = centreRepository.findById(centreId)
                    .orElseThrow(() -> new RuntimeException("Centre introuvable"));
            TypeLogement typeLogement = typeLogementRepository.findById(typeLogementId)
                    .orElseThrow(() -> new RuntimeException("Type de logement introuvable"));
            
            reservation.setCentre(centre);
            reservation.setTypeLogement(typeLogement);
            
            // Nombre de personnes
            reservation.setNombrePersonnes(Integer.valueOf(reservationData.get("nombrePersonnes").toString()));
            
            // Commentaires
            if (reservationData.containsKey("commentaires")) {
                reservation.setCommentaires((String) reservationData.get("commentaires"));
            }
            
            // Calculer le prix total
            long jours = java.time.Duration.between(reservation.getDateDebut(), reservation.getDateFin()).toDays();
            double prixTotal = jours * typeLogement.getPrixParNuit();
            reservation.setPrixTotal(prixTotal);
            
            // Sauvegarder
            Reservation savedReservation = reservationRepository.save(reservation);
            
            // Traiter les personnes accompagnantes si présentes
            @SuppressWarnings("unchecked")
            List<Map<String, String>> accompagnants = (List<Map<String, String>>) reservationData.get("personnesAccompagnement");
            if (accompagnants != null && !accompagnants.isEmpty()) {
                 for (Map<String, String> accompagnantData : accompagnants) {
                    PersonneAccompagnement personne = new PersonneAccompagnement();
                    personne.setReservation(savedReservation);
                    personne.setNom(accompagnantData.get("nom"));
                    personne.setPrenom(accompagnantData.get("prenom"));
                    personne.setCin(accompagnantData.get("cin"));
                    personne.setTelephone(accompagnantData.get("telephone"));
                    // Set default relationship if not provided
                    personne.setLienParente(accompagnantData.getOrDefault("lienParente", "Accompagnant"));
                    
                    personneAccompagnementRepository.save(personne);
                }
            }
            
            return ResponseEntity.ok(savedReservation);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", "Erreur lors de la création de la réservation: " + e.getMessage()));
        }
    }

    /**
     * Récupérer toutes les réservations de l'utilisateur connecté par matricule
     */
    @GetMapping("/user/matricule")
    public List<Reservation> getUserReservationsByMatricule(Authentication auth) {
        String username = auth.getName();
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return List.of(); // Retourner une liste vide si utilisateur non trouvé
        }
        
        User user = userOpt.get();
        String matricule = user.getMatricule();
        return reservationRepository.findByMatriculeOrderByDateReservationDesc(matricule);
    }

    /**
     * Récupérer toutes les réservations de l'utilisateur connecté par CIN (fallback)
     */
    @GetMapping("/user/cin")
    public List<Reservation> getUserReservationsByCin(Authentication auth) {
        String username = auth.getName();
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return List.of(); // Retourner une liste vide si utilisateur non trouvé
        }
        
        User user = userOpt.get();
        String cin = user.getNumCin();
        return reservationRepository.findByCinOrderByDateReservationDesc(cin);
    }

    /**
     * Récupérer une réservation par son ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getReservationById(@PathVariable Long id, Authentication auth) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Réservation introuvable"));
        
        // Récupérer l'utilisateur connecté pour obtenir son matricule
        String username = auth.getName();
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(403).body(Map.of("message", "Utilisateur non trouvé"));
        }
        
        User user = userOpt.get();
        String userMatricule = user.getMatricule();
        
        // Vérifier que l'utilisateur est le propriétaire
        if (!reservation.getMatricule().equals(userMatricule)) {
            return ResponseEntity.status(403).body(Map.of("message", "Accès non autorisé"));
        }
        
        return ResponseEntity.ok(reservation);
    }

    /**
     * Annuler une réservation
     */
    @PostMapping("/{id}/annuler")
    public ResponseEntity<?> annulerReservation(@PathVariable Long id, Authentication auth) {
        try {
            Reservation reservation = reservationRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Réservation introuvable"));
            
            // Récupérer l'utilisateur connecté pour obtenir son matricule
            String username = auth.getName();
            Optional<User> userOpt = userRepository.findByUsername(username);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(403).body(Map.of("message", "Utilisateur non trouvé"));
            }
            
            User user = userOpt.get();
            String userMatricule = user.getMatricule();
            
            // Vérifier que l'utilisateur est le propriétaire
            if (!reservation.getMatricule().equals(userMatricule)) {
                return ResponseEntity.status(403).body(Map.of("message", "Accès non autorisé"));
            }
            
            reservation.setStatut(StatutReservation.ANNULEE);
            reservationRepository.save(reservation);
            
            return ResponseEntity.ok(Map.of("message", "Réservation annulée avec succès"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Erreur lors de l'annulation: " + e.getMessage()));
        }
    }

    /**
     * Confirmer le paiement d'une réservation
     */
    @PostMapping("/{id}/confirmer-paiement")
    public ResponseEntity<?> confirmerPaiement(@PathVariable Long id, @RequestBody Map<String, String> paiementData, Authentication auth) {
        try {
            Reservation reservation = reservationRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Réservation introuvable"));
            
            // Récupérer l'utilisateur connecté pour obtenir son matricule
            String username = auth.getName();
            Optional<User> userOpt = userRepository.findByUsername(username);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(403).body(Map.of("message", "Utilisateur non trouvé"));
            }
            
            User user = userOpt.get();
            String userMatricule = user.getMatricule();
            
            // Vérifier que l'utilisateur est le propriétaire
            if (!reservation.getMatricule().equals(userMatricule)) {
                return ResponseEntity.status(403).body(Map.of("message", "Accès non autorisé"));
            }
            
            // Mettre à jour les informations de paiement
            String methode = paiementData.get("methodePaiement");
            reservation.setMethodePaiement(MethodePaiement.valueOf(methode));
            reservation.setReferencePaiement(paiementData.get("referencePaiement"));
            reservation.setDatePaiement(LocalDateTime.now());
            reservation.setStatut(StatutReservation.CONFIRMEE);
            
            reservationRepository.save(reservation);
            
            return ResponseEntity.ok(Map.of("message", "Paiement confirmé avec succès"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Erreur lors de la confirmation: " + e.getMessage()));
        }
    }
}

