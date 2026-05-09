import { useState } from 'react'
import { SWAP_LOGS } from '../data/mockData'
import { Search } from 'lucide-react'

const fmtTime = (iso) => {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }) +
    ' ' + d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

// Extra mock data
const MORE_SWAPS = [
  { id: 'SWP-004', ticketOld: 'PKF-B7E3A2C1', ticketNew: 'PKF-SW-ABCD04', userName: 'Siti Rahayu', plate: 'BE 5678 CD', fromParking: 'Mall Boemi Kedaton', fromSlot: 'B1/B1-04', toParking: 'Lampung City Mall', toSlot: 'L1/A05', swapTime: '2026-05-08T09:30:00Z', status: 'success' },
  { id: 'SWP-005', ticketOld: 'PKF-E4B6E5G4', ticketNew: null, userName: 'Eko Prasetyo', plate: 'BE 7890 IJ', fromParking: 'Stasiun TK', fromSlot: 'L1/A08', toParking: 'Pasar Bambu Kuning', toSlot: 'L1/A03', swapTime: '2026-05-08T10:10:00Z', status: 'pending' },
]

const ALL_SWAPS = [...SWAP_LOGS, ...MORE_SWAPS].sort((a, b) => new Date(b.swapTime) - new Date(a.swapTime))

export default function SwapsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = ALL_SWAPS.filter(s => {
    const matchSearch =
      s.userName.toLowerCase().includes(search.toLowerCase()) ||
      s.ticketOld.toLowerCase().includes(search.toLowerCase()) ||
      s.plate.toLowerCase().includes(search.toLowerCase()) ||
      s.fromParking.toLowerCase().includes(search.toLowerCase()) ||
      s.toParking.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || s.status === statusFilter
    return matchSearch && matchStatus
  })

  const successCount = ALL_SWAPS.filter(s => s.status === 'success').length
  const failedCount = ALL_SWAPS.filter(s => s.status === 'failed').length
  const pendingCount = ALL_SWAPS.filter(s => s.status === 'pending').length

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">🔄 Manajemen Tukar Slot</h1>
          <p className="page-sub">Monitor semua permintaan dan riwayat penukaran slot parkir</p>
        </div>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px,1fr))', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Total Swap', value: ALL_SWAPS.length, color: 'var(--text)' },
          { label: 'Berhasil', value: successCount, color: 'var(--green)' },
          { label: 'Gagal', value: failedCount, color: 'var(--red)' },
          { label: 'Pending', value: pendingCount, color: 'var(--orange)' },
        ].map((s, i) => (
          <div key={i} className="card" style={{ padding: '14px 18px', textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <div className="input-icon-wrap" style={{ flex: 1, minWidth: 200 }}>
          <Search size={14} className="input-icon" />
          <input className="input" placeholder="Cari nama, tiket, gedung..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="filter-tabs">
          {[['all','Semua'], ['success','Berhasil'], ['failed','Gagal'], ['pending','Pending']].map(([v, l]) => (
            <button key={v} className={`filter-tab ${statusFilter === v ? 'active' : ''}`} onClick={() => setStatusFilter(v)}>{l}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Swap ID</th>
                <th>Pengguna</th>
                <th>Tiket Lama</th>
                <th>Dari</th>
                <th>Ke</th>
                <th>Tiket Baru</th>
                <th>Waktu</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8}>
                  <div className="empty-state">
                    <div className="empty-icon">🔄</div>
                    <div>Tidak ada data swap ditemukan</div>
                  </div>
                </td></tr>
              ) : filtered.map(s => (
                <tr key={s.id}>
                  <td style={{ fontSize: 12, color: 'var(--text3)', fontFamily: 'monospace' }}>{s.id}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="avatar avatar-sm">{s.userName[0]}</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{s.userName}</div>
                        <div style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--text3)' }}>{s.plate}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="ticket-code">{s.ticketOld}</span></td>
                  <td>
                    <div style={{ fontSize: 13, color: 'var(--text)' }}>{s.fromParking}</div>
                    <div style={{ fontSize: 11, color: 'var(--text3)' }}>{s.fromSlot}</div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ color: 'var(--accent)', fontWeight: 700 }}>→</span>
                      <div>
                        <div style={{ fontSize: 13, color: 'var(--text)' }}>{s.toParking}</div>
                        <div style={{ fontSize: 11, color: 'var(--text3)' }}>{s.toSlot}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    {s.ticketNew
                      ? <span className="ticket-code" style={{ color: 'var(--green)' }}>{s.ticketNew}</span>
                      : <span style={{ color: 'var(--text3)', fontSize: 12 }}>—</span>}
                  </td>
                  <td style={{ fontSize: 12 }}>{fmtTime(s.swapTime)}</td>
                  <td>
                    <span className={`badge ${
                      s.status === 'success' ? 'badge-green' :
                      s.status === 'failed' ? 'badge-red' : 'badge-orange'
                    }`}>
                      {s.status === 'success' ? '✓ Berhasil' :
                       s.status === 'failed' ? '✕ Gagal' : '⏳ Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* How swap works info box */}
      <div className="card" style={{ marginTop: 20 }}>
        <div className="card-header">
          <span className="card-title">ℹ️ Cara Kerja Tukar Slot</span>
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
            {[
              { step: '01', title: 'Pengguna Memilih Slot Baru', desc: 'Dari halaman booking aktif, pengguna memilih gedung dan slot tujuan yang tersedia.' },
              { step: '02', title: 'Konfirmasi Tukar', desc: 'Pengguna mengkonfirmasi perubahan slot. Sistem memvalidasi ketersediaan slot tujuan.' },
              { step: '03', title: 'Tiket Baru Diterbitkan', desc: 'Slot lama dilepas, tiket baru dengan kode PKF-SW-* otomatis diterbitkan.' },
              { step: '04', title: 'Masuk ke Slot Baru', desc: 'Pengguna scan tiket baru di gerbang gedung tujuan untuk aktivasi sesi.' },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'var(--accent-glow)', border: '1px solid var(--border2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 800, color: 'var(--accent)', flexShrink: 0
                }}>{s.step}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{s.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text3)', lineHeight: 1.5 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
