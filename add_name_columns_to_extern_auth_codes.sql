-- Add prenom and nom columns to extern_auth_codes table
-- This migration adds the new name columns for better security verification

ALTER TABLE extern_auth_codes ADD COLUMN prenom VARCHAR(255) NOT NULL DEFAULT 'Unknown';
ALTER TABLE extern_auth_codes ADD COLUMN nom VARCHAR(255) NOT NULL DEFAULT 'Unknown';

-- Update existing records with placeholder values (optional)
-- UPDATE extern_auth_codes SET prenom = 'Unknown', nom = 'Unknown' WHERE prenom IS NULL OR nom IS NULL;

-- Remove the default constraints after adding the columns
ALTER TABLE extern_auth_codes ALTER COLUMN prenom DROP DEFAULT;
ALTER TABLE extern_auth_codes ALTER COLUMN nom DROP DEFAULT; 