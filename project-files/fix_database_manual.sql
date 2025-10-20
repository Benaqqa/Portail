-- Manual fix for database schema issues
-- Run these commands directly in your PostgreSQL database

-- Connect to your database first:
-- \c cosone_db

-- Step 1: Fix extern_auth_codes table
-- Add new columns (nullable first)
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

-- Step 2: Fix users table
-- Add new columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS prenom VARCHAR(255),
ADD COLUMN IF NOT EXISTS nom VARCHAR(255);

-- Step 3: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_extern_auth_codes_code ON extern_auth_codes(code);
CREATE INDEX IF NOT EXISTS idx_extern_auth_codes_expiration ON extern_auth_codes(expiration_date);
CREATE INDEX IF NOT EXISTS idx_extern_auth_codes_used ON extern_auth_codes(used);

-- Step 4: Verify the changes
SELECT 'extern_auth_codes columns:' as table_name, column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'extern_auth_codes' 
ORDER BY ordinal_position;

SELECT 'users table columns:' as table_name, column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;
