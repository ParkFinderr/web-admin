import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Car, CalendarCheck, Users,
  QrCode, ArrowLeftRight, BarChart3, Settings, LogOut, UserCog
} from 'lucide-react'
import { useApp } from '../context/AppContext'

const LOGO_URL = 'https://storage.googleapis.com/parkfinderbucket/foto/logo.png'

const NAV_ITEMS = [
  {
    section: 'Utama',
    items: [
      { path: '/', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/parkings', label: 'Gedung Parkir', icon: Car },
      { path: '/bookings', label: 'Manajemen Booking', icon: CalendarCheck, badge: '1.2K' },
      { path: '/users', label: 'Data Pengguna', icon: Users },
    ],
  },
  {
    section: 'Monitoring',
    items: [
      { path: '/scans', label: 'Log Scan QR', icon: QrCode },
      { path: '/swaps', label: 'Tukar Slot', icon: ArrowLeftRight },
      { path: '/analytics', label: 'Analitik & Statistik', icon: BarChart3 },
    ],
  },
  {
    section: 'Sistem',
    items: [
      { path: '/staff-management', label: 'Manajemen Staff', icon: UserCog },
      { path: '/settings', label: 'Pengaturan', icon: Settings },
    ],
  },
]

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useApp()

  return (
    <>
      {open && (
        <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 99 }} />
      )}
      <aside className={`admin-sidebar ${open ? 'open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <img
            src={LOGO_URL}
            alt="ParkFinder"
            style={{ height: 36, width: 'auto', objectFit: 'contain', maxWidth: 140 }}
            onError={e => { e.target.style.display = 'none' }}
          />
          <div style={{ fontSize: 10, color: 'var(--text3)', fontWeight: 600, marginTop: 2, letterSpacing: '0.5px' }}>ADMIN DASHBOARD</div>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          {NAV_ITEMS.map((section) => (
            <div key={section.section}>
              <div className="nav-section-label">{section.section}</div>
              {section.items.map((item) => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/'}
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    onClick={onClose}
                  >
                    <span className="nav-item-icon"><Icon size={16} /></span>
                    {item.label}
                    {item.badge && <span className="nav-item-badge">{item.badge}</span>}
                  </NavLink>
                )
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', borderRadius: 'var(--radius)',
            background: 'var(--bg-hover)', border: '1px solid var(--border)',
          }}>
            <div className="avatar avatar-sm">{user?.name?.[0] || 'A'}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{user?.name || 'Admin'}</div>
              <div style={{ fontSize: 11, color: 'var(--text3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.email || 'admin@parkfinder.id'}
              </div>
            </div>
            <button onClick={logout} title="Logout" style={{
              background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)',
              display: 'flex', padding: 4, borderRadius: 6, transition: 'color 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--red)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text3)'}
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
