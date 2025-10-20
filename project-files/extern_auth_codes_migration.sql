-- Migration script to add new columns to extern_auth_codes table
-- Run this script on your PostgreSQL database

-- Add new columns to extern_auth_codes table (nullable first)
ALTER TABLE extern_auth_codes 
ADD COLUMN IF NOT EXISTS matricule VARCHAR(255),
ADD COLUMN IF NOT EXISTS num_cin VARCHAR(255),
ADD COLUMN IF NOT EXISTS phone_number VARCHAR(255),
ADD COLUMN IF NOT EXISTS expiration_hours INTEGER,
ADD COLUMN IF NOT EXISTS one_time_only BOOLEAN,
ADD COLUMN IF NOT EXISTS expiration_date TIMESTAMP;

-- Update existing records with default values
UPDATE extern_auth_codes 
SET expiration_hours = 24
WHERE expiration_hours IS NULL;

UPDATE extern_auth_codes 
SET one_time_only = true
WHERE one_time_only IS NULL;

-- Update existing records to set expiration_date based on created_at + expiration_hours
UPDATE extern_auth_codes 
SET expiration_date = created_at + INTERVAL '24 hours'
WHERE expiration_date IS NULL;

-- Now make the columns NOT NULL
ALTER TABLE extern_auth_codes 
ALTER COLUMN expiration_hours SET NOT NULL,
ALTER COLUMN one_time_only SET NOT NULL;

-- Create index on code column for better performance
CREATE INDEX IF NOT EXISTS idx_extern_auth_codes_code ON extern_auth_codes(code);

-- Create index on expiration_date for cleanup queries
CREATE INDEX IF NOT EXISTS idx_extern_auth_codes_expiration ON extern_auth_codes(expiration_date);

-- Create index on used column for filtering
CREATE INDEX IF NOT EXISTS idx_extern_auth_codes_used ON extern_auth_codes(used);

-- Add comments to document the new columns
COMMENT ON COLUMN extern_auth_codes.matricule IS 'Matricule de l''utilisateur externe';
COMMENT ON COLUMN extern_auth_codes.num_cin IS 'Numéro CIN de l''utilisateur externe';
COMMENT ON COLUMN extern_auth_codes.phone_number IS 'Numéro de téléphone de l''utilisateur externe';
COMMENT ON COLUMN extern_auth_codes.expiration_hours IS 'Nombre d''heures avant expiration du code';
COMMENT ON COLUMN extern_auth_codes.one_time_only IS 'Indique si le code ne peut être utilisé qu''une seule fois';
COMMENT ON COLUMN extern_auth_codes.expiration_date IS 'Date et heure d''expiration du code';

-- Verify the migration
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'extern_auth_codes' 
ORDER BY ordinal_position;
