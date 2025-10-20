-- Seed initial actualités if table is empty or specific titles missing

INSERT INTO actualites (titre, contenu, date_publication, image_url, piece_jointe, featured, created_at)
SELECT 'Lancement du Portail Interactif COS''ONE',
       'Découvrez notre nouvelle plateforme digitale qui révolutionne l''expérience du personnel. Accédez à tous vos services en ligne avec une interface moderne et intuitive.',
       to_date(extract(year from now()) || '-01-15','YYYY-MM-DD'),
       '/src/Logo/vacances.webp',
       NULL,
       TRUE,
       now()
WHERE NOT EXISTS (SELECT 1 FROM actualites WHERE titre = 'Lancement du Portail Interactif COS''ONE');

INSERT INTO actualites (titre, contenu, date_publication, image_url, piece_jointe, featured, created_at)
SELECT 'Assemblée Générale du COS''ONE 2025',
       'L''assemblée générale annuelle se tiendra le 28 février 2025. Inscription obligatoire via le portail jusqu''au 20 février.',
       to_date(extract(year from now()) || '-01-10','YYYY-MM-DD'),
       '/src/Logo/kids.jpg',
       NULL,
       FALSE,
       now()
WHERE NOT EXISTS (SELECT 1 FROM actualites WHERE titre = 'Assemblée Générale du COS''ONE 2025');

INSERT INTO actualites (titre, contenu, date_publication, image_url, piece_jointe, featured, created_at)
SELECT 'Nouveaux Modules de Formation en Ligne',
       'Découvrez nos nouveaux modules de formation disponibles sur la plateforme : gestion du stress, communication digitale et bien-être au travail.',
       to_date(extract(year from now()) || '-01-08','YYYY-MM-DD'),
       '/src/Logo/vacances 1.webp',
       NULL,
       FALSE,
       now()
WHERE NOT EXISTS (SELECT 1 FROM actualites WHERE titre = 'Nouveaux Modules de Formation en Ligne');

INSERT INTO actualites (titre, contenu, date_publication, image_url, piece_jointe, featured, created_at)
SELECT 'Ouverture des Réservations Été 2025',
       'Les réservations pour les centres de vacances d''été sont maintenant ouvertes. Tarifs préférentiels pour les premiers inscrits.',
       to_date(extract(year from now()) || '-01-05','YYYY-MM-DD'),
       '/src/Logo/vacances 2.webp',
       NULL,
       FALSE,
       now()
WHERE NOT EXISTS (SELECT 1 FROM actualites WHERE titre = 'Ouverture des Réservations Été 2025');

INSERT INTO actualites (titre, contenu, date_publication, image_url, piece_jointe, featured, created_at)
SELECT 'Newsletter COS''ONE - Janvier 2025',
       'Retrouvez toutes les actualités du mois : nouveaux services, événements à venir et témoignages du personnel.',
       to_date(extract(year from now()) || '-01-03','YYYY-MM-DD'),
       '/src/Logo/centre_de_vacances.jpg',
       NULL,
       FALSE,
       now()
WHERE NOT EXISTS (SELECT 1 FROM actualites WHERE titre = 'Newsletter COS''ONE - Janvier 2025');

INSERT INTO actualites (titre, contenu, date_publication, image_url, piece_jointe, featured, created_at)
SELECT 'Nouvelles Orientations Stratégiques 2025',
       'Découvrez les nouvelles orientations du COS''ONE pour 2025 : digitalisation, innovation sociale et proximité humaine renforcée.',
       to_date(extract(year from now()) || '-01-01','YYYY-MM-DD'),
       '/src/Logo/LOGO.png',
       NULL,
       FALSE,
       now()
WHERE NOT EXISTS (SELECT 1 FROM actualites WHERE titre = 'Nouvelles Orientations Stratégiques 2025');


