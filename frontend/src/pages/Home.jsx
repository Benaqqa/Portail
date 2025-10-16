import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react'
import api from '../services/api'
import '../colors.css'
import './Home.css'

function Home() {
  const { user, logout } = useAuth()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeSection, setActiveSection] = useState('actualites')
  const [nombrePersonnes, setNombrePersonnes] = useState(1)
  const [centres, setCentres] = useState([])
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    cin: user?.cin || '',
    telephone: user?.telephone || '',
    email: user?.email || '',
    centreId: '',
    typeLogementId: '',
    dateDebut: '',
    dateFin: '',
    nombrePersonnes: 1,
    paymentMethod: '',
    notes: ''
  })


  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  // Charger les centres quand la section réservation est activée
  useEffect(() => {
    if (activeSection === 'reservation' && centres.length === 0) {
      loadCentres()
    }
  }, [activeSection, centres.length])

  const handleSectionClick = (section) => {
    setActiveSection(section);
  };

  const handleNombrePersonnesChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    setNombrePersonnes(Math.min(Math.max(value, 1), 10)); // Clamp between 1 and 10
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    }
  };

  const handlePrevStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (currentStep === 2) {
      try {
        // Prepare reservation data
        const reservationData = {
          matricule: user?.matricule || 'MATRICULE-ADMIN',
          cin: formData.cin,
          telephone: formData.telephone,
          email: formData.email,
          centreId: parseInt(formData.centreId),
          typeLogementId: parseInt(formData.typeLogementId),
          dateDebut: formData.dateDebut,
          dateFin: formData.dateFin,
          nombrePersonnes: parseInt(formData.nombrePersonnes),
          paymentMethod: formData.paymentMethod,
          notes: formData.notes || '',
          status: 'EN_ATTENTE' // Default status
        };

        // Add person information if more than 1 person
        if (nombrePersonnes > 1) {
          reservationData.personnes = [];
          for (let i = 2; i <= nombrePersonnes; i++) {
            const nomField = document.getElementById(`nom_${i}`);
            const cinField = document.getElementById(`cin_${i}`);
            if (nomField && cinField) {
              reservationData.personnes.push({
                nom: nomField.value,
                cin: cinField.value
              });
            }
          }
        }

        // Send reservation to backend using API service
        const response = await api.post('/api/reservations', reservationData);
        
        alert('Réservation créée avec succès! Numéro: ' + (response.data.id || 'N/A'));
        
        // Reset form
        setCurrentStep(1);
        setFormData({
          cin: user?.cin || '',
          telephone: user?.telephone || '',
          email: user?.email || '',
          centreId: '',
          typeLogementId: '',
          dateDebut: '',
          dateFin: '',
          nombrePersonnes: 1,
          paymentMethod: '',
          notes: ''
        });
        setNombrePersonnes(1);
      } catch (error) {
        console.error('Erreur lors de la soumission de la réservation:', error);
        
        let errorMessage = 'Erreur lors de la création de la réservation.';
        
        if (error.response) {
          // Server responded with error status
          if (error.response.status === 401) {
            errorMessage = 'Vous n\'êtes pas autorisé. Veuillez vous reconnecter.';
          } else if (error.response.status === 400) {
            errorMessage = 'Données invalides. Vérifiez les informations saisies.';
          } else if (error.response.status === 500) {
            errorMessage = 'Erreur du serveur. Veuillez réessayer plus tard.';
          } else {
            errorMessage = `Erreur ${error.response.status}: ${error.response.data?.message || 'Erreur inconnue'}`;
          }
        } else if (error.request) {
          // Network error
          errorMessage = 'Impossible de contacter le serveur. Vérifiez votre connexion.';
        }
        
        alert(errorMessage);
      }
    } else {
      handleNextStep();
    }
  };

  // Fonction pour récupérer les centres depuis l'API
  const loadCentres = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/centres')
      if (response.ok) {
        const data = await response.json()
        setCentres(data)
      } else {
        console.error('Erreur lors de la récupération des centres')
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des centres:', error)
    }
  };

  const renderPersonFields = () => {
    if (nombrePersonnes < 2) return null;
    
    const fields = [];
    for (let i = 2; i <= nombrePersonnes; i++) {
      fields.push(
        <div key={i} className="person-info-section">
          <h3 className="person-title">Personne {i}</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor={`nom_${i}`}>
                <i className="fas fa-user"></i> Nom complet *
              </label>
              <input
                type="text"
                id={`nom_${i}`}
                name={`nom_${i}`}
                required
                className="form-input"
                placeholder="Ex: Jean Dupont"
              />
            </div>
            <div className="form-group">
              <label htmlFor={`cin_${i}`}>
                <i className="fas fa-id-card"></i> CIN *
              </label>
              <input
                type="text"
                id={`cin_${i}`}
                name={`cin_${i}`}
                required
                className="form-input"
                placeholder="Entrez le CIN"
              />
            </div>
          </div>
        </div>
      );
    }
    return fields;
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'actualites':
        return (
          <section className="actualites-section">
            <div className="actualites-list">
              <div className="actualite-item aligned">
                <div className="actualite-image-placeholder">
                  <img src="/src/Logo/vacances.webp" alt="Nouveau portail" />
                </div>
                <div className="actualite-content">
                  <div className="actualite-meta">
                    <span className="actualite-date">15 Janvier 2025</span>
                  </div>
                  <h3 className="actualite-title">Lancement du Portail Interactif COS'ONE</h3>
                  <p className="actualite-text">
                    Découvrez notre nouvelle plateforme digitale qui révolutionne l'expérience du personnel. 
                    Accédez à tous vos services en ligne avec une interface moderne et intuitive.
                  </p>
                  <div className="actualite-actions">
                    <a href="#" className="btn-actualite">Lire la suite</a>
                    <a href="#" className="btn-download">Télécharger le communiqué</a>
                  </div>
                </div>
              </div>

              <div className="actualite-item aligned">
                <div className="actualite-image-placeholder">
                  <img src="/src/Logo/kids.jpg" alt="Assemblée générale" />
                </div>
                <div className="actualite-content">
                  <div className="actualite-meta">
                    <span className="actualite-date">10 Janvier 2025</span>
                  </div>
                  <h3 className="actualite-title">Assemblée Générale du COS'ONE 2025</h3>
                  <p className="actualite-text">
                    L'assemblée générale annuelle se tiendra le 28 février 2025. 
                    Inscription obligatoire via le portail jusqu'au 20 février.
                  </p>
                  <div className="actualite-actions">
                    <a href="#" className="btn-actualite">S'inscrire</a>
                    <a href="#" className="btn-download">Télécharger le communiqué</a>
                  </div>
                </div>
              </div>

              <div className="actualite-item aligned">
                <div className="actualite-image-placeholder">
                  <img src="/src/Logo/vacances 1.webp" alt="Formation en ligne" />
                </div>
                <div className="actualite-content">
                  <div className="actualite-meta">
                    <span className="actualite-date">8 Janvier 2025</span>
                  </div>
                  <h3 className="actualite-title">Nouveaux Modules de Formation en Ligne</h3>
                  <p className="actualite-text">
                    Découvrez nos nouveaux modules de formation disponibles sur la plateforme : 
                    gestion du stress, communication digitale et bien-être au travail.
                  </p>
                  <div className="actualite-actions">
                    <a href="#" className="btn-actualite">Consulter le catalogue</a>
                    <a href="#" className="btn-download">Télécharger le communiqué</a>
                  </div>
                </div>
              </div>

              <div className="actualite-item aligned">
                <div className="actualite-image-placeholder">
                  <img src="/src/Logo/vacances 2.webp" alt="Centres de vacances" />
                </div>
                <div className="actualite-content">
                  <div className="actualite-meta">
                    <span className="actualite-date">5 Janvier 2025</span>
                  </div>
                  <h3 className="actualite-title">Ouverture des Réservations Été 2025</h3>
                  <p className="actualite-text">
                    Les réservations pour les centres de vacances d'été sont maintenant ouvertes. 
                    Tarifs préférentiels pour les premiers inscrits.
                  </p>
                  <div className="actualite-actions">
                    <a href="#" className="btn-actualite">Réserver maintenant</a>
                    <a href="#" className="btn-download">Télécharger la brochure</a>
                  </div>
                </div>
              </div>

              <div className="actualite-item aligned">
                <div className="actualite-image-placeholder">
                  <img src="/src/Logo/centre_de_vacances.jpg" alt="Newsletter" />
                </div>
                <div className="actualite-content">
                  <div className="actualite-meta">
                    <span className="actualite-date">3 Janvier 2025</span>
                  </div>
                  <h3 className="actualite-title">Newsletter COS'ONE - Janvier 2025</h3>
                  <p className="actualite-text">
                    Retrouvez toutes les actualités du mois : nouveaux services, 
                    événements à venir et témoignages du personnel.
                  </p>
                  <div className="actualite-actions">
                    <a href="#" className="btn-actualite">Lire la newsletter</a>
                    <a href="#" className="btn-download">Télécharger PDF</a>
                  </div>
                </div>
              </div>

              <div className="actualite-item aligned">
                <div className="actualite-image-placeholder">
                  <img src="/src/Logo/LOGO.png" alt="Orientations stratégiques" />
                </div>
                <div className="actualite-content">
                  <div className="actualite-meta">
                    <span className="actualite-date">1er Janvier 2025</span>
                  </div>
                  <h3 className="actualite-title">Nouvelles Orientations Stratégiques 2025</h3>
                  <p className="actualite-text">
                    Découvrez les nouvelles orientations du COS'ONE pour 2025 : 
                    digitalisation, innovation sociale et proximité humaine renforcée.
                  </p>
                  <div className="actualite-actions">
                    <a href="#" className="btn-actualite">Consulter le document</a>
                    <a href="#" className="btn-download">Télécharger le communiqué</a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )
      
      case 'reservation':
        return (
          <section className="content-section">
            <div className="reservation-header">
              <h1><i className="fas fa-calendar-plus"></i> Nouvelle Réservation</h1>
              <div className="steps-indicator">
                <div className={`step ${currentStep === 1 ? 'active' : ''}`}>
                  <span className="step-number">1</span>
                  <span className="step-label">Informations</span>
                </div>
                <div className="step-divider"></div>
                <div className={`step ${currentStep === 2 ? 'active' : ''}`}>
                  <span className="step-number">2</span>
                  <span className="step-label">Paiement</span>
                </div>
              </div>
            </div>
            
            <form className="reservation-form" onSubmit={handleFormSubmit}>
              {currentStep === 1 && (
                <>
                  <h2>Informations personnelles</h2>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="matricule">
                        <i className="fas fa-id-badge"></i> Matricule *
                      </label>
                      <input
                        type="text"
                        id="matricule"
                        name="matricule"
                        value={user?.matricule || 'MATRICULE-ADMIN'}
                        readOnly
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="cin">
                        <i className="fas fa-id-card"></i> CIN *
                      </label>
                      <input
                        type="text"
                        id="cin"
                        name="cin"
                        value={formData.cin}
                        onChange={handleInputChange}
                        required
                        className="form-input"
                        placeholder="Entrez votre CIN"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="telephone">
                        <i className="fas fa-phone"></i> Téléphone *
                      </label>
                      <input
                        type="tel"
                        id="telephone"
                        name="telephone"
                        value={formData.telephone}
                        onChange={handleInputChange}
                        required
                        className="form-input"
                        placeholder="Ex: +212 6 12 34 56 78"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="email">
                        <i className="fas fa-envelope"></i> Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="form-input"
                        placeholder="Ex: admin@cosone.ma"
                      />
                    </div>
                  </div>

                  <hr className="section-divider" />
                  <h2>Informations de réservation</h2>
                  
                  <div className="form-group">
                    <label htmlFor="centreId">
                      <i className="fas fa-building"></i> Centre de vacances *
                    </label>
                    <select
                      id="centreId"
                      name="centreId"
                      required
                      className="form-select"
                    >
                      <option value="">Sélectionnez un centre</option>
                      {centres.map(centre => (
                        <option key={centre.id} value={centre.id}>
                          {centre.nom} - {centre.ville}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="typeLogementId">
                      <i className="fas fa-home"></i> Type de logement *
                    </label>
                    <select
                      id="typeLogementId"
                      name="typeLogementId"
                      required
                      className="form-select"
                    >
                      <option value="">Sélectionnez un type de logement</option>
                      <option value="1">Studio - 250 DH/nuit (Capacité: 2 personnes)</option>
                      <option value="2">Appartement 2 Chambres - 450 DH/nuit (Capacité: 4 personnes)</option>
                      <option value="3">Appartement 3 Chambres - 650 DH/nuit (Capacité: 6 personnes)</option>
                      <option value="4">Villa - 1200 DH/nuit (Capacité: 8 personnes)</option>
                    </select>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="dateDebut">
                        <i className="fas fa-calendar-alt"></i> Date d'arrivée *
                      </label>
                      <input
                        type="date"
                        id="dateDebut"
                        name="dateDebut"
                        min={new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                        required
                        className="form-input"
                      />
                      <small>Les réservations doivent être faites au moins 10 jours à l'avance</small>
                    </div>

                    <div className="form-group">
                      <label htmlFor="dateFin">
                        <i className="fas fa-calendar-alt"></i> Date de départ *
                      </label>
                      <input
                        type="date"
                        id="dateFin"
                        name="dateFin"
                        required
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="nombrePersonnes">
                      <i className="fas fa-users"></i> Nombre total de personnes *
                    </label>
                    <input
                      type="number"
                      id="nombrePersonnes"
                      name="nombrePersonnes"
                      min="1"
                      max="10"
                      value={nombrePersonnes}
                      onChange={handleNombrePersonnesChange}
                      required
                      className="form-input"
                    />
                  </div>

                  {nombrePersonnes >= 2 && (
                    <>
                      <hr className="section-divider" />
                      <h2>Informations des personnes supplémentaires</h2>
                      {renderPersonFields()}
                    </>
                  )}

                  <div className="form-actions">
                    <button type="submit" className="btn-primary">
                      Suivant <i className="fas fa-arrow-right"></i>
                    </button>
                  </div>
                </>
              )}

              {currentStep === 2 && (
                <>
                  <h2>Informations de paiement</h2>
                  <div className="form-group">
                    <label htmlFor="paymentMethod">
                      <i className="fas fa-credit-card"></i> Méthode de paiement *
                    </label>
                    <select
                      id="paymentMethod"
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleInputChange}
                      required
                      className="form-select"
                    >
                      <option value="">Sélectionnez une méthode</option>
                      <option value="cash">Espèces</option>
                      <option value="check">Chèque</option>
                      <option value="transfer">Virement bancaire</option>
                      <option value="later">Payer plus tard</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="notes">
                      <i className="fas fa-sticky-note"></i> Notes (optionnel)
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      className="form-input"
                      rows="4"
                      placeholder="Ajoutez des notes ou commentaires..."
                    ></textarea>
                  </div>

                  <div className="form-actions">
                    <button type="button" className="btn-secondary" onClick={handlePrevStep}>
                      <i className="fas fa-arrow-left"></i> Retour
                    </button>
                    <button type="submit" className="btn-primary">
                      Confirmer la réservation <i className="fas fa-check"></i>
                    </button>
                  </div>
                </>
              )}
              </form>
          </section>
        )
      
      case 'history':
        return (
          <section className="content-section" style={{borderTopColor: '#f59e0b'}}>
            <div className="section-header">
              <h2>Mes Réservations</h2>
              <p>Consultez l'historique de vos réservations et leur statut</p>
            </div>
            
            <div className="reservations-filters">
              <button className="filter-btn active">Toutes</button>
              <button className="filter-btn">Confirmées</button>
              <button className="filter-btn">En attente</button>
              <button className="filter-btn">Terminées</button>
            </div>
            
            <div className="reservations-list">
              <div className="reservation-card confirmed">
                <div className="card-header">
                  <div className="reservation-status confirmed">
                    <span className="status-icon">✓</span>
                    Confirmée
                  </div>
                  <div className="reservation-id">#RES-2025-001</div>
                </div>
                
                <div className="card-content">
                  <div className="reservation-details">
                    <h3>Centre d'Agadir</h3>
                    <div className="detail-row">
                      <span className="detail-label">Dates:</span>
                      <span className="detail-value">15 - 22 Janvier 2025</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Durée:</span>
                      <span className="detail-value">7 nuits</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Personnes:</span>
                      <span className="detail-value">2 adultes</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Logement:</span>
                      <span className="detail-value">Chambre Supérieure</span>
                    </div>
                  </div>
                  
                  <div className="card-actions">
                    <button className="btn-outline">Voir détails</button>
                    <button className="btn-outline">Modifier</button>
                    <button className="btn-danger">Annuler</button>
                  </div>
                </div>
              </div>
              
              <div className="reservation-card pending">
                <div className="card-header">
                  <div className="reservation-status pending">
                    <span className="status-icon">⏳</span>
                    En attente
                  </div>
                  <div className="reservation-id">#RES-2025-002</div>
                </div>
                
                <div className="card-content">
                  <div className="reservation-details">
                    <h3>Centre d'Ifrane</h3>
                    <div className="detail-row">
                      <span className="detail-label">Dates:</span>
                      <span className="detail-value">10 - 15 Mars 2025</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Durée:</span>
                      <span className="detail-value">5 nuits</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Personnes:</span>
                      <span className="detail-value">4 personnes</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Logement:</span>
                      <span className="detail-value">Suite Familiale</span>
                    </div>
                  </div>
                  
                  <div className="card-actions">
                    <button className="btn-outline">Voir détails</button>
                    <button className="btn-outline">Modifier</button>
                    <button className="btn-danger">Annuler</button>
                  </div>
                </div>
              </div>
              
              <div className="reservation-card completed">
                <div className="card-header">
                  <div className="reservation-status completed">
                    <span className="status-icon">✓</span>
                    Terminée
                  </div>
                  <div className="reservation-id">#RES-2024-089</div>
                </div>
                
                <div className="card-content">
                  <div className="reservation-details">
                    <h3>Centre de Merzouga</h3>
                    <div className="detail-row">
                      <span className="detail-label">Dates:</span>
                      <span className="detail-value">5 - 12 Décembre 2024</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Durée:</span>
                      <span className="detail-value">7 nuits</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Personnes:</span>
                      <span className="detail-value">1 personne</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Logement:</span>
                      <span className="detail-value">Chambre Standard</span>
                    </div>
                  </div>
                  
                  <div className="card-actions">
                    <button className="btn-outline">Voir détails</button>
                    <button className="btn-primary">Réserver à nouveau</button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )
      
      case 'profile':
        return (
          <section className="content-section">
            <h2>Mon Profil</h2>
            <div className="profile-form">
              <div className="profile-info">
                <div className="profile-avatar">
                  <i className="fas fa-user-circle"></i>
                </div>
                <div className="profile-details">
                  <h3>Informations personnelles</h3>
                  <div className="form-group">
                    <label>Nom d'utilisateur</label>
                    <input type="text" value={user?.username || ''} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" placeholder="votre.email@example.com" />
                  </div>
                  <div className="form-group">
                    <label>Téléphone</label>
                    <input type="tel" placeholder="+212 6XX XXX XXX" />
                  </div>
                  <div className="form-group">
                    <label>Rôle</label>
                    <input type="text" value={user?.role || ''} readOnly />
                  </div>
                  <button className="btn-primary">Mettre à jour</button>
                </div>
              </div>
            </div>
          </section>
        )
      
      case 'admin-centres':
        return (
          <section className="content-section">
            <h2>Gestion des Centres</h2>
            <p>Interface d'administration des centres en cours de développement...</p>
          </section>
        )
      
      case 'admin-users':
        return (
          <section className="content-section">
            <h2>Gestion des Utilisateurs</h2>
            <p>Interface d'administration des utilisateurs en cours de développement...</p>
          </section>
        )
      
      case 'admin-reservations':
        return (
          <section className="content-section">
            <h2>Toutes les Réservations</h2>
            <p>Interface d'administration des réservations en cours de développement...</p>
          </section>
        )
      
      case 'admin-actualites':
        return (
          <section className="content-section">
            <h2>Gestion des Actualités</h2>
            <p>Interface d'administration des actualités en cours de développement...</p>
          </section>
        )
      
      case 'admin-codes':
        return (
          <section className="content-section">
            <h2>Gestion des Codes OTP</h2>
            <p>Interface d'administration des codes OTP en cours de développement...</p>
          </section>
        )
      
      default:
        return (
          <section className="content-section" style={{borderTopColor: '#ef4444'}}>
            <h2>Section: {activeSection}</h2>
            <p>This section is not implemented yet.</p>
          </section>
        )
    }
  }

  return (
    <div className="dashboard-layout">
      {/* Top Navigation */}
      <nav className="dashboard-navbar">
        <div className="navbar-content">
          <div className="navbar-left">
            <button className="sidebar-toggle" onClick={toggleSidebar}>
              <i className="fas fa-bars"></i>
            </button>
          <div className="logo">
            <img src="/src/Logo/LOGO.png" alt="COSONE Logo" />
              <span className="logo-text">Conseil des Œuvres Sociales de l'ONE</span>
            </div>
          </div>
          <div className="navbar-right">
            <span className="welcome">Bienvenue, {user?.username}</span>
            <button onClick={logout} className="btn-logout">
              <i className="fas fa-sign-out-alt"></i>
              Déconnexion
            </button>
          </div>
        </div>
      </nav>

      <div className="dashboard-container">
        {/* Sidebar */}
        <aside className={`dashboard-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
          <div className="sidebar-menu">
            {/* User Menu Items */}
            <div className="menu-section">
              <h3 className="menu-title">Tableau de Bord</h3>
              <button 
                className={`menu-item ${activeSection === 'actualites' ? 'active' : ''}`}
                onClick={() => handleSectionClick('actualites')}
              >
                <i className="fas fa-home"></i>
                <span>Accueil</span>
              </button>
              <button 
                className={`menu-item ${activeSection === 'reservation' ? 'active' : ''}`}
                onClick={() => handleSectionClick('reservation')}
              >
                <i className="fas fa-calendar-plus"></i>
                <span>Créer Réservation</span>
              </button>
              <button 
                className={`menu-item ${activeSection === 'history' ? 'active' : ''}`}
                onClick={() => handleSectionClick('history')}
              >
                <i className="fas fa-history"></i>
                <span>Mes Réservations</span>
              </button>
              <button 
                className={`menu-item ${activeSection === 'profile' ? 'active' : ''}`}
                onClick={() => handleSectionClick('profile')}
              >
                <i className="fas fa-user"></i>
                <span>Mon Profil</span>
              </button>
            </div>

            {/* Admin Menu Items */}
            {user?.role === 'ADMIN' && (
              <div className="menu-section">
                <h3 className="menu-title">Administration</h3>
                <button 
                  className={`menu-item admin ${activeSection === 'admin-centres' ? 'active' : ''}`}
                  onClick={() => handleSectionClick('admin-centres')}
                >
                  <i className="fas fa-building"></i>
                  <span>Gestion Centres</span>
                </button>
                <button 
                  className={`menu-item admin ${activeSection === 'admin-users' ? 'active' : ''}`}
                  onClick={() => handleSectionClick('admin-users')}
                >
                  <i className="fas fa-users"></i>
                  <span>Utilisateurs</span>
                </button>
                <button 
                  className={`menu-item admin ${activeSection === 'admin-reservations' ? 'active' : ''}`}
                  onClick={() => handleSectionClick('admin-reservations')}
                >
                  <i className="fas fa-list-alt"></i>
                  <span>Toutes les Réservations</span>
                </button>
                <button 
                  className={`menu-item admin ${activeSection === 'admin-actualites' ? 'active' : ''}`}
                  onClick={() => handleSectionClick('admin-actualites')}
                >
                  <i className="fas fa-newspaper"></i>
                  <span>Actualités</span>
                </button>
                <button 
                  className={`menu-item admin ${activeSection === 'admin-codes' ? 'active' : ''}`}
                  onClick={() => handleSectionClick('admin-codes')}
                >
                  <i className="fas fa-key"></i>
                  <span>Codes OTP</span>
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="dashboard-main">
          <div className="dashboard-content">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-column">
              <h4>À Propos</h4>
              <ul>
                <li><a href="#about">Qui Sommes-Nous</a></li>
                <li><a href="#mission">Notre Mission</a></li>
                <li><a href="#team">Notre Équipe</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Services</h4>
              <ul>
                <li><Link to="/reservation">Réservation en Ligne</Link></li>
                <li><a href="#centres">Nos Centres</a></li>
                <li><a href="#prices">Tarifs</a></li>
                <li><a href="#faq">FAQ</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Légal</h4>
              <ul>
                <li><a href="#privacy">Confidentialité</a></li>
                <li><a href="#terms">Conditions d'Utilisation</a></li>
                <li><a href="#cookies">Politique de Cookies</a></li>
                <li><a href="#cgv">CGV</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Suivez-Nous</h4>
              <div className="social-links">
                <a href="#facebook" className="social-link">Facebook</a>
                <a href="#twitter" className="social-link">Twitter</a>
                <a href="#instagram" className="social-link">Instagram</a>
                <a href="#linkedin" className="social-link">LinkedIn</a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2025 COSONE - Centre des Œuvres Sociales de l'ONE. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home

