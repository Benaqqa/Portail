package com.cosone.cosone.model;

public enum MethodePaiement {
    CARTE_BANCAIRE("Carte bancaire"),
    VIREMENT("Virement bancaire"),
    ESPECES("Espèces"),
    CHEQUE("Chèque"),
    MOBILE_MONEY("Mobile Money"),
    AUTRE("Autre");

    private final String libelle;

    MethodePaiement(String libelle) {
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