package com.cosone.cosone.controller.api;

import com.cosone.cosone.model.User;
import com.cosone.cosone.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:3000")
public class UserRestController {

    @Autowired
    private UserRepository userRepository;

    /**
     * Mettre à jour le profil de l'utilisateur connecté
     */
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> profileData, Authentication auth) {
        try {
            System.out.println("Profile update request received");
            System.out.println("Authentication: " + auth);
            System.out.println("Auth name: " + (auth != null ? auth.getName() : "null"));
            System.out.println("Auth authenticated: " + (auth != null ? auth.isAuthenticated() : "null"));
            
            if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getName())) {
                System.out.println("Authentication failed - returning 401");
                return ResponseEntity.status(401).body(Map.of("message", "Non autorisé"));
            }

            String username = auth.getName();
            Optional<User> userOpt = userRepository.findByUsername(username);
            
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(404).body(Map.of("message", "Utilisateur non trouvé"));
            }

            User user = userOpt.get();
            
            // Mettre à jour les champs fournis
            if (profileData.containsKey("email")) {
                user.setEmail(profileData.get("email"));
            }
            if (profileData.containsKey("telephone")) {
                user.setPhoneNumber(profileData.get("telephone"));
            }
            
            // Sauvegarder les modifications
            userRepository.save(user);
            
            return ResponseEntity.ok(Map.of("message", "Profil mis à jour avec succès"));
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("message", "Erreur lors de la mise à jour du profil"));
        }
    }
}

