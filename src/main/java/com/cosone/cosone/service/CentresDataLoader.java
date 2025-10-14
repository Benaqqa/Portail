package com.cosone.cosone.service;

import com.cosone.cosone.model.Centre;
import com.cosone.cosone.repository.CentreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
// import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

/**
 * Service pour charger les données des centres depuis output.csv dans la base de données
 * Solution temporaire pour peupler la table centres
 * 
 * Pour activer ce chargement automatique au démarrage, décommenter @Component et son import
 */
// @Component
public class CentresDataLoader implements CommandLineRunner {

    @Autowired
    private CentreRepository centreRepository;

    @Override
    public void run(String... args) throws Exception {
        // Vérifier si des centres existent déjà
        if (centreRepository.count() > 0) {
            System.out.println("Des centres existent déjà dans la base de données. Chargement ignoré.");
            return;
        }

        System.out.println("Chargement des centres depuis les données CSV...");

        List<Centre> centres = Arrays.asList(
            createCentre("Office Nationale de l'Eau branche electricite", "R653+8G, Ain El Aouda", "Ain El Aouda", "N/A", "contact@cosone.ma", ""),
            createCentre("Office national de l'electricite et de l'eau potable - Casablanca", "Casablanca", "Casablanca", "N/A", "casablanca@cosone.ma", ""),
            createCentre("ONEE - Branche Electricite - Direction Regionale Distribution RABAT", "Place Pietrie, Ndeg6 BIS - Avenue Patrice Lumumba", "Rabat 10000", "05377-17755", "rabat@cosone.ma", ""),
            createCentre("Office National de l'electricite ONEE-BE - Sidi Allal", "2F5C+PP3, Sidi Allal el Bahraoui", "Sidi Allal el Bahraoui", "05375-20125", "sidiallal@cosone.ma", ""),
            createCentre("Office National De L'electricite Direction Regionale Distribution Tanger", "Q5GR+8QC", "Tanger 90060", "05399-45958", "tanger@cosone.ma", ""),
            createCentre("Office National de l'Electricite - Mechra Bel Ksiri", "Av. Ouazzane", "Mechra Bel Ksiri", "0664-724750", "mechrabk@cosone.ma", ""),
            createCentre("Office national de l'electricite et de l'eau potable - Meknes", "VFXG+Q4R, R718", "Meknes", "N/A", "meknes@cosone.ma", ""),
            createCentre("Office National d'Electricite et de L'Eau Potable - Branche Electricite Meknes", "VFV4+PHV, Bd Moulay Youssef", "Meknes", "05355-25657", "meknes-be@cosone.ma", ""),
            createCentre("l'office National De L'electricite - Khenichet", "C8P7+GH5", "Khenichet", "N/A", "khenichet@cosone.ma", ""),
            createCentre("Office National d'Electricite - Bouskoura", "C8VX+GQ6", "Bouskoura", "N/A", "bouskoura@cosone.ma", ""),
            createCentre("Autorite Nationale de Regulation de l'Electricite (ANRE)", "Espace les Patios, Bat. 2, 5eme etage, Av. Annakhil", "Rabat", "05375-63183", "anre@cosone.ma", ""),
            createCentre("L'Office National de l'Electricite - Amizmiz", "6QG5+23V", "Amizmiz", "05244-54020", "amizmiz@cosone.ma", ""),
            createCentre("Office national de l'electricite et de l'eau potable - Jemaa Feddalat", "HM9M+WH", "Jemaa Feddalat", "N/A", "jemaa@cosone.ma", ""),
            createCentre("Office National De L'electricite - Oualidia", "Oualidia", "Oualidia", "05233-66487", "oualidia@cosone.ma", ""),
            createCentre("ONEE - l'Office National de l'Electricite BIR JDID", "9X9X+PG6", "Bir Jdid", "N/A", "birjdid@cosone.ma", ""),
            createCentre("Office National d'electricite - Casablanca 2", "88 RUE 8", "Casablanca 20000", "05222-23330", "casablanca2@cosone.ma", ""),
            createCentre("Office National de l'Electricite et de l'Eau Potable - Branche Eau - Fes", "88 Rue du Soudan", "Fes 30000", "N/A", "fes-eau@cosone.ma", ""),
            createCentre("Office National de L'Electricite et de L'Eau Potable - Agadir", "CC68+3JM, Rue Chair al-Hamra Mohammed ben Brahim", "Agadir 80000", "05282-20719", "agadir@cosone.ma", ""),
            createCentre("Office National de l'Electricite ONE Sidi Moumen Azhar", "JG36+W63", "Casablanca", "N/A", "sidimoumen@cosone.ma", ""),
            createCentre("Office national de l'electricite ONEE - Bni Boufrah", "Bni Boufrah", "Bni Boufrah", "05399-83179", "bniboufrah@cosone.ma", "office national de l'electricite et de l'eau potable ONEE"),
            createCentre("Office Nationale de l'Electricite - Bhalil", "V44G+8JP", "Bhalil", "N/A", "bhalil@cosone.ma", ""),
            createCentre("Office national de l'electricite et de l'eau potable - Jerada", "8R7R+JRJ", "Jerada", "N/A", "jerada@cosone.ma", ""),
            createCentre("Office national de l'electricite et de l'eau portable - Beni Mellal", "8MW2+787", "Beni Mellal", "0691-174912", "benimellal@cosone.ma", ""),
            createCentre("Office national d'electricite ONE - Bni Bouayach", "4523+5HQ", "Bni Bouayach", "N/A", "bnibouayach@cosone.ma", ""),
            createCentre("office national d'electricite - Ain Taoujdate", "WQQM+FHM", "Ain Taoujdate", "05354-40007", "aintaoujdate@cosone.ma", ""),
            createCentre("Office National de l'Electricite et de l'Eau potable - Casablanca 3", "JG36+V45", "Casablanca", "N/A", "casablanca3@cosone.ma", ""),
            createCentre("Office national d'electricite et de l'eau - Dar Gueddari", "CWC4+GJ", "Dar Gueddari", "N/A", "dargueddari@cosone.ma", ""),
            createCentre("ONE, Office National de l'Electricite - Issaguen", "WC9J+5Q3", "Issaguen", "N/A", "issaguen@cosone.ma", ""),
            createCentre("Office National d'Electricite - Bab Berred", "Route 2", "Bab Berred", "N/A", "babberred@cosone.ma", ""),
            createCentre("Office National d'Electricite/Direction Transport Region Nord Tanger", "Residence Ennassr ndeg5 Avenue Zelouaga 1er etage", "Tanger", "05393-23887", "tanger-nord@cosone.ma", ""),
            createCentre("Office National de l'Electricite et de l'Eau potable - Skhour Rhamna", "Ndeg, Centre, 60 Lotissement Bouchetta Serghini", "Skhour Rhamna 43402", "05243-66877", "skhourrhamna@cosone.ma", ""),
            createCentre("Office National d'Eau et d'Electricite - Chefchaouen", "5PG9+FW9", "Chefchaouen", "N/A", "chefchaouen@cosone.ma", ""),
            createCentre("OFFICE NATIONAL DE L'ELECTRICITE ET DE L'E POTABLE - BRANCHE EAU - Zagora", "8595+X3M, Unnamed Road", "Zagora", "N/A", "zagora@cosone.ma", ""),
            createCentre("Office National de l'electricite - Aglou", "Q682+J2P", "Bou Soun", "N/A", "aglou@cosone.ma", ""),
            createCentre("Office National de l'Electricite et de l'Eau Potable - Ait Ourir", "H962+9M3", "Ait Ourir", "05244-80060", "aitourir@cosone.ma", ""),
            createCentre("Office National de l'electricite et de l'eau potable - Rabat DRC", "2589+XMQ", "Rabat", "N/A", "rabat-drc@cosone.ma", ""),
            createCentre("Office National De L'electricite Direction Provainciale Distribution Tanger 2", "rez chaussee, Rue ibn toumart 43 imm azhar b, 43 Rue Ibn Toumert", "Tanger", "N/A", "tanger2@cosone.ma", ""),
            createCentre("ONE OFFICE NATIONAL DE L'ELECTRICITE - Mirleft", "HXH9+H74", "Mirleft", "05287-19091", "mirleft@cosone.ma", ""),
            createCentre("Siege ONEE - Branche electricite Casablanca", "No. 65 Rue Othman Ben Affane Ex Lafuente Station De Traitement", "Casablanca 20000", "05226-68298", "siege@cosone.ma", ""),
            createCentre("Office National d'Electricite - Al Hoceima", "Ave Abdelkrim El Khattabi", "Al Hoceima", "N/A", "alhoceima@cosone.ma", ""),
            createCentre("Office National d'Electricite - Safi", "8Q2F+856", "Safi", "N/A", "safi@cosone.ma", ""),
            createCentre("ONEE BRANCHE EAU DIRECTION REGIONALE DE L'OUEST - Kenitra", "7C32+RV9 l'Office Nationale de l'Eau Potable", "Kenitra", "N/A", "kenitra@cosone.ma", ""),
            createCentre("Office National de l'Electricite et de l'Eau Potable - Machraa Ben Abbou", "Centre de Mechraa, Barrage d'Imfout", "Machraa Ben Abbou", "05237-22059", "machraa@cosone.ma", ""),
            createCentre("Office National de l'Electricite - Oujda", "P33J+J78", "Oujda", "N/A", "oujda@cosone.ma", ""),
            createCentre("Office National de l'Eau et de l'Electricite - El Menzel", "RFP4+477, P5045", "El Menzel", "N/A", "elmenzel@cosone.ma", ""),
            createCentre("Office national d'electricite et de l'eau potable - Sidi Rahal", "MG3F+4GP, Unnamed Road", "Sidi Rahal", "05242-40007", "sidirahal@cosone.ma", ""),
            createCentre("Office national de l'electricite et de l'eau portable - Rhafsai", "J3GR+RGJ", "Rhafsai", "080-2007777", "rhafsai@cosone.ma", ""),
            createCentre("Office National de l'Electricite et de l'Eau Potable - Oued Nachef Oujda", "M386+FMF, Boulevard Faycal Ibn Abdul Aziz", "Oujda", "05366-85280", "oujda-ouednachef@cosone.ma", ""),
            createCentre("Office National De L'electricite Et De L'eau Potable - Ouarzazate", "W3HM+Q7G", "Ouarzazate 45000", "080-2007777", "ouarzazate@cosone.ma", ""),
            createCentre("Bureau Office nationale de l'electricite et de l'eau potable - Tazenakht", "HQHW+378", "Tazenakht", "N/A", "tazenakht@cosone.ma", ""),
            createCentre("ONEE Office National d'Electricite et de l'Eau potable - Oued Zem", "l'Office National de l'Electricite, Rue du Lac", "Oued Zem", "N/A", "ouedzem@cosone.ma", ""),
            createCentre("Office national de l'electricite et l'eau potable ONEP - Tinejdad", "GX7H+3HF", "Tinejdad", "N/A", "tinejdad@cosone.ma", ""),
            createCentre("Office Nationale de l'Electricite et de l'Eau Potable - Errachidia", "WHHC+WGQ", "Errachidia", "05355-72098", "errachidia@cosone.ma", ""),
            createCentre("ONEE Office National de l'Electricite et de l'Eau Potable - Branche EAU Al Hoceima", "63V6+6V", "Al Hoceima", "0612-569545", "alhoceima-eau@cosone.ma", ""),
            createCentre("Office nationale de l'electricite et de l'eau potable - Ifrane", "GVFR+CC7, Avenue la Princesse Lalla Amina", "Ifrane", "N/A", "ifrane@cosone.ma", ""),
            createCentre("Office National de l'Electricite et de l'Eau Potable - Asilah", "FX89+7WW", "Asilah", "N/A", "asilah@cosone.ma", ""),
            createCentre("Office National de l'Electricite et de l'Eau potable ONEE - Tamaris", "G6M4+HM4", "Tamaris", "05222-90210", "tamaris@cosone.ma", ""),
            createCentre("Office national d'electricite - Aghbala", "F9H4+HMJ, Boulevard H2", "Aghbala", "05235-10183", "aghbala@cosone.ma", ""),
            createCentre("Office National d'Electricite - Afourer", "6F58+GJC", "Afourer", "N/A", "afourer@cosone.ma", ""),
            createCentre("O.N.E.E.P Office National de l'electricite et Eau Potable - Sabaa Aiyoun", "WJ2C+W5R, P7040", "Sabaa Aiyoun", "N/A", "sabaa@cosone.ma", ""),
            createCentre("Office National Electricite Direction Provinciale Berkane", "WMG7+CRG, shraa sydy mHmd", "Berkane", "05366-13917", "berkane@cosone.ma", ""),
            createCentre("Office National de l'Electricite - Berkane 2", "WMHP+HC2, Al Houdaybia", "Berkane", "05366-16748", "berkane2@cosone.ma", ""),
            createCentre("Office National d'Electricite - Azrou", "CQMG+36F, P24", "Azrou", "N/A", "azrou@cosone.ma", ""),
            createCentre("Office National de l'Electricite - Poste 60/22KV Khemisset", "KM 4,6 Route Meknes", "Khemisset", "N/A", "khemisset@cosone.ma", ""),
            createCentre("ONE OFFICE NATIONAL D'ELECTRICITE - Taza", "Intersection des avenue Alal Fassi et, Ave Mohammed V", "Taza", "05356-73035", "taza@cosone.ma", ""),
            createCentre("Office National de l'electricite et de l'eau potable ONEEP - Boujniba", "W62G+2VH", "Boujniba", "N/A", "boujniba@cosone.ma", ""),
            createCentre("Office national de l'electricite et de l'eau potable ONEP - Menzla", "Menzla P 4604 menzla, 90000", "Menzla", "0651-134174", "menzla@cosone.ma", ""),
            createCentre("Office national d'electricite et de l'eau potable - Tetouan", "VGG3+887", "Tetouan", "N/A", "tetouan@cosone.ma", "")
        );

        // Sauvegarder tous les centres
        centreRepository.saveAll(centres);
        
        System.out.println("✓ " + centres.size() + " centres ont été chargés avec succès dans la base de données.");
    }

    private Centre createCentre(String nom, String adresse, String ville, String telephone, String email, String description) {
        Centre centre = new Centre();
        centre.setNom(nom);
        centre.setAdresse(adresse);
        centre.setVille(ville);
        centre.setTelephone(telephone);
        centre.setEmail(email);
        centre.setDescription(description);
        centre.setActif(true);
        return centre;
    }
}

