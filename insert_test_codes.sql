-- Insert test codes for extern authentication (development purposes)
-- Run this command first:
INSERT INTO extern_auth_codes (code, used, created_at) VALUES 
('DEV001', false, NOW()),
('DEV002', false, NOW()),
('DEV003', false, NOW()),
('TEST123', false, NOW()),
('DEMO456', false, NOW()),
('GUEST789', false, NOW()),
('EXTERN001', false, NOW()),
('EXTERN002', false, NOW()),
('EXTERN003', false, NOW());

-- Then run this command to verify:
-- SELECT * FROM extern_auth_codes; 