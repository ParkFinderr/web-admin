import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import StaffLayout from './components/StaffLayout'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import ParkingsPage from './pages/ParkingsPage'
import BookingsPage from './pages/BookingsPage'
import UsersPage from './pages/UsersPage'
import ScansPage from './pages/ScansPage'
import SwapsPage from './pages/SwapsPage'
import AnalyticsPage from './pages/AnalyticsPage'
import SettingsPage from './pages/SettingsPage'
import StaffDashboard from './pages/StaffDashboard'
import StaffManagementPage from './pages/StaffManagementPage'
import ProfilePage from './pages/ProfilePage'
import './index.css'

/* ── Admin Layout ──────────────────────────────────────────────────── */
function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  return (
    <div className="admin-layout">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="admin-main">
        <Topbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="admin-content">{children}</main>
      </div>
    </div>
  )
}

/* ── Route Guards ──────────────────────────────────────────────────── */
function RequireAdmin({ children }) {
  const { isLoggedIn, isAdmin } = useApp()
  if (!isLoggedIn) return <Navigate to="/login" replace />
  if (!isAdmin)   return <Navigate to="/staff" replace />
  return children
}

function RequireStaff({ children }) {
  const { isLoggedIn, isStaff } = useApp()
  if (!isLoggedIn) return <Navigate to="/login" replace />
  if (!isStaff)    return <Navigate to="/" replace />
  return children
}

/* ── Routes ────────────────────────────────────────────────────────── */
function AppRoutes() {
  const { isLoggedIn, isAdmin, isStaff } = useApp()

  const adminHome = (
    <RequireAdmin>
      <AdminLayout><Dashboard /></AdminLayout>
    </RequireAdmin>
  )

  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={
        !isLoggedIn ? <LoginPage />
          : isAdmin ? <Navigate to="/" replace />
          : <Navigate to="/staff" replace />
      } />

      {/* Admin routes */}
      <Route path="/" element={<RequireAdmin><AdminLayout><Dashboard /></AdminLayout></RequireAdmin>} />
      <Route path="/parkings"  element={<RequireAdmin><AdminLayout><ParkingsPage /></AdminLayout></RequireAdmin>} />
      <Route path="/bookings"  element={<RequireAdmin><AdminLayout><BookingsPage /></AdminLayout></RequireAdmin>} />
      <Route path="/users"     element={<RequireAdmin><AdminLayout><UsersPage /></AdminLayout></RequireAdmin>} />
      <Route path="/scans"     element={<RequireAdmin><AdminLayout><ScansPage /></AdminLayout></RequireAdmin>} />
      <Route path="/swaps"     element={<RequireAdmin><AdminLayout><SwapsPage /></AdminLayout></RequireAdmin>} />
      <Route path="/analytics" element={<RequireAdmin><AdminLayout><AnalyticsPage /></AdminLayout></RequireAdmin>} />
      <Route path="/staff-management" element={<RequireAdmin><AdminLayout><StaffManagementPage /></AdminLayout></RequireAdmin>} />
      <Route path="/profile"          element={<RequireAdmin><AdminLayout><ProfilePage /></AdminLayout></RequireAdmin>} />
      <Route path="/settings"  element={<RequireAdmin><AdminLayout><SettingsPage /></AdminLayout></RequireAdmin>} />

      {/* Staff route */}
      <Route path="/staff" element={
        <RequireStaff>
          <StaffLayout><StaffDashboard /></StaffLayout>
        </RequireStaff>
      } />

      {/* Fallback */}
      <Route path="*" element={
        <Navigate to={!isLoggedIn ? '/login' : isAdmin ? '/' : '/staff'} replace />
      } />
    </Routes>
  )
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  )
}
