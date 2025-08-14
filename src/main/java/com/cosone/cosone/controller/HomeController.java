package com.cosone.cosone.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import com.cosone.cosone.service.HomeContentService;

@Controller
public class HomeController {
    
    @Autowired
    private HomeContentService homeContentService;
    
    @GetMapping("/")
    public String root() {
        return "redirect:/home";
    }
    
    @GetMapping("/home")
    public String home(@RequestParam(value = "logout", required = false) String logout, Model model) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        
        // Check if user is authenticated and not anonymous
        boolean isAuthenticated = auth != null && auth.isAuthenticated() && 
                                !"anonymousUser".equals(auth.getName());
        
        if (isAuthenticated) {
            // User is logged in
            model.addAttribute("username", auth.getName());
            
            // Check if user has admin role
            boolean isAdmin = auth.getAuthorities().stream()
                    .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));
            model.addAttribute("isAdmin", isAdmin);
            model.addAttribute("isAuthenticated", true);
        } else {
            // User is not logged in
            model.addAttribute("isAuthenticated", false);
            if (logout != null) {
                model.addAttribute("message", "Vous avez été déconnecté avec succès.");
            }
        }
        
        // Add home content sections for future WordPress integration
        model.addAttribute("homeContent", homeContentService.getAllHomeContent());
        model.addAttribute("isWordPressContentAvailable", homeContentService.isWordPressContentAvailable());
        
        return "home";
    }
} 