-- Migration : Ajout de la colonne prix_total à la table reservations
-- Date : 13 octobre 2025
-- Description : Ajoute une colonne pour stocker le prix total calculé de chaque réservation

-- Ajouter la colonne prix_total si elle n'existe pas
ALTER TABLE reservations 
ADD COLUMN IF NOT EXISTS prix_total DOUBLE;

-- Mettre à jour les réservations existantes avec un prix calculé
-- (Si des réservations existent déjà sans prix_total)
UPDATE reservations r
INNER JOIN types_logement tl ON r.type_logement_id = tl.id
SET r.prix_total = DATEDIFF(r.date_fin, r.date_debut) * tl.prix_par_nuit
WHERE r.prix_total IS NULL;

-- Vérifier les résultats
SELECT 
    id,
    matricule,
    date_debut,
    date_fin,
    DATEDIFF(date_fin, date_debut) as nombre_nuits,
    prix_total,
    statut
FROM reservations
ORDER BY date_reservation DESC
LIMIT 10;

