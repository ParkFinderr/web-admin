import { useState } from 'react'
import { SCAN_LOGS } from '../data/mockData'
import { Search } from 'lucide-react'

const fmtTime = (iso) => {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }) +
    ' ' + d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

// Extend mock scan logs with more entries
const EXTRA_SCANS = [
  { id: 'SCN-007', ticketCode: 'PKF-H1F9H8J7', userName: 'Hana Putri', plate: 'BE 6789 OP', parking: 'RSUD Abdul Moeloek', scanTime: '2026-05-08T11:10:00Z', action: 'masuk', status: 'success' },
  { id: 'SCN-008', ticketCode: 'PKF-F3A7F6H5', userName: 'Farah Amelia', plate: 'BG 2345 KL', parking: 'UNILA Teknik', scanTime: '2026-05-08T07:10:00Z', action: 'masuk', status: 'success' },
  { id: 'SCN-009', ticketCode: 'PKF-INVALID02', userName: '—', plate: '—', parking: 'Mall Boemi Kedaton', scanTime: '2026-05-08T10:30:00Z', action: 'masuk', status: 'failed' },
  { id: 'SCN-010', ticketCode: 'PKF-G2E8G7I6', userName: 'Gunawan Halim', plate: 'BE 4567 MN', parking: 'Mall Boemi Kedaton', scanTime: '2026-05-07T16:30:00Z', action: 'keluar', status: 'success' },
]

const ALL_SCANS = [...SCAN_LOGS, ...EXTRA_SCANS].sort((a, b) => new Date(b.scanTime) - new Date(a.scanTime))

export default function ScansPage() {
  const [search, setSearch] = useState('')
  const [actionFilter, setActionFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = ALL_SCANS.filter(s => {
    const matchSearch =
      s.ticketCode.toLowerCase().includes(search.toLowerCase()) ||
      s.userName.toLowerCase().includes(search.toLowerCase()) ||
      s.parking.toLowerCase().includes(search.toLowerCase()) ||
      s.plate.toLowerCase().includes(search.toLowerCase())
    const matchAction = actionFilter === 'all' || s.action === actionFilter
    const matchStatus = statusFilter === 'all' || s.status === statusFilter
    return matchSearch && matchAction && matchStatus
  })

  const successCount = ALL_SCANS.filter(s => s.status === 'success').length
  const failedCount = ALL_SCANS.filter(s => s.status === 'failed').length
  const masukCount = ALL_SCANS.filter(s => s.action === 'masuk').length
  const keluarCount = ALL_SCANS.filter(s => s.action === 'keluar').length

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">📡 Log Scan QR</h1>
          <p className="page-sub">Riwayat semua aktivitas scan tiket parkir secara real-time</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost">Export Log</button>
        </div>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px,1fr))', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Total Scan', value: ALL_SCANS.length, color: 'var(--text)' },
          { label: 'Berhasil', value: successCount, color: 'var(--green)' },
          { label: 'Gagal', value: failedCount, color: 'var(--red)' },
          { label: 'Masuk', value: masukCount, color: 'var(--accent)' },
          { label: 'Keluar', value: keluarCount, color: 'var(--orange)' },
        ].map((s, i) => (
          <div key={i} className="card" style={{ padding: '14px 18px', textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Live indicator */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px',
        background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)',
        borderRadius: 'var(--radius)', marginBottom: 16, fontSize: 13, color: 'var(--green)'
      }}>
        <span className="status-dot status-dot-green" />
        Monitoring aktif — Data scan diperbarui secara real-time
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <div className="input-icon-wrap" style={{ flex: 1, minWidth: 200 }}>
          <Search size={14} className="input-icon" />
          <input className="input" placeholder="Cari kode tiket, nama, gedung..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="filter-tabs">
          {[['all','Semua Aksi'], ['masuk','Masuk'], ['keluar','Keluar']].map(([v, l]) => (
            <button key={v} className={`filter-tab ${actionFilter === v ? 'active' : ''}`} onClick={() => setActionFilter(v)}>{l}</button>
          ))}
        </div>
        <div className="filter-tabs">
          {[['all','Semua Status'], ['success','Berhasil'], ['failed','Gagal']].map(([v, l]) => (
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
                <th>Log ID</th>
                <th>Kode Tiket</th>
                <th>Pengguna</th>
                <th>Plat Kendaraan</th>
                <th>Gedung</th>
                <th>Aksi</th>
                <th>Waktu Scan</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8}>
                  <div className="empty-state">
                    <div className="empty-icon">🔍</div>
                    <div>Tidak ada log scan ditemukan</div>
                  </div>
                </td></tr>
              ) : filtered.map(s => (
                <tr key={s.id}>
                  <td style={{ fontSize: 12, color: 'var(--text3)', fontFamily: 'monospace' }}>{s.id}</td>
                  <td><span className="ticket-code">{s.ticketCode}</span></td>
                  <td>
                    {s.userName !== '—' ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="avatar avatar-sm">{s.userName[0]}</div>
                        <span style={{ fontSize: 13, color: 'var(--text)' }}>{s.userName}</span>
                      </div>
                    ) : (
                      <span style={{ fontSize: 13, color: 'var(--red)' }}>⚠ Tidak dikenal</span>
                    )}
                  </td>
                  <td><span style={{ fontSize: 13, fontFamily: 'monospace', fontWeight: 700, color: s.plate !== '—' ? 'var(--text)' : 'var(--text3)' }}>{s.plate}</span></td>
                  <td style={{ fontSize: 13, color: 'var(--text)' }}>{s.parking}</td>
                  <td>
                    <span className={`badge ${s.action === 'masuk' ? 'badge-accent' : 'badge-orange'}`}>
                      {s.action === 'masuk' ? '⬆ Masuk' : '⬇ Keluar'}
                    </span>
                  </td>
                  <td style={{ fontSize: 12 }}>{fmtTime(s.scanTime)}</td>
                  <td>
                    <span className={`badge ${s.status === 'success' ? 'badge-green' : 'badge-red'}`}>
                      {s.status === 'success' ? '✓ Berhasil' : '✕ Gagal'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
