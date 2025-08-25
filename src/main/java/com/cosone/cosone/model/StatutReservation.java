package com.cosone.cosone.model;

public enum StatutReservation {
    EN_ATTENTE_PAIEMENT("En attente de paiement"),
    PAYEE("Payée"),
    CONFIRMEE("Confirmée"),
    ANNULEE("Annulée"),
    EXPIREE("Expirée");

    private final String libelle;

    StatutReservation(String libelle) {
        this.libelle = libelle;
    }

    public String getLibelle() {
        return libelle;
    }

    @Override
    public String toString() {
        return libelle;
    }
} 