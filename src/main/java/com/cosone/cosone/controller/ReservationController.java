package com.cosone.cosone.controller;

import com.cosone.cosone.model.*;
import com.cosone.cosone.service.ReservationService;
import com.cosone.cosone.repository.CentreRepository;
import com.cosone.cosone.repository.TypeLogementRepository;
import com.cosone.cosone.repository.ReservationRepository;
import com.cosone.cosone.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Controller
@RequestMapping("/reservation")
public class ReservationController {
    
    @Autowired
    private ReservationService reservationService;
    
    @Autowired
    private CentreRepository centreRepository;
    
    @Autowired
    private TypeLogementRepository typeLogementRepository;
    
    @Autowired
    private ReservationRepository reservationRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * Afficher la page principale de réservation
     */
    @GetMapping("")
    public String afficherPageReservation(Model model) {
        // Récupérer les centres et types de logement disponibles
        List<Centre> centres = centreRepository.findByActifTrueOrderByNom();
        List<TypeLogement> typesLogement = typeLogementRepository.findByActifTrueOrderByNom();
        
        model.addAttribute("centres", centres);
        model.addAttribute("typesLogement", typesLogement);
        model.addAttribute("methodePaiement", MethodePaiement.values());
        
        // Récupérer les réservations de l'utilisateur connecté
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getName())) {
            // TODO: Récupérer le matricule de l'utilisateur connecté
            // String matricule = getUserMatricule(auth);
            // List<Reservation> reservations = reservationService.trouverReservationsUtilisateur(matricule);
            // model.addAttribute("reservations", reservations);
        }
        
        return "reservation";
    }
    
    /**
     * Créer une nouvelle réservation
     */
    @PostMapping("/creer")
    public String creerReservation(@ModelAttribute Reservation reservation,
                                   @RequestParam("dateDebutStr") String dateDebutStr,
                                   @RequestParam("dateFinStr") String dateFinStr,
                                   @RequestParam("centreId") Long centreId,
                                   @RequestParam("typeLogementId") Long typeLogementId,
                                   RedirectAttributes redirectAttributes) {
        try {
            // Récupérer l'utilisateur connecté
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getName())) {
                redirectAttributes.addFlashAttribute("error", "Vous devez être connecté pour effectuer une réservation.");
                return "redirect:/login";
            }

            String username = auth.getName();
            Optional<User> userOpt = userRepository.findByUsername(username);
            if (userOpt.isEmpty()) {
                redirectAttributes.addFlashAttribute("error", "Utilisateur non trouvé.");
                return "redirect:/login";
            }

            User user = userOpt.get();
            
            // Parser les dates (format date seulement)
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
            LocalDateTime dateDebut = LocalDateTime.parse(dateDebutStr, formatter);
            LocalDateTime dateFin = LocalDateTime.parse(dateFinStr, formatter);
            
            // Récupérer le centre et le type de logement
            Centre centre = centreRepository.findById(centreId).orElseThrow();
            TypeLogement typeLogement = typeLogementRepository.findById(typeLogementId).orElseThrow();
            
            // Configurer la réservation avec les informations de l'utilisateur
            reservation.setMatricule(user.getMatricule());
            reservation.setCin(user.getNumCin());
            reservation.setTelephone(user.getPhoneNumber());
            // Si l'email n'est pas fourni dans le formulaire, on peut utiliser un email par défaut
            if (reservation.getEmail() == null || reservation.getEmail().isEmpty()) {
                reservation.setEmail(user.getMatricule() + "@cosone.ma");
            }
            reservation.setDateDebut(dateDebut);
            reservation.setDateFin(dateFin);
            reservation.setCentre(centre);
            reservation.setTypeLogement(typeLogement);
            
            // Calculer le prix total
            long nombreNuits = java.time.temporal.ChronoUnit.DAYS.between(dateDebut, dateFin);
            double prixTotal = nombreNuits * typeLogement.getPrixParNuit();
            reservation.setPrixTotal(prixTotal);
            
            // Créer la réservation
            Reservation savedReservation = reservationService.creerReservation(reservation);
            
            redirectAttributes.addFlashAttribute("success", 
                "Réservation créée avec succès ! Référence: " + savedReservation.getId() + 
                ". Vous avez 24h pour effectuer le paiement.");
            
            return "redirect:/reservation/confirmation/" + savedReservation.getId();
            
        } catch (Exception e) {
            e.printStackTrace();
            redirectAttributes.addFlashAttribute("error", "Erreur lors de la création de la réservation: " + e.getMessage());
            return "redirect:/reservation";
        }
    }
    
    /**
     * Afficher la confirmation de réservation
     */
    @GetMapping("/confirmation/{id}")
    public String afficherConfirmation(@PathVariable Long id, Model model) {
        Reservation reservation = reservationRepository.findById(id).orElse(null);
        if (reservation == null) {
            return "redirect:/reservation";
        }
        
        model.addAttribute("reservation", reservation);
        model.addAttribute("prixTotal", reservationService.calculerPrixTotal(reservation));
        model.addAttribute("methodePaiement", MethodePaiement.values());
        
        return "reservation-confirmation";
    }
    
    /**
     * Confirmer le paiement
     */
    @PostMapping("/paiement/{id}")
    public String confirmerPaiement(@PathVariable Long id,
                                    @RequestParam MethodePaiement methodePaiement,
                                    @RequestParam String referencePaiement,
                                    RedirectAttributes redirectAttributes) {
        try {
            Reservation reservation = reservationService.confirmerPaiement(id, methodePaiement, referencePaiement);
            redirectAttributes.addFlashAttribute("success", 
                "Paiement confirmé ! Votre réservation est maintenant validée.");
            
            return "redirect:/reservation/confirmation/" + id;
            
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Erreur lors de la confirmation du paiement: " + e.getMessage());
            return "redirect:/reservation/confirmation/" + id;
        }
    }
    
    /**
     * Annuler une réservation
     */
    @PostMapping("/annuler/{id}")
    public String annulerReservation(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        try {
            reservationService.annulerReservation(id);
            redirectAttributes.addFlashAttribute("success", "Réservation annulée avec succès.");
            
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Erreur lors de l'annulation: " + e.getMessage());
        }
        
        return "redirect:/reservation";
    }
    
    /**
     * Afficher les détails d'une réservation
     */
    @GetMapping("/details/{id}")
    public String afficherDetails(@PathVariable Long id, Model model) {
        Reservation reservation = reservationRepository.findById(id).orElse(null);
        if (reservation == null) {
            return "redirect:/reservation";
        }
        
        model.addAttribute("reservation", reservation);
        model.addAttribute("prixTotal", reservationService.calculerPrixTotal(reservation));
        
        return "reservation-details";
    }
    
    /**
     * Vérifier la disponibilité d'un logement
     */
    @PostMapping("/verifier-disponibilite")
    @ResponseBody
    public String verifierDisponibilite(@RequestParam Long centreId,
                                       @RequestParam Long typeLogementId,
                                       @RequestParam String dateDebutStr,
                                       @RequestParam String dateFinStr) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
            LocalDateTime dateDebut = LocalDateTime.parse(dateDebutStr, formatter);
            LocalDateTime dateFin = LocalDateTime.parse(dateFinStr, formatter);
            
            // Créer une réservation temporaire pour vérifier la disponibilité
            Reservation tempReservation = new Reservation();
            Centre centre = centreRepository.findById(centreId).orElseThrow();
            TypeLogement typeLogement = typeLogementRepository.findById(typeLogementId).orElseThrow();
            
            tempReservation.setCentre(centre);
            tempReservation.setTypeLogement(typeLogement);
            tempReservation.setDateDebut(dateDebut);
            tempReservation.setDateFin(dateFin);
            
            boolean disponible = reservationService.estDisponible(tempReservation);
            
            return disponible ? "disponible" : "non_disponible";
            
        } catch (Exception e) {
            return "erreur";
        }
    }
    
    /**
     * Calculer le prix d'une réservation
     */
    @PostMapping("/calculer-prix")
    @ResponseBody
    public String calculerPrix(@RequestParam Long typeLogementId,
                               @RequestParam String dateDebutStr,
                               @RequestParam String dateFinStr) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
            LocalDateTime dateDebut = LocalDateTime.parse(dateDebutStr, formatter);
            LocalDateTime dateFin = LocalDateTime.parse(dateFinStr, formatter);
            
            TypeLogement typeLogement = typeLogementRepository.findById(typeLogementId).orElseThrow();
            
            long nombreNuits = java.time.temporal.ChronoUnit.DAYS.between(dateDebut, dateFin);
            double prixTotal = nombreNuits * typeLogement.getPrixParNuit();
            
            return String.format("%.2f", prixTotal);
            
        } catch (Exception e) {
            return "0.00";
        }
    }
} 