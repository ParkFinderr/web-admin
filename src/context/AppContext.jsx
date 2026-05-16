import { createContext, useContext, useEffect, useState } from 'react'
import { authService } from '../services/apiService'

const AppContext = createContext()

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
  // superAdmin = admin role in current UI terminology
  const isSuperAdmin = user?.role === 'superAdmin'
  // admin = staff/admin parkir
  const isAdmin = user?.role === 'admin'

  const login = async (email, password) => {
    try {
      const res = await authService.login(email, password)
      const data = res.data || res
      const t = data.token || data.accessToken || data.jwt || null
      const u = data.user || data.account || {
        email,
        role: data.role || data.data?.role || 'admin',
      }

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
