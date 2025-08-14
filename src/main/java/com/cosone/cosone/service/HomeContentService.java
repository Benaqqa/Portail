package com.cosone.cosone.service;

import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

/**
 * Service to manage home page content sections
 * This service will later be integrated with WordPress to fetch dynamic content
 */
@Service
public class HomeContentService {
    
    /**
     * Get content for "Qui sommes-nous" section
     * @return Map containing section content
     */
    public Map<String, Object> getQuiSommesNous() {
        Map<String, Object> content = new HashMap<>();
        content.put("title", "Qui sommes-nous");
        content.put("description", "Contenu en cours de chargement depuis WordPress...");
        content.put("sections", new String[]{"Notre Mission", "Notre Vision", "Nos Valeurs"});
        content.put("isWordPressContent", false);
        return content;
    }
    
    /**
     * Get content for "Nos Activités" section
     * @return Map containing section content
     */
    public Map<String, Object> getNosActivites() {
        Map<String, Object> content = new HashMap<>();
        content.put("title", "Nos Activités");
        content.put("description", "Contenu en cours de chargement depuis WordPress...");
        content.put("sections", new String[]{"Formation", "Consultation", "Accompagnement"});
        content.put("isWordPressContent", false);
        return content;
    }
    
    /**
     * Get content for "Nos Centres" section
     * @return Map containing section content
     */
    public Map<String, Object> getNosCentres() {
        Map<String, Object> content = new HashMap<>();
        content.put("title", "Nos Centres");
        content.put("description", "Contenu en cours de chargement depuis WordPress...");
        content.put("sections", new String[]{"Centre Principal", "Centres Régionaux", "Centres Spécialisés"});
        content.put("isWordPressContent", false);
        return content;
    }
    
    /**
     * Get content for "Nos Conventions" section
     * @return Map containing section content
     */
    public Map<String, Object> getNosConventions() {
        Map<String, Object> content = new HashMap<>();
        content.put("title", "Nos Conventions");
        content.put("description", "Contenu en cours de chargement depuis WordPress...");
        content.put("sections", new String[]{"Partenariats", "Accords", "Collaborations"});
        content.put("isWordPressContent", false);
        return content;
    }
    
    /**
     * Get all home page content sections
     * @return Map containing all sections
     */
    public Map<String, Object> getAllHomeContent() {
        Map<String, Object> allContent = new HashMap<>();
        allContent.put("quiSommesNous", getQuiSommesNous());
        allContent.put("nosActivites", getNosActivites());
        allContent.put("nosCentres", getNosCentres());
        allContent.put("nosConventions", getNosConventions());
        return allContent;
    }
    
    /**
     * Check if WordPress content is available
     * @return true if WordPress content is loaded, false otherwise
     */
    public boolean isWordPressContentAvailable() {
        // This will be updated when WordPress integration is implemented
        return false;
    }
} 