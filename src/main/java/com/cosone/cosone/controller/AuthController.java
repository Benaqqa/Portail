package com.cosone.cosone.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
import java.util.Random;
import java.time.LocalDateTime;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import com.cosone.cosone.model.User;
import com.cosone.cosone.model.ExternAuthCode;
import com.cosone.cosone.model.PhoneVerificationCode;
import com.cosone.cosone.repository.UserRepository;
import com.cosone.cosone.repository.ExternAuthCodeRepository;
import com.cosone.cosone.repository.PhoneVerificationCodeRepository;
import com.cosone.cosone.service.SmsService;
import com.cosone.cosone.util.PasswordValidator;

@Controller
public class AuthController {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    @Autowired
    private ExternAuthCodeRepository externAuthCodeRepository;
    @Autowired
    private PhoneVerificationCodeRepository phoneVerificationCodeRepository;
    @Autowired
    private SmsService smsService;
    @Autowired
    private AuthenticationManager authenticationManager;

    @GetMapping("/register")
    public String showRegistrationForm(Model model) {
        model.addAttribute("user", new User());
        return "register";
    }

    @PostMapping("/register")
    public String registerUser(@ModelAttribute User user, Model model) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            model.addAttribute("error", "Le nom d'utilisateur existe déjà");
            return "register";
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return "redirect:/login";
    }



    @GetMapping("/test-auth")
    public String testAuth() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return "home";
    }

    @GetMapping("/login")
    public String showLogin(@RequestParam(value = "message", required = false) String message,
                           @RequestParam(value = "error", required = false) String error,
                           Model model) {
        if (message != null) {
            model.addAttribute("message", message);
        }
        if (error != null) {
            model.addAttribute("error", error);
        }
        return "login";
    }

    @PostMapping("/login/interne/first")
    public String firstLogin(@RequestParam String identifier, Model model) {
        // Try to find user by matricule first, then by numCin
        var userOpt = userRepository.findByMatricule(identifier);
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByNumCin(identifier);
        }
        
        if (userOpt.isEmpty()) {
            model.addAttribute("error", "Matricule ou Num CIN introuvable");
            return "login";
        }
        
        User user = userOpt.get();
        
        // Check if user already has a password
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            model.addAttribute("error", "L'utilisateur a déjà un mot de passe. Veuillez utiliser la connexion régulière.");
            return "login";
        }
        
        String phoneNumber = user.getPhoneNumber();
        if (phoneNumber == null || phoneNumber.isEmpty()) {
            model.addAttribute("error", "Aucun numéro de téléphone associé à cet utilisateur. Veuillez contacter l'administrateur.");
            return "login";
        }
        
        // Generate and send verification code
        String verificationCode = generateVerificationCode();
        PhoneVerificationCode code = new PhoneVerificationCode();
        code.setPhoneNumber(phoneNumber);
        code.setCode(verificationCode);
        phoneVerificationCodeRepository.save(code);
        smsService.sendSms(phoneNumber, "Votre code de vérification est : " + verificationCode);
        
        model.addAttribute("phoneNumber", phoneNumber);
        model.addAttribute("identifier", identifier);
        return "verify-phone";
    }

    @PostMapping("/login/interne")
    public String interneLogin(@RequestParam String identifier, @RequestParam String password, Model model,
                             HttpServletRequest request, HttpServletResponse response) {
        System.out.println("Interne login attempt for identifier: " + identifier);
        
        // Try to find user by matricule first, then by numCin
        var userOpt = userRepository.findByMatricule(identifier);
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByNumCin(identifier);
        }
        
        if (userOpt.isEmpty()) {
            System.out.println("User not found for identifier: " + identifier);
            model.addAttribute("error", "Matricule ou Num CIN invalide");
            return "login";
        }
        
        User user = userOpt.get();
        if (user.getPassword() == null || user.getPassword().isEmpty()) {
            System.out.println("No password set for user: " + user.getUsername());
            model.addAttribute("error", "Aucun mot de passe défini pour cet utilisateur. Veuillez utiliser la Première Connexion.");
            return "login";
        }
        
        if (!passwordEncoder.matches(password, user.getPassword())) {
            System.out.println("Invalid password for user: " + user.getUsername());
            model.addAttribute("error", "Mot de passe invalide");
            return "login";
        }
        
        // Use AuthenticationManager for proper authentication
        try {
            System.out.println("Attempting authentication for username: " + user.getUsername() + " with password length: " + password.length());
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), password)
            );
            
            // Set authentication in SecurityContext and save to session
            SecurityContextHolder.getContext().setAuthentication(authentication);
            SecurityContextRepository securityContextRepository = new HttpSessionSecurityContextRepository();
            securityContextRepository.saveContext(SecurityContextHolder.getContext(), request, response);
            
            System.out.println("Login successful for user: " + user.getUsername() + ", redirecting to /home");
            System.out.println("Authentication object: " + authentication);
            System.out.println("Is authenticated: " + authentication.isAuthenticated());
            return "redirect:/home";
        } catch (Exception e) {
            System.err.println("Authentication failed for user: " + user.getUsername() + ", error: " + e.getMessage());
            e.printStackTrace();
            model.addAttribute("error", "Échec de l'authentification");
            return "login";
        }
    }

    @PostMapping("/verify-phone")
    public String verifyPhone(@RequestParam String identifier, @RequestParam String phoneNumber, 
                            @RequestParam String verificationCode, Model model) {
        var codeOpt = phoneVerificationCodeRepository.findByPhoneNumberAndCode(phoneNumber, verificationCode);
        
        if (codeOpt.isEmpty()) {
            model.addAttribute("error", "Code de vérification invalide");
            model.addAttribute("phoneNumber", phoneNumber);
            model.addAttribute("identifier", identifier);
            return "verify-phone";
        }
        
        PhoneVerificationCode code = codeOpt.get();
        
        if (code.isUsed()) {
            model.addAttribute("error", "Le code de vérification a déjà été utilisé");
            model.addAttribute("phoneNumber", phoneNumber);
            model.addAttribute("identifier", identifier);
            return "verify-phone";
        }
        
        if (LocalDateTime.now().isAfter(code.getExpiresAt())) {
            model.addAttribute("error", "Le code de vérification a expiré");
            model.addAttribute("phoneNumber", phoneNumber);
            model.addAttribute("identifier", identifier);
            return "verify-phone";
        }
        
        // Mark code as used
        code.setUsed(true);
        phoneVerificationCodeRepository.save(code);
        model.addAttribute("identifier", identifier);
        return "create-password";
    }

    @PostMapping("/resend-code")
    public String resendCode(@RequestParam String identifier, @RequestParam String phoneNumber, Model model) {
        // Delete any existing unused codes for this phone number
        var existingCodes = phoneVerificationCodeRepository.findByPhoneNumber(phoneNumber);
        existingCodes.ifPresent(code -> {
            if (!code.isUsed()) {
                phoneVerificationCodeRepository.delete(code);
            }
        });
        
        // Generate and send new verification code
        String verificationCode = generateVerificationCode();
        PhoneVerificationCode code = new PhoneVerificationCode();
        code.setPhoneNumber(phoneNumber);
        code.setCode(verificationCode);
        phoneVerificationCodeRepository.save(code);
        smsService.sendSms(phoneNumber, "Votre nouveau code de vérification est : " + verificationCode);
        
        model.addAttribute("phoneNumber", phoneNumber);
        model.addAttribute("identifier", identifier);
        model.addAttribute("message", "Nouveau code de vérification envoyé");
        return "verify-phone";
    }

    @PostMapping("/create-password")
    public String createPassword(@RequestParam String identifier, @RequestParam String password, 
                               @RequestParam String confirmPassword, Model model,
                               HttpServletRequest request, HttpServletResponse response) {
        if (!password.equals(confirmPassword)) {
            model.addAttribute("error", "Les mots de passe ne correspondent pas");
            model.addAttribute("identifier", identifier);
            return "create-password";
        }
        if (!PasswordValidator.isValidPassword(password)) {
            model.addAttribute("error", PasswordValidator.getPasswordRequirements());
            model.addAttribute("identifier", identifier);
            return "create-password";
        }
        
        // Try to find user by matricule first, then by numCin
        var userOpt = userRepository.findByMatricule(identifier);
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByNumCin(identifier);
        }
        
        if (userOpt.isEmpty()) {
            model.addAttribute("error", "Utilisateur introuvable");
            return "login";
        }
        User user = userOpt.get();
        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);
        
        // Password created successfully, redirect to login page
        System.out.println("Password created successfully for user: " + user.getUsername() + ", redirecting to login page");
        return "redirect:/login?message=Mot de passe créé avec succès ! Vous pouvez maintenant vous connecter avec votre Matricule/Num CIN et mot de passe.";
    }

    @PostMapping("/login/extern")
    public String externLogin(@RequestParam String authCode, 
                            @RequestParam String prenom, 
                            @RequestParam String nom, 
                            Model model,
                            HttpServletRequest request, HttpServletResponse response) {
        System.out.println("Extern login attempt with code: " + authCode + " for " + prenom + " " + nom);
        var codeOpt = externAuthCodeRepository.findByCode(authCode);
        if (codeOpt.isEmpty() || codeOpt.get().isUsed()) {
            System.out.println("Invalid or used extern code: " + authCode);
            model.addAttribute("error", "Code invalide ou déjà utilisé");
            return "login";
        }
        
        ExternAuthCode code = codeOpt.get();
        
        // Verify the person's name matches
        if (!prenom.equalsIgnoreCase(code.getPrenom()) || !nom.equalsIgnoreCase(code.getNom())) {
            System.out.println("Name mismatch for code: " + authCode + ". Expected: " + code.getPrenom() + " " + code.getNom() + ", Got: " + prenom + " " + nom);
            model.addAttribute("error", "Code invalide ou nom incorrect");
            return "login";
        }
        
        // Mark code as used
        code.setUsed(true);
        externAuthCodeRepository.save(code);
        
        // Create a temporary authentication for extern user
        UserDetails externUser = org.springframework.security.core.userdetails.User
            .withUsername("extern_user_" + prenom + "_" + nom + "_" + System.currentTimeMillis())
            .password("")
            .roles("EXTERN")
            .build();
        
        Authentication authentication = new UsernamePasswordAuthenticationToken(
            externUser, null, externUser.getAuthorities());
        
        // Set authentication in SecurityContext and save to session
        SecurityContextHolder.getContext().setAuthentication(authentication);
        SecurityContextRepository securityContextRepository = new HttpSessionSecurityContextRepository();
        securityContextRepository.saveContext(SecurityContextHolder.getContext(), request, response);
        
        System.out.println("Extern login successful for " + prenom + " " + nom + ", redirecting to /home");
        return "redirect:/home";
    }


    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin/generate-code")
    public String generateExternCode(@RequestParam String code, 
                                   @RequestParam String prenom, 
                                   @RequestParam String nom, 
                                   Model model) {
        if (externAuthCodeRepository.findByCode(code).isPresent()) {
            model.addAttribute("error", "Le code existe déjà");
            return "redirect:/admin/generate-code";
        }
        ExternAuthCode newCode = new ExternAuthCode();
        newCode.setCode(code);
        newCode.setPrenom(prenom);
        newCode.setNom(nom);
        externAuthCodeRepository.save(newCode);
        model.addAttribute("message", "Code généré : " + code + " pour " + prenom + " " + nom);
        return "redirect:/admin/generate-code";
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin/delete-code")
    public String deleteExternCode(@RequestParam Long codeId, Model model) {
        var codeOpt = externAuthCodeRepository.findById(codeId);
        if (codeOpt.isEmpty()) {
            model.addAttribute("error", "Code introuvable");
        } else {
            ExternAuthCode code = codeOpt.get();
            externAuthCodeRepository.delete(code);
            model.addAttribute("message", "Code supprimé : " + code.getCode() + " pour " + code.getPrenom() + " " + code.getNom());
        }
        return "redirect:/admin/generate-code";
    }


    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin/users/add-phone")
    public String addPhoneToUser(@RequestParam Long userId, @RequestParam String phoneNumber, Model model) {
        var userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            model.addAttribute("error", "Utilisateur introuvable");
            return "redirect:/admin/users";
        }
        User user = userOpt.get();
        user.setPhoneNumber(phoneNumber);
        userRepository.save(user);
        model.addAttribute("message", "Numéro de téléphone ajouté avec succès");
        return "redirect:/admin/users";
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin/users/update-phone")
    public String updateUserPhone(@RequestParam Long userId, @RequestParam String phoneNumber, Model model) {
        var userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            model.addAttribute("error", "Utilisateur introuvable");
            return "redirect:/admin/users";
        }
        User user = userOpt.get();
        user.setPhoneNumber(phoneNumber);
        userRepository.save(user);
        model.addAttribute("message", "Numéro de téléphone mis à jour avec succès");
        return "redirect:/admin/users";
    }

    @GetMapping("/dev/sms")
    public String viewLatestSms(Model model) {
        model.addAttribute("smsMessages", smsService.getAllLatestSms());
        return "dev-sms";
    }





    @GetMapping("/logout")
    public String logout() {
        SecurityContextHolder.clearContext();
        return "redirect:/login?message=Vous avez été déconnecté avec succès.";
    }

    private String generateVerificationCode() {
        Random random = new Random();
        return String.format("%06d", random.nextInt(1000000));
    }
} 