package com.cosone.cosone.service;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

/**
 * Service pour gérer les paiements Stripe
 */
@Service
public class StripeService {

    @Value("${stripe.api.key}")
    private String stripeApiKey;

    @Value("${stripe.success.url}")
    private String successUrl;

    @Value("${stripe.cancel.url}")
    private String cancelUrl;

    /**
     * Créer une session de paiement Stripe Checkout
     * 
     * @param reservationId ID de la réservation
     * @param amount Montant en DH (sera converti en centimes)
     * @param description Description du paiement
     * @return Session Stripe avec URL de paiement
     */
    public Session createCheckoutSession(Long reservationId, Double amount, String description) throws StripeException {
        // Initialiser Stripe avec la clé API
        Stripe.apiKey = stripeApiKey;

        // Convertir le montant en centimes (Stripe utilise les plus petites unités)
        // 100 DH = 10000 centimes
        long amountInCents = (long) (amount * 100);

        // Créer les paramètres de la session
        SessionCreateParams params = SessionCreateParams.builder()
            .setMode(SessionCreateParams.Mode.PAYMENT)
            .setSuccessUrl(successUrl + "?session_id={CHECKOUT_SESSION_ID}&reservation_id=" + reservationId)
            .setCancelUrl(cancelUrl + "?reservation_id=" + reservationId)
            .addLineItem(
                SessionCreateParams.LineItem.builder()
                    .setPriceData(
                        SessionCreateParams.LineItem.PriceData.builder()
                            .setCurrency("mad") // Dirham marocain
                            .setUnitAmount(amountInCents)
                            .setProductData(
                                SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                    .setName("Réservation COSONE #" + reservationId)
                                    .setDescription(description)
                                    .build()
                            )
                            .build()
                    )
                    .setQuantity(1L)
                    .build()
            )
            // Ajouter des métadonnées pour identifier la réservation
            .putMetadata("reservation_id", reservationId.toString())
            .putMetadata("type", "reservation_payment")
            .build();

        // Créer et retourner la session
        return Session.create(params);
    }

    /**
     * Récupérer une session Stripe existante
     * 
     * @param sessionId ID de la session Stripe
     * @return Session Stripe
     */
    public Session retrieveSession(String sessionId) throws StripeException {
        Stripe.apiKey = stripeApiKey;
        return Session.retrieve(sessionId);
    }

    /**
     * Vérifier si une session a été payée avec succès
     * 
     * @param sessionId ID de la session Stripe
     * @return true si le paiement est réussi
     */
    public boolean isSessionPaid(String sessionId) {
        try {
            Session session = retrieveSession(sessionId);
            return "paid".equals(session.getPaymentStatus());
        } catch (StripeException e) {
            return false;
        }
    }

    /**
     * Obtenir les détails d'une session de paiement
     * 
     * @param sessionId ID de la session Stripe
     * @return Map contenant les détails de la session
     */
    public Map<String, Object> getSessionDetails(String sessionId) {
        Map<String, Object> details = new HashMap<>();
        try {
            Session session = retrieveSession(sessionId);
            details.put("status", session.getPaymentStatus());
            details.put("amount_total", session.getAmountTotal() / 100.0); // Convertir en DH
            details.put("currency", session.getCurrency());
            details.put("customer_email", session.getCustomerEmail());
            details.put("payment_intent", session.getPaymentIntent());
            details.put("reservation_id", session.getMetadata().get("reservation_id"));
        } catch (StripeException e) {
            details.put("error", e.getMessage());
        }
        return details;
    }
}

