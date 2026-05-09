import { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext()

// ── Akun Staff per Gedung ─────────────────────────────────────────
export const STAFF_ACCOUNTS = [
  {
    id: 'staff-1',
    name: 'Rizki Pratama',
    email: 'staff.unila@parkfinder.id',
    password: 'staff123',
    parkingId: 1,
    parkingName: 'Jurusan Teknik Elektro UNILA',
    parkingShort: 'UNILA Teknik',
  },
  {
    id: 'staff-2',
    name: 'Maya Sari',
    email: 'staff.mbk@parkfinder.id',
    password: 'staff123',
    parkingId: 2,
    parkingName: 'Mall Boemi Kedaton',
    parkingShort: 'MBK',
  },
  {
    id: 'staff-3',
    name: 'Andi Wijaya',
    email: 'staff.lcm@parkfinder.id',
    password: 'staff123',
    parkingId: 3,
    parkingName: 'Lampung City Mall',
    parkingShort: 'LCM',
  },
  {
    id: 'staff-4',
    name: 'Sari Dewi',
    email: 'staff.bambu@parkfinder.id',
    password: 'staff123',
    parkingId: 4,
    parkingName: 'Pasar Bambu Kuning',
    parkingShort: 'P. Bambu Kuning',
  },
  {
    id: 'staff-5',
    name: 'Hendra Kusuma',
    email: 'staff.rsud@parkfinder.id',
    password: 'staff123',
    parkingId: 5,
    parkingName: 'RSUD Abdul Moeloek',
    parkingShort: 'RSUD AM',
  },
  {
    id: 'staff-6',
    name: 'Putri Lestari',
    email: 'staff.stasiun@parkfinder.id',
    password: 'staff123',
    parkingId: 6,
    parkingName: 'Stasiun Tanjungkarang',
    parkingShort: 'Stasiun TK',
  },
]

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('pf_user')) || null } catch { return null }
  })
  const [theme, setTheme] = useState(() => localStorage.getItem('pf_theme') || 'dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('pf_theme', theme)
  }, [theme])

  const isLoggedIn = !!user
  const isAdmin    = user?.role === 'admin'
  const isStaff    = user?.role === 'staff'

  const loginAdmin = (email, password) => {
    if (email === 'admin@parkfinder.id' && password === 'admin123') {
      const u = { role: 'admin', name: 'Admin', email }
      sessionStorage.setItem('pf_user', JSON.stringify(u))
      setUser(u)
      return { ok: true }
    }
    return { ok: false, msg: 'Email atau password admin salah' }
  }

  const loginStaff = (staffId, password) => {
    const acc = STAFF_ACCOUNTS.find(s => s.id === staffId)
    if (!acc) return { ok: false, msg: 'Pilih akun staff terlebih dahulu' }
    if (acc.password !== password) return { ok: false, msg: 'Password salah' }
    const u = {
      role: 'staff',
      id: acc.id,
      name: acc.name,
      email: acc.email,
      parkingId: acc.parkingId,
      parkingName: acc.parkingName,
      parkingShort: acc.parkingShort,
    }
    sessionStorage.setItem('pf_user', JSON.stringify(u))
    setUser(u)
    return { ok: true }
  }

  const logout = () => {
    sessionStorage.removeItem('pf_user')
    setUser(null)
  }

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  return (
    <AppContext.Provider value={{ user, isLoggedIn, isAdmin, isStaff, loginAdmin, loginStaff, logout, theme, toggleTheme }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
