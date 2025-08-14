package com.cosone.cosone.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "reservations")
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String matricule;

    @Column(nullable = false)
    private String cin;

    @Column(nullable = false)
    private String telephone;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private LocalDateTime dateDebut;

    @Column(nullable = false)
    private LocalDateTime dateFin;

    @ManyToOne
    @JoinColumn(name = "centre_id", nullable = false)
    private Centre centre;

    @ManyToOne
    @JoinColumn(name = "type_logement_id", nullable = false)
    private TypeLogement typeLogement;

    @Column(nullable = false)
    private Integer nombrePersonnes;

    @OneToMany(mappedBy = "reservation", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<PersonneAccompagnement> personnesAccompagnement;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutReservation statut = StatutReservation.EN_ATTENTE_PAIEMENT;

    @Column(nullable = false)
    private LocalDateTime dateReservation;

    @Column(nullable = false)
    private LocalDateTime dateLimitePaiement;

    @Column
    private LocalDateTime datePaiement;

    @Enumerated(EnumType.STRING)
    @Column
    private MethodePaiement methodePaiement;

    @Column
    private String referencePaiement;

    @Column
    private String commentaires;

    // Constructeurs
    public Reservation() {
        this.dateReservation = LocalDateTime.now();
        this.dateLimitePaiement = LocalDateTime.now().plusHours(24);
    }

    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getMatricule() { return matricule; }
    public void setMatricule(String matricule) { this.matricule = matricule; }

    public String getCin() { return cin; }
    public void setCin(String cin) { this.cin = cin; }

    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public LocalDateTime getDateDebut() { return dateDebut; }
    public void setDateDebut(LocalDateTime dateDebut) { this.dateDebut = dateDebut; }

    public LocalDateTime getDateFin() { return dateFin; }
    public void setDateFin(LocalDateTime dateFin) { this.dateFin = dateFin; }

    public Centre getCentre() { return centre; }
    public void setCentre(Centre centre) { this.centre = centre; }

    public TypeLogement getTypeLogement() { return typeLogement; }
    public void setTypeLogement(TypeLogement typeLogement) { this.typeLogement = typeLogement; }

    public Integer getNombrePersonnes() { return nombrePersonnes; }
    public void setNombrePersonnes(Integer nombrePersonnes) { this.nombrePersonnes = nombrePersonnes; }

    public List<PersonneAccompagnement> getPersonnesAccompagnement() { return personnesAccompagnement; }
    public void setPersonnesAccompagnement(List<PersonneAccompagnement> personnesAccompagnement) { 
        this.personnesAccompagnement = personnesAccompagnement; 
    }

    public StatutReservation getStatut() { return statut; }
    public void setStatut(StatutReservation statut) { this.statut = statut; }

    public LocalDateTime getDateReservation() { return dateReservation; }
    public void setDateReservation(LocalDateTime dateReservation) { this.dateReservation = dateReservation; }

    public LocalDateTime getDateLimitePaiement() { return dateLimitePaiement; }
    public void setDateLimitePaiement(LocalDateTime dateLimitePaiement) { this.dateLimitePaiement = dateLimitePaiement; }

    public LocalDateTime getDatePaiement() { return datePaiement; }
    public void setDatePaiement(LocalDateTime datePaiement) { this.datePaiement = datePaiement; }

    public MethodePaiement getMethodePaiement() { return methodePaiement; }
    public void setMethodePaiement(MethodePaiement methodePaiement) { this.methodePaiement = methodePaiement; }

    public String getReferencePaiement() { return referencePaiement; }
    public void setReferencePaiement(String referencePaiement) { this.referencePaiement = referencePaiement; }

    public String getCommentaires() { return commentaires; }
    public void setCommentaires(String commentaires) { this.commentaires = commentaires; }

    // Méthodes utilitaires
    public boolean isEnRetardPaiement() {
        return LocalDateTime.now().isAfter(dateLimitePaiement) && statut == StatutReservation.EN_ATTENTE_PAIEMENT;
    }

    public boolean peutEtreReservee() {
        return dateDebut.isAfter(LocalDateTime.now().plusDays(10));
    }

    public boolean estWeekend() {
        int dayOfWeek = dateDebut.getDayOfWeek().getValue();
        return dayOfWeek == 6 || dayOfWeek == 7;
    }
} 