-- Add matricule column to users table
ALTER TABLE users ADD COLUMN matricule VARCHAR(255);

-- Add unique constraint for matricule column
ALTER TABLE users ADD CONSTRAINT uk_users_matricule UNIQUE (matricule);

-- Note: You may need to update existing users with actual matricule values
-- UPDATE users SET matricule = 'MAT_' || id WHERE matricule IS NULL; 