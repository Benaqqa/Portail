package com.cosone.cosone.repository;

import com.cosone.cosone.model.Reservation;
import com.cosone.cosone.model.StatutReservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    
    // Trouver les réservations par matricule
    List<Reservation> findByMatriculeOrderByDateReservationDesc(String matricule);
    
    // Trouver les réservations par CIN
    List<Reservation> findByCinOrderByDateReservationDesc(String cin);
    
    // Trouver les réservations par statut
    List<Reservation> findByStatutOrderByDateReservationDesc(StatutReservation statut);
    
    // Trouver les réservations en retard de paiement
    @Query("SELECT r FROM Reservation r WHERE r.statut = :statut AND r.dateLimitePaiement < :now")
    List<Reservation> findReservationsEnRetardPaiement(@Param("statut") StatutReservation statut, @Param("now") LocalDateTime now);
    
    // Trouver les réservations pour un centre spécifique
    List<Reservation> findByCentreIdOrderByDateDebutAsc(Long centreId);
    
    // Trouver les réservations pour une période donnée
    @Query("SELECT r FROM Reservation r WHERE r.dateDebut >= :debut AND r.dateFin <= :fin")
    List<Reservation> findReservationsPourPeriode(@Param("debut") LocalDateTime debut, @Param("fin") LocalDateTime fin);
    
    // Trouver les réservations confirmées pour un centre et une période
    @Query("SELECT r FROM Reservation r WHERE r.centre.id = :centreId AND r.statut = :statut AND r.dateDebut >= :debut AND r.dateFin <= :fin")
    List<Reservation> findReservationsConfirmeesPourCentreEtPeriode(
        @Param("centreId") Long centreId, 
        @Param("statut") StatutReservation statut,
        @Param("debut") LocalDateTime debut, 
        @Param("fin") LocalDateTime fin
    );
    
    // Vérifier la disponibilité d'un logement pour une période
    @Query("SELECT COUNT(r) FROM Reservation r WHERE r.centre.id = :centreId AND r.typeLogement.id = :typeLogementId AND r.statut IN (:statuts) AND ((r.dateDebut <= :fin AND r.dateFin >= :debut))")
    Long countReservationsConflitantes(
        @Param("centreId") Long centreId,
        @Param("typeLogementId") Long typeLogementId,
        @Param("statuts") List<StatutReservation> statuts,
        @Param("debut") LocalDateTime debut,
        @Param("fin") LocalDateTime fin
    );
} 