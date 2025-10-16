package com.cosone.cosone.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.cosone.cosone.service.CentresCsvService;
import com.cosone.cosone.repository.UserRepository;
import com.cosone.cosone.repository.ReservationRepository;
import com.cosone.cosone.repository.ExternAuthCodeRepository;
import com.cosone.cosone.model.StatutReservation;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private CentresCsvService centresCsvService;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ReservationRepository reservationRepository;
    
    @Autowired
    private ExternAuthCodeRepository externAuthCodeRepository;

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
        try {
            // Récupérer toutes les réservations
            var reservations = reservationRepository.findAll();
            model.addAttribute("reservations", reservations);
            
            // Statistiques des réservations
            long totalReservations = reservations.size();
            long pendingReservations = reservationRepository.findByStatutOrderByDateReservationDesc(StatutReservation.EN_ATTENTE_PAIEMENT).size();
            long confirmedReservations = reservationRepository.findByStatutOrderByDateReservationDesc(StatutReservation.CONFIRMEE).size();
            long cancelledReservations = reservationRepository.findByStatutOrderByDateReservationDesc(StatutReservation.ANNULEE).size();
            
            model.addAttribute("totalReservations", totalReservations);
            model.addAttribute("pendingReservations", pendingReservations);
            model.addAttribute("confirmedReservations", confirmedReservations);
            model.addAttribute("cancelledReservations", cancelledReservations);
            
        } catch (Exception e) {
            System.err.println("Erreur lors du chargement des réservations: " + e.getMessage());
            e.printStackTrace();
            model.addAttribute("reservations", new ArrayList<>());
            model.addAttribute("totalReservations", 0);
            model.addAttribute("pendingReservations", 0);
            model.addAttribute("confirmedReservations", 0);
            model.addAttribute("cancelledReservations", 0);
            model.addAttribute("error", "Erreur lors du chargement des réservations: " + e.getMessage());
        }
        
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
            
            // Statistiques utilisateurs
            long totalUsers = userRepository.count();
            model.addAttribute("totalUsers", totalUsers);
            
            // Statistiques réservations
            long totalReservations = reservationRepository.count();
            model.addAttribute("totalReservations", totalReservations);
            
            // Statistiques codes d'authentification
            long totalAuthCodes = externAuthCodeRepository.count();
            long usedAuthCodes = externAuthCodeRepository.findAll().stream()
                .filter(code -> code.isUsed())
                .count();
            model.addAttribute("totalAuthCodes", totalAuthCodes);
            model.addAttribute("usedAuthCodes", usedAuthCodes);
            
        } catch (Exception e) {
            System.err.println("Erreur lors du chargement des statistiques: " + e.getMessage());
            e.printStackTrace();
            model.addAttribute("centres", new ArrayList<>());
            model.addAttribute("totalUsers", 0);
            model.addAttribute("totalReservations", 0);
            model.addAttribute("totalAuthCodes", 0);
            model.addAttribute("usedAuthCodes", 0);
        }
        
        return "admin-reports";
    }
    
    /**
     * Page de gestion des utilisateurs
     */
    @GetMapping("/users")
    public String adminUsers(Model model) {
        try {
            var users = userRepository.findAll();
            model.addAttribute("users", users);
            
            // Statistiques utilisateurs
            long totalUsers = users.size();
            long usersWithPassword = users.stream()
                .filter(user -> user.getPassword() != null && !user.getPassword().isEmpty())
                .count();
            long adminUsers = users.stream()
                .filter(user -> "ADMIN".equals(user.getRole()))
                .count();
            
            model.addAttribute("totalUsers", totalUsers);
            model.addAttribute("usersWithPassword", usersWithPassword);
            model.addAttribute("adminUsers", adminUsers);
            
        } catch (Exception e) {
            System.err.println("Erreur lors du chargement des utilisateurs: " + e.getMessage());
            e.printStackTrace();
            model.addAttribute("users", new ArrayList<>());
            model.addAttribute("totalUsers", 0);
            model.addAttribute("usersWithPassword", 0);
            model.addAttribute("adminUsers", 0);
            model.addAttribute("error", "Erreur lors du chargement des utilisateurs: " + e.getMessage());
        }
        
        return "admin-users";
    }
    
    /**
     * Page de génération des codes d'authentification
     */
    @GetMapping("/generate-code")
    public String adminGenerateCode(Model model) {
        try {
            var existingCodes = externAuthCodeRepository.findAll();
            model.addAttribute("existingCodes", existingCodes);
        } catch (Exception e) {
            System.err.println("Erreur lors du chargement des codes: " + e.getMessage());
            e.printStackTrace();
            model.addAttribute("existingCodes", new ArrayList<>());
        }
        return "admin-generate-code";
    }
}

