import { useEffect, useState } from 'react'
import { Plus, Trash2, Pencil, UserCog, X, RefreshCw } from 'lucide-react'
import { adminService } from '../services/apiService'

export default function AdminsPage() {
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [showEdit, setShowEdit] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [saving, setSaving] = useState(false)

  const fetchAdmins = async () => {
    setLoading(true)
    try {
      const res = await adminService.getAll()
      setAdmins(res.data || res || [])
    } catch (err) {
      console.error('Gagal fetch admins:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAdmins() }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await adminService.create(form.name, form.email, form.password)
      setShowAdd(false)
      setForm({ name: '', email: '', password: '' })
      fetchAdmins()
    } catch (err) { alert(err.message) }
    finally { setSaving(false) }
  }

  const handleEdit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const data = { name: form.name }
      if (form.password) data.password = form.password
      await adminService.update(showEdit.id, data)
      setShowEdit(null)
      setForm({ name: '', email: '', password: '' })
      fetchAdmins()
    } catch (err) { alert(err.message) }
    finally { setSaving(false) }
  }

  const handleDelete = async (adminId) => {
    if (!confirm('Yakin hapus admin ini?')) return
    try {
      await adminService.delete(adminId)
      fetchAdmins()
    } catch (err) { alert(err.message) }
  }

  return (
    <div className="animate-fade-up">
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Parkir</h1>
          <p className="page-sub">Kelola admin yang mengelola area parkir</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" onClick={fetchAdmins}><RefreshCw size={14} /> Refresh</button>
          <button className="btn btn-primary" onClick={() => { setForm({ name: '', email: '', password: '' }); setShowAdd(true) }}>
            <Plus size={14} /> Tambah Admin
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Daftar Admin Parkir</span>
          <span className="badge badge-accent">{admins.length}</span>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          {loading ? (
            <div className="empty-state">
              <div style={{ width: 28, height: 28, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            </div>
          ) : admins.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👤</div>
              <p>Belum ada admin parkir</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Nama</th>
                    <th>Email</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map(admin => (
                    <tr key={admin.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div className="avatar" style={{ width: 32, height: 32, fontSize: 13 }}>
                            {(admin.name || 'A').charAt(0).toUpperCase()}
                          </div>
                          <span style={{ fontWeight: 600, color: 'var(--text)' }}>{admin.name}</span>
                        </div>
                      </td>
                      <td>{admin.email}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button className="btn btn-ghost btn-sm" onClick={() => {
                            setForm({ name: admin.name, email: admin.email, password: '' })
                            setShowEdit(admin)
                          }}>
                            <Pencil size={12} /> Edit
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(admin.id)}>
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      {showAdd && (
        <Modal title="Tambah Admin Parkir" onClose={() => setShowAdd(false)}>
          <form onSubmit={handleAdd}>
            <FormField label="Nama" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} required />
            <FormField label="Email" value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} type="email" required />
            <FormField label="Password" value={form.password} onChange={v => setForm(f => ({ ...f, password: v }))} type="password" required />
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 20 }}>
              <button type="button" className="btn btn-ghost" onClick={() => setShowAdd(false)}>Batal</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan'}</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Modal */}
      {showEdit && (
        <Modal title="Edit Admin Parkir" onClose={() => setShowEdit(null)}>
          <form onSubmit={handleEdit}>
            <FormField label="Nama" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} required />
            <div style={{ marginBottom: 12, padding: '8px 12px', borderRadius: 8, background: 'var(--bg-hover)', fontSize: 12, color: 'var(--text3)' }}>
              Email: {form.email} (tidak bisa diubah)
            </div>
            <FormField label="Password Baru (kosongkan jika tidak diubah)" value={form.password} onChange={v => setForm(f => ({ ...f, password: v }))} type="password" />
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 20 }}>
              <button type="button" className="btn btn-ghost" onClick={() => setShowEdit(null)}>Batal</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

function Modal({ title, children, onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }} />
      <div style={{
        position: 'relative', width: '100%', maxWidth: 440,
        background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16,
        padding: 24, animation: 'fadeUp 0.25s ease both',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', display: 'flex' }}><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  )
}

function FormField({ label, value, onChange, placeholder, type = 'text', required }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', marginBottom: 6, fontSize: 12, fontWeight: 600, color: 'var(--text2)' }}>{label}</label>
      <input className="input" type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} required={required} />
    </div>
  )
}
