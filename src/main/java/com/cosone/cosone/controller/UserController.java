package com.cosone.cosone.controller;

import com.cosone.cosone.model.Reservation;
import com.cosone.cosone.model.StatutReservation;
import com.cosone.cosone.model.User;
import com.cosone.cosone.repository.ReservationRepository;
import com.cosone.cosone.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;
import java.util.Optional;

@Controller
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    /**
     * Afficher l'historique des réservations de l'utilisateur connecté
     */
    @GetMapping({"/history", "/historique"})
    public String showHistory(Model model) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getName())) {
            return "redirect:/login";
        }

        String username = auth.getName();
        Optional<User> userOpt = userRepository.findByUsername(username);

        if (userOpt.isEmpty()) {
            model.addAttribute("error", "Utilisateur non trouvé");
            model.addAttribute("reservations", List.of());
            return "user-history";
        }

        User user = userOpt.get();
        String matricule = user.getMatricule();

        // Récupérer toutes les réservations de l'utilisateur
        List<Reservation> reservations = reservationRepository.findByMatriculeOrderByDateReservationDesc(matricule);

        // Calculer les statistiques
        long totalReservations = reservations.size();
        long reservationsEnCours = reservations.stream()
                .filter(r -> r.getStatut() == StatutReservation.EN_ATTENTE_PAIEMENT)
                .count();
        long reservationsConfirmees = reservations.stream()
                .filter(r -> r.getStatut() == StatutReservation.CONFIRMEE)
                .count();

        model.addAttribute("reservations", reservations);
        model.addAttribute("totalReservations", totalReservations);
        model.addAttribute("reservationsEnCours", reservationsEnCours);
        model.addAttribute("reservationsConfirmees", reservationsConfirmees);
        model.addAttribute("username", username);
        model.addAttribute("matricule", matricule);

        return "user-history";
    }

    /**
     * Afficher le profil de l'utilisateur
     */
    @GetMapping({"/profile", "/profil"})
    public String showProfile(Model model) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getName())) {
            return "redirect:/login";
        }

        String username = auth.getName();
        Optional<User> userOpt = userRepository.findByUsername(username);

        if (userOpt.isEmpty()) {
            return "redirect:/home";
        }

        User user = userOpt.get();
        model.addAttribute("user", user);

        return "user-profile";
    }
}

