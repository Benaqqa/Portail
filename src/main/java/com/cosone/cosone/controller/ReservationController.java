package com.cosone.cosone.controller;

import com.cosone.cosone.model.WordPressArticle;
import com.cosone.cosone.service.WordPressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
public class ReservationController {
    
    @Autowired
    private WordPressService wordPressService;
    
    @GetMapping("/espace-reservation")
    public String espaceReservation(
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "search", required = false) String searchTerm,
            Model model) {
        
        try {
            List<WordPressArticle> articles;
            
            if (category != null && !category.trim().isEmpty() && searchTerm != null && !searchTerm.trim().isEmpty()) {
                // Both category and search filters
                articles = wordPressService.getArticlesWithFilters(category, searchTerm);
            } else if (category != null && !category.trim().isEmpty()) {
                // Category filter only
                articles = wordPressService.getArticlesByCategory(category);
            } else if (searchTerm != null && !searchTerm.trim().isEmpty()) {
                // Search filter only
                articles = wordPressService.searchArticles(searchTerm);
            } else {
                // No filters - get all articles
                articles = wordPressService.getArticles();
            }
            
            model.addAttribute("articles", articles);
            model.addAttribute("loading", false);
            model.addAttribute("error", null);
            
            // Add filter values back to model for form persistence
            model.addAttribute("selectedCategory", category);
            model.addAttribute("searchTerm", searchTerm);
            
        } catch (Exception e) {
            model.addAttribute("articles", List.of());
            model.addAttribute("loading", false);
            model.addAttribute("error", "Erreur lors du chargement des articles : " + e.getMessage());
        }
        
        return "espace-reservation";
    }
} 