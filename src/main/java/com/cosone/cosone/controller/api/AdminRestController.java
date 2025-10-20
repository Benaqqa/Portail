package com.cosone.cosone.controller.api;

import com.cosone.cosone.model.User;
import com.cosone.cosone.model.Reservation;
import com.cosone.cosone.model.ExternAuthCode;
import com.cosone.cosone.model.Actualite;
import com.cosone.cosone.repository.UserRepository;
import com.cosone.cosone.repository.ReservationRepository;
import com.cosone.cosone.repository.ExternAuthCodeRepository;
import com.cosone.cosone.repository.ActualiteRepository;
import com.cosone.cosone.service.CentresCsvService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
@PreAuthorize("hasRole('ADMIN')")
public class AdminRestController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private ExternAuthCodeRepository externAuthCodeRepository;

    @Autowired
    private CentresCsvService centresCsvService;

    @Autowired
    private ActualiteRepository actualiteRepository;

    // ==================== USERS MANAGEMENT ====================

    /**
     * Get all users
     * GET /api/admin/users
     */
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        try {
            List<User> users = userRepository.findAll();
            Map<String, Object> response = new HashMap<>();
            response.put("users", users);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Erreur lors du chargement des utilisateurs"));
        }
    }

    /**
     * Update user
     * PUT /api/admin/users/{userId}
     */
    @PutMapping("/users/{userId}")
    public ResponseEntity<?> updateUser(@PathVariable Long userId, @RequestBody Map<String, String> userData) {
        try {
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(404).body(Map.of("message", "Utilisateur non trouvé"));
            }

            User user = userOpt.get();
            
            // Update fields if provided
            if (userData.containsKey("username")) {
                user.setUsername(userData.get("username"));
            }
            if (userData.containsKey("matricule")) {
                user.setMatricule(userData.get("matricule"));
            }
            if (userData.containsKey("numCin")) {
                user.setNumCin(userData.get("numCin"));
            }
            if (userData.containsKey("phoneNumber")) {
                user.setPhoneNumber(userData.get("phoneNumber"));
            }
            if (userData.containsKey("role")) {
                user.setRole(userData.get("role"));
            }
            
            userRepository.save(user);
            return ResponseEntity.ok(Map.of("message", "Utilisateur mis à jour avec succès"));
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Erreur lors de la mise à jour de l'utilisateur"));
        }
    }

    // ==================== RESERVATIONS MANAGEMENT ====================

    /**
     * Get all reservations
     * GET /api/admin/reservations
     */
    @GetMapping("/reservations")
    public ResponseEntity<?> getAllReservations() {
        try {
            List<Reservation> reservations = reservationRepository.findAll();
            Map<String, Object> response = new HashMap<>();
            response.put("reservations", reservations);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Erreur lors du chargement des réservations"));
        }
    }

    // ==================== EXTERNAL AUTH CODES MANAGEMENT ====================

    /**
     * Get all external auth codes
     * GET /api/admin/codes
     */
    @GetMapping("/codes")
    public ResponseEntity<?> getAllCodes() {
        try {
            List<ExternAuthCode> codes = externAuthCodeRepository.findAll();
            Map<String, Object> response = new HashMap<>();
            response.put("codes", codes);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Erreur lors du chargement des codes"));
        }
    }

    /**
     * Generate new external auth code
     * POST /api/admin/codes
     */
    @PostMapping("/codes")
    public ResponseEntity<?> generateCode(@RequestBody Map<String, Object> codeData) {
        try {
            ExternAuthCode code = new ExternAuthCode();
            code.setCode((String) codeData.get("code"));
            code.setPrenom((String) codeData.get("prenom"));
            code.setNom((String) codeData.get("nom"));
            code.setMatricule((String) codeData.get("matricule"));
            code.setNumCin((String) codeData.get("numCin"));
            code.setPhoneNumber((String) codeData.get("phoneNumber"));
            
            // Set expiration date
            int expirationHours = (Integer) codeData.getOrDefault("expirationHours", 24);
            code.setExpirationDate(LocalDateTime.now().plusHours(expirationHours));
            
            // Set one-time usage
            code.setOneTimeOnly((Boolean) codeData.getOrDefault("oneTimeOnly", true));
            code.setUsed(false);
            
            externAuthCodeRepository.save(code);
            return ResponseEntity.ok(Map.of("message", "Code généré avec succès"));
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Erreur lors de la génération du code"));
        }
    }

    /**
     * Delete external auth code
     * DELETE /api/admin/codes/{codeId}
     */
    @DeleteMapping("/codes/{codeId}")
    public ResponseEntity<?> deleteCode(@PathVariable Long codeId) {
        try {
            Optional<ExternAuthCode> codeOpt = externAuthCodeRepository.findById(codeId);
            if (codeOpt.isEmpty()) {
                return ResponseEntity.status(404).body(Map.of("message", "Code non trouvé"));
            }
            
            externAuthCodeRepository.deleteById(codeId);
            return ResponseEntity.ok(Map.of("message", "Code supprimé avec succès"));
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Erreur lors de la suppression du code"));
        }
    }

    // ==================== CENTRES MANAGEMENT ====================

    /**
     * Get all centres
     * GET /api/admin/centres
     */
    @GetMapping("/centres")
    public ResponseEntity<?> getCentres() {
        try {
            List<Map<String, Object>> centres = centresCsvService.loadCentresFromCsv();
            Map<String, Object> response = new HashMap<>();
            response.put("centres", centres != null ? centres : List.of());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Erreur lors du chargement des centres"));
        }
    }

    /**
     * Create new centre
     * POST /api/admin/centres
     */
    @PostMapping("/centres")
    public ResponseEntity<?> createCentre(@RequestBody Map<String, Object> centreData) {
        try {
            // For now, we'll just return success since centres are managed via CSV
            // In a real implementation, you'd add the centre to the CSV file
            return ResponseEntity.ok(Map.of("message", "Centre créé avec succès (fonctionnalité à implémenter)"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Erreur lors de la création du centre"));
        }
    }

    /**
     * Update centre
     * PUT /api/admin/centres/{centreId}
     */
    @PutMapping("/centres/{centreId}")
    public ResponseEntity<?> updateCentre(@PathVariable String centreId, @RequestBody Map<String, Object> centreData) {
        try {
            // For now, we'll just return success since centres are managed via CSV
            return ResponseEntity.ok(Map.of("message", "Centre mis à jour avec succès (fonctionnalité à implémenter)"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Erreur lors de la mise à jour du centre"));
        }
    }

    /**
     * Delete centre
     * DELETE /api/admin/centres/{centreId}
     */
    @DeleteMapping("/centres/{centreId}")
    public ResponseEntity<?> deleteCentre(@PathVariable String centreId) {
        try {
            // For now, we'll just return success since centres are managed via CSV
            return ResponseEntity.ok(Map.of("message", "Centre supprimé avec succès (fonctionnalité à implémenter)"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Erreur lors de la suppression du centre"));
        }
    }

    // ==================== ACTUALITES MANAGEMENT ====================

    /**
     * Get all actualités
     * GET /api/admin/actualites
     */
    @GetMapping("/actualites")
    public ResponseEntity<?> getActualites() {
        try {
            List<Actualite> actualites = actualiteRepository.findAll();
            Map<String, Object> response = new HashMap<>();
            response.put("actualites", actualites);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Erreur lors du chargement des actualités"));
        }
    }

    /**
     * Create new actualité
     * POST /api/admin/actualites
     */
    @PostMapping("/actualites")
    public ResponseEntity<?> createActualite(@RequestBody Map<String, Object> actualiteData) {
        try {
            Actualite actualite = new Actualite();
            actualite.setTitre((String) actualiteData.getOrDefault("titre", ""));
            actualite.setContenu((String) actualiteData.getOrDefault("contenu", ""));
            Object dateValue = actualiteData.get("datePublication");
            if (dateValue instanceof String str && !str.isEmpty()) {
                actualite.setDatePublication(java.time.LocalDate.parse(str));
            }
            actualite.setImageUrl((String) actualiteData.getOrDefault("imageUrl", null));
            actualite.setPieceJointe((String) actualiteData.getOrDefault("pieceJointe", null));
            Object featuredVal = actualiteData.get("featured");
            if (featuredVal instanceof Boolean b) {
                actualite.setFeatured(b);
            } else if (featuredVal instanceof String s) {
                actualite.setFeatured(Boolean.parseBoolean(s));
            }
            Actualite saved = actualiteRepository.save(actualite);
            return ResponseEntity.ok(Map.of("message", "Actualité créée avec succès", "actualite", saved));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Erreur lors de la création de l'actualité"));
        }
    }

    /**
     * Update actualité
     * PUT /api/admin/actualites/{actualiteId}
     */
    @PutMapping("/actualites/{actualiteId}")
    public ResponseEntity<?> updateActualite(@PathVariable Long actualiteId, @RequestBody Map<String, Object> actualiteData) {
        try {
            Optional<Actualite> existingOpt = actualiteRepository.findById(actualiteId);
            if (existingOpt.isEmpty()) {
                return ResponseEntity.status(404).body(Map.of("message", "Actualité non trouvée"));
            }
            Actualite existing = existingOpt.get();
            if (actualiteData.containsKey("titre")) existing.setTitre((String) actualiteData.get("titre"));
            if (actualiteData.containsKey("contenu")) existing.setContenu((String) actualiteData.get("contenu"));
            if (actualiteData.containsKey("datePublication")) {
                Object dateValue = actualiteData.get("datePublication");
                if (dateValue instanceof String str && !str.isEmpty()) {
                    existing.setDatePublication(java.time.LocalDate.parse(str));
                }
            }
            if (actualiteData.containsKey("imageUrl")) existing.setImageUrl((String) actualiteData.get("imageUrl"));
            if (actualiteData.containsKey("pieceJointe")) existing.setPieceJointe((String) actualiteData.get("pieceJointe"));
            if (actualiteData.containsKey("featured")) {
                Object featuredVal = actualiteData.get("featured");
                if (featuredVal instanceof Boolean b) existing.setFeatured(b);
                else if (featuredVal instanceof String s) existing.setFeatured(Boolean.parseBoolean(s));
            }
            Actualite saved = actualiteRepository.save(existing);
            return ResponseEntity.ok(Map.of("message", "Actualité mise à jour avec succès", "actualite", saved));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Erreur lors de la mise à jour de l'actualité"));
        }
    }

    /**
     * Delete actualité
     * DELETE /api/admin/actualites/{actualiteId}
     */
    @DeleteMapping("/actualites/{actualiteId}")
    public ResponseEntity<?> deleteActualite(@PathVariable Long actualiteId) {
        try {
            if (!actualiteRepository.existsById(actualiteId)) {
                return ResponseEntity.status(404).body(Map.of("message", "Actualité non trouvée"));
            }
            actualiteRepository.deleteById(actualiteId);
            return ResponseEntity.ok(Map.of("message", "Actualité supprimée avec succès"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Erreur lors de la suppression de l'actualité"));
        }
    }
}

