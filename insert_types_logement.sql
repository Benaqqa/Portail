-- Script d'insertion des types de logement pour COSONE
-- À exécuter dans votre base de données PostgreSQL
-- Types de logement pour les centres de vacances ONEE

-- Vider la table types_logement avant l'insertion (optionnel)
-- TRUNCATE TABLE types_logement CASCADE;

-- Insertion des 3 types de logement principaux
INSERT INTO types_logement (nom, description, capacite_max, prix_par_nuit, actif) VALUES
(
    'Studio 2 personnes',
    'Studio confortable avec kitchenette équipée, salle de bain privée et balcon. Idéal pour les couples ou voyageurs individuels. Équipements : climatisation, wifi, TV, réfrigérateur, micro-ondes.',
    2,
    200.00,
    true
),
(
    'Appartement Familial 4 personnes',
    'Appartement spacieux avec 2 chambres, salon séparé, cuisine complète et salle de bain. Parfait pour les familles. Équipements : climatisation, wifi, TV, cuisine complète, balcon avec vue.',
    4,
    350.00,
    true
),
(
    'Villa 6 personnes',
    'Villa indépendante avec 3 chambres, grand salon, cuisine équipée, 2 salles de bain, jardin privé et terrasse. Idéale pour les grandes familles ou groupes. Équipements : climatisation, wifi, TV, cuisine complète, espace extérieur, parking privé.',
    6,
    500.00,
    true
)
ON CONFLICT (nom) DO UPDATE SET
    description = EXCLUDED.description,
    capacite_max = EXCLUDED.capacite_max,
    prix_par_nuit = EXCLUDED.prix_par_nuit,
    actif = EXCLUDED.actif;

-- Vérification du nombre d'insertions
SELECT COUNT(*) as nombre_types_logement FROM types_logement;

-- Afficher les types de logement insérés
SELECT id, nom, capacite_max, prix_par_nuit, actif 
FROM types_logement 
ORDER BY capacite_max;

-- Afficher les détails complets
SELECT 
    id,
    nom,
    description,
    capacite_max as capacite,
    prix_par_nuit as prix_nuit,
    actif
FROM types_logement
ORDER BY prix_par_nuit;

