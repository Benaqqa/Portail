package com.cosone.cosone.controller.api;

import com.cosone.cosone.model.TypeLogement;
import com.cosone.cosone.repository.TypeLogementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/types-logement")
@CrossOrigin(origins = "http://localhost:3000")
public class TypeLogementRestController {

    @Autowired
    private TypeLogementRepository typeLogementRepository;

    /**
     * Récupérer tous les types de logement actifs
     */
    @GetMapping
    public List<TypeLogement> getAllTypesLogement() {
        return typeLogementRepository.findByActifTrueOrderByNom();
    }

    /**
     * Récupérer les types de logement pour un centre spécifique
     * Note: Pour l'instant, les types de logement sont globaux (non liés à un centre)
     * On retourne tous les types actifs
     */
    @GetMapping("/centre/{centreId}")
    public List<TypeLogement> getTypesLogementByCentre(@PathVariable Long centreId) {
        // Pour l'instant, retourner tous les types actifs
        // TODO: Ajouter une relation Centre-TypeLogement si nécessaire
        return typeLogementRepository.findByActifTrueOrderByNom();
    }

    /**
     * Récupérer un type de logement par son ID
     */
    @GetMapping("/{id}")
    public TypeLogement getTypeLogementById(@PathVariable Long id) {
        return typeLogementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Type de logement introuvable avec l'ID: " + id));
    }
}

