# Guide d'Intégration Stripe - COSONE

## 📋 Vue d'ensemble

L'intégration Stripe permet aux utilisateurs de payer leurs réservations en ligne de manière sécurisée avec leur carte bancaire.

## ✅ Ce qui a été configuré

### 1. Dépendances
- ✅ Ajout de `stripe-java` version 25.0.0 dans `pom.xml`

### 2. Configuration
- ✅ Clés API Stripe configurées dans `application.properties`
- ✅ URLs de redirection (succès/annulation)

### 3. Services
- ✅ `StripeService` : Gestion des sessions de paiement Stripe

### 4. Contrôleurs
- ✅ `StripePaymentController` : Gestion des routes de paiement
  - `POST /payment/create-checkout-session/{reservationId}` - Créer une session Stripe
  - `GET /payment/success` - Page de succès après paiement
  - `GET /payment/cancel` - Page d'annulation
  - `POST /payment/webhook` - Webhook Stripe (à compléter en production)

### 5. Templates
- ✅ `reservation-confirmation.html` - Modifié avec bouton Stripe
- ✅ `payment-success.html` - Page de confirmation de paiement
- ✅ `payment-cancel.html` - Page d'annulation de paiement

## 🔧 Configuration Requise

### Étape 1 : Créer un compte Stripe

