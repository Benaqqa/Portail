package com.cosone.cosone.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import com.cosone.cosone.service.CentresCsvService;
import com.cosone.cosone.model.User;
import com.cosone.cosone.repository.UserRepository;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.Optional;

@Controller
public class HomeController {
    
    @Autowired
    private CentresCsvService centresCsvService;
    
    @Autowired
    private UserRepository userRepository;
    
    @GetMapping("/")
    public String root() {
        return "redirect:/landing";
    }
    
    @GetMapping("/home")
    public String home(@RequestParam(value = "logout", required = false) String logout, Model model) {
        // Load centres from CSV
        List<Map<String, Object>> centres = centresCsvService.loadCentresFromCsv();
        model.addAttribute("centres", centres != null ? centres : new ArrayList<>());
        
        // Check if user is authenticated
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() && 
            !authentication.getName().equals("anonymousUser")) {
            
            model.addAttribute("isAuthenticated", true);
            model.addAttribute("username", authentication.getName());
            
            // Get user details from database
            Optional<User> userOpt = userRepository.findByUsername(authentication.getName());
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                // Use matricule as display name since fullName doesn't exist
                model.addAttribute("userFullName", user.getMatricule());
                model.addAttribute("userRole", user.getRole());
                model.addAttribute("isAdmin", "ADMIN".equals(user.getRole()));
            }
        } else {
            model.addAttribute("isAuthenticated", false);
        }
        
        // Add logout message if present
        if (logout != null) {
            model.addAttribute("message", "Vous avez été déconnecté avec succès.");
        }
        
        return "home";
    }
    
    @GetMapping("/landing")
    public String landing(Model model) {
        // Add any necessary data for the landing page
        model.addAttribute("pageTitle", "Landing Page - COSONE");
        model.addAttribute("isLandingPage", true);
        
        // Load centres from CSV
        List<Map<String, Object>> centres = centresCsvService.loadCentresFromCsv();
        model.addAttribute("centres", centres != null ? centres : new ArrayList<>());
        
        return "landing";
    }
    
    // Redirections pour les routes françaises
    @GetMapping("/historique")
    public String historique() {
        return "redirect:/user/history";
    }
    
    @GetMapping("/profil")
    public String profil() {
        return "redirect:/user/profile";
    }
} 