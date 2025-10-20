-- Migration script to add prenom and nom columns to users table
-- Run this script on your PostgreSQL database

-- Add new columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS prenom VARCHAR(255),
ADD COLUMN IF NOT EXISTS nom VARCHAR(255);

-- Add comments to document the new columns
COMMENT ON COLUMN users.prenom IS 'Prénom de l''utilisateur';
COMMENT ON COLUMN users.nom IS 'Nom de famille de l''utilisateur';

-- Verify the migration
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;
