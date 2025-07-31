-- Add role column to users table
-- This migration adds the role column to distinguish between admin and regular users

ALTER TABLE users ADD COLUMN role VARCHAR(50) NOT NULL DEFAULT 'USER';

-- Update existing users to have USER role (optional)
-- UPDATE users SET role = 'USER' WHERE role IS NULL;

-- Remove the default constraint after adding the column
ALTER TABLE users ALTER COLUMN role DROP DEFAULT; 