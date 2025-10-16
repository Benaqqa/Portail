package com.cosone.cosone.controller.api;

import com.cosone.cosone.model.User;
import com.cosone.cosone.model.ExternAuthCode;
import com.cosone.cosone.repository.UserRepository;
import com.cosone.cosone.repository.ExternAuthCodeRepository;
import com.cosone.cosone.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * REST Controller pour l'authentification (React Frontend)
 */
@RestController
@RequestMapping("/api/auth")
public class AuthRestController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ExternAuthCodeRepository externAuthCodeRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * Login endpoint pour React
     * POST /api/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String identifier = credentials.get("identifier");
        String password = credentials.get("password");

        // Chercher l'utilisateur par matricule ou CIN
        Optional<User> userOpt = userRepository.findByMatricule(identifier);
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByNumCin(identifier);
        }

        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", "Utilisateur introuvable"));
        }

        User user = userOpt.get();

        // Vérifier le mot de passe
        if (user.getPassword() == null || !passwordEncoder.matches(password, user.getPassword())) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", "Mot de passe incorrect"));
        }


        // Générer le token JWT
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole() != null ? user.getRole() : "USER");
        

        // Préparer la réponse
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        
        Map<String, Object> userData = new HashMap<>();
        userData.put("username", user.getUsername());
        userData.put("matricule", user.getMatricule());
        userData.put("numCin", user.getNumCin());
        userData.put("phoneNumber", user.getPhoneNumber());
        userData.put("role", user.getRole() != null ? user.getRole() : "USER");
        
        response.put("user", userData);


        return ResponseEntity.ok(response);
    }

    /**
     * Obtenir les informations de l'utilisateur connecté
     * GET /api/auth/me
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401)
                .body(Map.of("message", "Non autorisé"));
        }

        try {
            String token = authHeader.substring(7);
            String username = jwtUtil.extractUsername(token);

            Optional<User> userOpt = userRepository.findByUsername(username);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(404)
                    .body(Map.of("message", "Utilisateur non trouvé"));
            }

            User user = userOpt.get();
            
            Map<String, Object> userData = new HashMap<>();
            userData.put("username", user.getUsername());
            userData.put("matricule", user.getMatricule());
            userData.put("numCin", user.getNumCin());
            userData.put("phoneNumber", user.getPhoneNumber());
            userData.put("role", user.getRole() != null ? user.getRole() : "USER");
            
            return ResponseEntity.ok(userData);
        } catch (Exception e) {
            return ResponseEntity.status(401)
                .body(Map.of("message", "Token invalide"));
        }
    }

    /**
     * Register endpoint pour React
     * POST /api/auth/register
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            // Vérifier si l'utilisateur existe déjà
            if (userRepository.findByUsername(user.getUsername()).isPresent()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "Le nom d'utilisateur existe déjà"));
            }

            // Encoder le mot de passe
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            
            // Définir le rôle par défaut
            if (user.getRole() == null || user.getRole().isEmpty()) {
                user.setRole("USER");
            }

            // Sauvegarder l'utilisateur
            userRepository.save(user);

            return ResponseEntity.ok(Map.of("message", "Inscription réussie"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", "Erreur lors de l'inscription: " + e.getMessage()));
        }
    }

    /**
     * External login endpoint pour les codes OTP
     * POST /api/auth/external
     */
    @PostMapping("/external")
    @ResponseBody
    public ResponseEntity<?> externalLogin(@RequestBody Map<String, String> externalData) {
        
        String authCode = externalData.get("authCode");
        String prenom = externalData.get("prenom");
        String nom = externalData.get("nom");


        // Vérifier que tous les champs sont fournis
        if (authCode == null || authCode.trim().isEmpty() ||
            prenom == null || prenom.trim().isEmpty() ||
            nom == null || nom.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", "Tous les champs sont requis"));
        }

        // Chercher le code dans la base de données
        Optional<ExternAuthCode> codeOpt = externAuthCodeRepository.findByCode(authCode.trim().toUpperCase());
        
        if (codeOpt.isEmpty()) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", "Code d'authentification invalide"));
        }

        ExternAuthCode externCode = codeOpt.get();

        // Vérifier si le code a déjà été utilisé
        if (externCode.isUsed()) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", "Ce code a déjà été utilisé"));
        }

        // Vérifier si le code a expiré
        LocalDateTime expirationTime = externCode.getExpirationDate();
        if (expirationTime != null && LocalDateTime.now().isAfter(expirationTime)) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", "Ce code a expiré"));
        }

        // Vérifier que les noms correspondent
        if (!externCode.getPrenom().equalsIgnoreCase(prenom.trim()) ||
            !externCode.getNom().equalsIgnoreCase(nom.trim())) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", "Les noms ne correspondent pas au code"));
        }


        // Marquer le code comme utilisé
        externCode.setUsed(true);
        externAuthCodeRepository.save(externCode);

        // Générer un nom d'utilisateur unique
        String username = (prenom.toLowerCase().trim() + "." + nom.toLowerCase().trim()).replace(" ", "");
        
        // Vérifier si l'utilisateur existe déjà
        Optional<User> existingUserOpt = userRepository.findByUsername(username);
        User user;
        
        if (existingUserOpt.isPresent()) {
            user = existingUserOpt.get();
        } else {
            // Créer un nouvel utilisateur externe
            user = new User();
            user.setUsername(username);
            user.setPrenom(prenom);
            user.setNom(nom);
            user.setRole("USER");
            user.setMatricule("EXT" + System.currentTimeMillis()); // Matricule temporaire
            user.setNumCin("EXT_" + System.currentTimeMillis()); // NumCin temporaire
            user.setPhoneNumber(""); // Phone number vide
            userRepository.save(user);
        }

        // Générer le token JWT
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());
        

        // Préparer la réponse
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        
        Map<String, Object> userData = new HashMap<>();
        userData.put("username", user.getUsername());
        userData.put("prenom", user.getPrenom());
        userData.put("nom", user.getNom());
        userData.put("matricule", user.getMatricule());
        userData.put("role", user.getRole() != null ? user.getRole() : "USER");
        userData.put("isExternal", true);
        
        response.put("user", userData);


        return ResponseEntity.ok(response);
    }

    /**
     * First login endpoint pour l'initialisation
     * POST /api/auth/first-login
     */
    @PostMapping("/first-login")
    public ResponseEntity<?> firstLogin(@RequestBody Map<String, String> request) {
        String identifier = request.get("identifier");
        
        if (identifier == null || identifier.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", "Identifiant requis"));
        }

        // Chercher l'utilisateur par matricule ou CIN
        Optional<User> userOpt = userRepository.findByMatricule(identifier.trim());
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByNumCin(identifier.trim());
        }

        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", "Utilisateur introuvable avec cet identifiant"));
        }

        User user = userOpt.get();
        
        // Vérifier si l'utilisateur a déjà un mot de passe
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", "Cet utilisateur a déjà un mot de passe configuré"));
        }

        // TODO: Ici vous pouvez implémenter l'envoi d'email/SMS avec un code de validation
        // Pour l'instant, on retourne juste un message de succès
        
        return ResponseEntity.ok(Map.of(
            "message", "Première connexion initiée. Vérifiez votre email/SMS pour le code de validation.",
            "requiresPassword", true
        ));
    }
}

