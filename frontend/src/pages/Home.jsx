import { Link, useNavigate } from 'react-router-dom'
import AdminCentres from './admin/AdminCentres'
import AdminReservations from './admin/AdminReservations'
import AdminUsers from './admin/AdminUsers'
import AdminGenerateCode from './admin/AdminGenerateCode'
import AdminActualites from './admin/AdminActualites'
import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react'
import api from '../services/api'
import reservationService from '../services/reservationService'
import '../colors.css'
import './Home.css'

function Home() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeSection, setActiveSection] = useState('actualites')
  const [dynamicActualites, setDynamicActualites] = useState([])
  const [actualitesLoading, setActualitesLoading] = useState(false)
  const [actualitesError, setActualitesError] = useState('')
  const [nombrePersonnes, setNombrePersonnes] = useState(1)
  const [centres, setCentres] = useState([])
  const [currentStep, setCurrentStep] = useState(1)
  const [reservationFilter, setReservationFilter] = useState('all')
  const [reservations, setReservations] = useState([])
  const [reservationsLoading, setReservationsLoading] = useState(false)
  const [reservationsError, setReservationsError] = useState('')
  const [expandedReservations, setExpandedReservations] = useState(new Set())
  const [profileData, setProfileData] = useState({
    email: user?.email || '',
    telephone: user?.phoneNumber || ''
  })
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileError, setProfileError] = useState('')
  const [profileSuccess, setProfileSuccess] = useState('')
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

  // Charger les actualités dynamiques quand la section actualités est activée
  useEffect(() => {
    const loadActualites = async () => {
      try {
        setActualitesLoading(true)
        setActualitesError('')
        const resp = await api.get('/api/public/actualites')
        const list = resp.data?.actualites || resp.data || []
        setDynamicActualites(list)
      } catch (e) {
        console.error('Erreur chargement actualités:', e)
        setActualitesError("Impossible de charger les actualités")
      } finally {
        setActualitesLoading(false)
      }
    }

    if (activeSection === 'actualites' && dynamicActualites.length === 0) {
      loadActualites()
    }
  }, [activeSection, dynamicActualites.length])

  // Charger les réservations quand la section history est activée
  useEffect(() => {
    if (activeSection === 'history' && reservations.length === 0) {
      if (user) {
        setReservationsError('') // Clear any previous error
        loadReservations()
      } else {
        // User is not authenticated, show message instead of loading
        setReservationsError('Vous devez être connecté pour voir vos réservations.')
      }
    }
  }, [activeSection, reservations.length, user])

  const handleSectionClick = (section) => {
    setActiveSection(section);
  };

  const handleFilterChange = (filter) => {
    setReservationFilter(filter);
  };

  const toggleReservationExpansion = (reservationId) => {
    const newExpanded = new Set(expandedReservations);
    if (newExpanded.has(reservationId)) {
      newExpanded.delete(reservationId);
    } else {
      newExpanded.add(reservationId);
    }
    setExpandedReservations(newExpanded);
  };

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileError('');
    setProfileSuccess('');

    try {
      const response = await api.put('/api/user/profile', profileData);
      
      // Update the user context with new data
      const updatedUser = { ...user, ...profileData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setProfileSuccess('Profil mis à jour avec succès!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setProfileSuccess('');
      }, 3000);
      
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      
      let errorMessage = 'Erreur lors de la mise à jour du profil.';
      
      if (error.response) {
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
        errorMessage = 'Impossible de contacter le serveur. Vérifiez votre connexion.';
      }
      
      setProfileError(errorMessage);
    } finally {
      setProfileLoading(false);
    }
  };

  const loadReservations = async () => {
    try {
      setReservationsLoading(true)
      setReservationsError('')
      
      console.log('Loading reservations for user:', user?.matricule, user?.numCin)
      
      // Try matricule first (better for admin users), fallback to CIN
      let data = await reservationService.getUserReservationsByMatricule()
      console.log('Reservations by matricule:', data)
      
      if (!data || data.length === 0) {
        console.log('No reservations found by matricule, trying CIN...')
        data = await reservationService.getUserReservationsByCin()
        console.log('Reservations by CIN:', data)
      }
      
      setReservations(data)
    } catch (error) {
      console.error('Erreur lors du chargement des réservations:', error)
      if (error.response?.status === 401) {
        setReservationsError('Vous devez être connecté pour voir vos réservations. Veuillez vous reconnecter.')
        // Clear auth data and redirect to login
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
      } else {
        setReservationsError('Erreur lors du chargement des réservations. Veuillez réessayer.')
        setReservations([])
      }
    } finally {
      setReservationsLoading(false)
    }
  };

  const filteredReservations = reservations.filter(reservation => {
    if (reservationFilter === 'all') return true;
    if (reservationFilter === 'confirmed') return reservation.statut === 'CONFIRMEE';
    if (reservationFilter === 'pending') return reservation.statut === 'EN_ATTENTE_PAIEMENT';
    if (reservationFilter === 'completed') return reservation.statut === 'ANNULEE'; // Assuming cancelled means completed for now
    return true;
  });

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
        // Validate required fields
        if (!formData.dateDebut || !formData.dateFin) {
          alert('Veuillez sélectionner les dates de début et de fin.');
          return;
        }
        if (!formData.centreId || !formData.typeLogementId) {
          alert('Veuillez sélectionner un centre et un type de logement.');
          return;
        }
        if (!formData.cin || !formData.telephone || !formData.email) {
          alert('Veuillez remplir tous les champs obligatoires.');
          return;
        }

        // Prepare reservation data
        const reservationData = {
          matricule: user?.matricule || 'MATRICULE-ADMIN',
          cin: formData.cin,
          telephone: formData.telephone,
          email: formData.email,
          centreId: parseInt(formData.centreId),
          typeLogementId: parseInt(formData.typeLogementId),
          dateDebut: formData.dateDebut + 'T00:00:00', // Convert to LocalDateTime format
          dateFin: formData.dateFin + 'T00:00:00', // Convert to LocalDateTime format
          nombrePersonnes: parseInt(formData.nombrePersonnes),
          paymentMethod: formData.paymentMethod,
          commentaires: formData.notes || '', // Changed from 'notes' to 'commentaires'
          status: 'EN_ATTENTE' // Default status
        };

        // Add person information if more than 1 person
        if (nombrePersonnes > 1) {
          reservationData.personnesAccompagnement = []; // Changed from 'personnes' to 'personnesAccompagnement'
          for (let i = 2; i <= nombrePersonnes; i++) {
            const nomField = document.getElementById(`nom_${i}`);
            const cinField = document.getElementById(`cin_${i}`);
            if (nomField && cinField) {
              reservationData.personnesAccompagnement.push({
                nom: nomField.value,
                prenom: '', // Add required prenom field
                cin: cinField.value,
                telephone: '', // Add required telephone field
                lienParente: 'Accompagnant' // Add required lienParente field
              });
            }
          }
        }

        // Debug: Log the data being sent
        console.log('Reservation data being sent:', reservationData);

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

  // Handler functions for reservation buttons
  const handleReserverANouveau = () => {
    setActiveSection('reservation');
  };

  const handleVoirDetails = (reservationId) => {
    navigate(`/reservation/details/${reservationId}`);
  };

  const handleModifierReservation = (reservationId) => {
    // For now, navigate to details page where user can see options
    navigate(`/reservation/details/${reservationId}`);
  };

  const handleAnnulerReservation = async (reservationId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
      return;
    }

    try {
      await reservationService.cancelReservation(reservationId);
      // Reload reservations
      loadReservations();
    } catch (err) {
      alert('Erreur lors de l\'annulation de la réservation');
      console.error(err);
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
              {actualitesLoading && (
                <div className="loading-container"><div className="loading-spinner"></div><p>Chargement des actualités...</p></div>
              )}
              {actualitesError && (
                <div className="alert alert-error"><i className="fas fa-exclamation-circle"></i> {actualitesError}</div>
              )}
              {(!actualitesLoading && dynamicActualites.length === 0 && !actualitesError) && (
                <div className="empty-state"><p>Aucune actualité publiée pour le moment.</p></div>
              )}
              {dynamicActualites.map((act, idx) => (
                <div key={act.id || idx} className="actualite-item aligned">
                  <div className="actualite-image-placeholder">
                    {act.imageUrl ? (
                      <img src={act.imageUrl} alt={act.titre || 'Actualité'} />
                    ) : (
                      <img src="/src/Logo/LOGO.png" alt="Actualité" />
                    )}
                  </div>
                  <div className="actualite-content">
                    <div className="actualite-meta">
                      <span className="actualite-date">{act.datePublication ? new Date(act.datePublication).toLocaleDateString('fr-FR') : ''}</span>
                    </div>
                    <h3 className="actualite-title">{act.titre}</h3>
                    <p className="actualite-text">{act.contenu?.length > 300 ? act.contenu.substring(0, 300) + '…' : act.contenu}</p>
                  </div>
                </div>
              ))}
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
                      value={formData.centreId}
                      onChange={handleInputChange}
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
                      value={formData.typeLogementId}
                      onChange={handleInputChange}
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
                        value={formData.dateDebut}
                        onChange={handleInputChange}
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
                        value={formData.dateFin}
                        onChange={handleInputChange}
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
              <button 
                className={`filter-btn ${reservationFilter === 'all' ? 'active' : ''}`}
                onClick={() => handleFilterChange('all')}
              >
                Toutes
              </button>
              <button 
                className={`filter-btn ${reservationFilter === 'confirmed' ? 'active' : ''}`}
                onClick={() => handleFilterChange('confirmed')}
              >
                Confirmées
              </button>
              <button 
                className={`filter-btn ${reservationFilter === 'pending' ? 'active' : ''}`}
                onClick={() => handleFilterChange('pending')}
              >
                En attente
              </button>
              <button 
                className={`filter-btn ${reservationFilter === 'completed' ? 'active' : ''}`}
                onClick={() => handleFilterChange('completed')}
              >
                Terminées
              </button>
            </div>
            
            <div className="reservations-list">
              {!user && (
                <div className="alert alert-error">
                  <i className="fas fa-exclamation-circle"></i> Vous devez être connecté pour voir vos réservations.
                </div>
              )}
              
              {reservationsError && (
                <div className="alert alert-error">
                  <i className="fas fa-exclamation-circle"></i> {reservationsError}
                </div>
              )}
              
              {reservationsLoading ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <p>Chargement des réservations...</p>
                </div>
              ) : user ? (
                <>
                  {filteredReservations.map((reservation) => (
                    <div key={reservation.id} className={`reservation-card ${reservation.statut.toLowerCase().replace('_', '-')}`}>
                      <div className="card-header">
                        <div className={`reservation-status ${reservation.statut.toLowerCase().replace('_', '-')}`}>
                          {reservation.statut === 'CONFIRMEE' && 'Confirmée'}
                          {reservation.statut === 'EN_ATTENTE_PAIEMENT' && 'En attente'}
                          {reservation.statut === 'ANNULEE' && 'Annulée'}
                        </div>
                        <div className="reservation-id">#{reservation.id}</div>
                      </div>
                      
                      <div className="card-content">
                        <div className="reservation-details">
                          <h3>{reservation.centre?.nom || 'Centre non spécifié'}</h3>
                          <div className="detail-row">
                            <span className="detail-label">Dates:</span>
                            <span className="detail-value">
                              {new Date(reservation.dateDebut).toLocaleDateString('fr-FR')} - {new Date(reservation.dateFin).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label">Durée:</span>
                            <span className="detail-value">
                              {Math.ceil((new Date(reservation.dateFin) - new Date(reservation.dateDebut)) / (1000 * 60 * 60 * 24))} nuits
                            </span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label">Personnes:</span>
                            <span className="detail-value">{reservation.nombrePersonnes} personne{reservation.nombrePersonnes > 1 ? 's' : ''}</span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label">Logement:</span>
                            <span className="detail-value">{reservation.typeLogement?.nom || 'Type non spécifié'}</span>
                          </div>
                          {reservation.prixTotal && (
                            <div className="detail-row">
                              <span className="detail-label">Prix:</span>
                              <span className="detail-value">{reservation.prixTotal} MAD</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Expandable detailed information */}
                        {expandedReservations.has(reservation.id) && (
                          <div className="card-expanded-content">
                            <div className="expanded-details">
                              <h4>Informations détaillées</h4>
                              
                              <div className="detail-section">
                                <h5>Informations personnelles</h5>
                                <div className="detail-row">
                                  <span className="detail-label">CIN:</span>
                                  <span className="detail-value">{reservation.cin || 'Non spécifié'}</span>
                                </div>
                                <div className="detail-row">
                                  <span className="detail-label">Téléphone:</span>
                                  <span className="detail-value">{reservation.telephone || 'Non spécifié'}</span>
                                </div>
                                <div className="detail-row">
                                  <span className="detail-label">Email:</span>
                                  <span className="detail-value">{reservation.email || 'Non spécifié'}</span>
                                </div>
                                <div className="detail-row">
                                  <span className="detail-label">Matricule:</span>
                                  <span className="detail-value">{reservation.matricule || 'Non spécifié'}</span>
                                </div>
                              </div>

                              <div className="detail-section">
                                <h5>Détails du séjour</h5>
                                <div className="detail-row">
                                  <span className="detail-label">Date de début:</span>
                                  <span className="detail-value">
                                    {new Date(reservation.dateDebut).toLocaleDateString('fr-FR', {
                                      weekday: 'long',
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric'
                                    })}
                                  </span>
                                </div>
                                <div className="detail-row">
                                  <span className="detail-label">Date de fin:</span>
                                  <span className="detail-value">
                                    {new Date(reservation.dateFin).toLocaleDateString('fr-FR', {
                                      weekday: 'long',
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric'
                                    })}
                                  </span>
                                </div>
                                <div className="detail-row">
                                  <span className="detail-label">Date de réservation:</span>
                                  <span className="detail-value">
                                    {reservation.dateReservation ? 
                                      new Date(reservation.dateReservation).toLocaleDateString('fr-FR') : 
                                      'Non spécifié'
                                    }
                                  </span>
                                </div>
                              </div>

                              <div className="detail-section">
                                <h5>Informations du centre</h5>
                                <div className="detail-row">
                                  <span className="detail-label">Nom du centre:</span>
                                  <span className="detail-value">{reservation.centre?.nom || 'Non spécifié'}</span>
                                </div>
                                <div className="detail-row">
                                  <span className="detail-label">Adresse:</span>
                                  <span className="detail-value">{reservation.centre?.adresse || 'Non spécifié'}</span>
                                </div>
                                <div className="detail-row">
                                  <span className="detail-label">Téléphone:</span>
                                  <span className="detail-value">{reservation.centre?.telephone || 'Non spécifié'}</span>
                                </div>
                              </div>

                              <div className="detail-section">
                                <h5>Type de logement</h5>
                                <div className="detail-row">
                                  <span className="detail-label">Type:</span>
                                  <span className="detail-value">{reservation.typeLogement?.nom || 'Non spécifié'}</span>
                                </div>
                                <div className="detail-row">
                                  <span className="detail-label">Capacité:</span>
                                  <span className="detail-value">{reservation.typeLogement?.capacite || 'Non spécifié'} personnes</span>
                                </div>
                                <div className="detail-row">
                                  <span className="detail-label">Prix par nuit:</span>
                                  <span className="detail-value">{reservation.typeLogement?.prixParNuit || 'Non spécifié'} MAD</span>
                                </div>
                              </div>

                              {reservation.commentaires && (
                                <div className="detail-section">
                                  <h5>Commentaires</h5>
                                  <div className="commentaires-content">
                                    {reservation.commentaires}
                                  </div>
                                </div>
                              )}

                              {reservation.personnesAccompagnement && reservation.personnesAccompagnement.length > 0 && (
                                <div className="detail-section">
                                  <h5>Personnes accompagnantes</h5>
                                  {reservation.personnesAccompagnement.map((personne, index) => (
                                    <div key={index} className="accompagnant-item">
                                      <div className="detail-row">
                                        <span className="detail-label">Nom:</span>
                                        <span className="detail-value">{personne.nom || 'Non spécifié'}</span>
                                      </div>
                                      <div className="detail-row">
                                        <span className="detail-label">Prénom:</span>
                                        <span className="detail-value">{personne.prenom || 'Non spécifié'}</span>
                                      </div>
                                      <div className="detail-row">
                                        <span className="detail-label">CIN:</span>
                                        <span className="detail-value">{personne.cin || 'Non spécifié'}</span>
                                      </div>
                                      <div className="detail-row">
                                        <span className="detail-label">Lien de parenté:</span>
                                        <span className="detail-value">{personne.lienParente || 'Non spécifié'}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        
                        <div className="card-actions">
                          <button 
                            className="btn-outline"
                            onClick={() => toggleReservationExpansion(reservation.id)}
                          >
                            {expandedReservations.has(reservation.id) ? 'Masquer détails' : 'Voir détails'}
                          </button>
                          {reservation.statut === 'ANNULEE' ? (
                            <button 
                              className="btn-primary"
                              onClick={handleReserverANouveau}
                            >
                              Réserver à nouveau
                            </button>
                          ) : (
                            <>
                              <button 
                                className="btn-outline"
                                onClick={() => handleModifierReservation(reservation.id)}
                              >
                                Modifier
                              </button>
                              <button 
                                className="btn-danger"
                                onClick={() => handleAnnulerReservation(reservation.id)}
                              >
                                Annuler
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {filteredReservations.length === 0 && !reservationsLoading && (
                    <div className="empty-state">
                      <p>Aucune réservation trouvée pour ce filtre.</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="empty-state">
                  <p>Vous devez être connecté pour voir vos réservations.</p>
                </div>
              )}
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
                  
                  {profileError && (
                    <div className="alert alert-error">
                      <i className="fas fa-exclamation-circle"></i> {profileError}
                    </div>
                  )}
                  
                  {profileSuccess && (
                    <div className="alert alert-success">
                      <i className="fas fa-check-circle"></i> {profileSuccess}
                    </div>
                  )}
                  
                  <form onSubmit={handleProfileUpdate}>
                    <div className="form-group">
                      <label>Nom d'utilisateur</label>
                      <input type="text" value={user?.username || ''} readOnly />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input 
                        type="email" 
                        name="email"
                        value={profileData.email}
                        onChange={handleProfileInputChange}
                        placeholder="votre.email@example.com" 
                      />
                    </div>
                    <div className="form-group">
                      <label>Téléphone</label>
                      <input 
                        type="tel" 
                        name="telephone"
                        value={profileData.telephone}
                        onChange={handleProfileInputChange}
                        placeholder="+212 6XX XXX XXX" 
                      />
                    </div>
                    <button 
                      type="submit" 
                      className="btn-primary"
                      disabled={profileLoading}
                    >
                      {profileLoading ? (
                        <>
                          <i className="fas fa-spinner fa-spin"></i>
                          Mise à jour...
                        </>
                      ) : (
                        'Mettre à jour'
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </section>
        )
      
      case 'admin-centres':
        return (
          <section className="content-section">
            <AdminCentres />
          </section>
        )
      
      case 'admin-users':
        return (
          <section className="content-section">
            <AdminUsers />
          </section>
        )
      
      case 'admin-reservations':
        return (
          <section className="content-section">
            <AdminReservations />
          </section>
        )
      
      case 'admin-actualites':
        return (
          <section className="content-section">
            <AdminActualites />
          </section>
        )
      
      case 'admin-codes':
        return (
          <section className="content-section">
            <AdminGenerateCode />
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

