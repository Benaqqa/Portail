package com.cosone.cosone.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.cosone.cosone.service.CentresCsvService;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Controller
public class EspaceReservationController {

    @Autowired
    private CentresCsvService centresCsvService;

    @GetMapping("/espace-reservation")
    public String afficherEspaceReservation(Model model) {
        
        System.out.println("=== DEBUG: EspaceReservationController appelé ===");
        System.out.println("=== DEBUG: Méthode afficherEspaceReservation exécutée ===");
        
        try {
            // Récupérer les centres depuis le fichier CSV
            List<Map<String, Object>> centres = centresCsvService.loadCentresFromCsv();
            
            System.out.println("DEBUG: Nombre de centres trouvés: " + (centres != null ? centres.size() : "null"));
            
            model.addAttribute("centres", centres != null ? centres : new ArrayList<>());
            
            // Types de logement temporaires (à remplacer par des données réelles plus tard)
            List<Map<String, String>> typesLogement = new ArrayList<>();
            Map<String, String> type1 = Map.of(
                "nom", "Studio",
                "description", "Studio confortable pour 2 personnes",
                "capacite", "2",
                "prix", "150"
            );
            Map<String, String> type2 = Map.of(
                "nom", "Appartement 2 pièces",
                "description", "Appartement spacieux pour 4 personnes",
                "capacite", "4",
                "prix", "250"
            );
            Map<String, String> type3 = Map.of(
                "nom", "Villa",
                "description", "Villa de luxe pour 6 personnes",
                "capacite", "6",
                "prix", "400"
            );
            
            typesLogement.add(type1);
            typesLogement.add(type2);
            typesLogement.add(type3);
            
            System.out.println("DEBUG: Nombre de types de logement: " + typesLogement.size());
            
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