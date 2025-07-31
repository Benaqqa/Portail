-- Check if phone_verification_codes table exists and has correct structure
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'phone_verification_codes';

-- If table exists, show its structure
\d phone_verification_codes;

-- Check if there are any existing codes
SELECT * FROM phone_verification_codes LIMIT 5;

-- Check users table structure
\d users;

-- Check if test user exists
SELECT id, username, num_cin, phone_number, password FROM users WHERE num_cin = 'A22222'; 