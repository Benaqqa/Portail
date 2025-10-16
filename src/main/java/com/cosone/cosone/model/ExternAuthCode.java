package com.cosone.cosone.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "extern_auth_codes")
public class ExternAuthCode {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(nullable = false)
    private boolean used = false;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(nullable = false)
    private String prenom;

    @Column(nullable = false)
    private String nom;

    @Column
    private String matricule;

    @Column
    private String numCin;

    @Column
    private String phoneNumber;

    @Column(nullable = false)
    private int expirationHours = 24;

    @Column(nullable = false)
    private boolean oneTimeOnly = true;

    @Column
    private LocalDateTime expirationDate;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public boolean isUsed() { return used; }
    public void setUsed(boolean used) { this.used = used; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public String getPrenom() { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public String getMatricule() { return matricule; }
    public void setMatricule(String matricule) { this.matricule = matricule; }
    public String getNumCin() { return numCin; }
    public void setNumCin(String numCin) { this.numCin = numCin; }
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    public int getExpirationHours() { return expirationHours; }
    public void setExpirationHours(int expirationHours) { this.expirationHours = expirationHours; }
    public boolean isOneTimeOnly() { return oneTimeOnly; }
    public void setOneTimeOnly(boolean oneTimeOnly) { this.oneTimeOnly = oneTimeOnly; }
    public LocalDateTime getExpirationDate() { return expirationDate; }
    public void setExpirationDate(LocalDateTime expirationDate) { this.expirationDate = expirationDate; }

    @PrePersist
    protected void onCreate() {
        if (expirationDate == null) {
            expirationDate = createdAt.plusHours(expirationHours);
        }
    }
} 