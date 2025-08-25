package com.cosone.cosone.repository;

import com.cosone.cosone.model.Centre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CentreRepository extends JpaRepository<Centre, Long> {
    
    // Trouver tous les centres actifs
    List<Centre> findByActifTrueOrderByNom();
    
    // Trouver un centre par nom
    Optional<Centre> findByNom(String nom);
    
    // Trouver les centres par ville
    List<Centre> findByVilleOrderByNom(String ville);
} 