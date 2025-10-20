import api from '../api/axios'

const reservationService = {
  // Récupérer tous les centres actifs
  getCentres: async () => {
    const response = await api.get('/api/centres')
    return response.data
  },

  // Récupérer les types de logement pour un centre
  getTypesLogement: async (centreId) => {
    const response = await api.get(`/api/types-logement/centre/${centreId}`)
    return response.data
  },

  // Créer une nouvelle réservation
  createReservation: async (reservationData) => {
    const response = await api.post('/api/reservations', reservationData)
    return response.data
  },

  // Récupérer l'historique des réservations de l'utilisateur par matricule
  getUserReservationsByMatricule: async () => {
    const response = await api.get('/api/reservations/user/matricule')
    return response.data
  },

  // Récupérer l'historique des réservations de l'utilisateur par CIN
  getUserReservationsByCin: async () => {
    const response = await api.get('/api/reservations/user/cin')
    return response.data
  },

  // Récupérer l'historique des réservations de l'utilisateur (alias)
  getUserReservations: async () => {
    const response = await api.get('/api/reservations/user/cin')
    return response.data
  },

  // Récupérer les détails d'une réservation
  getReservationDetails: async (id) => {
    const response = await api.get(`/api/reservations/${id}`)
    return response.data
  },

  // Annuler une réservation
  cancelReservation: async (id) => {
    const response = await api.post(`/api/reservations/${id}/annuler`)
    return response.data
  },

  // Confirmer le paiement d'une réservation
  confirmPayment: async (id, paymentData) => {
    const response = await api.post(`/api/reservations/${id}/confirmer-paiement`, paymentData)
    return response.data
  }
}

export default reservationService
