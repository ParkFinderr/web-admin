import { useState } from 'react'
import { PARKINGS } from '../data/mockData'
import { useApp } from '../context/AppContext'
import { Search, Plus, X, UserPlus, Edit2, Trash2, Lock, Eye, EyeOff } from 'lucide-react'

const PARKING_LIST = PARKINGS || []

const fmtDate = (iso) => {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('id-ID', { day:'2-digit', month:'short', year:'numeric' })
}

// Initial staff list seeded dari AppContext
const INIT_STAFF = [
  { id:'staff-1', name:'Rizki Pratama',  email:'staff.unila@parkfinder.id', phone:'0812-1111-2222', parkingId:1, parkingName:'Jurusan Teknik Elektro UNILA', joinDate:'2026-01-10', status:'active', shifts:'Pagi (06:00–14:00)' },
  { id:'staff-2', name:'Maya Sari',      email:'staff.mbk@parkfinder.id',   phone:'0821-3333-4444', parkingId:2, parkingName:'Mall Boemi Kedaton',           joinDate:'2026-01-15', status:'active', shifts:'Pagi (06:00–14:00)' },
  { id:'staff-3', name:'Andi Wijaya',    email:'staff.lcm@parkfinder.id',   phone:'0856-5555-6666', parkingId:3, parkingName:'Lampung City Mall',            joinDate:'2026-02-01', status:'active', shifts:'Siang (14:00–22:00)' },
  { id:'staff-4', name:'Sari Dewi',      email:'staff.bambu@parkfinder.id', phone:'0878-7777-8888', parkingId:4, parkingName:'Pasar Bambu Kuning',           joinDate:'2026-02-10', status:'active', shifts:'Pagi (06:00–14:00)' },
  { id:'staff-5', name:'Hendra Kusuma', email:'staff.rsud@parkfinder.id',  phone:'0813-9999-0000', parkingId:5, parkingName:'RSUD Abdul Moeloek',           joinDate:'2026-03-05', status:'active', shifts:'Malam (22:00–06:00)' },
  { id:'staff-6', name:'Putri Lestari',  email:'staff.stasiun@parkfinder.id', phone:'0857-1212-3434', parkingId:6, parkingName:'Stasiun Tanjungkarang',   joinDate:'2026-03-20', status:'active', shifts:'Siang (14:00–22:00)' },
]

const SHIFT_OPTIONS = ['Pagi (06:00–14:00)', 'Siang (14:00–22:00)', 'Malam (22:00–06:00)']

