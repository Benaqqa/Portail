package com.cosone.cosone.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.cosone.cosone.repository.CentreRepository;
import com.cosone.cosone.repository.TypeLogementRepository;
import java.util.ArrayList;

@Controller
public class EspaceReservationController {

    @Autowired
    private CentreRepository centreRepository;
    
    @Autowired
    private TypeLogementRepository typeLogementRepository;

    @GetMapping("/espace-reservation")
    public String afficherEspaceReservation(Model model) {
        
        System.out.println("=== DEBUG: EspaceReservationController appelé ===");
        System.out.println("=== DEBUG: Méthode afficherEspaceReservation exécutée ===");
        
        try {
            // Récupérer tous les centres et types de logement
            var centres = centreRepository.findByActifTrueOrderByNom();
            var typesLogement = typeLogementRepository.findByActifTrueOrderByNom();
            
            System.out.println("DEBUG: Nombre de centres trouvés: " + (centres != null ? centres.size() : "null"));
            System.out.println("DEBUG: Nombre de types de logement trouvés: " + (typesLogement != null ? typesLogement.size() : "null"));
            
            model.addAttribute("centres", centres);
            model.addAttribute("typesLogement", typesLogement);
            

            
        } catch (Exception e) {
            System.err.println("DEBUG: Erreur lors de la récupération des données: " + e.getMessage());
            e.printStackTrace();
            // Ajouter des données d'exemple en cas d'erreur
            model.addAttribute("centres", new ArrayList<>());
            model.addAttribute("typesLogement", new ArrayList<>());
        }
        
        System.out.println("DEBUG: Retour du template: espace-reservation");
        System.out.println("DEBUG: Fin de la méthode afficherEspaceReservation");
        
        // Test: essayer de retourner un template différent pour voir si c'est un problème de résolution
        return "espace-reservation";
    }
}