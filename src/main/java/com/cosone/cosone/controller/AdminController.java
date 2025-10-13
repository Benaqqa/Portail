package com.cosone.cosone.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.cosone.cosone.service.CentresCsvService;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private CentresCsvService centresCsvService;

    /**
     * Page de gestion des centres
     */
    @GetMapping("/centres")
    public String adminCentres(Model model) {
        try {
            // Charger les centres depuis le CSV
            List<Map<String, Object>> centres = centresCsvService.loadCentresFromCsv();
            model.addAttribute("centres", centres != null ? centres : new ArrayList<>());
            
            // Compter les centres actifs
            long centresActifs = centres != null ? 
                centres.stream().filter(c -> Boolean.TRUE.equals(c.get("actif"))).count() : 0;
            model.addAttribute("centresActifs", centresActifs);
            
        } catch (Exception e) {
            System.err.println("Erreur lors du chargement des centres: " + e.getMessage());
            e.printStackTrace();
            model.addAttribute("centres", new ArrayList<>());
            model.addAttribute("centresActifs", 0);
            model.addAttribute("error", "Erreur lors du chargement des centres: " + e.getMessage());
        }
        
        return "admin-centres";
    }

    /**
     * Page de gestion des réservations
     */
    @GetMapping("/reservations")
    public String adminReservations(Model model) {
        // TODO: Implémenter la récupération des réservations depuis la base de données
        // Pour l'instant, page vide avec message informatif
        return "admin-reservations";
    }

    /**
     * Page des rapports et statistiques
     */
    @GetMapping("/reports")
    public String adminReports(Model model) {
        try {
            // Charger les centres pour les statistiques
            List<Map<String, Object>> centres = centresCsvService.loadCentresFromCsv();
            model.addAttribute("centres", centres != null ? centres : new ArrayList<>());
            
            // TODO: Ajouter d'autres statistiques depuis la base de données
            // - Nombre d'utilisateurs
            // - Nombre de réservations
            // - Revenus
            
        } catch (Exception e) {
            System.err.println("Erreur lors du chargement des statistiques: " + e.getMessage());
            e.printStackTrace();
            model.addAttribute("centres", new ArrayList<>());
        }
        
        return "admin-reports";
    }
}

