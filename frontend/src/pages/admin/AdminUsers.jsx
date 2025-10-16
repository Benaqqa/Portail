import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminService } from '../../services/adminService'

function AdminUsers() {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingUser, setEditingUser] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editForm, setEditForm] = useState({
    username: '',
    matricule: '',
    numCin: '',
    phoneNumber: '',
    role: 'USER'
  })

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const data = await adminService.getAllUsers()
        setUsers(data.users || data || [])
      } catch (err) {
        console.error('Erreur lors du chargement des utilisateurs:', err)
        setError('Erreur lors du chargement des utilisateurs')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleEditUser = (user) => {
    setEditingUser(user)
    setEditForm({
      username: user.username || '',
      matricule: user.matricule || '',
      numCin: user.numCin || '',
      phoneNumber: user.phoneNumber || '',
      role: user.role || 'USER'
    })
    setShowEditModal(true)
  }

  const handleSaveUser = async () => {
    try {
      await adminService.updateUser(editingUser.id, editForm)
      // Refresh the users list
      const data = await adminService.getAllUsers()
      setUsers(data.users || data || [])
      setShowEditModal(false)
      setEditingUser(null)
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err)
      setError('Erreur lors de la mise à jour de l\'utilisateur')
    }
  }

  const handleCancelEdit = () => {
    setShowEditModal(false)
    setEditingUser(null)
    setEditForm({
      username: '',
      matricule: '',
      numCin: '',
      phoneNumber: '',
      role: 'USER'
    })
  }

  if (loading) {
    return (
      <div className="page-container">
        <div className="container">
          <h1>Gestion des Utilisateurs</h1>
          <p>Chargement des utilisateurs...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="container">
          <h1>Gestion des Utilisateurs</h1>
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
            <h1>Gestion des Utilisateurs</h1>
            <p className="subtitle">Administration et gestion des utilisateurs du système</p>
          </div>
        </div>
        
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{users.length}</div>
            <div className="stat-label">Total des utilisateurs</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{users.filter(u => u.password).length}</div>
            <div className="stat-label">Avec mot de passe</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{users.filter(u => u.role === 'ADMIN').length}</div>
            <div className="stat-label">Administrateurs</div>
          </div>
        </div>
        
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom d'utilisateur</th>
                <th>Matricule</th>
                <th>CIN</th>
                <th>Téléphone</th>
                <th>Rôle</th>
                <th>Mot de passe</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.matricule || 'N/A'}</td>
                  <td>{user.numCin || 'N/A'}</td>
                  <td>{user.phoneNumber || 'N/A'}</td>
                  <td>
                    <span className={`role-badge role-${user.role?.toLowerCase()}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span className={`password-status ${user.password ? 'has-password' : 'no-password'}`}>
                      {user.password ? '✓ Défini' : '✗ Non défini'}
                    </span>
                  </td>
                  <td>
                    <button 
                      onClick={() => handleEditUser(user)}
                      className="btn-edit"
                      title="Modifier l'utilisateur"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Edit User Modal */}
        {showEditModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Modifier l'utilisateur</h3>
                <button onClick={handleCancelEdit} className="btn-close">
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              <div className="modal-body">
                <div className="form-group">
                  <label>Nom d'utilisateur:</label>
                  <input
                    type="text"
                    value={editForm.username}
                    onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label>Matricule:</label>
                  <input
                    type="text"
                    value={editForm.matricule}
                    onChange={(e) => setEditForm({...editForm, matricule: e.target.value})}
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label>CIN:</label>
                  <input
                    type="text"
                    value={editForm.numCin}
                    onChange={(e) => setEditForm({...editForm, numCin: e.target.value})}
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label>Téléphone:</label>
                  <input
                    type="text"
                    value={editForm.phoneNumber}
                    onChange={(e) => setEditForm({...editForm, phoneNumber: e.target.value})}
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label>Rôle:</label>
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                    className="form-select"
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
              </div>
              
              <div className="modal-footer">
                <button onClick={handleCancelEdit} className="btn-cancel">
                  Annuler
                </button>
                <button onClick={handleSaveUser} className="btn-save">
                  Sauvegarder
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminUsers

