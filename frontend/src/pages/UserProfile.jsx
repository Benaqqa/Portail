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
        <div className="profile-header">
          <button onClick={() => navigate('/home')} className="btn-back-home">
            <i className="fas fa-arrow-left"></i> Retour à l'accueil
          </button>
          <h1><i className="fas fa-user-circle"></i> Mon Profil</h1>
        </div>

        {message.text && (
          <div className={`alert alert-${message.type}`}>
            <i className={`fas fa-${message.type === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i>
            {message.text}
          </div>
        )}

        <div className="profile-content">
          {/* Informations personnelles */}
          <div className="profile-section">
            <div className="section-header">
              <h2><i className="fas fa-id-card"></i> Informations personnelles</h2>
              {!editing && (
                <button onClick={() => setEditing(true)} className="btn-edit">
                  <i className="fas fa-edit"></i> Modifier
                </button>
              )}
            </div>

            {editing ? (
              <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="nom">Nom *</label>
                    <input
                      type="text"
                      id="nom"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="prenom">Prénom *</label>
                    <input
                      type="text"
                      id="prenom"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="telephone">Téléphone</label>
                  <input
                    type="tel"
                    id="telephone"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="adresse">Adresse</label>
                  <textarea
                    id="adresse"
                    name="adresse"
                    value={formData.adresse}
                    onChange={handleChange}
                    rows="3"
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
                    <i className="fas fa-times"></i> Annuler
                  </button>
                  <button type="submit" className="btn-primary" disabled={loading}>
                    <i className="fas fa-save"></i> {loading ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-info">
                <div className="info-row">
                  <span className="info-label"><i className="fas fa-user"></i> Nom complet:</span>
                  <span className="info-value">{user?.prenom} {user?.nom}</span>
                </div>
                <div className="info-row">
                  <span className="info-label"><i className="fas fa-id-badge"></i> Matricule:</span>
                  <span className="info-value">{user?.matricule || 'N/A'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label"><i className="fas fa-envelope"></i> Email:</span>
                  <span className="info-value">{user?.email}</span>
                </div>
                <div className="info-row">
                  <span className="info-label"><i className="fas fa-phone"></i> Téléphone:</span>
                  <span className="info-value">{user?.telephone || 'Non renseigné'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label"><i className="fas fa-map-marker-alt"></i> Adresse:</span>
                  <span className="info-value">{user?.adresse || 'Non renseignée'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label"><i className="fas fa-shield-alt"></i> Rôle:</span>
                  <span className="info-value">
                    <span className={`role-badge role-${user?.role?.toLowerCase()}`}>
                      {user?.role === 'ADMIN' ? 'Administrateur' : 'Utilisateur'}
                    </span>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Modification du mot de passe */}
          <div className="profile-section">
            <div className="section-header">
              <h2><i className="fas fa-lock"></i> Modifier le mot de passe</h2>
            </div>

            <form onSubmit={handlePasswordSubmit} className="profile-form">
              <div className="form-group">
                <label htmlFor="currentPassword">Mot de passe actuel *</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">Nouveau mot de passe *</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmer le nouveau mot de passe *</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                <i className="fas fa-key"></i> {loading ? 'Modification en cours...' : 'Modifier le mot de passe'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile
