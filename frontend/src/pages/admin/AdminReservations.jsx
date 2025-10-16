import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminService } from '../../services/adminService'

function AdminReservations() {
  const navigate = useNavigate()
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true)
        const data = await adminService.getAllReservations()
        setReservations(data.reservations || data || [])
      } catch (err) {
        console.error('Erreur lors du chargement des réservations:', err)
        setError('Erreur lors du chargement des réservations')
      } finally {
        setLoading(false)
      }
    }

    fetchReservations()
  }, [])

  if (loading) {
    return (
      <div className="page-container">
        <div className="container">
          <h1>Gestion des Réservations</h1>
          <p>Chargement des réservations...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="container">
          <h1>Gestion des Réservations</h1>
          <div className="error-message">
            <p>{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="container">
        <div className="admin-header">
          <button onClick={() => navigate('/home')} className="btn-back-home">
            <i className="fas fa-arrow-left"></i> Retour à l'accueil
          </button>
          <div>
            <h1>Gestion des Réservations</h1>
            <p className="subtitle">Suivi et administration de toutes les réservations</p>
          </div>
        </div>
        
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{reservations.length}</div>
            <div className="stat-label">Total des réservations</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{reservations.filter(r => r.statut === 'EN_ATTENTE_PAIEMENT').length}</div>
            <div className="stat-label">En attente de paiement</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{reservations.filter(r => r.statut === 'CONFIRMEE').length}</div>
            <div className="stat-label">Confirmées</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{reservations.filter(r => r.statut === 'ANNULEE').length}</div>
            <div className="stat-label">Annulées</div>
          </div>
        </div>
        
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Matricule</th>
                <th>CIN</th>
                <th>Centre</th>
                <th>Type</th>
                <th>Date Début</th>
                <th>Date Fin</th>
                <th>Statut</th>
                <th>Prix Total</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation) => (
                <tr key={reservation.id}>
                  <td>{reservation.id}</td>
                  <td>{reservation.matricule}</td>
                  <td>{reservation.numCin}</td>
                  <td>{reservation.centreNom}</td>
                  <td>{reservation.typeLogementNom}</td>
                  <td>{reservation.dateDebut ? new Date(reservation.dateDebut).toLocaleDateString('fr-FR') : 'N/A'}</td>
                  <td>{reservation.dateFin ? new Date(reservation.dateFin).toLocaleDateString('fr-FR') : 'N/A'}</td>
                  <td>
                    <span className={`status-badge status-${reservation.statut?.toLowerCase().replace('_', '-')}`}>
                      {reservation.statut?.replace('_', ' ')}
                    </span>
                  </td>
                  <td>{reservation.prixTotal ? `${reservation.prixTotal} MAD` : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminReservations

