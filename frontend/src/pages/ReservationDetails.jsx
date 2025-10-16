import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import reservationService from '../services/reservationService'
import './ReservationDetails.css'

function ReservationDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [reservation, setReservation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadReservation()
  }, [id])

  const loadReservation = async () => {
    try {
      setLoading(true)
      const data = await reservationService.getReservationDetails(id)
      setReservation(data)
    } catch (err) {
      setError('Erreur lors du chargement des détails de la réservation')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelReservation = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
      return
    }

    try {
      await reservationService.cancelReservation(id)
      navigate('/user/history')
    } catch (err) {
      alert('Erreur lors de l\'annulation de la réservation')
      console.error(err)
    }
  }

  const getStatusBadge = (statut) => {
    const badges = {
      'EN_ATTENTE_PAIEMENT': { label: 'En attente de paiement', class: 'status-pending' },
      'CONFIRMEE': { label: 'Confirmée', class: 'status-confirmed' },
      'ANNULEE': { label: 'Annulée', class: 'status-cancelled' }
    }
    const badge = badges[statut] || { label: statut, class: '' }
    return <span className={`status-badge ${badge.class}`}>{badge.label}</span>
  }

  const calculateNights = (dateDebut, dateFin) => {
    const start = new Date(dateDebut)
    const end = new Date(dateFin)
    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  if (loading) {
    return (
      <div className="details-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement des détails...</p>
        </div>
      </div>
    )
  }

  if (error || !reservation) {
    return (
      <div className="details-page">
        <div className="error-container">
          <i className="fas fa-exclamation-circle"></i>
          <h3>{error || 'Réservation introuvable'}</h3>
          <button onClick={() => navigate('/user/history')} className="btn-primary">
            <i className="fas fa-arrow-left"></i> Retour à l'historique
          </button>
        </div>
      </div>
    )
  }

  const nights = calculateNights(reservation.dateDebut, reservation.dateFin)

  return (
    <div className="details-page">
      <div className="details-container">
        <div className="details-header">
          <div className="header-actions">
            <button onClick={() => navigate('/user/history')} className="btn-back">
              <i className="fas fa-arrow-left"></i> Retour
            </button>
            <button onClick={() => navigate('/home')} className="btn-back-home">
              <i className="fas fa-home"></i> Accueil
            </button>
          </div>
          <h1>Détails de la Réservation #{reservation.id}</h1>
          {getStatusBadge(reservation.statut)}
        </div>

        <div className="details-content">
          {/* Informations du centre */}
          <div className="details-section">
            <h2><i className="fas fa-building"></i> Centre de vacances</h2>
            <div className="section-content">
              <h3>{reservation.centre?.nom}</h3>
              <div className="info-grid">
                <div className="info-item">
                  <i className="fas fa-map-marker-alt"></i>
                  <div>
                    <strong>Adresse</strong>
                    <p>{reservation.centre?.adresse}, {reservation.centre?.ville}</p>
                  </div>
                </div>
                <div className="info-item">
                  <i className="fas fa-phone"></i>
                  <div>
                    <strong>Téléphone</strong>
                    <p>{reservation.centre?.telephone}</p>
                  </div>
                </div>
                {reservation.centre?.email && (
                  <div className="info-item">
                    <i className="fas fa-envelope"></i>
                    <div>
                      <strong>Email</strong>
                      <p>{reservation.centre?.email}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Informations du logement */}
          <div className="details-section">
            <h2><i className="fas fa-home"></i> Logement</h2>
            <div className="section-content">
              <div className="logement-card">
                <h3>{reservation.typeLogement?.nom}</h3>
                <p className="logement-description">{reservation.typeLogement?.description}</p>
                <div className="logement-specs">
                  <div className="spec">
                    <i className="fas fa-users"></i>
                    <span>Capacité: {reservation.typeLogement?.capaciteMax} personnes</span>
                  </div>
                  <div className="spec">
                    <i className="fas fa-tag"></i>
                    <span>{reservation.typeLogement?.prixParNuit} DH / nuit</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dates et durée */}
          <div className="details-section">
            <h2><i className="fas fa-calendar-alt"></i> Période de séjour</h2>
            <div className="section-content">
              <div className="dates-grid">
                <div className="date-card">
                  <span className="date-label">Arrivée</span>
                  <div className="date-value">
                    <i className="fas fa-calendar-check"></i>
                    {new Date(reservation.dateDebut).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
                <div className="date-divider">
                  <i className="fas fa-arrow-right"></i>
                </div>
                <div className="date-card">
                  <span className="date-label">Départ</span>
                  <div className="date-value">
                    <i className="fas fa-calendar-times"></i>
                    {new Date(reservation.dateFin).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>
              <div className="duration-info">
                <i className="fas fa-moon"></i>
                <strong>{nights} nuit{nights > 1 ? 's' : ''}</strong>
              </div>
            </div>
          </div>

          {/* Voyageurs */}
          <div className="details-section">
            <h2><i className="fas fa-users"></i> Voyageurs</h2>
            <div className="section-content">
              <div className="travelers-summary">
                <div className="traveler-count">
                  <i className="fas fa-user"></i>
                  <span>{reservation.nombreAdultes} adulte{reservation.nombreAdultes > 1 ? 's' : ''}</span>
                </div>
                {reservation.nombreEnfants > 0 && (
                  <div className="traveler-count">
                    <i className="fas fa-child"></i>
                    <span>{reservation.nombreEnfants} enfant{reservation.nombreEnfants > 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>

              {reservation.personnesAccompagnement && reservation.personnesAccompagnement.length > 0 && (
                <div className="accompagnants-list">
                  <h4>Personnes accompagnantes</h4>
                  {reservation.personnesAccompagnement.map((personne, index) => (
                    <div key={index} className="accompagnant-item">
                      <i className="fas fa-user-circle"></i>
                      <div>
                        <strong>{personne.prenom} {personne.nom}</strong>
                        <p>Né(e) le {new Date(personne.dateNaissance).toLocaleDateString('fr-FR')}</p>
                        {personne.cin && <p>CIN: {personne.cin}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Paiement */}
          <div className="details-section highlight">
            <h2><i className="fas fa-credit-card"></i> Informations de paiement</h2>
            <div className="section-content">
              <div className="payment-summary">
                <div className="payment-row">
                  <span>Prix par nuit:</span>
                  <span>{reservation.typeLogement?.prixParNuit} DH</span>
                </div>
                <div className="payment-row">
                  <span>Nombre de nuits:</span>
                  <span>{nights}</span>
                </div>
                <div className="payment-row total">
                  <span>Prix total:</span>
                  <span className="total-amount">{reservation.prixTotal || (nights * reservation.typeLogement?.prixParNuit)} DH</span>
                </div>
              </div>

              {reservation.methodePaiement && (
                <div className="payment-info">
                  <div className="info-item">
                    <strong>Méthode de paiement:</strong>
                    <span>{reservation.methodePaiement}</span>
                  </div>
                  {reservation.referencePaiement && (
                    <div className="info-item">
                      <strong>Référence:</strong>
                      <span>{reservation.referencePaiement}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="details-actions">
          {reservation.statut === 'EN_ATTENTE_PAIEMENT' && (
            <>
              <button 
                onClick={() => navigate(`/reservation/confirmation/${reservation.id}`)}
                className="btn-primary"
              >
                <i className="fas fa-credit-card"></i> Procéder au paiement
              </button>
              <button onClick={handleCancelReservation} className="btn-danger">
                <i className="fas fa-times-circle"></i> Annuler la réservation
              </button>
            </>
          )}
          {reservation.statut === 'CONFIRMEE' && (
            <div className="alert alert-success">
              <i className="fas fa-check-circle"></i>
              Votre réservation est confirmée ! Vous recevrez un email de confirmation prochainement.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ReservationDetails
