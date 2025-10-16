package com.cosone.cosone.repository;

import com.cosone.cosone.model.Centre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CentreRepository extends JpaRepository<Centre, Long> {
    
    // Méthodes de recherche personnalisées
    List<Centre> findByActifTrueOrderByNom();
}