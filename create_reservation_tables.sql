-- Script de création des tables pour le système de réservation COSONE
-- À exécuter dans votre base de données PostgreSQL

-- Table des centres
CREATE TABLE IF NOT EXISTS centres (
    id BIGSERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL UNIQUE,
    adresse TEXT NOT NULL,
    ville VARCHAR(255) NOT NULL,
    telephone VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    description TEXT,
    actif BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des types de logement
CREATE TABLE IF NOT EXISTS types_logement (
    id BIGSERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    capacite_max INTEGER NOT NULL,
    prix_par_nuit DECIMAL(10,2) NOT NULL,
    actif BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des réservations
CREATE TABLE IF NOT EXISTS reservations (
    id BIGSERIAL PRIMARY KEY,
    matricule VARCHAR(100) NOT NULL,
    cin VARCHAR(100) NOT NULL,
    telephone VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    date_debut TIMESTAMP NOT NULL,
    date_fin TIMESTAMP NOT NULL,
    centre_id BIGINT NOT NULL REFERENCES centres(id),
    type_logement_id BIGINT NOT NULL REFERENCES types_logement(id),
    nombre_personnes INTEGER NOT NULL,
    statut VARCHAR(50) NOT NULL DEFAULT 'EN_ATTENTE_PAIEMENT',
    date_reservation TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_limite_paiement TIMESTAMP NOT NULL,
    date_paiement TIMESTAMP,
    methode_paiement VARCHAR(50),
    reference_paiement VARCHAR(255),
    commentaires TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des personnes d'accompagnement
CREATE TABLE IF NOT EXISTS personnes_accompagnement (
    id BIGSERIAL PRIMARY KEY,
    reservation_id BIGINT NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    cin VARCHAR(100) NOT NULL,
    lien_parente VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_reservations_matricule ON reservations(matricule);
CREATE INDEX IF NOT EXISTS idx_reservations_cin ON reservations(cin);
CREATE INDEX IF NOT EXISTS idx_reservations_statut ON reservations(statut);
CREATE INDEX IF NOT EXISTS idx_reservations_centre ON reservations(centre_id);
CREATE INDEX IF NOT EXISTS idx_reservations_dates ON reservations(date_debut, date_fin);
CREATE INDEX IF NOT EXISTS idx_reservations_limite_paiement ON reservations(date_limite_paiement);
CREATE INDEX IF NOT EXISTS idx_centres_actif ON centres(actif);
CREATE INDEX IF NOT EXISTS idx_types_logement_actif ON types_logement(actif);

-- Contraintes de validation
ALTER TABLE reservations ADD CONSTRAINT chk_dates_validite 
    CHECK (date_fin > date_debut);

ALTER TABLE reservations ADD CONSTRAINT chk_nombre_personnes 
    CHECK (nombre_personnes > 0);

ALTER TABLE types_logement ADD CONSTRAINT chk_prix_positif 
    CHECK (prix_par_nuit > 0);

ALTER TABLE types_logement ADD CONSTRAINT chk_capacite_positive 
    CHECK (capacite_max > 0);

-- Données d'exemple pour les centres
INSERT INTO centres (nom, adresse, ville, telephone, email, description) VALUES
('Centre de Vacances Al Hoceima', 'Route de la Plage, Al Hoceima', 'Al Hoceima', '+212 539 123 456', 'alhoceima@cosone.ma', 'Centre de vacances au bord de la mer avec vue panoramique'),
('Centre de Vacances Ifrane', 'Route des Cèdres, Ifrane', 'Ifrane', '+212 535 789 012', 'ifrane@cosone.ma', 'Centre de montagne dans la forêt de cèdres'),
('Centre de Vacances Agadir', 'Boulevard de la Corniche, Agadir', 'Agadir', '+212 528 345 678', 'agadir@cosone.ma', 'Centre moderne avec accès direct à la plage'),
('Centre de Vacances Marrakech', 'Route de l''Ourika, Marrakech', 'Marrakech', '+212 524 901 234', 'marrakech@cosone.ma', 'Centre traditionnel au pied de l''Atlas');

-- Données d'exemple pour les types de logement
INSERT INTO types_logement (nom, description, capacite_max, prix_par_nuit) VALUES
('Studio 2 personnes', 'Studio moderne avec kitchenette et salle de bain privée', 2, 300.00),
('Appartement 4 personnes', 'Appartement spacieux avec 2 chambres et salon', 4, 450.00),
('Villa 6 personnes', 'Villa privée avec jardin et terrasse', 6, 650.00),
('Chalet 8 personnes', 'Chalet de montagne avec cheminée et vue panoramique', 8, 800.00),
('Suite familiale', 'Suite luxueuse avec services premium', 6, 950.00);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour mettre à jour automatiquement updated_at
CREATE TRIGGER update_centres_updated_at BEFORE UPDATE ON centres
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_types_logement_updated_at BEFORE UPDATE ON types_logement
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reservations_updated_at BEFORE UPDATE ON reservations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Vue pour les réservations avec informations complètes
CREATE OR REPLACE VIEW reservations_completes AS
SELECT 
    r.id,
    r.matricule,
    r.cin,
    r.telephone,
    r.email,
    r.date_debut,
    r.date_fin,
    c.nom as centre_nom,
    c.ville as centre_ville,
    tl.nom as type_logement_nom,
    tl.prix_par_nuit,
    r.nombre_personnes,
    r.statut,
    r.date_reservation,
    r.date_limite_paiement,
    r.date_paiement,
    r.methode_paiement,
    r.reference_paiement,
    r.commentaires,
    EXTRACT(DAY FROM (r.date_fin - r.date_debut)) as nombre_nuits,
    (EXTRACT(DAY FROM (r.date_fin - r.date_debut)) * tl.prix_par_nuit) as prix_total
FROM reservations r
JOIN centres c ON r.centre_id = c.id
JOIN types_logement tl ON r.type_logement_id = tl.id;

-- Fonction pour vérifier la disponibilité d'un logement
CREATE OR REPLACE FUNCTION verifier_disponibilite(
    p_centre_id BIGINT,
    p_type_logement_id BIGINT,
    p_date_debut TIMESTAMP,
    p_date_fin TIMESTAMP
) RETURNS BOOLEAN AS $$
DECLARE
    v_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_count
    FROM reservations r
    WHERE r.centre_id = p_centre_id
      AND r.type_logement_id = p_type_logement_id
      AND r.statut IN ('PAYEE', 'CONFIRMEE')
      AND ((r.date_debut <= p_date_fin AND r.date_fin >= p_date_debut));
    
    RETURN v_count = 0;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour calculer le prix total d'une réservation
CREATE OR REPLACE FUNCTION calculer_prix_reservation(
    p_type_logement_id BIGINT,
    p_date_debut TIMESTAMP,
    p_date_fin TIMESTAMP
) RETURNS DECIMAL(10,2) AS $$
DECLARE
    v_prix_par_nuit DECIMAL(10,2);
    v_nombre_nuits INTEGER;
    v_prix_total DECIMAL(10,2);
BEGIN
    SELECT prix_par_nuit INTO v_prix_par_nuit
    FROM types_logement
    WHERE id = p_type_logement_id;
    
    v_nombre_nuits := EXTRACT(DAY FROM (p_date_fin - p_date_debut));
    v_prix_total := v_prix_par_nuit * v_nombre_nuits;
    
    RETURN v_prix_total;
END;
$$ LANGUAGE plpgsql;

-- Commentaires sur les tables
COMMENT ON TABLE centres IS 'Centres de vacances COSONE disponibles pour les réservations';
COMMENT ON TABLE types_logement IS 'Types de logements disponibles dans chaque centre';
COMMENT ON TABLE reservations IS 'Réservations des utilisateurs pour les séjours';
COMMENT ON TABLE personnes_accompagnement IS 'Personnes accompagnant le demandeur principal';

COMMENT ON COLUMN reservations.statut IS 'Statut de la réservation: EN_ATTENTE_PAIEMENT, PAYEE, CONFIRMEE, ANNULEE, EXPIREE';
COMMENT ON COLUMN reservations.date_limite_paiement IS 'Date limite pour effectuer le paiement (24h après création)';
COMMENT ON COLUMN reservations.methode_paiement IS 'Méthode de paiement utilisée: CARTE_BANCAIRE, VIREMENT, ESPECES, CHEQUE, MOBILE_MONEY, AUTRE'; 