1. Allez sur [https://stripe.com](https://stripe.com)
2. Créez un compte (gratuit)
3. Activez le mode TEST

### Étape 2 : Récupérer vos clés API

1. Connectez-vous à [Stripe Dashboard](https://dashboard.stripe.com)
2. Allez dans **Developers** > **API keys**
3. Copiez vos clés de test :
   - **Publishable key** (commence par `pk_test_`)
   - **Secret key** (commence par `sk_test_`)

### Étape 3 : Configurer application.properties

Remplacez les clés dans `src/main/resources/application.properties` :

```properties
# Stripe Configuration (TEST MODE)
stripe.api.key=sk_test_VOTRE_CLE_SECRETE_ICI
stripe.publishable.key=pk_test_VOTRE_CLE_PUBLIQUE_ICI
stripe.webhook.secret=whsec_VOTRE_SECRET_WEBHOOK_ICI
stripe.success.url=http://localhost:8080/payment/success
stripe.cancel.url=http://localhost:8080/payment/cancel
```

### Étape 4 : Activer le Dirham Marocain (MAD)

1. Dans le Dashboard Stripe, allez dans **Settings** > **Payment methods**
2. Activez les méthodes de paiement pour le Maroc
3. Le code devise `MAD` est déjà configuré dans le code

## 🧪 Tests

### Cartes bancaires de test

Stripe fournit des cartes de test. **NE JAMAIS utiliser de vraies cartes en mode test !**

| Carte | Numéro | Résultat |
|-------|--------|----------|
| **Visa (succès)** | `4242 4242 4242 4242` | ✅ Paiement réussi |
| **Visa (décliné)** | `4000 0000 0000 0002` | ❌ Carte déclinée |
| **Visa (3D Secure)** | `4000 0027 6000 3184` | 🔐 Authentification requise |

- **Date d'expiration** : N'importe quelle date future (ex: 12/25)
- **CVV** : N'importe quel code 3 chiffres (ex: 123)
- **Code postal** : N'importe lequel (ex: 12345)

### Scénario de test complet

1. **Créer une réservation** :
   ```
   http://localhost:8080/reservation
   ```

2. **Confirmer et accéder au paiement** :
   - Une fois la réservation créée, vous serez redirigé vers la page de confirmation
   - Cliquez sur "Payer Maintenant avec Stripe"

3. **Payer avec une carte de test** :
   - Vous serez redirigé vers la page Stripe Checkout
   - Entrez : `4242 4242 4242 4242`
   - Date : `12/25`
   - CVV : `123`
   - Cliquez sur "Payer"

4. **Vérifier le succès** :
   - Vous serez redirigé vers `/payment/success`
   - La réservation sera marquée comme CONFIRMEE
   - Vérifiez dans la base de données

## 📊 Vérification dans le Dashboard Stripe

1. Connectez-vous à [Stripe Dashboard](https://dashboard.stripe.com/test/payments)
2. Allez dans **Payments**
3. Vous verrez tous vos paiements de test

## 🔒 Sécurité

### En mode TEST (actuel)
- ✅ Toutes les transactions sont fictives
- ✅ Aucun argent réel n'est transféré
- ✅ Les cartes de test ne fonctionnent qu'en mode test

### Pour passer en PRODUCTION
1. Complétez le processus de vérification Stripe
2. Activez votre compte
3. Remplacez les clés de test par les clés de production (commencent par `pk_live_` et `sk_live_`)
4. **IMPORTANT** : Implémentez la validation des webhooks pour plus de sécurité

## 🚀 Fonctionnalités

### Actuellement implémentées
- ✅ Paiement par carte bancaire via Stripe Checkout
- ✅ Support du Dirham Marocain (MAD)
- ✅ Redirection automatique après paiement
- ✅ Mise à jour automatique du statut de réservation
- ✅ Stockage de la référence de paiement Stripe
- ✅ Interface moderne et responsive
- ✅ Option de paiement manuel (backup)

### À améliorer pour la production
- ⚠️ Validation des webhooks Stripe (signature)
- ⚠️ Emails de confirmation automatiques
- ⚠️ Gestion des remboursements
- ⚠️ Logs détaillés des transactions
- ⚠️ Retry logic en cas d'échec

## 📱 Flux de Paiement

```
Utilisateur crée réservation
         ↓
Statut: EN_ATTENTE_PAIEMENT
         ↓
Clique "Payer avec Stripe"
         ↓
Redirection vers Stripe Checkout
         ↓
Utilisateur entre ses infos de carte
         ↓
    [Paiement réussi]  ←→  [Paiement échoué/annulé]
         ↓                           ↓
  /payment/success            /payment/cancel
         ↓                           ↓
Statut: CONFIRMEE           Reste EN_ATTENTE_PAIEMENT
         ↓                           ↓
Référence: STRIPE_xxx       Peut réessayer
```

## 🛠️ Dépannage

### Erreur "Invalid API Key"
- Vérifiez que vous avez copié la clé correctement
- Assurez-vous d'utiliser la clé de TEST (commence par `sk_test_`)

### Erreur "Currency not supported"
- Le MAD doit être activé dans votre compte Stripe
- Allez dans Settings > Payment methods settings

### La redirection ne fonctionne pas
- Vérifiez que les URLs dans `application.properties` sont correctes
- Assurez-vous que le serveur tourne sur `localhost:8080`

### Webhook ne fonctionne pas
- En mode test local, les webhooks ne sont pas nécessaires
- Le paiement est confirmé lors de la redirection vers `/payment/success`

## 📞 Support

- **Documentation Stripe** : [https://stripe.com/docs](https://stripe.com/docs)
- **API Reference** : [https://stripe.com/docs/api](https://stripe.com/docs/api)
- **Support Stripe** : [https://support.stripe.com](https://support.stripe.com)

## 🎯 Prochaines Étapes Recommandées

1. **Tester tous les scénarios** :
   - Paiement réussi
   - Paiement échoué
   - Annulation
   
2. **Ajouter des logs** pour le debugging

3. **Implémenter les webhooks** pour une sécurité renforcée

4. **Ajouter l'envoi d'emails** de confirmation

5. **Configurer les remboursements** si nécessaire

## ⚡ Notes Importantes

- **NE JAMAIS** committer vos vraies clés API dans Git
- Utilisez des variables d'environnement en production
- Testez toujours en mode TEST avant de passer en LIVE
- Le MAD (Dirham Marocain) est maintenant supporté par Stripe
- Stripe prend des frais de transaction (vérifiez les tarifs pour le Maroc)

---

**Intégration réalisée avec succès ! 🎉**

Pour toute question, consultez la documentation Stripe ou contactez leur support.

