# 🔍 Diagnostic - Centres non affichés

## 🚨 Problème identifié

L'image montre que la page affiche **"0 Centres disponibles"** et le message **"Aucun centre n'est disponible pour le moment"**.

## ✅ Vérifications effectuées

### 1. Fichier CSV existe ✅
- **Emplacement :** `src/main/resources/static/csv/output.csv`
- **Taille :** 12,788 octets
- **Date :** 25/08/2025

### 2. Service Java ✅
- `CentresCsvService.java` existe
- Chemin configuré : `"static/csv/output.csv"`

### 3. Controller ✅
- `HomeController.java` charge les centres
- Variable `centres` passée au modèle

## 🔧 Solutions à tester

### Solution 1 : Vérifier les logs

Ouvrez la console où tourne `mvn spring-boot:run` et cherchez :

```
✅ Bon : Aucune erreur
❌ Mauvais : "Error reading CSV file: ..."
```

### Solution 2 : Tester le service manuellement

Ajoutez temporairement ce code dans `HomeController.java` :

```java
@GetMapping("/test-centres")
public String testCentres(Model model) {
    List<Map<String, Object>> centres = centresCsvService.loadCentresFromCsv();
    System.out.println("Nombre de centres chargés : " + (centres != null ? centres.size() : 0));
    if (centres != null && !centres.isEmpty()) {
        System.out.println("Premier centre : " + centres.get(0));
    }
    return "redirect:/landing";
}
```

Puis visitez : http://localhost:8080/test-centres

### Solution 3 : Vérifier le format CSV

Ouvrez `output.csv` et vérifiez :
- ✅ Première ligne : `name,description,rating,website,phone,featured_image,address`
- ✅ Pas de caractères spéciaux problématiques
- ✅ Virgules correctement placées

### Solution 4 : Forcer le rechargement

```bash
# Arrêter l'application (Ctrl+C)
mvn clean
mvn spring-boot:run
```

## 🔍 Tests de diagnostic

### Test 1 : Vérifier la console navigateur

Ouvrez F12 → Console et cherchez :
```
✅ Bon : Pas d'erreur JavaScript
❌ Mauvais : Erreurs en rouge
```

### Test 2 : Vérifier les variables Thymeleaf

Ajoutez temporairement dans `landing.html` :

```html
<!-- Debug temporaire -->
<p>Debug: centres = ${centres}</p>
<p>Debug: centres.size = ${centres != null ? centres.size() : 'null'}</p>
```

### Test 3 : Test manuel du service

Créez un endpoint de test :

```java
@GetMapping("/debug-centres")
@ResponseBody
public String debugCentres() {
    List<Map<String, Object>> centres = centresCsvService.loadCentresFromCsv();
    return "Centres chargés : " + (centres != null ? centres.size() : 0);
}
```

Puis visitez : http://localhost:8080/debug-centres

## 🎯 Solutions probables

### Solution A : Chemin du fichier

Le chemin pourrait être incorrect. Essayez :

```java
private static final String CSV_FILE_PATH = "csv/output.csv";
```

### Solution B : Encodage du fichier

Le fichier CSV pourrait avoir un mauvais encodage :
1. Ouvrez `output.csv` dans un éditeur
2. Sauvegardez en UTF-8
3. Redémarrez l'application

### Solution C : Format CSV

Le fichier pourrait être mal formaté :
1. Vérifiez qu'il n'y a pas de guillemets mal fermés
2. Vérifiez que chaque ligne a le bon nombre de colonnes
3. Vérifiez qu'il n'y a pas de caractères spéciaux

### Solution D : Exception silencieuse

Le service pourrait lever une exception silencieuse. Ajoutez des logs :

```java
public List<Map<String, Object>> loadCentresFromCsv() {
    List<Map<String, Object>> centres = new ArrayList<>();
    System.out.println("Tentative de chargement du CSV...");
    
    try {
        ClassPathResource resource = new ClassPathResource(CSV_FILE_PATH);
        System.out.println("Fichier trouvé : " + resource.exists());
        
        // ... reste du code ...
        
        System.out.println("Centres chargés : " + centres.size());
    } catch (IOException e) {
        System.err.println("Erreur lors du chargement : " + e.getMessage());
        e.printStackTrace();
    }
    
    return centres;
}
```

## 🚀 Solution rapide

Si vous voulez une solution immédiate, ajoutez ce code temporaire dans `HomeController.java` :

```java
@GetMapping("/landing")
public String landing(Model model) {
    // Code existant...
    
    // SOLUTION TEMPORAIRE : Forcer des centres de test
    List<Map<String, Object>> centres = centresCsvService.loadCentresFromCsv();
    if (centres == null || centres.isEmpty()) {
        centres = createTestCentres();
        System.out.println("Utilisation de centres de test");
    }
    
    model.addAttribute("centres", centres);
    return "landing";
}

private List<Map<String, Object>> createTestCentres() {
    List<Map<String, Object>> testCentres = new ArrayList<>();
    
    Map<String, Object> centre1 = new HashMap<>();
    centre1.put("nom", "Centre Test 1");
    centre1.put("adresse", "123 Rue Test, Rabat");
    centre1.put("ville", "Rabat");
    centre1.put("telephone", "0522-111111");
    centre1.put("rating", 4.5);
    centre1.put("actif", true);
    testCentres.add(centre1);
    
    Map<String, Object> centre2 = new HashMap<>();
    centre2.put("nom", "Centre Test 2");
    centre2.put("adresse", "456 Avenue Test, Casablanca");
    centre2.put("ville", "Casablanca");
    centre2.put("telephone", "0522-222222");
    centre2.put("rating", 4.0);
    centre2.put("actif", true);
    testCentres.add(centre2);
    
    return testCentres;
}
```

## 📋 Checklist de diagnostic

- [ ] Application redémarrée avec `mvn clean spring-boot:run`
- [ ] Fichier CSV existe dans `src/main/resources/static/csv/output.csv`
- [ ] Aucune erreur dans les logs Spring Boot
- [ ] Console navigateur sans erreur (F12)
- [ ] Test du service manuel effectué
- [ ] Format CSV vérifié
- [ ] Encodage UTF-8 confirmé

## 🎯 Résultat attendu

Après correction, la page devrait afficher :
- **69 Centres disponibles** (au lieu de 0)
- **Grille de cartes** avec les centres de l'ONEE
- **Informations complètes** pour chaque centre

---

**Prochaine étape :** Vérifiez les logs de l'application et partagez-moi les erreurs éventuelles !
