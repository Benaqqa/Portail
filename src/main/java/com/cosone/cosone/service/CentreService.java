package com.cosone.cosone.service;

import com.cosone.cosone.model.Centre;
import com.cosone.cosone.repository.CentreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CentreService {

    @Autowired
    private CentreRepository centreRepository;

    public List<Centre> getAllCentres() {
        return centreRepository.findAll();
    }

    public List<Centre> searchCentres(String query, String region, String centre, 
                                    String activityType, String period, String budget, String rating) {
        
        List<Centre> allCentres = centreRepository.findAll();
        
        return allCentres.stream()
            .filter(centreItem -> {
                // Filtre par mots-clés
                if (query != null && !query.trim().isEmpty()) {
                    String searchQuery = query.toLowerCase().trim();
                    boolean matchesQuery = false;
                    
                    // Recherche flexible dans tous les champs
                    if (centreItem.getNom() != null && centreItem.getNom().toLowerCase().contains(searchQuery)) {
                        matchesQuery = true;
                    } else if (centreItem.getDescription() != null && centreItem.getDescription().toLowerCase().contains(searchQuery)) {
                        matchesQuery = true;
                    } else if (centreItem.getVille() != null && centreItem.getVille().toLowerCase().contains(searchQuery)) {
                        matchesQuery = true;
                    } else if (centreItem.getAdresse() != null && centreItem.getAdresse().toLowerCase().contains(searchQuery)) {
                        matchesQuery = true;
                    }
                    
                    // Recherche par mots partiels (pour "casa" -> "casablanca")
                    if (!matchesQuery) {
                        String[] searchWords = searchQuery.split("\\s+");
                        for (String word : searchWords) {
                            if (centreItem.getNom() != null && centreItem.getNom().toLowerCase().contains(word)) {
                                matchesQuery = true;
                                break;
                            }
                            if (centreItem.getVille() != null && centreItem.getVille().toLowerCase().contains(word)) {
                                matchesQuery = true;
                                break;
                            }
                            if (centreItem.getAdresse() != null && centreItem.getAdresse().toLowerCase().contains(word)) {
                                matchesQuery = true;
                                break;
                            }
                        }
                    }
                    
                    if (!matchesQuery) return false;
                }
                
                // Filtre par région
                if (region != null && !region.trim().isEmpty()) {
                    if (centreItem.getVille() == null) return false;
                    String ville = centreItem.getVille().toLowerCase();
                    boolean matchesRegion = false;
                    
                    switch (region.toLowerCase()) {
                        case "casablanca":
                            matchesRegion = ville.contains("casablanca") || ville.contains("settat");
                            break;
                        case "rabat":
                            matchesRegion = ville.contains("rabat") || ville.contains("salé") || ville.contains("kénitra");
                            break;
                        case "marrakech":
                            matchesRegion = ville.contains("marrakech") || ville.contains("safi");
                            break;
                        case "fes":
                            matchesRegion = ville.contains("fès") || ville.contains("meknès");
                            break;
                        case "tanger":
                            matchesRegion = ville.contains("tanger") || ville.contains("tétouan") || ville.contains("hoceïma");
                            break;
                        case "souss":
                            matchesRegion = ville.contains("agadir") || ville.contains("souss") || ville.contains("massa");
                            break;
                        case "oriental":
                            matchesRegion = ville.contains("oujda") || ville.contains("oriental");
                            break;
                        case "beni":
                            matchesRegion = ville.contains("béni") || ville.contains("mellal") || ville.contains("khénifra");
                            break;
                        case "dakhla":
                            matchesRegion = ville.contains("dakhla") || ville.contains("oued");
                            break;
                        case "draa":
                            matchesRegion = ville.contains("drâa") || ville.contains("tafilalet");
                            break;
                    }
                    if (!matchesRegion) return false;
                }
                
                // Filtre par centre spécifique
                if (centre != null && !centre.trim().isEmpty()) {
                    if (!centreItem.getId().toString().equals(centre)) return false;
                }
                
                // Filtre par type d'activité (pour l'instant, tous les centres sont des centres de vacances)
                if (activityType != null && !activityType.trim().isEmpty()) {
                    if (!"vacances".equals(activityType.toLowerCase())) return false;
                }
                
                // Filtre par évaluation (pas de champ rating dans l'ancienne entité)
                // On ignore ce filtre pour l'instant
                
                return true;
            })
            .collect(Collectors.toList());
    }
}
