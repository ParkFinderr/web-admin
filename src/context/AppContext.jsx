import { createContext, useContext, useEffect, useState } from 'react'
import { authService } from '../services/apiService'

const AppContext = createContext()

const normalizeRole = (roleValue) => {
  const raw = String(roleValue || '').trim().toLowerCase()
  if (raw === 'superadmin' || raw === 'super_admin' || raw === 'super-admin') return 'superAdmin'
  if (raw === 'admin') return 'admin'
  if (raw === 'staff') return 'staff'
  return roleValue || 'admin'
}

const detectIsSuperAdmin = (userValue) => {
  if (!userValue) return false

  const roleCandidates = [
    userValue.role,
    userValue.userRole,
    userValue.type,
    userValue.userType,
    userValue?.data?.role,
  ]

  const hasSuperRole = roleCandidates.some((r) => {
    const normalized = normalizeRole(r)
    return normalized === 'superAdmin'
  })

  if (hasSuperRole) return true

  // Fallback for inconsistent API role payloads.
  const email = String(userValue.email || '').toLowerCase()
  const name = String(userValue.name || '').toLowerCase()
  if (email === 'super@parkfinder.id') return true
  if (name.includes('super admin')) return true

  return false
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('pf_user')) || null } catch { return null }
  })
  const [token, setToken] = useState(() => localStorage.getItem('pf_token') || null)
  const [theme, setTheme] = useState(() => localStorage.getItem('pf_theme') || 'dark')

  const clearSession = () => {
    localStorage.removeItem('pf_token')
    localStorage.removeItem('pf_user')
    setToken(null)
    setUser(null)
  }

  useEffect(() => {
    if (!token) return

    const looksLikeJwt = token.split('.').length === 3
    if (token.startsWith('demo-') || !looksLikeJwt) {
      clearSession()
    }
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('pf_theme', theme)
  }, [theme])

  const isLoggedIn = !!user && !!token
  // superAdmin = highest privileged dashboard account
  const isSuperAdmin = detectIsSuperAdmin(user)
  // admin = staff/admin parkir
  const isAdmin = normalizeRole(user?.role) === 'admin'

  const login = async (email, password) => {
    try {
      const res = await authService.login(email, password)
      const data = res.data || res
      const t = data.token || data.accessToken || data.jwt || null
      const uRaw = data.user || data.account || {
        email,
        role: data.role || data.data?.role || 'admin',
      }
      const u = { ...uRaw, role: normalizeRole(uRaw.role || data.role || data.data?.role) }

      if (!t) {
        return { ok: false, msg: 'Token tidak ditemukan di respons login.' }
      }
      
      localStorage.setItem('pf_token', t)
      localStorage.setItem('pf_user', JSON.stringify(u))
      setToken(t)
      setUser(u)
      return { ok: true, user: u }
    } catch (err) {
      return { ok: false, msg: err.message || 'Login gagal' }
    }
  }

  const logout = async () => {
    try { await authService.logout() } catch { /* ignore */ }
    clearSession()
  }

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  return (
    <AppContext.Provider value={{
      user, token, isLoggedIn, isSuperAdmin, isAdmin,
      login, logout,
      theme, toggleTheme,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
