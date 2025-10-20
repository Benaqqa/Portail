import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './App.css'

// Pages
import Landing from './pages/Landing'
import Login from './pages/Login'
import Home from './pages/Home'
import Reservation from './pages/Reservation'
import ReservationConfirmation from './pages/ReservationConfirmation'
import ReservationDetails from './pages/ReservationDetails'
import UserHistory from './pages/UserHistory'
import UserProfile from './pages/UserProfile'
import AdminCentres from './pages/admin/AdminCentres'
import AdminReservations from './pages/admin/AdminReservations'
import AdminUsers from './pages/admin/AdminUsers'
import AdminGenerateCode from './pages/admin/AdminGenerateCode'
import AdminActualites from './pages/admin/AdminActualites'

// Context
import { AuthProvider, useAuth } from './context/AuthContext'

// Protected Route Component
function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="loading">Chargement...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (adminOnly && user.role !== 'ADMIN') {
    return <Navigate to="/home" replace />
  }

  return children
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reservation"
            element={
              <ProtectedRoute>
                <Reservation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reservation/confirmation/:id"
            element={
              <ProtectedRoute>
                <ReservationConfirmation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reservation/details/:id"
            element={
              <ProtectedRoute>
                <ReservationDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/history"
            element={
              <ProtectedRoute>
                <UserHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/historique"
            element={
              <ProtectedRoute>
                <UserHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profil"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/home/admin/centres"
            element={
              <ProtectedRoute adminOnly>
                <AdminCentres />
              </ProtectedRoute>
            }
          />
          <Route
            path="/home/admin/reservations"
            element={
              <ProtectedRoute adminOnly>
                <AdminReservations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/home/admin/users"
            element={
              <ProtectedRoute adminOnly>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/home/admin/generate-code"
            element={
              <ProtectedRoute adminOnly>
                <AdminGenerateCode />
              </ProtectedRoute>
            }
          />
          <Route
            path="/home/admin/actualites"
            element={
              <ProtectedRoute adminOnly>
                <AdminActualites />
              </ProtectedRoute>
            }
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App

