package com.cosone.cosone.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import com.cosone.cosone.service.HomeContentService;
import com.cosone.cosone.service.CentresCsvService;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;

@Controller
public class HomeController {
    
    @Autowired
    private HomeContentService homeContentService;
    
    @Autowired
    private CentresCsvService centresCsvService;
    
    @GetMapping("/")
    public String root() {
        return "redirect:/home";
    }
    
    @GetMapping("/home")
    public String home(@RequestParam(value = "logout", required = false) String logout, Model model) {
        // Temporarily disable CSV loading to test if it's causing the error
        // List<Map<String, Object>> centres = centresCsvService.loadCentresFromCsv();
        // model.addAttribute("centres", centres);
        
        return "landing";
    }
    
    @GetMapping("/landing")
    public String landing(Model model) {
        // Add any necessary data for the landing page
        // This can be extended later for WordPress integration
        model.addAttribute("pageTitle", "Landing Page - COSONE");
        model.addAttribute("isLandingPage", true);
        
        return "landing";
    }
} 