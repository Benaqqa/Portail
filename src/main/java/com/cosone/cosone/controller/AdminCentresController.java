package com.cosone.cosone.controller;

import com.cosone.cosone.service.CentresDataLoader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Contrôleur pour la gestion administrative des centres
 * Permet de charger manuellement les données des centres depuis CSV
 */
@RestController
@RequestMapping("/api/admin/centres")
public class AdminCentresController {

    @Autowired(required = false)
    private CentresDataLoader centresDataLoader;

    /**
     * Endpoint pour charger manuellement les centres depuis les données CSV
     * Accessible uniquement aux administrateurs
     * 
     * @return Message de confirmation ou d'erreur
     */
    @PostMapping("/load-from-csv")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> loadCentresFromCsv() {
        Map<String, Object> response = new HashMap<>();
        
        if (centresDataLoader == null) {
            response.put("success", false);
            response.put("message", "Le service CentresDataLoader n'est pas activé. Veuillez activer @Component dans CentresDataLoader.java");
            return ResponseEntity.badRequest().body(response);
        }
        
        try {
            // Exécuter le chargement
            centresDataLoader.run();
            
            response.put("success", true);
            response.put("message", "Les centres ont été chargés avec succès depuis le fichier CSV");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Erreur lors du chargement des centres : " + e.getMessage());
            response.put("error", e.getClass().getSimpleName());
            
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * Endpoint pour obtenir des statistiques sur les centres
     * 
     * @return Statistiques des centres
     */
    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getCentresStats() {
        // TODO: Implémenter les statistiques
        Map<String, Object> stats = new HashMap<>();
        stats.put("message", "Endpoint de statistiques - À implémenter");
        
        return ResponseEntity.ok(stats);
    }
}

