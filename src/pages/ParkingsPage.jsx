import { useEffect, useState } from 'react'
import { Car, Plus, Trash2, Pencil, ChevronRight, MapPin, X, RefreshCw } from 'lucide-react'
import { parkingService, slotService } from '../services/apiService'

export default function ParkingsPage() {
  const [areas, setAreas] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedArea, setSelectedArea] = useState(null)
  const [slots, setSlots] = useState([])
  const [loadingSlots, setLoadingSlots] = useState(false)

  // Modals
  const [showAddArea, setShowAddArea] = useState(false)
  const [showEditArea, setShowEditArea] = useState(null)
  const [showAddSlot, setShowAddSlot] = useState(false)

  // Forms
  const [areaForm, setAreaForm] = useState({ name: '', location: '', slot: '' })
  const [slotForm, setSlotForm] = useState({ slotNumber: '', vehicleType: 'mobil' })
  const [saving, setSaving] = useState(false)

  const fetchAreas = async () => {
    setLoading(true)
    try {
      const res = await parkingService.getAll()
      setAreas(res.data || res || [])
    } catch (err) {
      console.error('Gagal fetch areas:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchSlots = async (areaId) => {
    setLoadingSlots(true)
    try {
      const res = await slotService.getByArea(areaId)
      setSlots(res.data || res || [])
    } catch (err) {
      console.error('Gagal fetch slots:', err)
      setSlots([])
    } finally {
      setLoadingSlots(false)
    }
  }

  useEffect(() => { fetchAreas() }, [])

  useEffect(() => {
    if (selectedArea?.id) fetchSlots(selectedArea.id)
    else setSlots([])
  }, [selectedArea])

  // Area CRUD
  const handleAddArea = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await parkingService.create(areaForm.name, areaForm.location, parseInt(areaForm.slot) || 0)
      setShowAddArea(false)
      setAreaForm({ name: '', location: '', slot: '' })
      fetchAreas()
    } catch (err) { alert(err.message) }
    finally { setSaving(false) }
  }

  const handleEditArea = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await parkingService.update(showEditArea.id, areaForm.name, areaForm.location)
      setShowEditArea(null)
      setAreaForm({ name: '', location: '', slot: '' })
      fetchAreas()
      if (selectedArea?.id === showEditArea.id) {
        setSelectedArea(prev => ({ ...prev, name: areaForm.name, location: areaForm.location }))
      }
    } catch (err) { alert(err.message) }
    finally { setSaving(false) }
  }

  const handleDeleteArea = async (areaId) => {
    if (!confirm('Yakin hapus area ini? Semua slot di dalamnya akan ikut terhapus.')) return
    try {
      await parkingService.delete(areaId)
      if (selectedArea?.id === areaId) { setSelectedArea(null); setSlots([]) }
      fetchAreas()
    } catch (err) { alert(err.message) }
  }

  // Slot CRUD
  const handleAddSlot = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await slotService.add(selectedArea.id, slotForm.slotNumber, slotForm.vehicleType)
      setShowAddSlot(false)
      setSlotForm({ slotNumber: '', vehicleType: 'mobil' })
      fetchSlots(selectedArea.id)
      fetchAreas() // refresh count
    } catch (err) { alert(err.message) }
    finally { setSaving(false) }
  }

  const handleDeleteSlot = async (slotId) => {
    if (!confirm('Yakin hapus slot ini?')) return
    try {
      await slotService.delete(slotId)
      fetchSlots(selectedArea.id)
      fetchAreas()
    } catch (err) { alert(err.message) }
  }

  const handleUpdateSlotStatus = async (slotId, newStatus) => {
    try {
      await slotService.update(slotId, undefined, newStatus)
      fetchSlots(selectedArea.id)
      fetchAreas()
    } catch (err) { alert(err.message) }
  }

  const getStatusBadge = (status) => {
    const map = {
      available: { cls: 'badge-green', label: 'Tersedia' },
      occupied: { cls: 'badge-orange', label: 'Terisi' },
      reserved: { cls: 'badge-blue', label: 'Dipesan' },
      maintenance: { cls: 'badge-gray', label: 'Maintenance' },
    }
    const s = map[status] || { cls: 'badge-gray', label: status || 'Unknown' }
    return <span className={`badge ${s.cls}`}>{s.label}</span>
  }

  return (
    <div className="animate-fade-up">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Gedung Parkir</h1>
          <p className="page-sub">Kelola area parkir dan slot</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" onClick={fetchAreas}><RefreshCw size={14} /> Refresh</button>
          <button className="btn btn-primary" onClick={() => { setAreaForm({ name: '', location: '', slot: '' }); setShowAddArea(true) }}>
            <Plus size={14} /> Tambah Area
          </button>
        </div>
      </div>

      <div className="section-grid section-grid-1-2">
        {/* Area list */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Daftar Area</span>
            <span className="badge badge-accent">{areas.length}</span>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            {loading ? (
              <div className="empty-state"><div style={{ width: 28, height: 28, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /></div>
            ) : areas.length === 0 ? (
              <div className="empty-state"><div className="empty-icon">🏗️</div><p>Belum ada area parkir</p></div>
            ) : (
              areas.map(area => (
                <div
                  key={area.id}
                  onClick={() => setSelectedArea(area)}
                  style={{
                    padding: '14px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12,
                    borderBottom: '1px solid var(--border)', transition: 'background 0.15s',
                    background: selectedArea?.id === area.id ? 'var(--accent-glow)' : 'transparent',
                  }}
                  onMouseEnter={e => { if (selectedArea?.id !== area.id) e.currentTarget.style.background = 'var(--bg-hover)' }}
                  onMouseLeave={e => { if (selectedArea?.id !== area.id) e.currentTarget.style.background = 'transparent' }}
                >
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--accent-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', flexShrink: 0 }}>
                    <Car size={18} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{area.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text3)' }}>{area.location || '—'} · {area.totalSlots || 0} slot</div>
                  </div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button className="btn btn-ghost btn-sm" onClick={(e) => { e.stopPropagation(); setAreaForm({ name: area.name, location: area.location || '', slot: '' }); setShowEditArea(area) }}>
                      <Pencil size={12} />
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={(e) => { e.stopPropagation(); handleDeleteArea(area.id) }}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                  <ChevronRight size={14} style={{ color: 'var(--text3)' }} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Slot panel */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">
              {selectedArea ? `Slot — ${selectedArea.name}` : 'Pilih Area'}
            </span>
            {selectedArea && (
              <button className="btn btn-primary btn-sm" onClick={() => { setSlotForm({ slotNumber: '', vehicleType: 'mobil' }); setShowAddSlot(true) }}>
                <Plus size={12} /> Tambah Slot
              </button>
            )}
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            {!selectedArea ? (
              <div className="empty-state"><div className="empty-icon">👈</div><p>Pilih area di kiri untuk melihat slot</p></div>
            ) : loadingSlots ? (
              <div className="empty-state"><div style={{ width: 28, height: 28, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /></div>
            ) : slots.length === 0 ? (
              <div className="empty-state"><div className="empty-icon">📦</div><p>Belum ada slot di area ini</p></div>
            ) : (
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Slot</th>
                      <th>Tipe</th>
                      <th>Status</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {slots.map(slot => (
                      <tr key={slot.id}>
                        <td style={{ fontWeight: 600, color: 'var(--text)' }}>{slot.slotNumber || slot.slotName || slot.id}</td>
                        <td>{slot.vehicleType || '—'}</td>
                        <td>{getStatusBadge(slot.status || slot.appStatus)}</td>
                        <td>
                          <div style={{ display: 'flex', gap: 4 }}>
                            {(slot.status === 'available' || slot.appStatus === 'available') && (
                              <button className="btn btn-ghost btn-sm" onClick={() => handleUpdateSlotStatus(slot.id, 'maintenance')}>
                                Maintenance
                              </button>
                            )}
                            {(slot.status === 'maintenance') && (
                              <button className="btn btn-ghost btn-sm" onClick={() => handleUpdateSlotStatus(slot.id, 'available')}>
                                Aktifkan
                              </button>
                            )}
                            <button className="btn btn-danger btn-sm" onClick={() => handleDeleteSlot(slot.id)}>
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
      </div>

      {/* ── Add Area Modal ── */}
      {showAddArea && (
        <Modal title="Tambah Area Parkir" onClose={() => setShowAddArea(false)}>
          <form onSubmit={handleAddArea}>
            <FormField label="Nama Area" value={areaForm.name} onChange={v => setAreaForm(f => ({ ...f, name: v }))} placeholder="Gedung A" required />
            <FormField label="Lokasi" value={areaForm.location} onChange={v => setAreaForm(f => ({ ...f, location: v }))} placeholder="Jl. Contoh No. 1" />
            <FormField label="Jumlah Slot Awal" value={areaForm.slot} onChange={v => setAreaForm(f => ({ ...f, slot: v }))} placeholder="20" type="number" />
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 20 }}>
              <button type="button" className="btn btn-ghost" onClick={() => setShowAddArea(false)}>Batal</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan'}</button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Edit Area Modal ── */}
      {showEditArea && (
        <Modal title="Edit Area Parkir" onClose={() => setShowEditArea(null)}>
          <form onSubmit={handleEditArea}>
            <FormField label="Nama Area" value={areaForm.name} onChange={v => setAreaForm(f => ({ ...f, name: v }))} required />
            <FormField label="Lokasi" value={areaForm.location} onChange={v => setAreaForm(f => ({ ...f, location: v }))} />
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 20 }}>
              <button type="button" className="btn btn-ghost" onClick={() => setShowEditArea(null)}>Batal</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan'}</button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Add Slot Modal ── */}
      {showAddSlot && (
        <Modal title={`Tambah Slot — ${selectedArea?.name}`} onClose={() => setShowAddSlot(false)}>
          <form onSubmit={handleAddSlot}>
            <FormField label="Nomor Slot" value={slotForm.slotNumber} onChange={v => setSlotForm(f => ({ ...f, slotNumber: v }))} placeholder="A-01" required />
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 12, fontWeight: 600, color: 'var(--text2)' }}>Tipe Kendaraan</label>
              <select className="input" value={slotForm.vehicleType} onChange={e => setSlotForm(f => ({ ...f, vehicleType: e.target.value }))}>
                <option value="mobil">Mobil</option>
                <option value="motor">Motor</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 20 }}>
              <button type="button" className="btn btn-ghost" onClick={() => setShowAddSlot(false)}>Batal</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

/* ── Reusable Components ─────────────────────────────────── */
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