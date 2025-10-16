package com.cosone.cosone.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.cosone.cosone.service.CentresCsvService;
import com.cosone.cosone.repository.UserRepository;
import com.cosone.cosone.repository.ReservationRepository;
import com.cosone.cosone.repository.ExternAuthCodeRepository;
import com.cosone.cosone.model.StatutReservation;

import java.util.HashMap;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminApiController {

    @Autowired
    private CentresCsvService centresCsvService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private ExternAuthCodeRepository externAuthCodeRepository;

    /**
     * Get all centres from CSV
     */
    @GetMapping("/centres")
    public ResponseEntity<?> getCentres() {
        try {
            List<Map<String, Object>> centres = centresCsvService.loadCentresFromCsv();
            
            Map<String, Object> response = new HashMap<>();
            response.put("centres", centres);
            response.put("total", centres.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Erreur lors du chargement des centres: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }

    /**
     * Get all users
     */
    @GetMapping("/users")
    public ResponseEntity<?> getUsers() {
        try {
            var users = userRepository.findAll();
            
            Map<String, Object> response = new HashMap<>();
            response.put("users", users);
            response.put("total", users.size());
            
            // Calculate statistics
            long usersWithPassword = users.stream()
                .filter(user -> user.getPassword() != null && !user.getPassword().isEmpty())
                .count();
            long adminUsers = users.stream()
                .filter(user -> "ADMIN".equals(user.getRole()))
                .count();
            
            response.put("usersWithPassword", usersWithPassword);
            response.put("adminUsers", adminUsers);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Erreur lors du chargement des utilisateurs: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }

    /**
     * Get all reservations
     */
    @GetMapping("/reservations")
    public ResponseEntity<?> getReservations() {
        try {
            var reservations = reservationRepository.findAll();
            
            Map<String, Object> response = new HashMap<>();
            response.put("reservations", reservations);
            response.put("total", reservations.size());
            
            // Calculate statistics
            long pendingReservations = reservationRepository.findByStatutOrderByDateReservationDesc(StatutReservation.EN_ATTENTE_PAIEMENT).size();
            long confirmedReservations = reservationRepository.findByStatutOrderByDateReservationDesc(StatutReservation.CONFIRMEE).size();
            long cancelledReservations = reservationRepository.findByStatutOrderByDateReservationDesc(StatutReservation.ANNULEE).size();
            
            response.put("pendingReservations", pendingReservations);
            response.put("confirmedReservations", confirmedReservations);
            response.put("cancelledReservations", cancelledReservations);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Erreur lors du chargement des réservations: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }

    /**
     * Get all external authentication codes
     */
    @GetMapping("/codes")
    public ResponseEntity<?> getCodes() {
        try {
            var codes = externAuthCodeRepository.findAll();
            
            Map<String, Object> response = new HashMap<>();
            response.put("codes", codes);
            response.put("total", codes.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Erreur lors du chargement des codes: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }

    /**
     * Generate a new external authentication code
     */
    @PostMapping("/codes")
    public ResponseEntity<?> generateCode(@RequestBody Map<String, Object> request) {
        try {
            String code = (String) request.get("code");
            String prenom = (String) request.get("prenom");
            String nom = (String) request.get("nom");
            String matricule = (String) request.get("matricule");
            String numCin = (String) request.get("numCin");
            String phoneNumber = (String) request.get("phoneNumber");
            
            // Parse expiration hours with default value
            int expirationHours = 24;
            if (request.get("expirationHours") != null) {
                if (request.get("expirationHours") instanceof Integer) {
                    expirationHours = (Integer) request.get("expirationHours");
                } else if (request.get("expirationHours") instanceof String) {
                    expirationHours = Integer.parseInt((String) request.get("expirationHours"));
                }
            }
            
            // Parse oneTimeOnly with default value
            boolean oneTimeOnly = true;
            if (request.get("oneTimeOnly") != null) {
                if (request.get("oneTimeOnly") instanceof Boolean) {
                    oneTimeOnly = (Boolean) request.get("oneTimeOnly");
                } else if (request.get("oneTimeOnly") instanceof String) {
                    oneTimeOnly = Boolean.parseBoolean((String) request.get("oneTimeOnly"));
                }
            }
            
            if (code == null || prenom == null || nom == null) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "Code, prénom et nom sont requis");
                return ResponseEntity.badRequest().body(error);
            }
            
            if (externAuthCodeRepository.findByCode(code.toUpperCase()).isPresent()) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "Le code existe déjà");
                return ResponseEntity.badRequest().body(error);
            }
            
            com.cosone.cosone.model.ExternAuthCode newCode = new com.cosone.cosone.model.ExternAuthCode();
            newCode.setCode(code.toUpperCase());
            newCode.setPrenom(prenom);
            newCode.setNom(nom);
            newCode.setMatricule(matricule);
            newCode.setNumCin(numCin);
            newCode.setPhoneNumber(phoneNumber);
            newCode.setExpirationHours(expirationHours);
            newCode.setOneTimeOnly(oneTimeOnly);
            
            externAuthCodeRepository.save(newCode);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Code généré avec succès");
            response.put("code", newCode);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Erreur lors de la génération du code: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }

    /**
     * Delete an external authentication code
     */
    @DeleteMapping("/codes/{codeId}")
    public ResponseEntity<?> deleteCode(@PathVariable Long codeId) {
        try {
            var codeOpt = externAuthCodeRepository.findById(codeId);
            if (codeOpt.isEmpty()) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "Code introuvable");
                return ResponseEntity.notFound().build();
            }
            
            externAuthCodeRepository.delete(codeOpt.get());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Code supprimé avec succès");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Erreur lors de la suppression du code: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }

    /**
     * Update user information
     */
    @PutMapping("/users/{userId}")
    public ResponseEntity<?> updateUser(@PathVariable Long userId, @RequestBody Map<String, Object> request) {
        try {
            var userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "Utilisateur introuvable");
                return ResponseEntity.notFound().build();
            }
            
            var user = userOpt.get();
            
            // Update fields if provided
            if (request.get("username") != null) {
                user.setUsername((String) request.get("username"));
            }
            if (request.get("matricule") != null) {
                user.setMatricule((String) request.get("matricule"));
            }
            if (request.get("numCin") != null) {
                user.setNumCin((String) request.get("numCin"));
            }
            if (request.get("phoneNumber") != null) {
                user.setPhoneNumber((String) request.get("phoneNumber"));
            }
            if (request.get("role") != null) {
                user.setRole((String) request.get("role"));
            }
            
            userRepository.save(user);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Utilisateur mis à jour avec succès");
            response.put("user", user);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Erreur lors de la mise à jour de l'utilisateur: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
}
