package com.cosone.cosone.controller;

import com.cosone.cosone.model.Reservation;
import com.cosone.cosone.model.StatutReservation;
import com.cosone.cosone.model.MethodePaiement;
import com.cosone.cosone.repository.ReservationRepository;
import com.cosone.cosone.service.StripeService;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Contrôleur pour gérer les paiements Stripe
 */
@Controller
@RequestMapping("/payment")
public class StripePaymentController {

    @Autowired
    private StripeService stripeService;

    @Autowired
    private ReservationRepository reservationRepository;

    /**
     * Créer une session de paiement Stripe pour une réservation
     */
    @PostMapping("/create-checkout-session/{reservationId}")
    public String createCheckoutSession(@PathVariable Long reservationId, 
                                       RedirectAttributes redirectAttributes) {
        try {
            // Récupérer la réservation
            Reservation reservation = reservationRepository.findById(reservationId).orElse(null);
            
            if (reservation == null) {
                redirectAttributes.addFlashAttribute("error", "Réservation introuvable.");
                return "redirect:/reservation";
            }

            // Vérifier que la réservation est en attente de paiement
            if (reservation.getStatut() != StatutReservation.EN_ATTENTE_PAIEMENT) {
                redirectAttributes.addFlashAttribute("error", "Cette réservation ne peut pas être payée.");
                return "redirect:/reservation/confirmation/" + reservationId;
            }

            // Vérifier que la date limite de paiement n'est pas dépassée
            if (LocalDateTime.now().isAfter(reservation.getDateLimitePaiement())) {
                redirectAttributes.addFlashAttribute("error", "La date limite de paiement est dépassée.");
                return "redirect:/reservation/confirmation/" + reservationId;
            }

            // Créer la description du paiement
            String description = String.format(
                "Réservation %s - %s du %s au %s",
                reservation.getCentre().getNom(),
                reservation.getTypeLogement().getNom(),
                reservation.getDateDebut().toLocalDate(),
                reservation.getDateFin().toLocalDate()
            );

            // Créer la session Stripe
            Session session = stripeService.createCheckoutSession(
                reservationId,
                reservation.getPrixTotal(),
                description
            );

            // Rediriger vers la page de paiement Stripe
            return "redirect:" + session.getUrl();

        } catch (StripeException e) {
            e.printStackTrace();
            redirectAttributes.addFlashAttribute("error", "Erreur lors de la création de la session de paiement: " + e.getMessage());
            return "redirect:/reservation/confirmation/" + reservationId;
        } catch (Exception e) {
            e.printStackTrace();
            redirectAttributes.addFlashAttribute("error", "Erreur inattendue: " + e.getMessage());
            return "redirect:/reservation/confirmation/" + reservationId;
        }
    }

    /**
     * Page de succès après paiement Stripe
     */
    @GetMapping("/success")
    public String paymentSuccess(@RequestParam("session_id") String sessionId,
                                @RequestParam("reservation_id") Long reservationId,
                                Model model,
                                RedirectAttributes redirectAttributes) {
        try {
            // Récupérer la session Stripe
            Map<String, Object> sessionDetails = stripeService.getSessionDetails(sessionId);
            
            // Vérifier que le paiement est réussi
            if ("paid".equals(sessionDetails.get("status"))) {
                // Récupérer la réservation
                Reservation reservation = reservationRepository.findById(reservationId).orElse(null);
                
                if (reservation != null) {
                    // Mettre à jour la réservation
                    reservation.setStatut(StatutReservation.CONFIRMEE);
                    reservation.setMethodePaiement(MethodePaiement.CARTE_BANCAIRE);
                    reservation.setReferencePaiement("STRIPE_" + sessionId);
                    reservation.setDatePaiement(LocalDateTime.now());
                    reservationRepository.save(reservation);

                    model.addAttribute("reservation", reservation);
                    model.addAttribute("sessionDetails", sessionDetails);
                    return "payment-success";
                }
            }

            // Si quelque chose ne va pas, rediriger vers la confirmation
            redirectAttributes.addFlashAttribute("error", "Le paiement n'a pas pu être confirmé.");
            return "redirect:/reservation/confirmation/" + reservationId;

        } catch (Exception e) {
            e.printStackTrace();
            redirectAttributes.addFlashAttribute("error", "Erreur lors de la vérification du paiement: " + e.getMessage());
            return "redirect:/reservation/confirmation/" + reservationId;
        }
    }

    /**
     * Page d'annulation du paiement
     */
    @GetMapping("/cancel")
    public String paymentCancel(@RequestParam("reservation_id") Long reservationId, Model model) {
        Reservation reservation = reservationRepository.findById(reservationId).orElse(null);
        
        if (reservation != null) {
            model.addAttribute("reservation", reservation);
        }
        
        return "payment-cancel";
    }

    /**
     * Webhook pour recevoir les notifications de Stripe
     * Note: Dans un environnement de production, vous devriez valider la signature du webhook
     */
    @PostMapping("/webhook")
    @ResponseBody
    public String handleWebhook(@RequestBody String payload, 
                               @RequestHeader("Stripe-Signature") String sigHeader) {
        // TODO: Implémenter la validation de la signature et le traitement des événements
        // Pour les tests, on peut laisser vide car on traite déjà le paiement dans la page de succès
        return "Received";
    }
}

