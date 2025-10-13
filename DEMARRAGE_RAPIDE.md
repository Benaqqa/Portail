# 🚀 Démarrage rapide - Application COSONE

## ✅ Problème résolu !

Le problème était que l'application ne démarrait pas à cause d'une dépendance dupliquée dans le `pom.xml`.

### 🔧 Corrections apportées

1. **Suppression de la dépendance dupliquée**
   - `spring-boot-starter-data-jpa` était déclarée deux fois
   - ✅ Supprimée la duplication

2. **Utilisation du wrapper Maven**
   - ✅ `./mvnw spring-boot:run` au lieu de `mvn spring-boot:run`

---

## 🚀 Comment démarrer l'application

### Méthode 1 : Wrapper Maven (Recommandée)

```bash
# Dans le répertoire COSONE
./mvnw spring-boot:run
```

### Méthode 2 : Maven standard

```bash
# Après avoir corrigé les dépendances
mvn clean compile
mvn spring-boot:run
```

### Méthode 3 : Compilation puis exécution

```bash
mvn clean compile
java -jar target/COSONE-0.0.1-SNAPSHOT.jar
```

---

## 📋 Vérifications après démarrage

### 1. Logs de démarrage

Vous devriez voir :
```
Started CosoneApplication in X.XXX seconds (JVM running for X.XXX)
```

### 2. URL d'accès

- **Page d'accueil :** http://localhost:8080/
- **Page landing :** http://localhost:8080/landing
- **Page home :** http://localhost:8080/home

### 3. Test des centres

1. Allez sur http://localhost:8080/landing
2. Cliquez sur "Nos centres" dans le menu
3. ✅ Vous devriez voir **69 centres** au lieu de 0

---

## 🎯 Fonctionnalités à tester

### Navigation
- [ ] Menu latéral fonctionne
- [ ] Clic sur "Qui sommes-nous" → Section s'affiche
- [ ] Clic sur "Nos activités" → Section s'affiche
- [ ] Clic sur "Nos centres" → Section s'affiche

### Centres
- [ ] "69 Centres disponibles" s'affiche
- [ ] Cartes des centres sont visibles
- [ ] Images des centres (ou icônes)
- [ ] Téléphones cliquables
- [ ] Sites web cliquables
- [ ] Évaluations avec étoiles

### Responsive
- [ ] Fonctionne sur desktop
- [ ] Fonctionne sur tablette
- [ ] Fonctionne sur mobile

---

## 🐛 Problèmes courants résolus

### Erreur : "No plugin found for prefix 'spring-boot'"
**Cause :** Maven ne trouve pas le plugin  
**Solution :** ✅ Utiliser `./mvnw spring-boot:run`

### Erreur : "duplicate declaration of version"
**Cause :** Dépendance dupliquée dans pom.xml  
**Solution :** ✅ Supprimée la duplication

### Erreur : "0 Centres disponibles"
**Cause :** Application ne démarrait pas  
**Solution :** ✅ Application démarre maintenant

---

## 📊 Résultats attendus

Après démarrage réussi :

| Élément | Résultat attendu |
|---------|------------------|
| **Application** | Démarrée sur http://localhost:8080 |
| **Navigation** | Menu latéral fonctionnel |
| **Centres** | 69 centres affichés |
| **Images** | Photos des centres ou icônes |
| **Liens** | Téléphones et sites web cliquables |
| **Responsive** | Adapté à tous les écrans |

---

## 🔄 Commandes utiles

### Redémarrer l'application
```bash
# Arrêter (Ctrl+C)
./mvnw spring-boot:run
```

### Nettoyer et recompiler
```bash
./mvnw clean compile
```

### Vérifier les dépendances
```bash
./mvnw dependency:tree
```

### Tests
```bash
./mvnw test
```

---

## 📞 Support

Si l'application ne démarre toujours pas :

1. **Vérifiez Java** : `java -version` (doit être Java 17+)
2. **Vérifiez Maven** : `./mvnw --version`
3. **Videz le cache** : `./mvnw clean`
4. **Regardez les logs** : Cherchez les erreurs en rouge

---

## ✅ Checklist de validation

- [ ] Application démarre sans erreur
- [ ] http://localhost:8080/landing s'ouvre
- [ ] Menu de navigation fonctionne
- [ ] Section "Nos centres" affiche 69 centres
- [ ] Cartes des centres sont visibles
- [ ] Pas d'erreur dans la console navigateur
- [ ] Design responsive fonctionne

---

**Date** : 13 octobre 2025  
**Problème** : Application ne démarrait pas  
**Cause** : Dépendance dupliquée + commande Maven  
**Solution** : pom.xml corrigé + wrapper Maven  
**Statut** : ✅ **RÉSOLU**

