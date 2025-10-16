import api from './api'

export const adminService = {
  // Users management
  getAllUsers: async () => {
    const response = await api.get('/api/admin/users')
    return response.data
  },

  updateUserPhone: async (userId, phoneNumber) => {
    const response = await api.post(`/api/admin/users/${userId}/phone`, { phoneNumber })
    return response.data
  },

  updateUser: async (userId, userData) => {
    const response = await api.put(`/api/admin/users/${userId}`, userData)
    return response.data
  },

  // Reservations management
  getAllReservations: async () => {
    const response = await api.get('/api/admin/reservations')
    return response.data
  },

  // External auth codes
  getAllCodes: async () => {
    const response = await api.get('/api/admin/codes')
    return response.data
  },

  generateCode: async (codeData) => {
    const response = await api.post('/api/admin/codes', codeData)
    return response.data
  },

  deleteCode: async (codeId) => {
    const response = await api.delete(`/api/admin/codes/${codeId}`)
    return response.data
  },

  // Centres management
  getCentres: async () => {
    const response = await api.get('/api/admin/centres')
    return response.data
  },

  createCentre: async (centreData) => {
    const response = await api.post('/api/admin/centres', centreData)
    return response.data
  },

  updateCentre: async (centreId, centreData) => {
    const response = await api.put(`/api/admin/centres/${centreId}`, centreData)
    return response.data
  },

  deleteCentre: async (centreId) => {
    const response = await api.delete(`/api/admin/centres/${centreId}`)
    return response.data
  },

  // Actualités management
  getActualites: async () => {
    const response = await api.get('/api/admin/actualites')
    return response.data
  },

  createActualite: async (actualiteData) => {
    const response = await api.post('/api/admin/actualites', actualiteData)
    return response.data
  },

  updateActualite: async (actualiteId, actualiteData) => {
    const response = await api.put(`/api/admin/actualites/${actualiteId}`, actualiteData)
    return response.data
  },

  deleteActualite: async (actualiteId) => {
    const response = await api.delete(`/api/admin/actualites/${actualiteId}`)
    return response.data
  },

  // External authentication
  validateExternalCode: async (codeData) => {
    const response = await api.post('/api/auth/external', codeData)
    return response.data
  },

  // First login functionality
  firstLogin: async (identifier) => {
    const response = await api.post('/api/auth/first-login', { identifier })
    return response.data
  }
}