/* ── Modal Tambah/Edit Staff ────────────────────────────────────────── */
function StaffFormModal({ editData, onClose, onSave }) {
  const isEdit = !!editData
  const [form, setForm] = useState({
    name:       editData?.name || '',
    email:      editData?.email || '',
    phone:      editData?.phone || '',
    parkingId:  editData?.parkingId || '',
    shifts:     editData?.shifts || SHIFT_OPTIONS[0],
    password:   '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: null })) }

  const validate = () => {
    const e = {}
    if (!form.name.trim())     e.name     = 'Nama wajib diisi'
    if (!form.email.trim())    e.email    = 'Email wajib diisi'
    if (!form.phone.trim())    e.phone    = 'No. telepon wajib diisi'
    if (!form.parkingId)       e.parkingId = 'Pilih gedung parkir'
    if (!isEdit && !form.password) e.password = 'Password wajib diisi untuk staff baru'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 700))
    const pkg = PARKING_LIST.find(p => p.id === Number(form.parkingId))
    onSave({
      id:          editData?.id || 'staff-' + Date.now(),
      name:        form.name.trim(),
      email:       form.email.trim(),
      phone:       form.phone.trim(),
      parkingId:   Number(form.parkingId),
      parkingName: pkg?.name || '—',
      shifts:      form.shifts,
      joinDate:    editData?.joinDate || new Date().toISOString().slice(0,10),
      status:      editData?.status || 'active',
    })
    setLoading(false)
    setSuccess(true)
  }

  const Field = ({ label, id, error, children }) => (
    <div style={{ marginBottom:14 }}>
      <label htmlFor={id} style={{ display:'block', fontSize:13, fontWeight:600, color:'var(--text2)', marginBottom:6 }}>{label}</label>
      {children}
      {error && <div style={{ fontSize:12, color:'var(--red)', marginTop:4 }}>⚠ {error}</div>}
    </div>
  )

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }} onClick={onClose}>
      <div style={{ background:'var(--bg-card)', border:'1px solid var(--border2)', borderRadius:'var(--radius-lg)', width:'100%', maxWidth:500, maxHeight:'92vh', overflow:'auto', animation:'fadeUp .35s ease both' }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ padding:'20px 24px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:'var(--accent-glow)', border:'1px solid var(--border2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <UserPlus size={18} color="var(--accent)" />
            </div>
            <div>
              <div style={{ fontSize:16, fontWeight:800, color:'var(--text)' }}>{isEdit ? 'Edit Data Staff' : 'Tambah Staff Baru'}</div>
              <div style={{ fontSize:12, color:'var(--text3)' }}>{isEdit ? `Mengubah data ${editData.name}` : 'Isi data petugas gedung parkir'}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text3)', display:'flex' }}><X size={18} /></button>
        </div>

        {success ? (
          <div style={{ padding:'48px 24px', textAlign:'center' }}>
            <div style={{ fontSize:52, marginBottom:14 }}>✅</div>
            <h3 style={{ fontSize:18, fontWeight:800, color:'var(--text)', marginBottom:8 }}>
              {isEdit ? 'Data Berhasil Diperbarui!' : 'Staff Berhasil Ditambahkan!'}
            </h3>
            <p style={{ fontSize:13, color:'var(--text3)', marginBottom:24 }}>
              <strong style={{ color:'var(--accent)' }}>{form.name}</strong> telah berhasil {isEdit ? 'diperbarui' : 'ditambahkan ke sistem'}.
            </p>
            <button className="btn btn-primary" onClick={onClose} style={{ width:'100%', justifyContent:'center', padding:11 }}>Tutup</button>
          </div>
        ) : (
          <form onSubmit={handleSave} style={{ padding:24 }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
              <Field label="Nama Lengkap *" id="name" error={errors.name}>
                <input id="name" className="input" placeholder="Nama petugas" value={form.name} onChange={e => set('name', e.target.value)} style={{ borderColor: errors.name ? 'var(--red)':undefined }} />
              </Field>
              <Field label="No. Telepon *" id="phone" error={errors.phone}>
                <input id="phone" className="input" placeholder="0812-xxxx-xxxx" value={form.phone} onChange={e => set('phone', e.target.value)} style={{ borderColor: errors.phone ? 'var(--red)':undefined }} />
              </Field>
            </div>

            <Field label="Email Login *" id="email" error={errors.email}>
              <input id="email" className="input" type="email" placeholder="staff.nama@parkfinder.id" value={form.email} onChange={e => set('email', e.target.value)} style={{ borderColor: errors.email ? 'var(--red)':undefined }} />
            </Field>

            {!isEdit && (
              <Field label="Password *" id="password" error={errors.password}>
                <input id="password" className="input" type="password" placeholder="Min. 6 karakter" value={form.password} onChange={e => set('password', e.target.value)} style={{ borderColor: errors.password ? 'var(--red)':undefined }} />
              </Field>
            )}

            <Field label="Gedung Parkir Ditugaskan *" id="parkingId" error={errors.parkingId}>
              <select id="parkingId" className="input" value={form.parkingId} onChange={e => set('parkingId', e.target.value)} style={{ cursor:'pointer', borderColor: errors.parkingId ? 'var(--red)':undefined }}>
                <option value="">-- Pilih gedung --</option>
                {PARKING_LIST.map(p => (
                  <option key={p.id} value={p.id}>🏢 {p.name}</option>
                ))}
              </select>
            </Field>

            <Field label="Shift Kerja" id="shifts" error={null}>
              <select id="shifts" className="input" value={form.shifts} onChange={e => set('shifts', e.target.value)} style={{ cursor:'pointer' }}>
                {SHIFT_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>

            {/* Preview */}
            {(form.name || form.parkingId) && (
              <div style={{ background:'var(--accent-glow)', border:'1px solid var(--border2)', borderRadius:10, padding:'12px 14px', marginBottom:20 }}>
                <div style={{ fontSize:11, color:'var(--text3)', marginBottom:6, fontWeight:600 }}>Preview Data</div>
                {form.name && <div style={{ fontSize:13, fontWeight:700, color:'var(--text)' }}>👤 {form.name}</div>}
                {form.parkingId && <div style={{ fontSize:12, color:'var(--text3)', marginTop:2 }}>🏢 {PARKING_LIST.find(p=>p.id===Number(form.parkingId))?.name}</div>}
                {form.shifts && <div style={{ fontSize:12, color:'var(--accent)', marginTop:2 }}>🕐 {form.shifts}</div>}
              </div>
            )}

            <div style={{ borderTop:'1px solid var(--border)', paddingTop:16, display:'flex', gap:10 }}>
              <button type="button" className="btn btn-ghost" onClick={onClose} style={{ flex:1, justifyContent:'center' }}>Batal</button>
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex:2, justifyContent:'center', padding:11 }}>
                {loading
                  ? <span style={{ display:'flex', alignItems:'center', gap:8 }}><span style={{ width:15, height:15, border:'2px solid rgba(0,0,0,0.25)', borderTopColor:'#000', borderRadius:'50%', animation:'spin .7s linear infinite', display:'inline-block' }} />Menyimpan...</span>
                  : isEdit ? <><Edit2 size={14} /> Simpan Perubahan</> : <><Plus size={14} /> Tambah Staff</>
                }
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

/* ── Confirm Delete Modal ────────────────────────────────────────────── */
function DeleteModal({ staff, onClose, onConfirm }) {
  const [loading, setLoading] = useState(false)
  const handle = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    onConfirm(staff.id)
    onClose()
  }
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', zIndex:1001, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }} onClick={onClose}>
      <div style={{ background:'var(--bg-card)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:'var(--radius-lg)', width:'100%', maxWidth:400, padding:28, animation:'fadeUp .3s ease' }} onClick={e => e.stopPropagation()}>
        <div style={{ textAlign:'center', marginBottom:20 }}>
          <div style={{ fontSize:44, marginBottom:12 }}>⚠️</div>
          <h3 style={{ fontSize:17, fontWeight:800, color:'var(--text)', marginBottom:8 }}>Hapus Staff?</h3>
          <p style={{ fontSize:13, color:'var(--text3)', lineHeight:1.5 }}>
            Akun <strong style={{ color:'var(--red)' }}>{staff.name}</strong> ({staff.parkingName}) akan dihapus permanen dari sistem.
          </p>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <button className="btn btn-ghost" onClick={onClose} style={{ flex:1, justifyContent:'center' }}>Batal</button>
          <button className="btn btn-danger" onClick={handle} disabled={loading} style={{ flex:1, justifyContent:'center' }}>
            {loading ? 'Menghapus...' : '🗑️ Ya, Hapus'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Modal Ubah Password Staff ──────────────────────────────────── */
function ChangeStaffPasswordModal({ staff, onClose }) {
  const { changeStaffPassword } = useApp()
  const [newPw, setNewPw]     = useState('')
  const [confirm, setConfirm] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [showCon, setShowCon] = useState(false)
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (newPw.length < 6) { setError('Password minimal 6 karakter'); return }
    if (newPw !== confirm) { setError('Konfirmasi password tidak cocok'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    const result = changeStaffPassword(staff.id, newPw)
    setLoading(false)
    if (!result.ok) { setError(result.msg); return }
    setSuccess(true)
  }

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', zIndex:1001, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }} onClick={onClose}>
      <div style={{ background:'var(--bg-card)', border:'1px solid var(--border2)', borderRadius:'var(--radius-lg)', width:'100%', maxWidth:420, animation:'fadeUp .3s ease' }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ padding:'18px 22px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:34, height:34, borderRadius:9, background:'rgba(245,158,11,0.12)', border:'1px solid rgba(245,158,11,0.25)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Lock size={15} color="var(--orange)" />
            </div>
            <div>
              <div style={{ fontSize:15, fontWeight:800, color:'var(--text)' }}>Ubah Password Staff</div>
              <div style={{ fontSize:11, color:'var(--text3)' }}>{staff.name} · {staff.email}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text3)', display:'flex' }}><X size={17} /></button>
        </div>

        {success ? (
          <div style={{ padding:'40px 22px', textAlign:'center' }}>
            <div style={{ fontSize:48, marginBottom:12 }}>🔐</div>
            <h3 style={{ fontSize:17, fontWeight:800, color:'var(--text)', marginBottom:8 }}>Password Berhasil Diubah!</h3>
            <p style={{ fontSize:13, color:'var(--text3)', marginBottom:20 }}>
              Password <strong style={{ color:'var(--accent)' }}>{staff.name}</strong> telah diperbarui.
            </p>
            <button className="btn btn-primary" onClick={onClose} style={{ width:'100%', justifyContent:'center' }}>Tutup</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ padding:22 }}>
            {/* New password */}
            <div style={{ marginBottom:14 }}>
              <label style={{ display:'block', fontSize:13, fontWeight:600, color:'var(--text2)', marginBottom:6 }}>Password Baru *</label>
              <div style={{ display:'flex', alignItems:'center', background:'var(--bg-input)', border:'1px solid var(--border)', borderRadius:'var(--radius)', overflow:'hidden' }}>
                <Lock size={13} style={{ marginLeft:10, color:'var(--text3)', flexShrink:0 }} />
                <input type={showNew ? 'text' : 'password'} className="input" placeholder="Min. 6 karakter"
                  value={newPw} onChange={e => { setNewPw(e.target.value); setError('') }}
                  style={{ border:'none', boxShadow:'none', flex:1 }} />
                <button type="button" onClick={() => setShowNew(p => !p)}
                  style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text3)', display:'flex', padding:'0 8px' }}>
                  {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            {/* Confirm */}
            <div style={{ marginBottom: error ? 12 : 20 }}>
              <label style={{ display:'block', fontSize:13, fontWeight:600, color:'var(--text2)', marginBottom:6 }}>Konfirmasi Password *</label>
              <div style={{ display:'flex', alignItems:'center', background:'var(--bg-input)', border:`1px solid ${confirm && confirm !== newPw ? 'var(--red)' : 'var(--border)'}`, borderRadius:'var(--radius)', overflow:'hidden' }}>
                <Lock size={13} style={{ marginLeft:10, color:'var(--text3)', flexShrink:0 }} />
                <input type={showCon ? 'text' : 'password'} className="input" placeholder="Ulangi password"
                  value={confirm} onChange={e => { setConfirm(e.target.value); setError('') }}
                  style={{ border:'none', boxShadow:'none', flex:1 }} />
                <button type="button" onClick={() => setShowCon(p => !p)}
                  style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text3)', display:'flex', padding:'0 8px' }}>
                  {showCon ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {confirm && confirm !== newPw && <div style={{ fontSize:11, color:'var(--red)', marginTop:4 }}>⚠ Password tidak cocok</div>}
            </div>
            {error && <div style={{ padding:'9px 12px', background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:8, fontSize:12, color:'var(--red)', marginBottom:14 }}>⚠ {error}</div>}
            <div style={{ display:'flex', gap:10 }}>
              <button type="button" className="btn btn-ghost" onClick={onClose} style={{ flex:1, justifyContent:'center' }}>Batal</button>
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex:2, justifyContent:'center' }}>
                {loading
                  ? <span style={{ display:'flex', alignItems:'center', gap:8 }}><span style={{ width:14, height:14, border:'2px solid rgba(0,0,0,0.25)', borderTopColor:'#000', borderRadius:'50%', animation:'spin .7s linear infinite', display:'inline-block' }} />Menyimpan...</span>
                  : <><Lock size={13} /> Simpan Password</>}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

/* ── Main Page ──────────────────────────────────────────────────────── */
export default function StaffManagementPage() {
  const [staffList, setStaffList] = useState(INIT_STAFF)
  const [search, setSearch]       = useState('')
  const [filter, setFilter]       = useState('all')
  const [showAdd, setShowAdd]     = useState(false)
  const [editData, setEditData]   = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [changePasswordTarget, setChangePasswordTarget] = useState(null)

  const filtered = staffList.filter(s => {
    const q = search.toLowerCase()
    const matchSearch = s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.parkingName.toLowerCase().includes(q) || s.phone.includes(q)
    const matchFilter = filter === 'all' || s.status === filter
    return matchSearch && matchFilter
  })

  const handleSave = (data) => {
    setStaffList(prev => {
      const idx = prev.findIndex(s => s.id === data.id)
      if (idx >= 0) { const next = [...prev]; next[idx] = data; return next }
      return [...prev, data]
    })
    setShowAdd(false); setEditData(null)
  }

  const handleDelete = (id) => {
    setStaffList(prev => prev.filter(s => s.id !== id))
  }

  const toggleStatus = (id) => {
    setStaffList(prev => prev.map(s => s.id === id ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' } : s))
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">👷 Manajemen Staff</h1>
          <p className="page-sub">Kelola petugas monitoring per gedung parkir</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
          <Plus size={15} /> Tambah Staff
        </button>
      </div>

      {/* Summary */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(155px,1fr))', gap:12, marginBottom:20 }}>
        {[
          { label:'Total Staff',    value: staffList.length,                              color:'var(--text)' },
          { label:'Aktif',          value: staffList.filter(s=>s.status==='active').length, color:'var(--green)' },
          { label:'Non-Aktif',      value: staffList.filter(s=>s.status!=='active').length, color:'var(--text3)' },
          { label:'Gedung Aktif',   value: PARKING_LIST.length,                           color:'var(--accent)' },
        ].map((s, i) => (
          <div key={i} className="card" style={{ padding:'14px 18px', textAlign:'center' }}>
            <div style={{ fontSize:22, fontWeight:800, color:s.color }}>{s.value}</div>
            <div style={{ fontSize:12, color:'var(--text3)', marginTop:3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <div className="input-icon-wrap" style={{ flex:1, minWidth:200 }}>
          <Search size={14} className="input-icon" />
          <input className="input" placeholder="Cari nama, email, gedung..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="filter-tabs">
          {[['all','Semua'],['active','Aktif'],['inactive','Non-Aktif']].map(([v,l]) => (
            <button key={v} className={`filter-tab ${filter===v?'active':''}`} onClick={()=>setFilter(v)}>{l}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Staff</th>
                <th>Email Login</th>
                <th>Telepon</th>
                <th>Gedung Ditugaskan</th>
                <th>Shift</th>
                <th>Bergabung</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8}>
                  <div className="empty-state"><div className="empty-icon">👷</div><div>Tidak ada staff ditemukan</div></div>
                </td></tr>
              ) : filtered.map(s => (
                <tr key={s.id}>
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div className="avatar">{s.name[0]}</div>
                      <div>
                        <div style={{ fontSize:13, fontWeight:700, color:'var(--text)' }}>{s.name}</div>
                        <div style={{ fontSize:11, color:'var(--text3)' }}>{s.id}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize:13 }}>{s.email}</td>
                  <td style={{ fontSize:13 }}>{s.phone}</td>
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                      <span style={{ fontSize:13 }}>🏢</span>
                      <span style={{ fontSize:13, color:'var(--text)', fontWeight:600 }}>{s.parkingName}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{
                      fontSize:11, fontWeight:600, padding:'3px 8px', borderRadius:20,
                      background: s.shifts.includes('Pagi') ? 'rgba(245,158,11,0.1)' : s.shifts.includes('Siang') ? 'rgba(59,130,246,0.1)' : 'rgba(123,97,255,0.1)',
                      color: s.shifts.includes('Pagi') ? 'var(--orange)' : s.shifts.includes('Siang') ? 'var(--blue)' : 'var(--accent2)',
                    }}>
                      {s.shifts.includes('Pagi') ? '🌅' : s.shifts.includes('Siang') ? '☀️' : '🌙'} {s.shifts}
                    </span>
                  </td>
                  <td style={{ fontSize:12 }}>{fmtDate(s.joinDate)}</td>
                  <td>
                    <span className={`badge ${s.status==='active'?'badge-green':'badge-gray'}`}>
                      {s.status==='active' ? '● Aktif' : '○ Nonaktif'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display:'flex', gap:4 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => setEditData(s)} title="Edit">
                        <Edit2 size={13} />
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={() => setChangePasswordTarget(s)} title="Ubah Password"
                        style={{ color:'var(--orange)' }}>
                        <Lock size={13} />
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={() => toggleStatus(s.id)} title={s.status==='active'?'Nonaktifkan':'Aktifkan'}
                        style={{ color: s.status==='active' ? 'var(--text3)' : 'var(--green)' }}>
                        {s.status==='active' ? '⏸' : '▶'}
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={() => setDeleteTarget(s)} title="Hapus"
                        style={{ color:'var(--red)' }}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info box: login credentials */}
      <div className="card" style={{ marginTop:20 }}>
        <div className="card-header">
          <span className="card-title">🔑 Info Akun Login Staff</span>
          <span className="badge badge-orange">⚠ Rahasia</span>
        </div>
        <div className="card-body">
          <p style={{ fontSize:13, color:'var(--text3)', marginBottom:14, lineHeight:1.6 }}>
            Setiap staff dapat login di halaman login menggunakan email dan password yang terdaftar.
            Setelah login, staff hanya bisa melihat data gedung yang ditugaskan.
          </p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px,1fr))', gap:10 }}>
            {staffList.filter(s=>s.status==='active').map(s => (
              <div key={s.id} style={{ background:'var(--bg-hover)', border:'1px solid var(--border)', borderRadius:10, padding:'12px 14px', display:'flex', alignItems:'center', gap:10 }}>
                <div className="avatar avatar-sm">{s.name[0]}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{s.name}</div>
                  <div style={{ fontSize:11, color:'var(--accent)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{s.email}</div>
                </div>
                <span style={{ fontSize:11, color:'var(--text3)', background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:6, padding:'2px 8px', whiteSpace:'nowrap' }}>
                  🏢 {s.parkingName.split(' ').slice(0,2).join(' ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAdd            && <StaffFormModal editData={null}     onClose={() => setShowAdd(false)}   onSave={handleSave} />}
      {editData           && <StaffFormModal editData={editData} onClose={() => setEditData(null)}   onSave={handleSave} />}
      {deleteTarget       && <DeleteModal staff={deleteTarget}   onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} />}
      {changePasswordTarget && <ChangeStaffPasswordModal staff={changePasswordTarget} onClose={() => setChangePasswordTarget(null)} />}
    </div>
  )
}
