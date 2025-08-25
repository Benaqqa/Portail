package com.cosone.cosone.model;

import jakarta.persistence.*;

@Entity
@Table(name = "personnes_accompagnement")
public class PersonneAccompagnement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "reservation_id", nullable = false)
    private Reservation reservation;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String prenom;

    @Column(nullable = false)
    private String cin;

    @Column(nullable = false)
    private String lienParente;

    // Constructeurs
    public PersonneAccompagnement() {}

    public PersonneAccompagnement(String nom, String prenom, String cin, String lienParente) {
        this.nom = nom;
        this.prenom = prenom;
        this.cin = cin;
        this.lienParente = lienParente;
    }

    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Reservation getReservation() { return reservation; }
    public void setReservation(Reservation reservation) { this.reservation = reservation; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getPrenom() { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }

    public String getCin() { return cin; }
    public void setCin(String cin) { this.cin = cin; }

    public String getLienParente() { return lienParente; }
    public void setLienParente(String lienParente) { this.lienParente = lienParente; }

    @Override
    public String toString() {
        return prenom + " " + nom + " (" + lienParente + ")";
    }
} 