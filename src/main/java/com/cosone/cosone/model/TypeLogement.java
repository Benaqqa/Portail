package com.cosone.cosone.model;

import jakarta.persistence.*;

@Entity
@Table(name = "types_logement")
public class TypeLogement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nom;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private Integer capaciteMax;

    @Column(nullable = false)
    private Double prixParNuit;

    @Column(nullable = false)
    private Boolean actif = true;

    // Constructeurs
    public TypeLogement() {}

    public TypeLogement(String nom, String description, Integer capaciteMax, Double prixParNuit) {
        this.nom = nom;
        this.description = description;
        this.capaciteMax = capaciteMax;
        this.prixParNuit = prixParNuit;
    }

    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getCapaciteMax() { return capaciteMax; }
    public void setCapaciteMax(Integer capaciteMax) { this.capaciteMax = capaciteMax; }

    public Double getPrixParNuit() { return prixParNuit; }
    public void setPrixParNuit(Double prixParNuit) { this.prixParNuit = prixParNuit; }

    public Boolean getActif() { return actif; }
    public void setActif(Boolean actif) { this.actif = actif; }

    @Override
    public String toString() {
        return nom + " (Max: " + capaciteMax + " personnes)";
    }
} 