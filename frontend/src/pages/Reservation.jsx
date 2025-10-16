import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import reservationService from '../services/reservationService'
import './Reservation.css'

function Reservation() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [centres, setCentres] = useState([])
  const [typesLogement, setTypesLogement] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    matricule: user?.matricule || '',
    cin: user?.cin || '',
    telephone: user?.telephone || '',
    email: user?.email || '',
    centreId: '',
    typeLogementId: '',
    dateDebut: '',
    dateFin: '',
    nombrePersonnes: 1,
    personnesAccompagnement: []
  })

  // Charger les centres au montage
  useEffect(() => {
    loadCentres()
  }, [])

  // Charger les types de logement quand un centre est sélectionné
  useEffect(() => {
    if (formData.centreId) {
      loadTypesLogement(formData.centreId)
    }
  }, [formData.centreId])

  const loadCentres = async () => {
    try {
      setLoading(true)
      const data = await reservationService.getCentres()
      setCentres(data.filter(c => c.actif))
    } catch (err) {
      setError('Erreur lors du chargement des centres')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const loadTypesLogement = async (centreId) => {
    try {
      setLoading(true)
      const data = await reservationService.getTypesLogement(centreId)
      setTypesLogement(data)
    } catch (err) {
      console.error('Erreur API types logement:', err)
      // Fallback: utiliser des données de test
      const fallbackTypes = [
        { id: 1, nom: 'Studio', description: 'Studio confortable pour 2 personnes avec kitchenette', capaciteMax: 2, prixParNuit: 250.00, actif: true },
        { id: 2, nom: 'Appartement 2 Chambres', description: 'Appartement spacieux avec 2 chambres, salon et cuisine équipée', capaciteMax: 4, prixParNuit: 450.00, actif: true },
        { id: 3, nom: 'Appartement 3 Chambres', description: 'Grand appartement familial avec 3 chambres, 2 salles de bain', capaciteMax: 6, prixParNuit: 650.00, actif: true },
        { id: 4, nom: 'Villa', description: 'Villa luxueuse avec jardin privé, piscine et terrasse', capaciteMax: 8, prixParNuit: 1200.00, actif: true },
        { id: 5, nom: 'Bungalow', description: 'Bungalow indépendant avec vue sur mer et terrasse privée', capaciteMax: 4, prixParNuit: 550.00, actif: true },
        { id: 6, nom: 'Chambre Double', description: 'Chambre confortable avec lit double et salle de bain privée', capaciteMax: 2, prixParNuit: 200.00, actif: true }
      ]
      setTypesLogement(fallbackTypes)
      console.log('Utilisation des types de logement de test')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    
    // Si le nombre de personnes change, ajuster les accompagnants
    if (name === 'nombrePersonnes') {
      const newCount = parseInt(value) || 1
      
      setFormData(prev => {
        const currentCount = prev.personnesAccompagnement.length
        
        let newAccompagnants = [...prev.personnesAccompagnement]
        
        if (newCount > currentCount + 1) {
          // Ajouter des accompagnants manquants
          for (let i = currentCount; i < newCount - 1; i++) {
            newAccompagnants.push({
              prenom: '',
              nom: '',
              cin: '',
              telephone: ''
            })
          }
        } else if (newCount < currentCount + 1) {
          // Supprimer des accompagnants en trop
          newAccompagnants = newAccompagnants.slice(0, newCount - 1)
        }
        
        return {
          ...prev,
          [name]: value,
          personnesAccompagnement: newAccompagnants
        }
      })
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleAccompagnantChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      personnesAccompagnement: prev.personnesAccompagnement.map((person, i) => 
        i === index ? { ...person, [field]: value } : person
      )
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (step === 1) {
      // Validation étape 1
      if (!formData.centreId || !formData.typeLogementId || !formData.dateDebut || !formData.dateFin) {
        setError('Veuillez remplir tous les champs obligatoires')
        return
      }
      
      // Vérifier que la date de fin est après la date de début
      if (new Date(formData.dateFin) <= new Date(formData.dateDebut)) {
        setError('La date de départ doit être après la date d\'arrivée')
        return
      }
      
      // Validation des accompagnants
      for (let i = 0; i < formData.personnesAccompagnement.length; i++) {
        const person = formData.personnesAccompagnement[i]
        if (!person.prenom || !person.nom || !person.cin) {
          setError(`Veuillez remplir toutes les informations de la personne ${i + 1}`)
          return
        }
      }
      
      setError('')
      setStep(2)
    }
  }

  const handlePaymentSubmit = async (paymentMethod) => {
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      // Préparer les données pour l'API
      const reservationData = {
        matricule: formData.matricule,
        cin: formData.cin,
        telephone: formData.telephone,
        email: formData.email,
        centreId: parseInt(formData.centreId),
        typeLogementId: parseInt(formData.typeLogementId),
        dateDebut: formData.dateDebut + 'T14:00:00', // Heure d'arrivée par défaut
        dateFin: formData.dateFin + 'T11:00:00', // Heure de départ par défaut
        nombrePersonnes: parseInt(formData.nombrePersonnes),
        personnesAccompagnement: formData.personnesAccompagnement, // Include companion data
        statut: paymentMethod === 'stripe' ? 'EN_ATTENTE_PAIEMENT' : 'EN_ATTENTE_PAIEMENT'
      }
      
      console.log('🚀 Envoi de la réservation avec accompagnants:', reservationData)
      console.log('📊 Méthode de paiement:', paymentMethod)
      
      const reservation = await reservationService.createReservation(reservationData)
      console.log('✅ Réservation créée avec succès:', reservation)

      if (paymentMethod === 'stripe') {
        // Redirection vers Stripe (simulation pour l'instant)
        setSuccess('Redirection vers Stripe pour le paiement...')
        console.log('💳 Redirection vers Stripe...')
        // Dans une vraie app, vous appelleriez l'API Stripe ici
        setTimeout(() => {
          console.log('🔗 Navigation vers confirmation Stripe')
          navigate(`/reservation/confirmation/${reservation.id}?payment=stripe_pending`)
        }, 2000)
      } else if (paymentMethod === 'later') {
        setSuccess('Réservation créée ! Vous avez 24 heures pour effectuer le paiement.')
        console.log('⏰ Navigation vers confirmation paiement différé')
        navigate(`/reservation/confirmation/${reservation.id}?payment=pending`)
      }
    } catch (err) {
      console.error('❌ Erreur de création de réservation:', err)
      console.error('❌ Détails de l\'erreur:', err.response?.data)
      
      if (err.response?.status === 401) {
        setError('Vous devez être connecté pour effectuer une réservation. Veuillez vous reconnecter.')
        // Optionally redirect to login
        setTimeout(() => {
          navigate('/login')
        }, 3000)
      } else if (err.response?.status === 403) {
        setError('Accès non autorisé. Veuillez vérifier vos permissions.')
      } else {
        setError(err.response?.data?.message || 'Erreur lors de la création de la réservation.')
      }
    } finally {
      setLoading(false)
    }
  }


  const selectedCentre = centres.find(c => c.id === parseInt(formData.centreId))
  const selectedType = typesLogement.find(t => t.id === parseInt(formData.typeLogementId))

  return (
    <div className="reservation-page">
      <div className="reservation-container">
        <div className="reservation-header">
          <h1><i className="fas fa-calendar-plus"></i> Nouvelle Réservation</h1>
          <div className="steps-indicator">
            <div className={`step ${step >= 1 ? 'active' : ''}`}>
              <span className="step-number">1</span>
              <span className="step-label">Informations</span>
            </div>
            <div className="step-divider"></div>
            <div className={`step ${step >= 2 ? 'active' : ''}`}>
              <span className="step-number">2</span>
              <span className="step-label">Paiement</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="alert alert-error">
            <i className="fas fa-exclamation-circle"></i> {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <i className="fas fa-check-circle"></i> {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="reservation-form">
          {step === 1 && (
            <div className="form-step">
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
                    value={formData.matricule}
                    onChange={handleChange}
                    required
                    readOnly={!!user?.matricule}
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
                    onChange={handleChange}
                    required
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
                    onChange={handleChange}
                    required
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
                    onChange={handleChange}
                    required
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
                  onChange={handleChange}
                  required
                >
                  <option value="">Sélectionnez un centre</option>
                  {centres.map(centre => (
                    <option key={centre.id} value={centre.id}>
                      {centre.nom} - {centre.ville}
                    </option>
                  ))}
                </select>
              </div>

              {selectedCentre && (
                <div className="centre-info">
                  <p><i className="fas fa-map-marker-alt"></i> {selectedCentre.adresse}, {selectedCentre.ville}</p>
                  <p><i className="fas fa-phone"></i> {selectedCentre.telephone}</p>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="typeLogementId">
                  <i className="fas fa-home"></i> Type de logement *
                </label>
                <select
                  id="typeLogementId"
                  name="typeLogementId"
                  value={formData.typeLogementId}
                  onChange={handleChange}
                  required
                  disabled={!formData.centreId}
                >
                  <option value="">Sélectionnez un type de logement</option>
                  {typesLogement.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.nom} - {type.prixParNuit} DH/nuit (Capacité: {type.capaciteMax} personnes)
                    </option>
                  ))}
                </select>
              </div>

              {selectedType && (
                <div className="logement-info">
                  <p><strong>Description:</strong> {selectedType.description}</p>
                  <p><strong>Prix par nuit:</strong> {selectedType.prixParNuit} DH</p>
                  <p><strong>Capacité:</strong> {selectedType.capaciteMax} personnes</p>
                </div>
              )}

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
                    onChange={handleChange}
                    min={new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                    required
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
                    onChange={handleChange}
                    min={formData.dateDebut || new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                    required
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
                  value={formData.nombrePersonnes}
                  onChange={handleChange}
                  min="1"
                  max={selectedType?.capaciteMax || 10}
                  required
                />
                {selectedType && (
                  <small>Capacité maximale: {selectedType.capaciteMax} personnes</small>
                )}
              </div>

              {/* Champs pour les accompagnants */}
              {formData.personnesAccompagnement.length > 0 && (
                <div className="accompagnants-section">
                  <h3><i className="fas fa-user-friends"></i> Informations des accompagnants</h3>
                  <p className="info-text">
                    Veuillez remplir les informations des personnes qui vous accompagnent.
                  </p>
                  
                  {formData.personnesAccompagnement.map((person, index) => (
                    <div key={index} className="accompagnant-card">
                      <h4>Personne {index + 1}</h4>
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor={`prenom_${index}`}>
                            <i className="fas fa-user"></i> Prénom *
                          </label>
                          <input
                            type="text"
                            id={`prenom_${index}`}
                            value={person.prenom}
                            onChange={(e) => handleAccompagnantChange(index, 'prenom', e.target.value)}
                            required
                          />
                        </div>
                        
                        <div className="form-group">
                          <label htmlFor={`nom_${index}`}>
                            <i className="fas fa-user"></i> Nom *
                          </label>
                          <input
                            type="text"
                            id={`nom_${index}`}
                            value={person.nom}
                            onChange={(e) => handleAccompagnantChange(index, 'nom', e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor={`cin_${index}`}>
                            <i className="fas fa-id-card"></i> CIN *
                          </label>
                          <input
                            type="text"
                            id={`cin_${index}`}
                            value={person.cin}
                            onChange={(e) => handleAccompagnantChange(index, 'cin', e.target.value)}
                            required
                          />
                        </div>
                        
                        <div className="form-group">
                          <label htmlFor={`telephone_${index}`}>
                            <i className="fas fa-phone"></i> Téléphone
                          </label>
                          <input
                            type="tel"
                            id={`telephone_${index}`}
                            value={person.telephone}
                            onChange={(e) => handleAccompagnantChange(index, 'telephone', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}



              <div className="form-actions">
                <button type="button" onClick={() => navigate('/home')} className="btn-secondary">
                  <i className="fas fa-arrow-left"></i> Retour
                </button>
                <button type="button" onClick={handleSubmit} className="btn-primary" disabled={loading}>
                  Suivant <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="form-step">
              <h2><i className="fas fa-credit-card"></i> Paiement</h2>
              <p className="info-text">
                Choisissez votre méthode de paiement pour finaliser la réservation.
              </p>

              {/* Résumé de la réservation */}
              <div className="reservation-summary">
                <h3><i className="fas fa-info-circle"></i> Résumé de votre réservation</h3>
                <div className="summary-details">
                  <div className="summary-item">
                    <span className="label">Centre :</span>
                    <span className="value">{selectedCentre?.nom}</span>
                  </div>
                  <div className="summary-item">
                    <span className="label">Type de logement :</span>
                    <span className="value">{selectedType?.nom}</span>
                  </div>
                  <div className="summary-item">
                    <span className="label">Dates :</span>
                    <span className="value">
                      {new Date(formData.dateDebut).toLocaleDateString('fr-FR')} - {new Date(formData.dateFin).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="label">Nombre de personnes :</span>
                    <span className="value">{formData.nombrePersonnes}</span>
                  </div>
                  {selectedType && (
                    <div className="summary-item total">
                      <span className="label">Prix total :</span>
                      <span className="value">
                        {(selectedType.prixParNuit * formData.nombrePersonnes).toFixed(2)} DH
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Options de paiement */}
              <div className="payment-options">
                <button
                  className="payment-option stripe-option"
                  onClick={() => handlePaymentSubmit('stripe')}
                  disabled={loading}
                >
                  <div className="payment-icon">
                    {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fab fa-stripe"></i>}
                  </div>
                  <div className="payment-info">
                    <h4>Payer avec Stripe</h4>
                    <p>Paiement sécurisé par carte bancaire</p>
                  </div>
                </button>

                <button
                  className="payment-option later-option"
                  onClick={() => handlePaymentSubmit('later')}
                  disabled={loading}
                >
                  <div className="payment-icon">
                    {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-clock"></i>}
                  </div>
                  <div className="payment-info">
                    <h4>Payer plus tard</h4>
                    <p>Vous avez 24 heures pour effectuer le paiement</p>
                  </div>
                </button>
              </div>

              <div className="form-actions">
                <button type="button" onClick={() => setStep(1)} className="btn-secondary">
                  <i className="fas fa-arrow-left"></i> Précédent
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default Reservation
