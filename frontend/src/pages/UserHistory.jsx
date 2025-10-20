import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import reservationService from '../services/reservationService'
import './UserHistory.css'

function UserHistory() {
  const navigate = useNavigate()
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all') // all, en_attente, confirmee, annulee

  useEffect(() => {
    loadReservations()
  }, [])

  const loadReservations = async () => {
    try {
      setLoading(true)
      const data = await reservationService.getUserReservationsByCin()
      setReservations(data)
    } catch (err) {
      setError('Erreur lors du chargement de l\'historique')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelReservation = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
      return
    }

    try {
      await reservationService.cancelReservation(id)
      // Recharger les réservations
      loadReservations()
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

  const filteredReservations = reservations.filter(res => {
    if (filter === 'all') return true
    if (filter === 'en_attente') return res.statut === 'EN_ATTENTE_PAIEMENT'
    if (filter === 'confirmee') return res.statut === 'CONFIRMEE'
    if (filter === 'annulee') return res.statut === 'ANNULEE'
    return true
  })

  return (
    <div className="history-page">
      <div className="history-container">
        <div className="history-header">
          <button onClick={() => navigate('/home')} className="btn-back-home">
            <i className="fas fa-arrow-left"></i> Retour à l'accueil
          </button>
          <h1><i className="fas fa-history"></i> Historique des Réservations</h1>
          <button onClick={() => navigate('/reservation')} className="btn-new-reservation">
            <i className="fas fa-plus"></i> Nouvelle réservation
          </button>
        </div>

        {error && (
          <div className="alert alert-error">
            <i className="fas fa-exclamation-circle"></i> {error}
          </div>
        )}

        <div className="filter-tabs">
          <button
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Toutes
          </button>
          <button
            className={`filter-tab ${filter === 'en_attente' ? 'active' : ''}`}
            onClick={() => setFilter('en_attente')}
          >
            En attente
          </button>
          <button
            className={`filter-tab ${filter === 'confirmee' ? 'active' : ''}`}
            onClick={() => setFilter('confirmee')}
          >
            Confirmées
          </button>
          <button
            className={`filter-tab ${filter === 'annulee' ? 'active' : ''}`}
            onClick={() => setFilter('annulee')}
          >
            Annulées
          </button>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Chargement de l'historique...</p>
          </div>
        ) : filteredReservations.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-calendar-times"></i>
            <h3>Aucune réservation trouvée</h3>
            <p>Vous n'avez pas encore effectué de réservation.</p>
            <button onClick={() => navigate('/reservation')} className="btn-primary">
              <i className="fas fa-plus"></i> Créer une réservation
            </button>
          </div>
        ) : (
          <div className="reservations-list">
            {filteredReservations.map(reservation => (
              <div key={reservation.id} className="reservation-card">
                <div className="card-header">
                  <div className="card-title">
                    <h3>{reservation.centre?.nom || 'Centre inconnu'}</h3>
                    {getStatusBadge(reservation.statut)}
                  </div>
                  <div className="card-actions">
                    <button
                      onClick={() => navigate(`/reservation/details/${reservation.id}`)}
                      className="btn-details"
                      title="Voir les détails"
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    {reservation.statut === 'ANNULEE' ? (
                      <button
                        onClick={() => navigate('/reservation')}
                        className="btn-primary"
                        title="Réserver à nouveau"
                      >
                        <i className="fas fa-plus"></i>
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => navigate(`/reservation/details/${reservation.id}`)}
                          className="btn-outline"
                          title="Modifier"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          onClick={() => handleCancelReservation(reservation.id)}
                          className="btn-cancel"
                          title="Annuler"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="card-body">
                  <div className="reservation-info">
                    <div className="info-item">
                      <i className="fas fa-map-marker-alt"></i>
                      <span>{reservation.centre?.ville}</span>
                    </div>
                    <div className="info-item">
                      <i className="fas fa-home"></i>
                      <span>{reservation.typeLogement?.nom || 'N/A'}</span>
                    </div>
                    <div className="info-item">
                      <i className="fas fa-calendar"></i>
                      <span>
                        {new Date(reservation.dateDebut).toLocaleDateString('fr-FR')} 
                        {' → '}
                        {new Date(reservation.dateFin).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <div className="info-item">
                      <i className="fas fa-users"></i>
                      <span>
                        {reservation.nombreAdultes} adulte(s)
                        {reservation.nombreEnfants > 0 && `, ${reservation.nombreEnfants} enfant(s)`}
                      </span>
                    </div>
                  </div>

                  <div className="card-footer">
                    <div className="price-info">
                      <span className="price-label">Prix total:</span>
                      <span className="price-amount">{reservation.prixTotal || 'N/A'} DH</span>
                    </div>
                    {reservation.statut === 'EN_ATTENTE_PAIEMENT' && (
                      <button
                        onClick={() => navigate(`/reservation/confirmation/${reservation.id}`)}
                        className="btn-pay"
                      >
                        <i className="fas fa-credit-card"></i> Procéder au paiement
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default UserHistory
