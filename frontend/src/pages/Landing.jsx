import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import '../colors.css'
import './Landing.css'

function Landing() {
  const [activeSection, setActiveSection] = useState('actualites')
  const [centres, setCentres] = useState([])
  const [loading, setLoading] = useState(false)
  
  // États pour le moteur de recherche
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [filters, setFilters] = useState({
    region: '',
    centre: '',
    activityType: '',
    period: '',
    budget: '',
    rating: ''
  })

  const handleNavClick = (section) => {
    setActiveSection(section)
  }

  // Fonction pour récupérer les centres depuis l'API
  const fetchCentres = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:8080/api/centres')
      if (response.ok) {
        const data = await response.json()
        setCentres(data)
      } else {
        console.error('Erreur lors de la récupération des centres')
        // Centres de démonstration en cas d'erreur
        setCentres([
          {
            id: 1,
            nom: 'Centre Agadir',
            adresse: 'Boulevard Hassan II',
            ville: 'Agadir',
            telephone: '0528-123456',
            description: 'Centre de vacances en bord de mer avec plage privée',
            actif: true,
            rating: 4.5
          },
          {
            id: 2,
            nom: 'Centre Atlas',
            adresse: 'Route de l\'Atlas',
            ville: 'Ifrane',
            telephone: '0535-789012',
            description: 'Centre de montagne avec vue panoramique sur l\'Atlas',
            actif: true,
            rating: 4.8
          },
          {
            id: 3,
            nom: 'Centre Merzouga',
            adresse: 'Désert du Sahara',
            ville: 'Merzouga',
            telephone: '0524-345678',
            description: 'Expérience unique dans le désert avec tentes luxueuses',
            actif: true,
            rating: 4.7
          }
        ])
      }
    } catch (error) {
      console.error('Erreur de connexion:', error)
      // Centres de démonstration en cas d'erreur de connexion
      setCentres([
        {
          id: 1,
          nom: 'Centre Agadir',
          adresse: 'Boulevard Hassan II',
          ville: 'Agadir',
          telephone: '0528-123456',
          description: 'Centre de vacances en bord de mer avec plage privée',
          actif: true,
          rating: 4.5
        },
        {
          id: 2,
          nom: 'Centre Atlas',
          adresse: 'Route de l\'Atlas',
          ville: 'Ifrane',
          telephone: '0535-789012',
          description: 'Centre de montagne avec vue panoramique sur l\'Atlas',
          actif: true,
          rating: 4.8
        },
        {
          id: 3,
          nom: 'Centre Merzouga',
          adresse: 'Désert du Sahara',
          ville: 'Merzouga',
          telephone: '0524-345678',
          description: 'Expérience unique dans le désert avec tentes luxueuses',
          actif: true,
          rating: 4.7
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  // Fonctions pour le moteur de recherche
  const handleSearch = async () => {
    setLoading(true)
    
    try {
      // Construire les paramètres de recherche
      const searchParams = new URLSearchParams()
      
      if (searchQuery) {
        searchParams.append('query', searchQuery)
      }
      
      if (filters.region) {
        searchParams.append('region', filters.region)
      }
      
      if (filters.centre) {
        searchParams.append('centre', filters.centre)
      }
      
      if (filters.activityType) {
        searchParams.append('activityType', filters.activityType)
      }
      
      if (filters.period) {
        searchParams.append('period', filters.period)
      }
      
      if (filters.budget) {
        searchParams.append('budget', filters.budget)
      }
      
      if (filters.rating) {
        searchParams.append('rating', filters.rating)
      }
      
      // Appel à l'API de recherche
      const response = await fetch(`http://localhost:8080/api/centres/search?${searchParams.toString()}`)
      
      if (response.ok) {
        const centresData = await response.json()
        
        // Transformer les données des centres en format de résultats
        const transformedResults = centresData.map(centre => ({
          title: centre.nom,
          description: centre.description || 'Centre de vacances de qualité',
          type: 'Centre de vacances',
          location: `${centre.adresse}, ${centre.ville}`,
          rating: '4.0', // Rating par défaut car pas de champ rating dans l'ancienne entité
          icon: getCentreIcon(centre.ville, centre.nom),
          centreId: centre.id,
          telephone: centre.telephone,
          actif: centre.actif
        }))
        
        setSearchResults(transformedResults)
      } else {
        console.error('Erreur lors de la recherche:', response.status, response.statusText)
        // Fallback avec données de démonstration
        const fallbackResults = [
          {
            title: 'Centre Agadir',
            description: 'Centre de vacances en bord de mer avec plage privée et piscine olympique',
            type: 'Centre de vacances',
            location: 'Boulevard Hassan II, Agadir',
            rating: '4.5',
            icon: 'fa-umbrella-beach',
            centreId: 1,
            telephone: '0528-123456',
            actif: true
          },
          {
            title: 'Centre Atlas',
            description: 'Centre de montagne au cœur de l\'Atlas avec vue panoramique',
            type: 'Centre de vacances',
            location: 'Route de l\'Atlas, Ifrane',
            rating: '4.8',
            icon: 'fa-mountain',
            centreId: 2,
            telephone: '0535-789012',
            actif: true
          }
        ]
        setSearchResults(fallbackResults)
      }
    } catch (error) {
      console.error('Erreur de connexion lors de la recherche:', error)
      setSearchResults([])
    } finally {
      setLoading(false)
    }
  }
  
  // Fonction pour déterminer l'icône selon la ville/nom du centre
  const getCentreIcon = (ville, nom) => {
    if (ville && ville.toLowerCase().includes('agadir')) return 'fa-umbrella-beach'
    if (ville && ville.toLowerCase().includes('ifrane')) return 'fa-mountain'
    if (ville && ville.toLowerCase().includes('merzouga')) return 'fa-mountain-sun'
    if (nom && nom.toLowerCase().includes('atlas')) return 'fa-mountain'
    if (nom && nom.toLowerCase().includes('mer')) return 'fa-umbrella-beach'
    return 'fa-building'
  }
  
  const handleResetFilters = () => {
    setSearchQuery('')
    setFilters({
      region: '',
      centre: '',
      activityType: '',
      period: '',
      budget: '',
      rating: ''
    })
    setSearchResults([])
  }

  // Charger les centres quand la section "nos-centres" est activée
  useEffect(() => {
    if (activeSection === 'nos-centres' && centres.length === 0) {
      fetchCentres()
    }
  }, [activeSection, centres.length])

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-container">
          <div className="logo">
            <img src="/src/Logo/LOGO.png" alt="COSONE Logo" />
          </div>
          <div className="nav-menu">
            <button 
              className={`nav-item ${activeSection === 'actualites' ? 'active' : ''}`}
              onClick={() => handleNavClick('actualites')}
              style={{
                outline: 'none',
                border: 'none',
                boxShadow: 'none'
              }}
            >
              Actualités
            </button>
            <button 
              className={`nav-item ${activeSection === 'qui-sommes-nous' ? 'active' : ''}`}
              onClick={() => handleNavClick('qui-sommes-nous')}
              style={{
                outline: 'none',
                border: 'none',
                boxShadow: 'none'
              }}
            >
              Qui sommes-nous
            </button>
            <button 
              className={`nav-item ${activeSection === 'nos-activites' ? 'active' : ''}`}
              onClick={() => handleNavClick('nos-activites')}
              style={{
                outline: 'none',
                border: 'none',
                boxShadow: 'none'
              }}
            >
              Nos activités
            </button>
            <button 
              className={`nav-item ${activeSection === 'nos-centres' ? 'active' : ''}`}
              onClick={() => handleNavClick('nos-centres')}
              style={{
                outline: 'none',
                border: 'none',
                boxShadow: 'none'
              }}
            >
              Nos centres
            </button>
            <button 
              className={`nav-item ${activeSection === 'espace-galerie' ? 'active' : ''}`}
              onClick={() => handleNavClick('espace-galerie')}
              style={{
                outline: 'none',
                border: 'none',
                boxShadow: 'none'
              }}
            >
              Galerie
            </button>
            <button 
              className={`nav-item ${activeSection === 'espace-recherche' ? 'active' : ''}`}
              onClick={() => handleNavClick('espace-recherche')}
              style={{
                outline: 'none',
                border: 'none',
                boxShadow: 'none'
              }}
            >
              Recherche
            </button>
            <button 
              className={`nav-item ${activeSection === 'page-contact' ? 'active' : ''}`}
              onClick={() => handleNavClick('page-contact')}
              style={{
                outline: 'none',
                border: 'none',
                boxShadow: 'none'
              }}
            >
              Contact
            </button>
          </div>
          <div className="nav-actions">
            <Link to="/login" className="nav-btn btn-signup">Se connecter</Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {/* Actualités Section (Default) */}
        {activeSection === 'actualites' && (
          <section className="content-section active">
            <div className="hero">
              <div className="hero-container">
                <h1 className="hero-title">
                  Portail Interactif du COS'ONE
                </h1>
                <p className="hero-subtitle">
                  Découvrez notre nouvelle plateforme digitale conçue pour être à la hauteur des attentes du personnel du COS'ONE.
                </p>
                <div className="hero-actions">
                  <Link to="/login" className="btn-hero btn-primary">
                    Accéder au Portail
                  </Link>
                  <button 
                    className="btn-hero btn-secondary"
                    onClick={() => handleNavClick('qui-sommes-nous')}
                  >
                    Découvrir Notre Mission
                  </button>
                </div>
              </div>
            </div>

            {/* Featured Section */}
            <section className="section-featured">
              <div className="container">
                <div className="featured-content">
                  <div className="featured-image">
                    <img src="/src/Logo/centre_de_vacances.jpg" alt="Centre de vacances" />
                  </div>
                  <div className="featured-text">
                    <h2>Innovation Digitale au Service du Bien-être</h2>
                    <p>
                      En tenant compte des orientations stratégiques du Conseil des œuvres sociales de l'ONE, 
                      nous avons développé un portail web interactif et innovant qui facilite l'échange, 
                      le partage et la communication entre le COS'ONE et nos utilisateurs définis.
                    </p>
                    <ul className="featured-list">
                      <li>✓ Plateforme digitale moderne et intuitive</li>
                      <li>✓ Services en ligne accessibles 24h/24</li>
                      <li>✓ Communication directe et personnalisée</li>
                      <li>✓ Gestion simplifiée de vos réservations</li>
                    </ul>
                    <Link to="/login" className="btn-featured">
                      Explorer les Services
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* Actualités */}
            <section className="section-actualites">
              <div className="container">
                <h2 className="section-title">Actualités</h2>
                
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
              </div>
            </section>

            {/* CTA Section */}
            <section className="section-cta">
              <div className="container">
                <div className="cta-content">
                  <h2>Rejoignez Notre Communauté Digitale</h2>
                  <p>
                    Découvrez comment notre portail web interactif transforme votre expérience 
                    avec le COS'ONE. Innovation, proximité et excellence au service de votre bien-être.
                  </p>
                  <Link to="/login" className="btn-cta">
                    Accéder au Portail
                  </Link>
                </div>
              </div>
            </section>
          </section>
        )}

        {/* Qui sommes-nous Section */}
        {activeSection === 'qui-sommes-nous' && (
          <section className="content-section active">
            <div className="container">
              <div className="section-intro">
                <h2 className="section-title">Qui sommes-nous</h2>
              </div>
              
              <div className="about-content">
                <div className="about-text">
                  <h3>Orientations stratégiques et innovation digitale</h3>
                  <p>En tenant compte des orientations stratégiques du Conseil des œuvres sociales de l'ONE pour être à la hauteur des attentes du personnel du COS'ONE, nous avons développé un <strong>portail web interactif et innovant</strong> qui révolutionne notre approche du service social.</p>
                  
                  <p>Cette plateforme digitale moderne facilite l'échange, le partage et la communication entre le COS'ONE et nos utilisateurs définis, s'inscrivant parfaitement dans le développement actuel en matière de digitalisation.</p>
                  
                  <h3>Notre engagement digital</h3>
                  <ul>
                    <li><strong>Innovation technologique</strong> - Un portail web interactif à la pointe de la technologie</li>
                    <li><strong>Accessibilité permanente</strong> - Services disponibles 24h/24, 7j/7</li>
                    <li><strong>Communication directe</strong> - Échange facilité avec le personnel COS'ONE</li>
                    <li><strong>Transparence totale</strong> - Gestion simplifiée et traçable de tous les services</li>
                  </ul>
                  
                  <p>Cette transformation digitale renforce notre mission de service public exemplaire et améliore considérablement l'expérience utilisateur de notre communauté.</p>
                  
                  <h3>Vision digitale du COS'ONE</h3>
                  <p>Un portail web interactif et innovant qui place la technologie au service du bien-être du personnel, créant un lien numérique fort entre l'institution et ses collaborateurs.</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Nos activités Section */}
        {activeSection === 'nos-activites' && (
          <section className="content-section active">
            <div className="container">
              <div className="section-intro">
                <h2 className="section-title">Nos activités digitalisées</h2>
                <p>Notre portail web interactif et innovant transforme la façon dont nous déployons nos services. Découvrez comment la digitalisation révolutionne nos activités pour mieux servir le personnel COS'ONE :</p>
              </div>
              
              <div className="activities-grid">
                <div className="activity-card">
                  <div className="activity-icon">
                    <i className="fas fa-laptop"></i>
                  </div>
                  <h3>Portail web interactif</h3>
                  <p>Une plateforme digitale innovante qui facilite l'échange, le partage et la communication entre le COS'ONE et ses utilisateurs.</p>
                  <ul>
                    <li>Interface moderne et intuitive</li>
                    <li>Services en ligne 24h/24</li>
                    <li>Communication directe et personnalisée</li>
                  </ul>
                </div>
                
                <div className="activity-card">
                  <div className="activity-icon">
                    <i className="fas fa-mobile-alt"></i>
                  </div>
                  <h3>Services mobiles et digitaux</h3>
                  <p>Des services accessibles partout, à tout moment, pour répondre aux attentes du personnel COS'ONE.</p>
                  <ul>
                    <li>Application mobile dédiée</li>
                    <li>Notifications en temps réel</li>
                    <li>Gestion simplifiée des démarches</li>
                  </ul>
                </div>
                
                <div className="activity-card">
                  <div className="activity-icon">
                    <i className="fas fa-comments"></i>
                  </div>
                  <h3>Communication digitale</h3>
                  <p>Un système de communication moderne qui renforce les liens entre le COS'ONE et son personnel.</p>
                  <ul>
                    <li>Messagerie interne sécurisée</li>
                    <li>Actualités en temps réel</li>
                    <li>Feedback et suggestions en ligne</li>
                  </ul>
                </div>
                
                <div className="activity-card">
                  <div className="activity-icon">
                    <i className="fas fa-chart-line"></i>
                  </div>
                  <h3>Analytics et insights</h3>
                  <p>Des données et analyses en temps réel pour optimiser nos services et mieux comprendre les besoins du personnel.</p>
                  <ul>
                    <li>Tableaux de bord personnalisés</li>
                    <li>Statistiques d'utilisation</li>
                    <li>Amélioration continue des services</li>
                  </ul>
                </div>
                
                <div className="activity-card">
                  <div className="activity-icon">
                    <i className="fas fa-shield-alt"></i>
                  </div>
                  <h3>Sécurité et confidentialité</h3>
                  <p>Un environnement sécurisé et confidentiel pour protéger les données et garantir la confiance du personnel.</p>
                  <ul>
                    <li>Chiffrement des données</li>
                    <li>Authentification sécurisée</li>
                    <li>Respect de la vie privée</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Nos centres Section */}
        {activeSection === 'nos-centres' && (
          <section className="content-section active">
            <div className="container">
              <div className="section-intro">
                <h2 className="section-title">Nos Centres de Vacances</h2>
                <p className="section-description">
                  Découvrez nos centres de vacances répartis à travers le Maroc. 
                  Chaque centre offre une expérience unique dans des environnements exceptionnels.
                </p>
              </div>

              {loading ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <p>Chargement des centres...</p>
                </div>
              ) : centres.length > 0 ? (
                <div className="centres-grid">
                  {centres.map((centre) => (
                    <div key={centre.id} className="centre-card">
                      <div className="centre-icon">
                        {centre.ville === 'Agadir' ? '🏖️' : 
                         centre.ville === 'Ifrane' || centre.nom.includes('Atlas') ? '🏔️' : 
                         centre.ville === 'Merzouga' ? '🏜️' : '🏢'}
                      </div>
                      <h3>{centre.nom}</h3>
                      <p>{centre.description || 'Centre de vacances de qualité'}</p>
                      
                      <div className="centre-details">
                        <div className="centre-detail">
                          <i className="fas fa-map-marker-alt"></i>
                          <span>{centre.adresse}, {centre.ville}</span>
                        </div>
                        
                        {centre.telephone && (
                          <div className="centre-detail">
                            <i className="fas fa-phone"></i>
                            <span>{centre.telephone}</span>
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
                        
                        <div className="centre-status">
                          <span className={`status-badge ${centre.actif ? 'status-active' : 'status-inactive'}`}>
                            {centre.actif ? '✓ Actif' : '✗ Inactif'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-centres-message">
                  <i className="fas fa-info-circle"></i>
                  <p>Aucun centre n'est disponible pour le moment. Veuillez réessayer ultérieurement.</p>
                </div>
              )}
            </div>
          </section>
        )}


        {/* Espace galerie Section */}
        {activeSection === 'espace-galerie' && (
          <section className="content-section active">
            <div className="container">
              <div className="section-intro">
                <h2 className="section-title">Espace galerie et vidéothèque</h2>
              </div>
              
              <div className="gallery-tabs">
                <button className="tab-button active">Photos</button>
                <button className="tab-button">Vidéos</button>
              </div>
              
              <div className="tab-content active">
                <div className="gallery-grid">
                  <div className="gallery-item">
                    <div className="gallery-image">
                      <i className="fas fa-image"></i>
                    </div>
                    <div className="gallery-caption">Formation en cours</div>
                  </div>
                  <div className="gallery-item">
                    <div className="gallery-image">
                      <i className="fas fa-image"></i>
                    </div>
                    <div className="gallery-caption">Nos équipes</div>
                  </div>
                  <div className="gallery-item">
                    <div className="gallery-image">
                      <i className="fas fa-image"></i>
                    </div>
                    <div className="gallery-caption">Événements</div>
                  </div>
                  <div className="gallery-item">
                    <div className="gallery-image">
                      <i className="fas fa-image"></i>
                    </div>
                    <div className="gallery-caption">Nos centres</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Espace recherche Section */}
        {activeSection === 'espace-recherche' && (
          <section className="content-section active">
            <div className="container">
              <div className="section-intro">
                <h2 className="section-title">Moteur de recherche multicritères</h2>
                <p className="section-description">
                  Recherchez facilement dans nos centres, activités et services avec nos filtres avancés.
                </p>
              </div>
              
              <div className="search-container">
                        {/* Barre de recherche principale */}
                        <div className="search-box">
                          <input 
                            type="text" 
                            placeholder="Rechercher par mots-clés..." 
                            className="search-input"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                          />
                          <button className="search-button" onClick={handleSearch}>
                            <i className="fas fa-search"></i> Rechercher
                          </button>
                        </div>
                
                {/* Filtres multicritères */}
                <div className="search-filters">
                  <h3>Filtres de recherche avancés</h3>
                  
                  <div className="filters-grid">
                    {/* Filtre géographique */}
                    <div className="filter-group">
                      <label className="filter-label">
                        <i className="fas fa-map-marker-alt"></i> Zone géographique
                      </label>
                      <select 
                        className="filter-select"
                        value={filters.region}
                        onChange={(e) => setFilters({...filters, region: e.target.value})}
                      >
                        <option value="">Toutes les régions</option>
                        <option value="casablanca">Casablanca-Settat</option>
                        <option value="rabat">Rabat-Salé-Kénitra</option>
                        <option value="marrakech">Marrakech-Safi</option>
                        <option value="fes">Fès-Meknès</option>
                        <option value="tanger">Tanger-Tétouan-Al Hoceïma</option>
                        <option value="souss">Souss-Massa</option>
                        <option value="oriental">Oriental</option>
                        <option value="beni">Béni Mellal-Khénifra</option>
                        <option value="dakhla">Dakhla-Oued Ed-Dahab</option>
                        <option value="draa">Drâa-Tafilalet</option>
                      </select>
                    </div>
                    
                    {/* Filtre par centre */}
                    <div className="filter-group">
                      <label className="filter-label">
                        <i className="fas fa-building"></i> Centre spécifique
                      </label>
                      <select 
                        className="filter-select"
                        value={filters.centre}
                        onChange={(e) => setFilters({...filters, centre: e.target.value})}
                      >
                        <option value="">Tous les centres</option>
                        {centres.map(centre => (
                          <option key={centre.id} value={centre.id}>
                            {centre.nom} - {centre.ville}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Filtre par type d'activité */}
                    <div className="filter-group">
                      <label className="filter-label">
                        <i className="fas fa-tasks"></i> Type d'activité
                      </label>
                      <select 
                        className="filter-select"
                        value={filters.activityType}
                        onChange={(e) => setFilters({...filters, activityType: e.target.value})}
                      >
                        <option value="">Toutes les activités</option>
                        <option value="vacances">Centres de vacances</option>
                        <option value="sport">Clubs sportifs</option>
                        <option value="culture">Activités culturelles</option>
                        <option value="restauration">Restauration</option>
                        <option value="education">Soutien éducatif</option>
                        <option value="social">Accompagnement social</option>
                        <option value="formation">Formations</option>
                      </select>
                    </div>
                    
                    {/* Filtre par période */}
                    <div className="filter-group">
                      <label className="filter-label">
                        <i className="fas fa-calendar"></i> Période
                      </label>
                      <select 
                        className="filter-select"
                        value={filters.period}
                        onChange={(e) => setFilters({...filters, period: e.target.value})}
                      >
                        <option value="">Toute l'année</option>
                        <option value="ete">Été (Juin-Août)</option>
                        <option value="printemps">Printemps (Mars-Mai)</option>
                        <option value="automne">Automne (Septembre-Novembre)</option>
                        <option value="hiver">Hiver (Décembre-Février)</option>
                        <option value="weekend">Week-ends</option>
                        <option value="vacances">Périodes de vacances</option>
                      </select>
                    </div>
                    
                    {/* Filtre par budget */}
                    <div className="filter-group">
                      <label className="filter-label">
                        <i className="fas fa-money-bill-wave"></i> Budget
                      </label>
                      <select 
                        className="filter-select"
                        value={filters.budget}
                        onChange={(e) => setFilters({...filters, budget: e.target.value})}
                      >
                        <option value="">Tous les budgets</option>
                        <option value="economique">Économique (&lt; 500 DH)</option>
                        <option value="modere">Modéré (500-1000 DH)</option>
                        <option value="confort">Confort (1000-2000 DH)</option>
                        <option value="luxe">Luxe (&gt; 2000 DH)</option>
                      </select>
                    </div>
                    
                    {/* Filtre par évaluation */}
                    <div className="filter-group">
                      <label className="filter-label">
                        <i className="fas fa-star"></i> Évaluation minimum
                      </label>
                      <select 
                        className="filter-select"
                        value={filters.rating}
                        onChange={(e) => setFilters({...filters, rating: e.target.value})}
                      >
                        <option value="">Toutes les évaluations</option>
                        <option value="5">5 étoiles</option>
                        <option value="4">4+ étoiles</option>
                        <option value="3">3+ étoiles</option>
                        <option value="2">2+ étoiles</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Boutons d'action */}
                  <div className="filter-actions">
                    <button className="btn-search" onClick={handleSearch}>
                      <i className="fas fa-search"></i> Rechercher
                    </button>
                    <button className="btn-reset" onClick={handleResetFilters}>
                      <i className="fas fa-undo"></i> Réinitialiser
                    </button>
                  </div>
                </div>
                
                {/* Résultats de recherche */}
                <div className="search-results">
                  <div className="results-header">
                    <h3>
                      Résultats de recherche
                      {searchResults.length > 0 && (
                        <span className="results-count">({searchResults.length} résultat{searchResults.length > 1 ? 's' : ''})</span>
                      )}
                    </h3>
                    {searchQuery && (
                      <div className="search-query">
                        Recherche pour: <strong>"{searchQuery}"</strong>
                      </div>
                    )}
                  </div>
                  
                  {searchResults.length > 0 ? (
                    <div className="results-grid">
                      {searchResults.map((result, index) => (
                        <div key={index} className="result-card">
                          <div className="result-icon">
                            <i className={`fas ${result.icon}`}></i>
                          </div>
                          <div className="result-content">
                            <h4>{result.title}</h4>
                            <p className="result-description">{result.description}</p>
                            <div className="result-meta">
                              <span className="result-type">{result.type}</span>
                              {result.location && (
                                <span className="result-location">
                                  <i className="fas fa-map-marker-alt"></i> {result.location}
                                </span>
                              )}
                              {result.telephone && (
                                <span className="result-phone">
                                  <i className="fas fa-phone"></i> {result.telephone}
                                </span>
                              )}
                              {result.rating && (
                                <span className="result-rating">
                                  <i className="fas fa-star"></i> {result.rating}
                                </span>
                              )}
                              <span className={`result-status ${result.actif ? 'status-active' : 'status-inactive'}`}>
                                {result.actif ? '✓ Actif' : '✗ Inactif'}
                              </span>
                            </div>
                            <div className="result-actions">
                              <button className="btn-details">Voir détails</button>
                              <button className="btn-contact">Contacter</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : searchQuery ? (
                    <div className="no-results">
                      <i className="fas fa-search"></i>
                      <h4>Aucun résultat trouvé</h4>
                      <p>Essayez de modifier vos critères de recherche ou utilisez des mots-clés différents.</p>
                    </div>
                  ) : (
                    <div className="results-placeholder">
                      <i className="fas fa-search"></i>
                      <p>Utilisez les filtres ci-dessus pour rechercher dans nos centres et activités</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Page contact Section */}
        {activeSection === 'page-contact' && (
          <section className="content-section active">
            <div className="container">
              <div className="section-intro">
                <h2 className="section-title">Page contact</h2>
              </div>
              
              <div className="contact-container">
                <div className="contact-info">
                  <h3>Nos coordonnées - Centre de Casablanca</h3>
                  <div className="contact-item">
                    <i className="fas fa-map-marker-alt"></i>
                    <div>
                      <strong>Adresse :</strong><br />
                      No. 65 Rue Othman Ben Affane<br />
                      Ex Lafuente Station De Traitement<br />
                      Casablanca 20000, Maroc
                    </div>
                  </div>
                  <div className="contact-item">
                    <i className="fas fa-phone"></i>
                    <div>
                      <strong>Téléphone :</strong><br />
                      05226-68298
                    </div>
                  </div>
                  <div className="contact-item">
                    <i className="fas fa-envelope"></i>
                    <div>
                      <strong>Email :</strong><br />
                      contact@cosone.ma
                    </div>
                  </div>
                  <div className="contact-item">
                    <i className="fas fa-globe"></i>
                    <div>
                      <strong>Site web :</strong><br />
                      <a href="http://www.one.org.ma/" target="_blank" rel="noopener noreferrer">www.one.org.ma</a>
                    </div>
                  </div>
                  <div className="contact-item">
                    <i className="fas fa-clock"></i>
                    <div>
                      <strong>Horaires :</strong><br />
                      Lundi - Vendredi : 8h30 - 16h30<br />
                      Samedi : Fermé
                    </div>
                  </div>
                </div>
                
                <div className="contact-form">
                  <h3>Nous contacter</h3>
                  <form>
                    <div className="form-group">
                      <input type="text" placeholder="Nom complet" required />
                    </div>
                    <div className="form-group">
                      <input type="email" placeholder="Email" required />
                    </div>
                    <div className="form-group">
                      <input type="tel" placeholder="Téléphone" />
                    </div>
                    <div className="form-group">
                      <select required>
                        <option value="">Sujet de votre message</option>
                        <option value="formation">Demande de formation</option>
                        <option value="consultation">Demande de consultation</option>
                        <option value="information">Demande d'information</option>
                        <option value="autre">Autre</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <textarea placeholder="Votre message..." rows="5" required></textarea>
                    </div>
                    <button type="submit" className="submit-contact">Envoyer le message</button>
                  </form>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

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
                <li><Link to="/login">Réservation en Ligne</Link></li>
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

export default Landing
