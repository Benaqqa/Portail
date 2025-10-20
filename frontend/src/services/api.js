import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect to login if we're not already on the login page
      // and if this is not a background API call
      const currentPath = window.location.pathname
      if (currentPath !== '/login' && currentPath !== '/') {
        // Clear auth data
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        // Only redirect if this is a user-initiated action, not a background call
        if (error.config?.url?.includes('/api/reservations/user/cin') || 
            error.config?.url?.includes('/api/user/profile')) {
          // This is a reservations API call or profile update - don't redirect automatically
          // Let the component handle the error
          console.warn('Authentication failed for API call:', error.config?.url)
        } else {
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(error)
  }
)

export default api

