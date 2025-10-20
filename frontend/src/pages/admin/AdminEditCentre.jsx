import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { adminService } from '../../services/adminService'

function AdminEditCentre() {
  const navigate = useNavigate()
  const { centreId } = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [centreForm, setCentreForm] = useState({
    nom: '',
    adresse: '',
    ville: '',
    telephone: '',
    description: '',
    website: '',
    imageUrl: '',
    actif: true,
    rating: 4.0
  })

  useEffect(() => {
    const fetchCentre = async () => {
      try {
        setLoading(true)
        console.log('Fetching centre with ID:', centreId)
        
        const data = await adminService.getCentres()
        const centres = data.centres || data || []
        
        console.log('All centres:', centres)
        console.log('Looking for centreId:', centreId)
        
        // Try different ID matching strategies
        let centre = centres.find(c => c.id == centreId) || 
                    centres.find(c => c.id === parseInt(centreId)) ||
                    centres.find(c => String(c.id) === String(centreId)) ||
                    centres.find(c => c.nom === centreId) ||
                    centres.find(c => c.name === centreId)
        
        console.log('Found centre:', centre)
        
        if (centre) {
          setCentreForm({
            nom: centre.nom || centre.name || '',
            adresse: centre.adresse || centre.address || '',
            ville: centre.ville || '',
            telephone: centre.telephone || centre.phone || '',
            description: centre.description || '',
            website: centre.website || '',
            imageUrl: centre.imageUrl || centre.image || '',
            actif: centre.actif !== undefined ? centre.actif : true,
            rating: centre.rating || 4.0
          })
        } else {
          console.error('Centre not found. Available centres:', centres.map(c => ({ id: c.id, nom: c.nom || c.name })))
          setError('Centre non trouvé')
        }
      } catch (err) {
        console.error('Erreur lors du chargement du centre:', err)
        setError('Erreur lors du chargement du centre')
      } finally {
        setLoading(false)
      }
    }

    if (centreId && centreId !== 'undefined') {
      fetchCentre()
    } else {
      setError('ID du centre invalide')
      setLoading(false)
    }
  }, [centreId])

  const handleSaveCentre = async (e) => {
    e.preventDefault()
    try {
      setError(null)
      setSuccessMessage('')
      console.log('Saving centre with ID:', centreId)
      console.log('Form data:', centreForm)
      
      await adminService.updateCentre(centreId, centreForm)
      setSuccessMessage('Centre mis à jour avec succès!')
      
      // Optionally navigate back after a short delay
      setTimeout(() => {
        navigate('/home/admin/centres')
      }, 1500)
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err)
      setError('Erreur lors de la sauvegarde du centre')
    }
  }

  const handleCancel = () => {
    navigate('/home/admin/centres')
  }

  if (loading) {
    return (
      <div className="page-container">
        <div className="container">
          <h1>Modification du Centre</h1>
          <p>Chargement des données du centre...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="container">
          <h1>Modification du Centre</h1>
          <div className="error-message">
            <p>{error}</p>
            <button onClick={() => navigate('/home/admin/centres')} className="btn-back">
              Retour à la liste
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="container">
        <div className="admin-header">
          <button onClick={handleCancel} className="btn-back-home">
            <i className="fas fa-arrow-left"></i> Retour à la liste
          </button>
          <div>
            <h1>Modifier le Centre</h1>
            <p className="subtitle">Modification des informations du centre de vacances</p>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="success-message">
            <p>{successMessage}</p>
          </div>
        )}

        <form onSubmit={handleSaveCentre} className="edit-centre-form">
          <div className="form-section">
            <h3>Informations générales</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Nom du centre:</label>
                <input
                  type="text"
                  value={centreForm.nom}
                  onChange={(e) => setCentreForm({...centreForm, nom: e.target.value})}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label>Ville:</label>
                <input
                  type="text"
                  value={centreForm.ville}
                  onChange={(e) => setCentreForm({...centreForm, ville: e.target.value})}
                  className="form-input"
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Adresse:</label>
              <input
                type="text"
                value={centreForm.adresse}
                onChange={(e) => setCentreForm({...centreForm, adresse: e.target.value})}
                className="form-input"
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Téléphone:</label>
                <input
                  type="text"
                  value={centreForm.telephone}
                  onChange={(e) => setCentreForm({...centreForm, telephone: e.target.value})}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Note:</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  value={centreForm.rating}
                  onChange={(e) => setCentreForm({...centreForm, rating: parseFloat(e.target.value)})}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Informations supplémentaires</h3>
            <div className="form-group">
              <label>Site Web:</label>
              <input
                type="url"
                value={centreForm.website}
                onChange={(e) => setCentreForm({...centreForm, website: e.target.value})}
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label>URL de l'image:</label>
              <input
                type="url"
                value={centreForm.imageUrl}
                onChange={(e) => setCentreForm({...centreForm, imageUrl: e.target.value})}
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label>Description:</label>
              <textarea
                value={centreForm.description}
                onChange={(e) => setCentreForm({...centreForm, description: e.target.value})}
                className="form-textarea"
                rows="4"
              />
            </div>
          </div>

          <div className="form-actions">
            <button onClick={handleCancel} className="btn-cancel">
              Annuler
            </button>
            <button type="submit" className="btn-save">
              Sauvegarder
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminEditCentre
