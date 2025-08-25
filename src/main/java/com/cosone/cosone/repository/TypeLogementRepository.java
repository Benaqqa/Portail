package com.cosone.cosone.repository;

import com.cosone.cosone.model.TypeLogement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TypeLogementRepository extends JpaRepository<TypeLogement, Long> {
    
    // Trouver tous les types de logement actifs
    List<TypeLogement> findByActifTrueOrderByNom();
    
    // Trouver un type de logement par nom
    Optional<TypeLogement> findByNom(String nom);
    
    // Trouver les types de logement par capacité minimale
    List<TypeLogement> findByCapaciteMaxGreaterThanEqualAndActifTrueOrderByCapaciteMaxAsc(Integer capaciteMin);
} 