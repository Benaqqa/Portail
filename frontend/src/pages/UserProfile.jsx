import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import './UserProfile.css'

function UserProfile() {
  const navigate = useNavigate()
  const { user, setUser } = useAuth()
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: ''
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    if (user) {
      setFormData({
        nom: user.nom || '',
        prenom: user.prenom || '',
        email: user.email || '',
        telephone: user.telephone || '',
        adresse: user.adresse || ''
      })
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      setMessage({ type: '', text: '' })
      
      const response = await api.put('/user/profile', formData)
      
      // Mettre à jour l'utilisateur dans le contexte
      setUser({ ...user, ...formData })
      
      setMessage({ type: 'success', text: 'Profil mis à jour avec succès !' })
      setEditing(false)
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Erreur lors de la mise à jour du profil' 
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' })
      return
    }

    try {
      setLoading(true)
      setMessage({ type: '', text: '' })
      
      await api.put('/user/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })
      
      setMessage({ type: 'success', text: 'Mot de passe modifié avec succès !' })
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Erreur lors de la modification du mot de passe' 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Header */}
        <div className="profile-header">
          <div className="header-content">
            <div className="user-info">
              <div className="user-avatar">
                <i className="fas fa-user"></i>
              </div>
              <div className="user-details">
                <h1>{user?.prenom} {user?.nom}</h1>
                <p className="user-role">
                  <i className="fas fa-shield-alt"></i>
                  {user?.role === 'ADMIN' ? 'Administrateur' : 'Utilisateur'}
                </p>
                <p className="user-matricule">
                  <i className="fas fa-id-badge"></i>
                  {user?.matricule || 'N/A'}
                </p>
              </div>
            </div>
            <div className="header-actions">
              <button 
                onClick={() => navigate('/home')} 
                className="btn-back"
              >
                <i className="fas fa-arrow-left"></i>
                Retour au tableau de bord
              </button>
            </div>
          </div>
        </div>

        {/* Alert Messages */}
        {message.text && (
          <div className={`alert alert-${message.type}`}>
            <i className={`fas fa-${message.type === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i>
            {message.text}
          </div>
        )}

        {/* Profile Cards */}
        <div className="profile-cards">
          {/* Personal Information Card */}
          <div className="profile-card">
            <div className="card-header">
              <h2>
                <i className="fas fa-user"></i>
                Informations personnelles
              </h2>
              {!editing && (
                <button 
                  onClick={() => setEditing(true)} 
                  className="btn-edit"
                >
                  <i className="fas fa-edit"></i>
                  Modifier
                </button>
              )}
            </div>
            
            <div className="card-content">
              {!editing ? (
                <div className="info-grid">
                  <div className="info-item">
                    <label>Nom complet</label>
                    <div className="info-value">
                      <i className="fas fa-user"></i>
                      {user?.prenom} {user?.nom}
                    </div>
                  </div>
                  
                  <div className="info-item">
                    <label>Email</label>
                    <div className="info-value">
                      <i className="fas fa-envelope"></i>
                      {user?.email || 'Non renseigné'}
                    </div>
                  </div>
                  
                  <div className="info-item">
                    <label>Téléphone</label>
                    <div className="info-value">
                      <i className="fas fa-phone"></i>
                      {user?.telephone || 'Non renseigné'}
                    </div>
                  </div>
                  
                  <div className="info-item full-width">
                    <label>Adresse</label>
                    <div className="info-value">
                      <i className="fas fa-map-marker-alt"></i>
                      {user?.adresse || 'Non renseignée'}
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="edit-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="nom">
                        <i className="fas fa-user"></i>
                        Nom *
                      </label>
                      <input
                        type="text"
                        id="nom"
                        name="nom"
                        value={formData.nom}
                        onChange={handleChange}
                        required
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="prenom">
                        <i className="fas fa-user"></i>
                        Prénom *
                      </label>
                      <input
                        type="text"
                        id="prenom"
                        name="prenom"
                        value={formData.prenom}
                        onChange={handleChange}
                        required
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">
                      <i className="fas fa-envelope"></i>
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="telephone">
                      <i className="fas fa-phone"></i>
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      id="telephone"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="adresse">
                      <i className="fas fa-map-marker-alt"></i>
                      Adresse
                    </label>
                    <textarea
                      id="adresse"
                      name="adresse"
                      value={formData.adresse}
                      onChange={handleChange}
                      rows="3"
                      className="form-input"
                    />
                  </div>

                  <div className="form-actions">
                    <button 
                      type="button" 
                      onClick={() => {
                        setEditing(false)
                        setMessage({ type: '', text: '' })
                      }} 
                      className="btn-secondary"
                    >
                      <i className="fas fa-times"></i>
                      Annuler
                    </button>
                    <button 
                      type="submit" 
                      className="btn-primary" 
                      disabled={loading}
                    >
                      <i className="fas fa-save"></i>
                      {loading ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Security Card */}
          <div className="profile-card">
            <div className="card-header">
              <h2>
                <i className="fas fa-shield-alt"></i>
                Sécurité
              </h2>
            </div>
            
            <div className="card-content">
              <form onSubmit={handlePasswordSubmit} className="password-form">
                <div className="form-group">
                  <label htmlFor="currentPassword">
                    <i className="fas fa-lock"></i>
                    Mot de passe actuel *
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="newPassword">
                    <i className="fas fa-key"></i>
                    Nouveau mot de passe *
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">
                    <i className="fas fa-key"></i>
                    Confirmer le nouveau mot de passe *
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-actions">
                  <button 
                    type="submit" 
                    className="btn-primary" 
                    disabled={loading}
                  >
                    <i className="fas fa-key"></i>
                    {loading ? 'Modification en cours...' : 'Modifier le mot de passe'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Account Status Card */}
          <div className="profile-card">
            <div className="card-header">
              <h2>
                <i className="fas fa-info-circle"></i>
                Statut du compte
              </h2>
            </div>
            
            <div className="card-content">
              <div className="status-grid">
                <div className="status-item">
                  <div className="status-icon">
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <div className="status-info">
                    <h3>Compte actif</h3>
                    <p>Votre compte est actif et fonctionnel</p>
                  </div>
                </div>
                
                <div className="status-item">
                  <div className="status-icon">
                    <i className="fas fa-calendar"></i>
                  </div>
                  <div className="status-info">
                    <h3>Membre depuis</h3>
                    <p>Date de création du compte</p>
                  </div>
                </div>
                
                <div className="status-item">
                  <div className="status-icon">
                    <i className="fas fa-shield-alt"></i>
                  </div>
                  <div className="status-info">
                    <h3>Niveau d'accès</h3>
                    <p>{user?.role === 'ADMIN' ? 'Administrateur' : 'Utilisateur standard'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile
