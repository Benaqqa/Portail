# 👤 Guide - Création d'un utilisateur ADMIN

## 🎯 Objectif

Créer un utilisateur avec le rôle ADMIN pour accéder aux pages d'administration.

---

## 📋 Méthodes disponibles

### Méthode 1 : Modification directe en base de données (Recommandée)

#### Étape 1 : Créer un utilisateur normal
1. Accéder à `/register` ou `/login`
2. S'inscrire avec les informations requises :
   - Matricule
   - Numéro CIN
   - Numéro de téléphone
   - Mot de passe

#### Étape 2 : Modifier le rôle en base de données
```sql
-- Vérifier les utilisateurs existants
SELECT id, username, matricule, role FROM users;

-- Promouvoir un utilisateur en ADMIN
UPDATE users SET role = 'ADMIN' WHERE username = 'votre_username';

-- Ou par matricule
UPDATE users SET role = 'ADMIN' WHERE matricule = 'EMP001';

-- Vérifier la modification
SELECT id, username, matricule, role FROM users WHERE role = 'ADMIN';
```

---

### Méthode 2 : Script SQL d'insertion directe

#### Script pour créer un utilisateur ADMIN
```sql
-- Insérer un utilisateur ADMIN
-- Note : Le mot de passe doit être hashé avec BCrypt
-- Exemple : "admin123" hashé = "$2a$10$..."

INSERT INTO users (username, password, num_cin, matricule, phone_number, role)
VALUES (
    'admin',                                                    -- username
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',  -- BCrypt hash de "admin123"
    'ADMIN001',                                                 -- num_cin
    'ADM001',                                                   -- matricule
    '+212600000000',                                            -- phone_number
    'ADMIN'                                                     -- role
);
```

#### Mots de passe BCrypt pré-générés
| Mot de passe | Hash BCrypt |
|--------------|-------------|
| `admin123` | `$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy` |
| `password` | `$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG` |
| `test1234` | `$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi` |

---

### Méthode 3 : Via H2 Console (si activée)

#### Étape 1 : Activer H2 Console
Dans `application.properties` :
```properties
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console
```

#### Étape 2 : Accéder à H2 Console
1. Démarrer l'application
2. Accéder à `http://localhost:8080/h2-console`
3. Connexion :
   - **JDBC URL** : `jdbc:h2:mem:testdb` (ou votre URL)
   - **User Name** : `sa`
   - **Password** : (laisser vide ou selon votre config)

#### Étape 3 : Exécuter les requêtes SQL
Utiliser les scripts de la Méthode 2

---

## 🔐 Génération de hash BCrypt

### Option 1 : Utiliser un outil en ligne
- [BCrypt Generator](https://bcrypt-generator.com/)
- Entrer le mot de passe souhaité
- Copier le hash généré
- Rounds recommandés : 10

### Option 2 : Utiliser Java
```java
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordHashGenerator {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String password = "admin123";
        String hashedPassword = encoder.encode(password);
        System.out.println("Hash: " + hashedPassword);
    }
}
```

### Option 3 : Utiliser la console Spring Boot
```java
// Dans n'importe quelle classe avec accès au contexte Spring
@Autowired
private BCryptPasswordEncoder passwordEncoder;

public void generateHash() {
    String hash = passwordEncoder.encode("admin123");
    System.out.println("Hash: " + hash);
}
```

---

## 🧪 Vérification de l'utilisateur ADMIN

### 1. Vérifier en base de données
```sql
SELECT * FROM users WHERE role = 'ADMIN';
```

### 2. Tester la connexion
1. Accéder à `/login`
2. Se connecter avec les identifiants ADMIN
3. Vérifier la redirection vers `/home`
4. Vérifier l'affichage du badge ADMIN

### 3. Tester l'accès aux pages admin
1. Accéder à `/admin/generate-code`
2. Vérifier que la page s'affiche correctement
3. Tester la génération d'un code externe

---

## 📝 Exemple complet

### Script SQL complet pour créer un ADMIN
```sql
-- Supprimer l'utilisateur s'il existe déjà
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
```

### Identifiants de connexion
- **Username** : `admin`
- **Password** : `admin123`
- **Matricule** : `ADM001`
- **CIN** : `ADMIN001`
- **Téléphone** : `+212600000000`
- **Rôle** : `ADMIN`

---

## 🚨 Sécurité

### ⚠️ Recommandations importantes

1. **Changer le mot de passe par défaut**
   - Ne jamais utiliser `admin123` en production
   - Utiliser un mot de passe fort et unique

2. **Protéger les identifiants**
   - Ne jamais commiter les identifiants dans le code
   - Utiliser des variables d'environnement

3. **Limiter le nombre d'admins**
   - Créer uniquement le nombre nécessaire d'administrateurs
   - Auditer régulièrement les comptes admin

4. **Désactiver H2 Console en production**
   ```properties
   spring.h2.console.enabled=false
   ```

5. **Utiliser une vraie base de données en production**
   - PostgreSQL, MySQL, etc.
   - Pas H2 en mémoire

---

## 🔄 Promouvoir un utilisateur existant

### Script SQL
```sql
-- Lister tous les utilisateurs
SELECT id, username, matricule, role FROM users;

-- Promouvoir un utilisateur spécifique
UPDATE users SET role = 'ADMIN' WHERE id = 1;

-- Ou par username
UPDATE users SET role = 'ADMIN' WHERE username = 'john.doe';

-- Vérifier
SELECT id, username, matricule, role FROM users WHERE id = 1;
```

### Via l'application (à implémenter)
Créer un endpoint admin pour promouvoir des utilisateurs :
```java
@PreAuthorize("hasRole('ADMIN')")
@PostMapping("/admin/users/promote")
public String promoteUser(@RequestParam Long userId, Model model) {
    var userOpt = userRepository.findById(userId);
    if (userOpt.isEmpty()) {
        model.addAttribute("error", "Utilisateur introuvable");
        return "admin-users";
    }
    User user = userOpt.get();
    user.setRole("ADMIN");
    userRepository.save(user);
    model.addAttribute("message", "Utilisateur promu en ADMIN");
    model.addAttribute("users", userRepository.findAll());
    return "admin-users";
}
```

---

## 📊 Checklist de création d'ADMIN

- [ ] Choisir la méthode de création
- [ ] Préparer les informations nécessaires
- [ ] Générer le hash BCrypt du mot de passe
- [ ] Exécuter le script SQL ou créer via l'interface
- [ ] Vérifier la création en base de données
- [ ] Tester la connexion
- [ ] Vérifier l'affichage du badge ADMIN
- [ ] Tester l'accès aux pages admin
- [ ] Changer le mot de passe par défaut
- [ ] Documenter les identifiants de manière sécurisée

---

## 🆘 Dépannage

### Problème : "Access Denied" après connexion
**Solution** : Vérifier que le rôle est bien `ADMIN` et non `ROLE_ADMIN` en base de données.

### Problème : Mot de passe incorrect
**Solution** : Régénérer le hash BCrypt et mettre à jour en base de données.

### Problème : Utilisateur non trouvé
**Solution** : Vérifier que l'utilisateur existe bien en base de données.

### Problème : Redirection vers /login en boucle
**Solution** : Vérifier la configuration de sécurité et les rôles.

---

**Statut** : 📘 **Guide complet**  
**Utilisation** : Création et gestion des utilisateurs ADMIN  
**Auteur** : Assistant AI  
**Date** : 13 octobre 2025
