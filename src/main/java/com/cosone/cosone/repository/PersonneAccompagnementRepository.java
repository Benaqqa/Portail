package com.cosone.cosone.repository;

import com.cosone.cosone.model.PersonneAccompagnement;
import com.cosone.cosone.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PersonneAccompagnementRepository extends JpaRepository<PersonneAccompagnement, Long> {
    
    /**
     * Récupérer toutes les personnes accompagnantes d'une réservation
     */
    List<PersonneAccompagnement> findByReservationOrderById(Reservation reservation);
    
    /**
     * Récupérer toutes les personnes accompagnantes d'une réservation par son ID
     */
    List<PersonneAccompagnement> findByReservationIdOrderById(Long reservationId);
    
    /**
     * Supprimer toutes les personnes accompagnantes d'une réservation
     */
    void deleteByReservation(Reservation reservation);
}
