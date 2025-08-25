package com.cosone.cosone.service;

import org.springframework.stereotype.Service;

@Service
public class EmailService {
    
    /**
     * Envoyer un email
     * TODO: Implémenter l'intégration avec un service d'email (JavaMail, SendGrid, etc.)
     */
    public void envoyerEmail(String destinataire, String sujet, String contenu) {
        // Pour l'instant, on simule l'envoi d'email
        System.out.println("=== EMAIL SIMULÉ ===");
        System.out.println("À: " + destinataire);
        System.out.println("Sujet: " + sujet);
        System.out.println("Contenu: " + contenu);
        System.out.println("===================");
        
        // TODO: Implémenter l'envoi réel d'email
        // Exemple avec JavaMail:
        // - Configurer les propriétés SMTP
        // - Créer une session
        // - Créer et envoyer le message
    }
} 