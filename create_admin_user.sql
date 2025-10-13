-- Script pour créer un utilisateur ADMIN
-- Mot de passe : admin123
-- Hash BCrypt : $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy

-- Supprimer l'utilisateur admin s'il existe déjà
DELETE FROM users WHERE username = 'admin';

-- Créer un nouvel utilisateur ADMIN
INSERT INTO users (username, password, num_cin, matricule, phone_number, role)
VALUES (
    'admin',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'ADMIN001',
    'ADM001',
    '+212600000000',
    'ADMIN'
);

-- Vérifier la création
SELECT id, username, matricule, num_cin, phone_number, role 
FROM users 
WHERE username = 'admin';

