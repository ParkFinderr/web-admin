import { useState } from 'react'
import { USERS } from '../data/mockData'
import { Search } from 'lucide-react'

const fmtDate = (iso) => {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('id-ID', { day:'2-digit', month:'short', year:'numeric' })
}

const guestCount = USERS.filter(u => u.platform === 'web').length

export default function UsersPage() {
  const [search, setSearch]           = useState('')
  const [platformFilter, setPlatform] = useState('all')
  const [statusFilter, setStatus]     = useState('all')
  const [selectedUser, setSelectedUser] = useState(null)

  const filtered = USERS.filter(u => {
    const q = search.toLowerCase()
    const matchSearch =
      (u.name?.toLowerCase().includes(q)) ||
      (u.email?.toLowerCase().includes(q)) ||
      (u.phone?.includes(q)) ||
      (u.plate?.toLowerCase().includes(q)) ||
      (u.id?.toLowerCase().includes(q))
    const matchPlatform = platformFilter === 'all' || u.platform === platformFilter
    const matchStatus   = statusFilter === 'all'   || u.status === statusFilter
    return matchSearch && matchPlatform && matchStatus
  })

  const isGuest = (u) => u.platform === 'web'

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">👥 Data Pengguna</h1>
          <p className="page-sub">Monitor semua pengguna Mobile App & Web (Tamu)</p>
        </div>
      </div>

      {/* Summary */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(155px,1fr))', gap:12, marginBottom:20 }}>
        {[
          { label:'Total Pengguna',  value: USERS.length,                                              color:'var(--text)' },
          { label:'Aktif',           value: USERS.filter(u => u.status === 'active').length,            color:'var(--green)' },
          { label:'Non-Aktif',       value: USERS.filter(u => u.status !== 'active').length,            color:'var(--text3)' },
          { label:'Mobile App',      value: USERS.filter(u => u.platform === 'mobile').length,          color:'var(--accent)' },
          { label:'Web (Tamu)',       value: guestCount,                                                 color:'var(--accent2)' },
        ].map((s, i) => (
          <div key={i} className="card" style={{ padding:'14px 18px', textAlign:'center' }}>
            <div style={{ fontSize:22, fontWeight:800, color:s.color }}>{s.value}</div>
            <div style={{ fontSize:12, color:'var(--text3)', marginTop:3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Info box for guest */}
      <div style={{
        display:'flex', alignItems:'flex-start', gap:10,
        background:'var(--accent2-glow)', border:'1px solid rgba(123,97,255,0.2)',
        borderRadius:'var(--radius)', padding:'12px 16px', marginBottom:16, fontSize:13,
      }}>
        <span style={{ fontSize:18, flexShrink:0 }}>ℹ️</span>
        <span style={{ color:'var(--text2)', lineHeight:1.5 }}>
          Pengguna <strong style={{ color:'var(--accent2)' }}>Web User</strong> menggunakan sistem tanpa login — ditampilkan sebagai <strong style={{ color:'var(--accent2)' }}>Tamu</strong>.
          Data yang tersimpan hanya plat kendaraan dari form booking.
        </span>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <div className="input-icon-wrap" style={{ flex:1, minWidth:200 }}>
          <Search size={14} className="input-icon" />
          <input className="input" placeholder="Cari nama, email, telepon, atau plat..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="filter-tabs">
          {[['all','Semua'],['mobile','Mobile App'],['web','Web (Tamu)']].map(([v,l]) => (
            <button key={v} className={`filter-tab ${platformFilter === v ? 'active' : ''}`} onClick={() => setPlatform(v)}>{l}</button>
          ))}
        </div>
        <div className="filter-tabs">
          {[['all','Semua Status'],['active','Aktif'],['inactive','Non-Aktif']].map(([v,l]) => (
            <button key={v} className={`filter-tab ${statusFilter === v ? 'active' : ''}`} onClick={() => setStatus(v)}>{l}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Pengguna</th>
                <th>Kontak</th>
                <th>Plat Kendaraan</th>
                <th>Platform</th>
                <th>Total Booking</th>
                <th>Booking Aktif</th>
                <th>Bergabung</th>
                <th>Terakhir Aktif</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={10}>
                  <div className="empty-state"><div className="empty-icon">👤</div><div>Tidak ada pengguna ditemukan</div></div>
                </td></tr>
              ) : filtered.map(u => {
                const guest = isGuest(u)
                return (
                  <tr key={u.id}>
                    {/* Pengguna */}
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div className="avatar" style={{ background: guest ? 'linear-gradient(135deg,var(--accent2),#a855f7)' : undefined }}>
                          {guest ? '👤' : u.name[0]}
                        </div>
                        <div>
                          <div style={{ fontSize:13, fontWeight:700, color:'var(--text)' }}>
                            {guest ? 'Tamu' : u.name}
                          </div>
                          <div style={{ fontSize:11, color:'var(--text3)' }}>{u.id}</div>
                        </div>
                      </div>
                    </td>

                    {/* Kontak */}
                    <td>
                      {guest ? (
                        <span style={{ fontSize:12, color:'var(--text3)', fontStyle:'italic' }}>Tidak ada akun</span>
                      ) : (
                        <div>
                          <div style={{ fontSize:12, color:'var(--text)' }}>{u.email}</div>
                          <div style={{ fontSize:11, color:'var(--text3)' }}>{u.phone}</div>
                        </div>
                      )}
                    </td>

                    {/* Plat */}
                    <td>
                      <span style={{ fontFamily:'monospace', fontWeight:800, fontSize:13, color:'var(--accent)', letterSpacing:'0.5px' }}>
                        {u.plate || '—'}
                      </span>
                    </td>

                    {/* Platform */}
                    <td>
                      <span className={`badge ${guest ? 'badge-purple' : 'badge-accent'}`}>
                        {guest ? '🌐 Web (Tamu)' : '📱 Mobile'}
                      </span>
                    </td>

                    <td style={{ fontWeight:700, color:'var(--text)' }}>{u.totalBookings}</td>

                    <td>
                      {u.activeBookings > 0
                        ? <span className="badge badge-green">● {u.activeBookings} Aktif</span>
                        : <span style={{ fontSize:13, color:'var(--text3)' }}>—</span>}
                    </td>

                    <td style={{ fontSize:12 }}>{fmtDate(u.joinDate)}</td>
                    <td style={{ fontSize:12 }}>{fmtDate(u.lastActive)}</td>

                    <td>
                      <span className={`badge ${u.status === 'active' ? 'badge-green' : 'badge-gray'}`}>
                        {u.status === 'active' ? '● Aktif' : '○ Nonaktif'}
                      </span>
                    </td>

                    <td>
                      <button className="btn btn-ghost btn-sm" onClick={() => setSelectedUser(u)}>Detail</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedUser && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', zIndex:999, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }} onClick={() => setSelectedUser(null)}>
          <div style={{ background:'var(--bg-card)', border:'1px solid var(--border2)', borderRadius:'var(--radius-lg)', width:'100%', maxWidth:460, overflow:'hidden' }} onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div style={{ padding:'20px 24px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap:14 }}>
              <div className="avatar avatar-lg" style={{ background: isGuest(selectedUser) ? 'linear-gradient(135deg,var(--accent2),#a855f7)' : undefined }}>
                {isGuest(selectedUser) ? '👤' : selectedUser.name[0]}
              </div>
              <div>
                <div style={{ fontSize:18, fontWeight:800, color:'var(--text)' }}>
                  {isGuest(selectedUser) ? 'Pengguna Tamu' : selectedUser.name}
                </div>
                <div style={{ fontSize:13, color:'var(--text3)' }}>{selectedUser.id}</div>
              </div>
              <button onClick={() => setSelectedUser(null)} style={{ marginLeft:'auto', background:'none', border:'none', color:'var(--text3)', cursor:'pointer', fontSize:20 }}>✕</button>
            </div>

            {/* Guest notice */}
            {isGuest(selectedUser) && (
              <div style={{ background:'var(--accent2-glow)', borderBottom:'1px solid var(--border)', padding:'10px 24px', fontSize:12, color:'var(--accent2)' }}>
                🌐 Pengguna ini mengakses melalui <strong>Web User</strong> tanpa login — tidak ada data akun.
              </div>
            )}

            {/* Fields */}
            <div style={{ padding:'20px 24px' }}>
              {[
                ['Platform',       isGuest(selectedUser) ? '🌐 Web User (Tamu)' : '📱 Mobile App'],
                ['Plat Kendaraan', selectedUser.plate || '—'],
                ['Email',          selectedUser.email || '—'],
                ['Telepon',        selectedUser.phone || '—'],
                ['Total Booking',  selectedUser.totalBookings],
                ['Booking Aktif',  selectedUser.activeBookings],
                ['Bergabung',      fmtDate(selectedUser.joinDate)],
                ['Terakhir Aktif', fmtDate(selectedUser.lastActive)],
                ['Status',         selectedUser.status === 'active' ? '● Aktif' : '○ Nonaktif'],
              ].map(([k, v]) => (
                <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid var(--border)', gap:12 }}>
                  <span style={{ fontSize:13, color:'var(--text3)' }}>{k}</span>
                  <span style={{ fontSize:13, fontWeight:600, color:'var(--text)', textAlign:'right', maxWidth:260 }}>{v}</span>
                </div>
              ))}
            </div>

            <div style={{ padding:'14px 24px', borderTop:'1px solid var(--border)', display:'flex', justifyContent:'flex-end', gap:10 }}>
              {!isGuest(selectedUser) && (
                <button className="btn btn-danger btn-sm">Nonaktifkan</button>
              )}
              <button className="btn btn-ghost btn-sm" onClick={() => setSelectedUser(null)}>Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
