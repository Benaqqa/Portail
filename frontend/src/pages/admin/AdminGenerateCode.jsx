import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminService } from '../../services/adminService'
import './AdminGenerateCode.css'

function AdminGenerateCode() {
  const navigate = useNavigate()
  const [codes, setCodes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)
  const [formData, setFormData] = useState({
    code: '',
    prenom: '',
    nom: '',
    matricule: '',
    numCin: '',
    phoneNumber: '',
    expirationHours: 24,
    oneTimeOnly: true
  })

  useEffect(() => {
    const fetchCodes = async () => {
      try {
        setLoading(true)
        const data = await adminService.getAllCodes()
        setCodes(data.codes || data || [])
      } catch (err) {
        console.error('Erreur lors du chargement des codes:', err)
        setError('Erreur lors du chargement des codes')
      } finally {
        setLoading(false)
      }
    }

    fetchCodes()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await adminService.generateCode(formData)
      setMessage('Code généré avec succès!')
      setFormData({ 
        code: '', 
        prenom: '', 
        nom: '',
        matricule: '',
        numCin: '',
        phoneNumber: '',
        expirationHours: 24,
        oneTimeOnly: true
      })
      // Refresh codes list
      const data = await adminService.getAllCodes()
      setCodes(data.codes || data || [])
    } catch (err) {
      console.error('Erreur lors de la génération du code:', err)
      setError('Erreur lors de la génération du code')
    }
  }

  const handleDelete = async (codeId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce code?')) {
      try {
        await adminService.deleteCode(codeId)
        setMessage('Code supprimé avec succès!')
        // Refresh codes list
        const data = await adminService.getAllCodes()
        setCodes(data.codes || data || [])
      } catch (err) {
        console.error('Erreur lors de la suppression du code:', err)
        setError('Erreur lors de la suppression du code')
      }
    }
  }

  const [searchTerm, setSearchTerm] = useState('')

  if (loading) {
    return (
      <div className="page-container">
        <div className="container">
          <h1>Générer des Codes d'Authentification</h1>
          <p>Chargement des codes...</p>
        </div>
      </div>
    )
  }

  const filteredCodes = codes.filter(code =>
    code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${code.prenom} ${code.nom}`.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="page-container">
      <div className="container">
        <div className="admin-header">
          <button onClick={() => navigate('/home')} className="btn-back-home">
            <i className="fas fa-arrow-left"></i> Retour à l'accueil
          </button>
          <div>
            <h1>Gestion des Codes OTP</h1>
            <p className="subtitle">Génération et contrôle des codes d'accès temporaires pour utilisateurs externes</p>
          </div>
        </div>

        {error && <div className="error-message"><p>{error}</p></div>}
        {message && <div className="success-message"><p>{message}</p></div>}

        <div className="admin-content-grid">
          {/* Left Column */}
          <div className="admin-left-column">
            {/* Generate Code Form */}
            <div className="card">
              <div className="card-header">
                <h2>Générer un nouveau code OTP</h2>
              </div>
              <div className="card-body">
                <p className="form-description">Créez un code d'accès temporaire pour un utilisateur externe.</p>
                <form onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="code">Code d'authentification</label>
                      <input
                        type="text"
                        id="code"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        required
                        placeholder="Ex: CODE123"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="expirationHours">Durée de validité</label>
                      <select
                        id="expirationHours"
                        value={formData.expirationHours}
                        onChange={(e) => setFormData({ ...formData, expirationHours: parseInt(e.target.value) })}
                      >
                        <option value="1">1 heure</option>
                        <option value="6">6 heures</option>
                        <option value="12">12 heures</option>
                        <option value="24">24 heures</option>
                        <option value="48">48 heures</option>
                        <option value="168">7 jours</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="prenom">Prénom</label>
                      <input
                        type="text"
                        id="prenom"
                        value={formData.prenom}
                        onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                        required
                        placeholder="Prénom du bénéficiaire"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="nom">Nom</label>
                      <input
                        type="text"
                        id="nom"
                        value={formData.nom}
                        onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                        required
                        placeholder="Nom du bénéficiaire"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="matricule">Matricule (optionnel)</label>
                      <input
                        type="text"
                        id="matricule"
                        value={formData.matricule}
                        onChange={(e) => setFormData({ ...formData, matricule: e.target.value })}
                        placeholder="Matricule ONEE"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="numCin">N° CIN (optionnel)</label>
                      <input
                        type="text"
                        id="numCin"
                        value={formData.numCin}
                        onChange={(e) => setFormData({ ...formData, numCin: e.target.value })}
                        placeholder="Numéro CIN"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="phoneNumber">N° de téléphone (optionnel)</label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      placeholder="Pour l'envoi du code par SMS"
                    />
                  </div>

                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.oneTimeOnly}
                        onChange={(e) => setFormData({ ...formData, oneTimeOnly: e.target.checked })}
                      />
                      <span>Code à usage unique (recommandé)</span>
                    </label>
                  </div>

                  <button type="submit" className="submit-btn">
                    <i className="fas fa-key"></i> Générer le Code
                  </button>
                </form>
              </div>
            </div>

            {/* Statistics */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">{codes.length}</div>
                <div className="stat-label">Total</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{codes.filter(c => !c.used && new Date(c.expirationDate) > new Date()).length}</div>
                <div className="stat-label">Valides</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{codes.filter(c => c.used).length}</div>
                <div className="stat-label">Utilisés</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{codes.filter(c => new Date(c.expirationDate) <= new Date()).length}</div>
                <div className="stat-label">Expirés</div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="admin-right-column">
            <div className="card">
              <div className="card-header">
                <h2>Codes OTP existants</h2>
                <div className="filter-controls">
                  <input
                    type="text"
                    placeholder="Filtrer par code ou nom..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="card-body">
                <div className="codes-list">
                  {filteredCodes.length === 0 ? (
                    <div className="empty-state">
                      <p>Aucun code ne correspond à votre recherche.</p>
                    </div>
                  ) : (
                    filteredCodes.map((code) => {
                      const isExpired = new Date(code.expirationDate) <= new Date()
                      const statusClass = code.used ? 'status-cancelled' : isExpired ? 'status-expired' : 'status-active'
                      const statusText = code.used ? 'Utilisé' : isExpired ? 'Expiré' : 'Valide'

                      return (
                        <div key={code.id} className="code-item">
                          <div className="code-item-header">
                            <h3>{code.code}</h3>
                            <span className={`status-badge ${statusClass}`}>{statusText}</span>
                          </div>
                          <div className="code-item-body">
                            <p><strong>Bénéficiaire:</strong> {code.prenom} {code.nom}</p>
                            {code.matricule && <p><strong>Matricule:</strong> {code.matricule}</p>}
                            {code.numCin && <p><strong>CIN:</strong> {code.numCin}</p>}
                            <p><strong>Expire le:</strong> {new Date(code.expirationDate).toLocaleString('fr-FR')}</p>
                          </div>
                          <div className="code-item-footer">
                            <span>{code.oneTimeOnly ? 'Usage unique' : 'Multi-usage'}</span>
                            <button onClick={() => handleDelete(code.id)} className="delete-btn">
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminGenerateCode

