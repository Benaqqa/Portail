import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

// MODE DÉVELOPPEMENT : Mettre à true pour tester sans backend
const DEV_MODE = false

// Utilisateurs de test
const MOCK_USERS = [
  { 
    username: 'admin', 
    password: 'admin', 
    matricule: 'ADM001',
    role: 'ADMIN' 
  },
  { 
    username: 'user', 
    password: 'user', 
    matricule: 'USR001',
    role: 'USER' 
  }
]

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on mount
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token')
        const userStr = localStorage.getItem('user')
        
        if (token && userStr) {
          try {
            // Essayer de récupérer l'utilisateur depuis le backend
            const response = await api.get('/api/auth/me')
            setUser(response.data)
          } catch (error) {
            // Si l'API échoue, utiliser les données du localStorage
            try {
              const userData = JSON.parse(userStr)
              setUser(userData)
            } catch (e) {
              // Si le parsing échoue, déconnecter
              localStorage.removeItem('token')
              localStorage.removeItem('user')
              setUser(null)
            }
          }
        } else {
          setUser(null)
        }
      } catch (error) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const externalLogin = async (externalData) => {
    // Mode production : appel API réel pour vérifier dans extern_auth_codes
    try {
      const response = await api.post('/api/auth/external', externalData)
      
      // Check if response is HTML (server error)
      if (typeof response.data === 'string' && response.data.includes('<!DOCTYPE html>')) {
        return {
          success: false,
          error: 'Endpoint d\'authentification externe non disponible sur le serveur'
        }
      }
      
      // Handle different possible response formats
      let token, userData
      
      if (response.data.token && response.data.user) {
        // Standard format: { token: "...", user: {...} }
        token = response.data.token
        userData = response.data.user
      } else if (response.data.accessToken && response.data.user) {
        // Alternative format: { accessToken: "...", user: {...} }
        token = response.data.accessToken
        userData = response.data.user
      } else if (response.data.jwt && response.data.user) {
        // Alternative format: { jwt: "...", user: {...} }
        token = response.data.jwt
        userData = response.data.user
      } else if (response.data.token && response.data.username) {
        // Alternative format: { token: "...", username: "...", role: "..." }
        token = response.data.token
        userData = {
          username: response.data.username,
          role: response.data.role,
          matricule: response.data.matricule || null,
          prenom: response.data.prenom || null,
          nom: response.data.nom || null
        }
      } else {
        return {
          success: false,
          error: 'Format de réponse invalide du serveur'
        }
      }
      
      if (!token || !userData) {
        return {
          success: false,
          error: 'Données d\'authentification manquantes'
        }
      }
      
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)
      
      return { success: true }
    } catch (error) {
      // Handle network errors or server errors
      if (error.response?.status === 404) {
        return {
          success: false,
          error: 'Endpoint d\'authentification externe non trouvé'
        }
      } else if (error.response?.status >= 500) {
        return {
          success: false,
          error: 'Erreur serveur lors de l\'authentification'
        }
      }
      
      return {
        success: false,
        error: error.response?.data?.message || 'Code d\'authentification invalide ou expiré'
      }
    }
  }

  const firstLogin = async (identifier) => {
    // Mode production : appel API réel
    try {
      const response = await api.post('/api/auth/first-login', { identifier })
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de l\'initialisation de la première connexion'
      }
    }
  }

  const verifySms = async (identifier, phoneNumber, verificationCode) => {
    try {
      const response = await api.post('/api/auth/verify-sms', { 
        identifier, 
        phoneNumber, 
        verificationCode 
      })
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la vérification du code SMS'
      }
    }
  }

  const createPassword = async (identifier, password) => {
    try {
      const response = await api.post('/api/auth/create-password', { 
        identifier, 
        password 
      })
      const { token, user: userData } = response.data
      
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)
      
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la création du mot de passe'
      }
    }
  }

  const login = async (credentials) => {
    // Mode production : appel API réel pour vérifier dans table users
    try {
      const response = await api.post('/api/auth/login', credentials)
      const { token, user: userData } = response.data
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur de connexion'
      }
    }
  }

  const register = async (userData) => {
    // Mode production : appel API réel
    try {
      const response = await api.post('/api/auth/register', userData)
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de l\'inscription'
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('mockUser')
    setUser(null)
  }

  const value = {
    user,
    loading,
    login,
    externalLogin,
    firstLogin,
    verifySms,
    createPassword,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN'
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
