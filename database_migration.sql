-- Add missing columns to users table
ALTER TABLE users ADD COLUMN num_cin VARCHAR(255);
ALTER TABLE users ADD COLUMN phone_number VARCHAR(255);

-- Add unique constraints after adding columns
ALTER TABLE users ADD CONSTRAINT uk_users_num_cin UNIQUE (num_cin);
ALTER TABLE users ADD CONSTRAINT uk_users_phone_number UNIQUE (phone_number);

-- Note: You may need to update existing users with actual values
-- UPDATE users SET num_cin = 'CIN_' || id WHERE num_cin IS NULL;
-- UPDATE users SET phone_number = '+1234567890' WHERE phone_number IS NULL;

-- Allow password column to be nullable
ALTER TABLE users ALTER COLUMN password DROP NOT NULL; 