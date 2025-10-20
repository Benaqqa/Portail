-- Migration to make password column nullable
-- This allows users to be created without passwords (e.g., for external authentication)

ALTER TABLE users MODIFY COLUMN password VARCHAR(255) NULL; 