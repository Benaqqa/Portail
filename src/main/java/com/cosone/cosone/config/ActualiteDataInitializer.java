package com.cosone.cosone.config;

import com.cosone.cosone.model.Actualite;
import com.cosone.cosone.repository.ActualiteRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.util.List;

@Configuration
public class ActualiteDataInitializer {

    @Bean
    CommandLineRunner seedActualites(ActualiteRepository actualiteRepository) {
        return args -> {
            if (actualiteRepository.count() > 0) {
                return;
            }

            Actualite a1 = new Actualite();
            a1.setTitre("Lancement du Portail Interactif COS'ONE");
            a1.setContenu("Découvrez notre nouvelle plateforme digitale qui révolutionne l'expérience du personnel. Accédez à tous vos services en ligne avec une interface moderne et intuitive.");
            a1.setDatePublication(LocalDate.of(LocalDate.now().getYear(), 1, 15));
            a1.setImageUrl("/src/Logo/vacances.webp");
            a1.setFeatured(true);

            Actualite a2 = new Actualite();
            a2.setTitre("Assemblée Générale du COS'ONE 2025");
            a2.setContenu("L'assemblée générale annuelle se tiendra le 28 février 2025. Inscription obligatoire via le portail jusqu'au 20 février.");
            a2.setDatePublication(LocalDate.of(LocalDate.now().getYear(), 1, 10));
            a2.setImageUrl("/src/Logo/kids.jpg");

            Actualite a3 = new Actualite();
            a3.setTitre("Nouveaux Modules de Formation en Ligne");
            a3.setContenu("Découvrez nos nouveaux modules de formation disponibles sur la plateforme : gestion du stress, communication digitale et bien-être au travail.");
            a3.setDatePublication(LocalDate.of(LocalDate.now().getYear(), 1, 8));
            a3.setImageUrl("/src/Logo/vacances 1.webp");

            Actualite a4 = new Actualite();
            a4.setTitre("Ouverture des Réservations Été 2025");
            a4.setContenu("Les réservations pour les centres de vacances d'été sont maintenant ouvertes. Tarifs préférentiels pour les premiers inscrits.");
            a4.setDatePublication(LocalDate.of(LocalDate.now().getYear(), 1, 5));
            a4.setImageUrl("/src/Logo/vacances 2.webp");

            Actualite a5 = new Actualite();
            a5.setTitre("Newsletter COS'ONE - Janvier 2025");
            a5.setContenu("Retrouvez toutes les actualités du mois : nouveaux services, événements à venir et témoignages du personnel.");
            a5.setDatePublication(LocalDate.of(LocalDate.now().getYear(), 1, 3));
            a5.setImageUrl("/src/Logo/centre_de_vacances.jpg");

            Actualite a6 = new Actualite();
            a6.setTitre("Nouvelles Orientations Stratégiques 2025");
            a6.setContenu("Découvrez les nouvelles orientations du COS'ONE pour 2025 : digitalisation, innovation sociale et proximité humaine renforcée.");
            a6.setDatePublication(LocalDate.of(LocalDate.now().getYear(), 1, 1));
            a6.setImageUrl("/src/Logo/LOGO.png");

            actualiteRepository.saveAll(List.of(a1, a2, a3, a4, a5, a6));
        };
    }
}


