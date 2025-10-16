import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import reservationService from '../services/reservationService'
import './ReservationConfirmation.css'

function ReservationConfirmation() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [reservation, setReservation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [paymentData, setPaymentData] = useState({
    methodePaiement: '',
    referencePaiement: ''
  })

  useEffect(() => {
    loadReservation()
  }, [id])

  const loadReservation = async () => {
    try {
      setLoading(true)
      const data = await reservationService.getReservationDetails(id)
      setReservation(data)
    } catch (err) {
      setError('Erreur lors du chargement de la réservation')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setPaymentData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!paymentData.methodePaiement) {
      setError('Veuillez sélectionner une méthode de paiement')
      return
    }

    try {
      setSubmitting(true)
      setError('')
      await reservationService.confirmPayment(id, paymentData)
      navigate('/user/history')
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la confirmation du paiement')
    } finally {
      setSubmitting(false)
    }
  }

  const getPaymentInstructions = () => {
    switch (paymentData.methodePaiement) {
      case 'VIREMENT':
        return {
          title: 'Virement bancaire',
          icon: 'fa-university',
          instructions: [
            'Effectuez un virement bancaire vers le compte suivant :',
            'Banque : Attijariwafa Bank',
            'RIB : 007 810 0000123456789012 34',
            'Bénéficiaire : COSONE - Office National de l\'Électricité',
            'Mentionnez le numéro de réservation dans la référence'
          ]
        }
      case 'CHEQUE':
        return {
          title: 'Paiement par chèque',
          icon: 'fa-money-check',
          instructions: [
            'Établissez un chèque à l\'ordre de "COSONE"',
            'Montant : ' + (reservation?.prixTotal || 0) + ' DH',
            'Envoyez-le à l\'adresse suivante :',
            'COSONE - 65 Rue Othman Ben Affane, Casablanca 20000',
            'Indiquez le numéro de réservation au dos du chèque'
          ]
        }
      case 'ESPECES':
        return {
          title: 'Paiement en espèces',
          icon: 'fa-money-bill-wave',
          instructions: [
            'Présentez-vous au centre avec le montant en espèces',
            'Montant à payer : ' + (reservation?.prixTotal || 0) + ' DH',
            'Munissez-vous de votre pièce d\'identité',
            'Un reçu vous sera délivré sur place'
          ]
        }
      case 'MOBILE_MONEY':
        return {
          title: 'Mobile Money',
          icon: 'fa-mobile-alt',
          instructions: [
            'Envoyez le paiement via votre application mobile :',
            'Numéro de téléphone : 0522-668298',
            'Montant : ' + (reservation?.prixTotal || 0) + ' DH',
            'Indiquez le numéro de réservation en commentaire',
            'Conservez le SMS de confirmation comme référence'
          ]
        }
      case 'AUTRE':
        return {
          title: 'Autre méthode',
          icon: 'fa-ellipsis-h',
          instructions: [
            'Contactez-nous pour convenir d\'une autre méthode de paiement',
            'Téléphone : 0522-668298',
            'Email : contact@cosone.ma',
            'Horaires : Lundi - Vendredi, 8h30 - 16h30'
          ]
        }
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="confirmation-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement...</p>
        </div>
      </div>
    )
  }

  if (error && !reservation) {
    return (
      <div className="confirmation-page">
        <div className="error-container">
          <i className="fas fa-exclamation-circle"></i>
          <h3>{error}</h3>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/user/history')} className="btn-primary">
              <i className="fas fa-arrow-left"></i> Retour à l'historique
            </button>
            <button onClick={() => navigate('/home')} className="btn-secondary">
              <i className="fas fa-home"></i> Accueil
            </button>
          </div>
        </div>
      </div>
    )
  }

  const instructions = getPaymentInstructions()

  return (
    <div className="confirmation-page">
      <div className="confirmation-container">
        <div className="confirmation-header">
          <i className="fas fa-check-circle success-icon"></i>
          <h1>Réservation Créée avec Succès !</h1>
          <p>Numéro de réservation : <strong>#{reservation?.id}</strong></p>
        </div>

        {/* Résumé de la réservation */}
        <div className="reservation-summary">
          <h2><i className="fas fa-info-circle"></i> Résumé de votre réservation</h2>
          <div className="summary-grid">
            <div className="summary-item">
              <i className="fas fa-building"></i>
              <div>
                <strong>Centre</strong>
                <p>{reservation?.centre?.nom}</p>
              </div>
            </div>
            <div className="summary-item">
              <i className="fas fa-home"></i>
              <div>
                <strong>Logement</strong>
                <p>{reservation?.typeLogement?.nom}</p>
              </div>
            </div>
            <div className="summary-item">
              <i className="fas fa-calendar"></i>
              <div>
                <strong>Période</strong>
                <p>
                  {new Date(reservation?.dateDebut).toLocaleDateString('fr-FR')}
                  {' - '}
                  {new Date(reservation?.dateFin).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
            <div className="summary-item">
              <i className="fas fa-users"></i>
              <div>
                <strong>Voyageurs</strong>
                <p>
                  {reservation?.nombreAdultes} adulte(s)
                  {reservation?.nombreEnfants > 0 && `, ${reservation.nombreEnfants} enfant(s)`}
                </p>
              </div>
            </div>
          </div>
          <div className="total-price">
            <span>Prix total :</span>
            <span className="price">{reservation?.prixTotal || 0} DH</span>
          </div>
        </div>

        {/* Formulaire de paiement */}
        <div className="payment-section">
          <h2><i className="fas fa-credit-card"></i> Finaliser le paiement</h2>
          
          {error && (
            <div className="alert alert-error">
              <i className="fas fa-exclamation-circle"></i> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="payment-form">
            <div className="form-group">
              <label htmlFor="methodePaiement">
                Méthode de paiement *
              </label>
              <select
                id="methodePaiement"
                name="methodePaiement"
                value={paymentData.methodePaiement}
                onChange={handleChange}
                required
              >
                <option value="">Sélectionnez une méthode</option>
                <option value="VIREMENT">Virement bancaire</option>
                <option value="CHEQUE">Chèque</option>
                <option value="ESPECES">Espèces (au centre)</option>
                <option value="MOBILE_MONEY">Mobile Money</option>
                <option value="AUTRE">Autre méthode</option>
              </select>
            </div>

            {instructions && (
              <div className="payment-instructions">
                <div className="instructions-header">
                  <i className={`fas ${instructions.icon}`}></i>
                  <h3>{instructions.title}</h3>
                </div>
                <ul className="instructions-list">
                  {instructions.instructions.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </ul>
              </div>
            )}

            {paymentData.methodePaiement && (
              <div className="form-group">
                <label htmlFor="referencePaiement">
                  Référence ou Numéro de Transaction *
                </label>
                <input
                  type="text"
                  id="referencePaiement"
                  name="referencePaiement"
                  value={paymentData.referencePaiement}
                  onChange={handleChange}
                  placeholder="Entrez le numéro de référence de votre paiement"
                  required
                />
                <small>
                  Exemple: Numéro de virement, numéro de chèque, référence Mobile Money, etc.
                </small>
              </div>
            )}

            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate(`/reservation/details/${id}`)}
                className="btn-secondary"
              >
                <i className="fas fa-arrow-left"></i> Voir les détails
              </button>
              <button
                type="button"
                onClick={() => navigate('/home')}
                className="btn-secondary"
              >
                <i className="fas fa-home"></i> Accueil
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={submitting}
              >
                {submitting ? 'Confirmation en cours...' : 'Confirmer le paiement'}
                <i className="fas fa-check"></i>
              </button>
            </div>
          </form>

          <div className="payment-note">
            <i className="fas fa-info-circle"></i>
            <p>
              Votre réservation sera confirmée une fois que nous aurons vérifié votre paiement.
              Vous recevrez un email de confirmation dans les 24-48 heures.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReservationConfirmation
