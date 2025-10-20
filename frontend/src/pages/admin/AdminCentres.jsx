import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminService } from '../../services/adminService'
import AnimatedList from '../../components/AnimatedList'

function AdminCentres() {
  const navigate = useNavigate()
  const [centres, setCentres] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingCentre, setEditingCentre] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [centreForm, setCentreForm] = useState({
    nom: '',
    adresse: '',
    ville: '',
    telephone: '',
    description: '',
    actif: true,
    rating: 4.0
  })

  useEffect(() => {
    const fetchCentres = async () => {
      try {
        setLoading(true)
        const data = await adminService.getCentres()
        setCentres(data.centres || data || [])
      } catch (err) {
        console.error('Erreur lors du chargement des centres:', err)
        setError('Erreur lors du chargement des centres')
      } finally {
        setLoading(false)
      }
    }

    fetchCentres()
  }, [])

  const handleEditCentre = (centre) => {
    console.log('Centre to edit:', centre)
    console.log('Centre ID:', centre.id)
    console.log('Centre name:', centre.nom)
    
    // Try different ID properties
    const centreId = centre.id || centre.name || centre.nom
    console.log('Using centreId:', centreId)
    
    if (centreId) {
      navigate(`/home/admin/centres/edit/${centreId}`)
    } else {
      console.error('No valid ID found for centre:', centre)
      alert('Erreur: Impossible de trouver l\'ID du centre')
    }
  }

  const handleAddCentre = () => {
    setEditingCentre(null)
    setCentreForm({
      nom: '',
      adresse: '',
      ville: '',
      telephone: '',
      description: '',
      actif: true,
      rating: 4.0
    })
    setShowAddModal(true)
  }

  const handleSaveCentre = async () => {
    try {
      if (editingCentre) {
        await adminService.updateCentre(editingCentre.id, centreForm)
      } else {
        await adminService.createCentre(centreForm)
      }
      // Refresh the centres list
      const data = await adminService.getCentres()
      setCentres(data.centres || data || [])
      setShowEditModal(false)
      setShowAddModal(false)
      setEditingCentre(null)
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err)
      setError('Erreur lors de la sauvegarde du centre')
    }
  }

  const handleDeleteCentre = async (centreId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce centre ?')) {
      try {
        await adminService.deleteCentre(centreId)
        // Refresh the centres list
        const data = await adminService.getCentres()
        setCentres(data.centres || data || [])
      } catch (err) {
        console.error('Erreur lors de la suppression:', err)
        setError('Erreur lors de la suppression du centre')
      }
    }
  }

  const handleCancelEdit = () => {
    setShowEditModal(false)
    setShowAddModal(false)
    setEditingCentre(null)
    setCentreForm({
      nom: '',
      adresse: '',
      ville: '',
      telephone: '',
      description: '',
      actif: true,
      rating: 4.0
    })
  }

  if (loading) {
    return (
      <div className="page-container">
        <div className="container">
          <h1>Gestion des Centres</h1>
          <p>Chargement des centres...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="container">
          <h1>Gestion des Centres</h1>
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
            <h1>Gestion des Centres</h1>
            <p className="subtitle">Administration et gestion des centres de vacances</p>
          </div>
          <button onClick={handleAddCentre} className="btn-add">
            <i className="fas fa-plus"></i> Ajouter un centre
          </button>
        </div>
        
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{centres.length}</div>
            <div className="stat-label">Total des centres</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{centres.filter(c => c.actif).length}</div>
            <div className="stat-label">Centres actifs</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{centres.filter(c => c.rating > 4).length}</div>
            <div className="stat-label">Centres bien notés (4+⭐)</div>
          </div>
        </div>
        
        <div className="centres-animated-container">
          <div className="centres-info">
            <h3>Nos Centres de Vacances</h3>
            <p>Cliquez sur un centre pour voir plus de détails et gérer</p>
          </div>
          <div className="centres-list-wrapper">
            <AnimatedList
              items={centres.map(centre => `${centre.nom || centre.name || 'Nom non disponible'} - ${centre.ville || 'Ville non disponible'}`)}
              onItemSelect={(item, index) => {
                const selectedCentre = centres[index];
                console.log('Centre sélectionné:', selectedCentre);
              }}
              expandedContent={(item, index) => {
                const centre = centres[index];
                return (
                  <div className="centre-admin-details">
                    <div className="centre-detail-section">
                      <h4>Informations du centre</h4>
                      <p>{centre.description || 'Centre de vacances de qualité'}</p>
                      
                      <div className="centre-detail">
                        <i className="fas fa-map-marker-alt"></i>
                        <span>{centre.adresse || centre.address || 'Adresse non disponible'}, {centre.ville || 'Ville non disponible'}</span>
                      </div>
                      
                      {(centre.telephone || centre.phone) && (
                        <div className="centre-detail">
                          <i className="fas fa-phone"></i>
                          <span>{centre.telephone || centre.phone}</span>
                        </div>
                      )}
                      
                      {centre.rating && (
                        <div className="centre-rating">
                          <div className="rating-stars">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={i < Math.floor(centre.rating) ? 'star filled' : 'star empty'}>
                                ★
                              </span>
                            ))}
                          </div>
                          <span className="rating-value">{centre.rating}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="centre-admin-actions">
                      <button 
                        onClick={() => handleEditCentre(centre)}
                        className="btn-edit"
                        title="Modifier le centre"
                      >
                        <i className="fas fa-edit"></i> Modifier
                      </button>
                      <button 
                        onClick={() => handleDeleteCentre(centre.id || centre.name)}
                        className="btn-delete"
                        title="Supprimer le centre"
                      >
                        <i className="fas fa-trash"></i> Supprimer
                      </button>
                    </div>
                  </div>
                );
              }}
              showGradients={true}
              enableArrowNavigation={true}
              displayScrollbar={true}
              className="centres-animated-list"
              itemClassName="centre-item"
            />
          </div>
        </div>

        {/* Add/Edit Centre Modal */}
        {(showEditModal || showAddModal) && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>{editingCentre ? 'Modifier le centre' : 'Ajouter un centre'}</h3>
                <button onClick={handleCancelEdit} className="btn-close">
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              <div className="modal-body">
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
                  <label>Adresse:</label>
                  <input
                    type="text"
                    value={centreForm.adresse}
                    onChange={(e) => setCentreForm({...centreForm, adresse: e.target.value})}
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
                  <label>Description:</label>
                  <textarea
                    value={centreForm.description}
                    onChange={(e) => setCentreForm({...centreForm, description: e.target.value})}
                    className="form-textarea"
                    rows="3"
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
                
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={centreForm.actif}
                      onChange={(e) => setCentreForm({...centreForm, actif: e.target.checked})}
                      className="form-checkbox"
                    />
                    Centre actif
                  </label>
                </div>
              </div>
              
              <div className="modal-footer">
                <button onClick={handleCancelEdit} className="btn-cancel">
                  Annuler
                </button>
                <button onClick={handleSaveCentre} className="btn-save">
                  {editingCentre ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminCentres

