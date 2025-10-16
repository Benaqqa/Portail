import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminService } from '../../services/adminService'

function AdminActualites() {
  const navigate = useNavigate()
  const [actualites, setActualites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingActualite, setEditingActualite] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [actualiteForm, setActualiteForm] = useState({
    titre: '',
    contenu: '',
    datePublication: new Date().toISOString().split('T')[0],
    imageUrl: '',
    pieceJointe: '',
    featured: false
  })

  useEffect(() => {
    const fetchActualites = async () => {
      try {
        setLoading(true)
        const data = await adminService.getActualites()
        setActualites(data.actualites || data || [])
      } catch (err) {
        console.error('Erreur lors du chargement des actualités:', err)
        setError('Erreur lors du chargement des actualités')
      } finally {
        setLoading(false)
      }
    }

    fetchActualites()
  }, [])

  const handleEditActualite = (actualite) => {
    setEditingActualite(actualite)
    setActualiteForm({
      titre: actualite.titre || '',
      contenu: actualite.contenu || '',
      datePublication: actualite.datePublication || new Date().toISOString().split('T')[0],
      imageUrl: actualite.imageUrl || '',
      pieceJointe: actualite.pieceJointe || '',
      featured: actualite.featured || false
    })
    setShowEditModal(true)
  }

  const handleAddActualite = () => {
    setEditingActualite(null)
    setActualiteForm({
      titre: '',
      contenu: '',
      datePublication: new Date().toISOString().split('T')[0],
      imageUrl: '',
      pieceJointe: '',
      featured: false
    })
    setShowAddModal(true)
  }

  const handleSaveActualite = async () => {
    try {
      if (editingActualite) {
        await adminService.updateActualite(editingActualite.id, actualiteForm)
      } else {
        await adminService.createActualite(actualiteForm)
      }
      // Refresh the actualités list
      const data = await adminService.getActualites()
      setActualites(data.actualites || data || [])
      setShowEditModal(false)
      setShowAddModal(false)
      setEditingActualite(null)
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err)
      setError('Erreur lors de la sauvegarde de l\'actualité')
    }
  }

  const handleDeleteActualite = async (actualiteId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette actualité ?')) {
      try {
        await adminService.deleteActualite(actualiteId)
        // Refresh the actualités list
        const data = await adminService.getActualites()
        setActualites(data.actualites || data || [])
      } catch (err) {
        console.error('Erreur lors de la suppression:', err)
        setError('Erreur lors de la suppression de l\'actualité')
      }
    }
  }

  const handleCancelEdit = () => {
    setShowEditModal(false)
    setShowAddModal(false)
    setEditingActualite(null)
    setActualiteForm({
      titre: '',
      contenu: '',
      datePublication: new Date().toISOString().split('T')[0],
      imageUrl: '',
      pieceJointe: '',
      featured: false
    })
  }

  if (loading) {
    return (
      <div className="page-container">
        <div className="container">
          <h1>Gestion des Actualités</h1>
          <p>Chargement des actualités...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="container">
          <h1>Gestion des Actualités</h1>
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
            <h1>Gestion des Actualités</h1>
            <p className="subtitle">Administration et gestion des actualités COS'ONE</p>
          </div>
          <button onClick={handleAddActualite} className="btn-add">
            <i className="fas fa-plus"></i> Ajouter une actualité
          </button>
        </div>
        
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{actualites.length}</div>
            <div className="stat-label">Total des actualités</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{actualites.filter(a => a.featured).length}</div>
            <div className="stat-label">Actualités en vedette</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{actualites.filter(a => new Date(a.datePublication) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}</div>
            <div className="stat-label">Cette semaine</div>
          </div>
        </div>
        
        <div className="actualites-admin-grid">
          {actualites.map((actualite, index) => (
            <div key={index} className={`actualite-admin-card ${actualite.featured ? 'featured' : ''}`}>
              <div className="actualite-admin-header">
                <h3>{actualite.titre}</h3>
                <div className="actualite-actions">
                  <button 
                    onClick={() => handleEditActualite(actualite)}
                    className="btn-edit-small"
                    title="Modifier"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button 
                    onClick={() => handleDeleteActualite(actualite.id)}
                    className="btn-delete-small"
                    title="Supprimer"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
              <p className="actualite-date">{new Date(actualite.datePublication).toLocaleDateString('fr-FR')}</p>
              <p className="actualite-preview">{actualite.contenu.substring(0, 100)}...</p>
              {actualite.imageUrl && (
                <div className="actualite-image-preview">
                  <img src={actualite.imageUrl} alt="Preview" />
                </div>
              )}
              {actualite.featured && (
                <div className="featured-badge">En vedette</div>
              )}
            </div>
          ))}
        </div>

        {/* Add/Edit Actualité Modal */}
        {(showEditModal || showAddModal) && (
          <div className="modal-overlay">
            <div className="modal-content large-modal">
              <div className="modal-header">
                <h3>{editingActualite ? 'Modifier l\'actualité' : 'Ajouter une actualité'}</h3>
                <button onClick={handleCancelEdit} className="btn-close">
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              <div className="modal-body">
                <div className="form-group">
                  <label>Titre:</label>
                  <input
                    type="text"
                    value={actualiteForm.titre}
                    onChange={(e) => setActualiteForm({...actualiteForm, titre: e.target.value})}
                    className="form-input"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Contenu:</label>
                  <textarea
                    value={actualiteForm.contenu}
                    onChange={(e) => setActualiteForm({...actualiteForm, contenu: e.target.value})}
                    className="form-textarea"
                    rows="6"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Date de publication:</label>
                  <input
                    type="date"
                    value={actualiteForm.datePublication}
                    onChange={(e) => setActualiteForm({...actualiteForm, datePublication: e.target.value})}
                    className="form-input"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>URL de l'image:</label>
                  <input
                    type="url"
                    value={actualiteForm.imageUrl}
                    onChange={(e) => setActualiteForm({...actualiteForm, imageUrl: e.target.value})}
                    className="form-input"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                
                <div className="form-group">
                  <label>URL de la pièce jointe:</label>
                  <input
                    type="url"
                    value={actualiteForm.pieceJointe}
                    onChange={(e) => setActualiteForm({...actualiteForm, pieceJointe: e.target.value})}
                    className="form-input"
                    placeholder="https://example.com/document.pdf"
                  />
                </div>
                
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={actualiteForm.featured}
                      onChange={(e) => setActualiteForm({...actualiteForm, featured: e.target.checked})}
                      className="form-checkbox"
                    />
                    Actualité en vedette (flash)
                  </label>
                </div>
              </div>
              
              <div className="modal-footer">
                <button onClick={handleCancelEdit} className="btn-cancel">
                  Annuler
                </button>
                <button onClick={handleSaveActualite} className="btn-save">
                  {editingActualite ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminActualites
