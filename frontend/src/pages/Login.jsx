import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

function Login() {
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  })
  const [externalData, setExternalData] = useState({
    authCode: '',
    prenom: '',
    nom: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [loginType, setLoginType] = useState('interne') // 'interne' ou 'extern'
  const [showFirstLogin, setShowFirstLogin] = useState(false)
  
  const { login, externalLogin, firstLogin } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleExternalChange = (e) => {
    setExternalData({
      ...externalData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(formData)
    
    if (result.success) {
      navigate('/home')
    } else {
      setError(result.error)
    }
    
    setLoading(false)
  }

  const handleExternalSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await externalLogin(externalData)
      
      if (result.success) {
        // Check if user is actually set before navigating
        if (localStorage.getItem('token') && localStorage.getItem('user')) {
          navigate('/home', { replace: true })
        } else {
          setError('Erreur lors de l\'initialisation de la session')
        }
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Erreur lors de la connexion externe')
    }
    
    setLoading(false)
  }

  const handleFirstLogin = async () => {
    const identifier = document.getElementById('firstLoginIdentifier')?.value
    if (!identifier) {
      setError('Veuillez saisir votre matricule ou numéro CIN')
      return
    }

    setError('')
    setLoading(true)

    try {
      const result = await firstLogin(identifier)
      
      if (result.success) {
        setError('')
        alert(result.data.message || 'Première connexion initiée. Vérifiez votre email/SMS pour le code de validation.')
        // Optionally redirect or show next step
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Erreur lors de l\'initialisation de la première connexion')
    }
    
    setLoading(false)
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="logo-container">
              <img src="/src/Logo/LOGO.png" alt="COSONE Logo" />
            </div>
            <h2>Connexion COSONE</h2>
            <p>Choisissez votre méthode de connexion</p>
          </div>

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          {/* Options de connexion */}
          <div className="login-options">
            <button 
              className={`login-option-btn ${loginType === 'interne' ? 'active' : ''}`}
              onClick={() => {
                setLoginType('interne')
                setShowFirstLogin(false)
              }}
            >
              Connexion Interne
            </button>
            <button 
              className={`login-option-btn ${loginType === 'extern' ? 'active' : ''}`}
              onClick={() => {
                setLoginType('extern')
                setShowFirstLogin(false)
              }}
            >
              Connexion Externe
            </button>
          </div>

          {/* Connexion Interne */}
          {loginType === 'interne' && (
            <div className="login-form-section">
              <h3>Connexion Régulière</h3>
              <p>Vous avez déjà un mot de passe ? Connectez-vous avec votre Matricule ou Num CIN et mot de passe.</p>
              
              <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                  <label htmlFor="identifier">Matricule ou Num CIN</label>
                  <input
                    type="text"
                    id="identifier"
                    name="identifier"
                    value={formData.identifier}
                    onChange={handleChange}
                    placeholder="Entrez votre matricule ou num CIN"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Mot de passe</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Entrez votre mot de passe"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn-submit"
                  disabled={loading}
                >
                  {loading ? 'Connexion...' : 'Se connecter'}
                </button>
              </form>

              {/* Première connexion */}
              <div className="first-login-toggle">
                <button 
                  type="button"
                  className="first-login-toggle-btn"
                  onClick={() => setShowFirstLogin(!showFirstLogin)}
                >
                  {showFirstLogin ? 'Masquer la première connexion' : 'Première connexion ? Cliquez ici'}
                </button>
              </div>

              {showFirstLogin && (
                <div className="first-login-section">
                  <h4>Première Connexion</h4>
                  <p>Vous n'avez pas encore de mot de passe ? Utilisez votre Matricule ou Num CIN pour configurer votre compte.</p>
                  
                  <div className="form-group">
                    <label htmlFor="firstLoginIdentifier">Matricule ou Num CIN</label>
                    <input
                      type="text"
                      id="firstLoginIdentifier"
                      placeholder="Entrez votre matricule ou num CIN"
                    />
                  </div>
                  
                  <button 
                    type="button"
                    className="first-login-btn"
                    onClick={handleFirstLogin}
                    disabled={loading}
                  >
                    {loading ? 'Traitement...' : 'Commencer la première connexion'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Connexion Externe */}
          {loginType === 'extern' && (
            <div className="login-form-section">
              <h3>Connexion Externe</h3>
              <p>Utilisez votre code d'authentification à usage unique et vérifiez votre identité.</p>
              
              <form onSubmit={handleExternalSubmit} className="auth-form">
                <div className="form-group">
                  <label htmlFor="authCode">Code d'authentification à usage unique</label>
                  <input
                    type="text"
                    id="authCode"
                    name="authCode"
                    value={externalData.authCode}
                    onChange={handleExternalChange}
                    placeholder="Entrez votre code d'authentification"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="prenom">Prénom</label>
                  <input
                    type="text"
                    id="prenom"
                    name="prenom"
                    value={externalData.prenom}
                    onChange={handleExternalChange}
                    placeholder="Entrez votre prénom"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="nom">Nom</label>
                  <input
                    type="text"
                    id="nom"
                    name="nom"
                    value={externalData.nom}
                    onChange={handleExternalChange}
                    placeholder="Entrez votre nom"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn-submit"
                  disabled={loading}
                >
                  {loading ? 'Connexion...' : 'Se connecter'}
                </button>
              </form>
            </div>
          )}

          <div className="auth-footer">
            <p>
              <Link to="/">Retour à l'accueil</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login