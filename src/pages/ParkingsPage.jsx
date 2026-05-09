import { useState } from 'react'
import { PARKINGS as INITIAL_PARKINGS } from '../data/mockData'
import { Search, MapPin, Plus, X, Building2, Edit2, Save, ExternalLink, Map } from 'lucide-react'

const FLOOR_OPTIONS = ['B2','B1','L1','L2','L3','L4','L5']

// ── Google Maps helpers ───────────────────────────────────────────────
function parseGoogleMapsUrl(url) {
  if (!url) return null
  // Format: @lat,lng,zoom (standard share link)
  let m = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)
  if (m) return { lat: m[1], lng: m[2] }
  // Format: ?q=lat,lng
  m = url.match(/[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/)
  if (m) return { lat: m[1], lng: m[2] }
  // Format: ll=lat,lng
  m = url.match(/ll=(-?\d+\.\d+),(-?\d+\.\d+)/)
  if (m) return { lat: m[1], lng: m[2] }
  return null
}

function getEmbedUrl(url) {
  const coords = parseGoogleMapsUrl(url)
  if (!coords) return null
  return `https://maps.google.com/maps?q=${coords.lat},${coords.lng}&z=17&output=embed`
}

function OccupancyBar({ pct }) {
  const color = pct >= 90 ? 'var(--red)' : pct >= 75 ? 'var(--orange)' : 'var(--green)'
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: 'var(--text3)' }}>Okupansi</span>
        <span style={{ fontSize: 14, fontWeight: 800, color }}>{pct}%</span>
      </div>
      <div className="progress">
        <div className="progress-bar" style={{ width: pct + '%', background: color }} />
      </div>
    </div>
  )
}

/* ── Modal Detail Gedung ──────────────────────────────────────────────── */
function ParkingDetailModal({ parking, onClose }) {
  if (!parking) return null
  const [floor, setFloor] = useState(parking.floors[0])
  const SLOT_NAMES = ['A01','A02','A03','A04','A05','A06','B01','B02','B03','B04','B05','B06']
  const available = Array.from({ length: 12 }, () => Math.random() > 0.4)

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', zIndex:999, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }} onClick={onClose}>
      <div style={{ background:'var(--bg-card)', border:'1px solid var(--border2)', borderRadius:'var(--radius-lg)', width:'100%', maxWidth:600, maxHeight:'90vh', overflow:'auto' }} onClick={e => e.stopPropagation()}>
        <div style={{ padding:'20px 24px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
          <div>
            <h3 style={{ fontSize:18, fontWeight:800, color:'var(--text)', marginBottom:4 }}>{parking.name}</h3>
            <p style={{ fontSize:13, color:'var(--text3)' }}>📍 {parking.address}</p>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'var(--text3)', cursor:'pointer', fontSize:20, lineHeight:1 }}>✕</button>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:1, background:'var(--border)' }}>
          {[
            { label:'Total Slot', value: parking.totalSlots, color:'var(--text)' },
            { label:'Terpakai',   value: parking.usedSlots,  color:'var(--red)' },
            { label:'Kosong',     value: parking.totalSlots - parking.usedSlots, color:'var(--green)' },
          ].map((s, i) => (
            <div key={i} style={{ background:'var(--bg-card)', padding:'16px 20px', textAlign:'center' }}>
              <div style={{ fontSize:22, fontWeight:800, color:s.color }}>{s.value}</div>
              <div style={{ fontSize:12, color:'var(--text3)', marginTop:2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ padding:'20px 24px' }}>
          <OccupancyBar pct={parking.occupancy} />
          <div style={{ marginTop:20, marginBottom:12 }}>
            <div style={{ fontSize:13, fontWeight:700, color:'var(--text)', marginBottom:10 }}>Pilih Lantai:</div>
            <div style={{ display:'flex', gap:8 }}>
              {parking.floors.map(f => (
                <button key={f} className={`btn btn-sm ${f === floor ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFloor(f)}>{f}</button>
              ))}
            </div>
          </div>
          <div style={{ fontSize:12, fontWeight:700, color:'var(--text2)', marginBottom:8 }}>Denah Slot – {floor}</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:6, marginBottom:16 }}>
            {SLOT_NAMES.map((slot, i) => (
              <div key={slot} style={{
                padding:'8px 4px', borderRadius:8, textAlign:'center', fontSize:11, fontWeight:700,
                background: available[i] ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                color: available[i] ? 'var(--green)' : 'var(--red)',
                border: `1px solid ${available[i] ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`,
              }}>
                {floor}-{slot}
              </div>
            ))}
          </div>
        </div>
        {/* Map embed */}
        {parking.googleMapsUrl && getEmbedUrl(parking.googleMapsUrl) ? (
          <div style={{ borderTop: '1px solid var(--border)' }}>
            <div style={{ padding: '14px 24px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text2)' }}>📍 Lokasi di Google Maps</span>
              <a href={parking.googleMapsUrl} target="_blank" rel="noreferrer"
                style={{ fontSize: 12, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
                <ExternalLink size={12} /> Buka di Maps
              </a>
            </div>
            <iframe
              src={getEmbedUrl(parking.googleMapsUrl)}
              width="100%" height="220" style={{ border: 'none', display: 'block' }}
              title={`Peta ${parking.name}`}
              loading="lazy" referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        ) : (
          <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', fontSize: 13, color: 'var(--text3)', textAlign: 'center' }}>
            📍 Belum ada link Google Maps
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Modal Tambah Gedung ──────────────────────────────────────────────── */
function AddParkingModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    name: '', shortName: '', address: '', totalSlots: '', floors: ['L1'],
    googleMapsUrl: '',
  })
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }))
    if (errors[k]) setErrors(e => ({ ...e, [k]: null }))
  }

  const toggleFloor = (f) => {
    setForm(prev => ({
      ...prev,
      floors: prev.floors.includes(f)
        ? prev.floors.filter(x => x !== f)
        : [...prev.floors, f].sort((a, b) => FLOOR_OPTIONS.indexOf(a) - FLOOR_OPTIONS.indexOf(b)),
    }))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim())      e.name      = 'Nama gedung wajib diisi'
    if (!form.shortName.trim()) e.shortName = 'Nama singkat wajib diisi'
    if (!form.address.trim())   e.address   = 'Alamat wajib diisi'
    if (!form.totalSlots || isNaN(form.totalSlots) || Number(form.totalSlots) < 1)
                                e.totalSlots= 'Jumlah slot harus angka positif'
    if (form.floors.length === 0) e.floors  = 'Pilih minimal 1 lantai'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))

    const newParking = {
      id: Date.now(),
      name: form.name.trim(),
      shortName: form.shortName.trim(),
      address: form.address.trim(),
      totalSlots: Number(form.totalSlots),
      usedSlots: 0,
      occupancy: 0,
      tag: 'Tersedia',
      tagClass: 'green',
      googleMapsUrl: form.googleMapsUrl.trim(),
      floors: form.floors,
      distance: '—',
    }
    onAdd(newParking)
    setLoading(false)
    setSuccess(true)
  }

  const Field = ({ label, id, error, children }) => (
    <div style={{ marginBottom: 16 }}>
      <label htmlFor={id} style={{ display:'block', fontSize:13, fontWeight:600, color:'var(--text2)', marginBottom:6 }}>{label}</label>
      {children}
      {error && <div style={{ fontSize:12, color:'var(--red)', marginTop:5 }}>⚠ {error}</div>}
    </div>
  )

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }} onClick={onClose}>
      <div style={{ background:'var(--bg-card)', border:'1px solid var(--border2)', borderRadius:'var(--radius-lg)', width:'100%', maxWidth:520, maxHeight:'92vh', overflow:'auto', animation:'fadeUp .35s ease both' }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ padding:'20px 24px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:'var(--accent-glow)', border:'1px solid var(--border2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Building2 size={18} color="var(--accent)" />
            </div>
            <div>
              <div style={{ fontSize:16, fontWeight:800, color:'var(--text)' }}>Tambah Gedung Parkir</div>
              <div style={{ fontSize:12, color:'var(--text3)' }}>Isi data gedung parkir baru</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text3)', padding:4, borderRadius:8, display:'flex' }}>
            <X size={18} />
          </button>
        </div>

        {/* Success state */}
        {success ? (
          <div style={{ padding:'48px 24px', textAlign:'center' }}>
            <div style={{ fontSize:56, marginBottom:16 }}>✅</div>
            <h3 style={{ fontSize:20, fontWeight:800, color:'var(--text)', marginBottom:8 }}>Gedung Berhasil Ditambahkan!</h3>
            <p style={{ fontSize:14, color:'var(--text3)', marginBottom:24 }}>
              <strong style={{ color:'var(--accent)' }}>{form.name}</strong> telah berhasil ditambahkan ke sistem.
            </p>
            <button className="btn btn-primary" onClick={onClose} style={{ width:'100%', justifyContent:'center', padding:'11px' }}>
              Tutup
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ padding:'24px' }}>

            {/* Nama Gedung */}
            <Field label="Nama Gedung *" id="name" error={errors.name}>
              <input
                id="name" className="input"
                placeholder="Contoh: Mal Kartika Sari"
                value={form.name}
                onChange={e => set('name', e.target.value)}
                style={{ borderColor: errors.name ? 'var(--red)' : undefined }}
              />
            </Field>

            {/* Nama Singkat */}
            <Field label="Nama Singkat *" id="shortName" error={errors.shortName}>
              <input
                id="shortName" className="input"
                placeholder="Contoh: MKS (maks. 12 karakter)"
                value={form.shortName}
                onChange={e => set('shortName', e.target.value.slice(0, 12))}
                style={{ borderColor: errors.shortName ? 'var(--red)' : undefined }}
              />
            </Field>

            {/* Alamat */}
            <Field label="Alamat Lengkap *" id="address" error={errors.address}>
              <textarea
                id="address" className="input"
                placeholder="Contoh: Jl. Ratu Dibalau No.1, Bandar Lampung"
                value={form.address}
                onChange={e => set('address', e.target.value)}
                rows={2}
                style={{ resize:'vertical', minHeight:64, borderColor: errors.address ? 'var(--red)' : undefined }}
              />
            </Field>

            {/* Total Slot */}
            <Field label="Total Slot Parkir *" id="totalSlots" error={errors.totalSlots}>
              <input
                id="totalSlots" className="input" type="number" min="1"
                placeholder="Contoh: 250"
                value={form.totalSlots}
                onChange={e => set('totalSlots', e.target.value)}
                style={{ borderColor: errors.totalSlots ? 'var(--red)' : undefined }}
              />
            </Field>

            {/* Lantai */}
            <Field label="Lantai / Level *" id="floors" error={errors.floors}>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {FLOOR_OPTIONS.map(f => {
                  const active = form.floors.includes(f)
                  return (
                    <button
                      key={f} type="button"
                      onClick={() => toggleFloor(f)}
                      className={`btn btn-sm ${active ? 'btn-primary' : 'btn-ghost'}`}
                      style={{ minWidth:50 }}
                    >
                      {f}
                    </button>
                  )
                })}
              </div>
              {form.floors.length > 0 && (
                <div style={{ marginTop:8, fontSize:12, color:'var(--text3)' }}>
                  Dipilih: <span style={{ color:'var(--accent)', fontWeight:600 }}>{form.floors.join(', ')}</span>
                </div>
              )}
            </Field>

            {/* Link Google Maps */}
            <Field label="Link Google Maps (opsional)" id="gmaps" error={null}>
              <input
                id="gmaps" className="input"
                placeholder="https://maps.google.com/?q=... atau https://goo.gl/maps/..."
                value={form.googleMapsUrl}
                onChange={e => set('googleMapsUrl', e.target.value)}
              />
              {form.googleMapsUrl && parseGoogleMapsUrl(form.googleMapsUrl) && (
                <div style={{ marginTop:6, fontSize:11, color:'var(--green)', display:'flex', alignItems:'center', gap:4 }}>
                  ✅ Koordinat terdeteksi: {JSON.stringify(parseGoogleMapsUrl(form.googleMapsUrl))}
                </div>
              )}
              {form.googleMapsUrl && !parseGoogleMapsUrl(form.googleMapsUrl) && (
                <div style={{ marginTop:6, fontSize:11, color:'var(--orange)' }}>
                  ⚠️ Format tidak dikenali. Coba link yang mengandung koordinat (@lat,lng)
                </div>
              )}
            </Field>

            {/* Divider */}
            <div style={{ borderTop:'1px solid var(--border)', margin:'8px 0 20px' }} />

            {/* Info preview */}
            {(form.name || form.totalSlots) && (
              <div style={{ background:'var(--accent-glow)', border:'1px solid var(--border2)', borderRadius:10, padding:'12px 14px', marginBottom:20 }}>
                <div style={{ fontSize:12, color:'var(--text3)', marginBottom:6, fontWeight:600 }}>Preview Data</div>
                {form.name && <div style={{ fontSize:13, color:'var(--text)', fontWeight:700 }}>🏢 {form.name}</div>}
                {form.address && <div style={{ fontSize:12, color:'var(--text3)', marginTop:2 }}>📍 {form.address}</div>}
                <div style={{ display:'flex', gap:16, marginTop:8 }}>
                  {form.totalSlots && <div style={{ fontSize:12 }}><span style={{ color:'var(--text3)' }}>Slot: </span><span style={{ color:'var(--accent)', fontWeight:700 }}>{form.totalSlots}</span></div>}
                  {form.floors.length > 0 && <div style={{ fontSize:12 }}><span style={{ color:'var(--text3)' }}>Lantai: </span><span style={{ color:'var(--accent)', fontWeight:700 }}>{form.floors.join(', ')}</span></div>}
                </div>
              </div>
            )}

            {/* Actions */}
            <div style={{ display:'flex', gap:10 }}>
              <button type="button" className="btn btn-ghost" onClick={onClose} style={{ flex:1, justifyContent:'center' }}>
                Batal
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex:2, justifyContent:'center', padding:'11px' }}>
                {loading ? (
                  <span style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <span style={{ width:15, height:15, border:'2px solid rgba(0,0,0,0.25)', borderTopColor:'#000', borderRadius:'50%', animation:'spin .7s linear infinite', display:'inline-block' }} />
                    Menyimpan...
                  </span>
                ) : (
                  <><Plus size={16} /> Tambah Gedung</>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

/* ── Modal Edit Gedung ────────────────────────────────────────────────── */
function EditParkingModal({ parking, onClose, onSave }) {
  const [form, setForm] = useState({
    name:          parking.name,
    shortName:     parking.shortName,
    address:       parking.address,
    totalSlots:    String(parking.totalSlots),
    floors:        [...parking.floors],
    googleMapsUrl: parking.googleMapsUrl || '',
  })
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: null })) }
  const toggleFloor = (f) => set('floors', form.floors.includes(f)
    ? form.floors.filter(x => x !== f)
    : [...form.floors, f].sort((a,b) => FLOOR_OPTIONS.indexOf(a) - FLOOR_OPTIONS.indexOf(b))
  )

  const validate = () => {
    const e = {}
    if (!form.name.trim())       e.name       = 'Nama gedung wajib diisi'
    if (!form.shortName.trim())  e.shortName  = 'Nama singkat wajib diisi'
    if (!form.address.trim())    e.address    = 'Alamat wajib diisi'
    if (!form.totalSlots || isNaN(form.totalSlots) || Number(form.totalSlots) < 1)
                                 e.totalSlots = 'Jumlah slot harus angka positif'
    if (form.floors.length === 0) e.floors    = 'Pilih minimal 1 lantai'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 700))
    const slots = Number(form.totalSlots)
    const used  = Math.min(parking.usedSlots, slots)
    const occ   = Math.round((used / slots) * 100)
    onSave({
      ...parking,
      name:          form.name.trim(),
      shortName:     form.shortName.trim(),
      address:       form.address.trim(),
      totalSlots:    slots,
      usedSlots:     used,
      occupancy:     occ,
      tag:           occ >= 90 ? 'Penuh' : occ >= 75 ? 'Ramai' : 'Tersedia',
      floors:        form.floors,
      googleMapsUrl: form.googleMapsUrl.trim(),
    })
    setLoading(false)
    setSuccess(true)
  }

  const Field = ({ label, id, error, children }) => (
    <div style={{ marginBottom: 14 }}>
      <label htmlFor={id} style={{ display:'block', fontSize:13, fontWeight:600, color:'var(--text2)', marginBottom:6 }}>{label}</label>
      {children}
      {error && <div style={{ fontSize:12, color:'var(--red)', marginTop:4 }}>⚠ {error}</div>}
    </div>
  )

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }} onClick={onClose}>
      <div style={{ background:'var(--bg-card)', border:'1px solid var(--border2)', borderRadius:'var(--radius-lg)', width:'100%', maxWidth:520, maxHeight:'92vh', overflow:'auto', animation:'fadeUp .35s ease both' }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ padding:'20px 24px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:'rgba(245,158,11,0.12)', border:'1px solid rgba(245,158,11,0.25)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Edit2 size={16} color="var(--orange)" />
            </div>
            <div>
              <div style={{ fontSize:16, fontWeight:800, color:'var(--text)' }}>Edit Gedung Parkir</div>
              <div style={{ fontSize:12, color:'var(--text3)' }}>Mengubah data: {parking.name}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text3)', display:'flex' }}><X size={18} /></button>
        </div>

        {success ? (
          <div style={{ padding:'48px 24px', textAlign:'center' }}>
            <div style={{ fontSize:52, marginBottom:14 }}>✅</div>
            <h3 style={{ fontSize:18, fontWeight:800, color:'var(--text)', marginBottom:8 }}>Data Berhasil Diperbarui!</h3>
            <p style={{ fontSize:13, color:'var(--text3)', marginBottom:24 }}>
              <strong style={{ color:'var(--accent)' }}>{form.name}</strong> telah berhasil diperbarui.
            </p>
            <button className="btn btn-primary" onClick={onClose} style={{ width:'100%', justifyContent:'center', padding:11 }}>Tutup</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ padding:24 }}>

            <Field label="Nama Gedung *" id="en" error={errors.name}>
              <input id="en" className="input" value={form.name} onChange={e => set('name', e.target.value)} style={{ borderColor: errors.name ? 'var(--red)' : undefined }} />
            </Field>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
              <Field label="Nama Singkat *" id="esn" error={errors.shortName}>
                <input id="esn" className="input" value={form.shortName} onChange={e => set('shortName', e.target.value.slice(0,12))} style={{ borderColor: errors.shortName ? 'var(--red)' : undefined }} />
              </Field>
              <Field label="Total Slot *" id="ets" error={errors.totalSlots}>
                <input id="ets" className="input" type="number" min="1" value={form.totalSlots} onChange={e => set('totalSlots', e.target.value)} style={{ borderColor: errors.totalSlots ? 'var(--red)' : undefined }} />
              </Field>
            </div>

            <Field label="Alamat Lengkap *" id="ea" error={errors.address}>
              <textarea id="ea" className="input" rows={2} value={form.address} onChange={e => set('address', e.target.value)} style={{ resize:'vertical', minHeight:64, borderColor: errors.address ? 'var(--red)' : undefined }} />
            </Field>

            <Field label="Lantai / Level *" id="ef" error={errors.floors}>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {FLOOR_OPTIONS.map(f => (
                  <button key={f} type="button" onClick={() => toggleFloor(f)}
                    className={`btn btn-sm ${form.floors.includes(f) ? 'btn-primary' : 'btn-ghost'}`}
                    style={{ minWidth:46 }}>
                    {f}
                  </button>
                ))}
              </div>
              {form.floors.length > 0 && (
                <div style={{ marginTop:8, fontSize:12, color:'var(--text3)' }}>
                  Dipilih: <span style={{ color:'var(--accent)', fontWeight:600 }}>{form.floors.join(', ')}</span>
                </div>
              )}
            </Field>

            {/* Link Google Maps */}
            <Field label="Link Google Maps" id="egmaps" error={null}>
              <input
                id="egmaps" className="input"
                placeholder="https://maps.google.com/?q=... atau paste link share Google Maps"
                value={form.googleMapsUrl}
                onChange={e => set('googleMapsUrl', e.target.value)}
              />
              {form.googleMapsUrl && parseGoogleMapsUrl(form.googleMapsUrl) && (
                <div style={{ marginTop:6, fontSize:11, color:'var(--green)', display:'flex', alignItems:'center', gap:4 }}>
                  ✅ Koordinat terdeteksi — peta akan tampil di detail gedung
                </div>
              )}
              {form.googleMapsUrl && !parseGoogleMapsUrl(form.googleMapsUrl) && (
                <div style={{ marginTop:6, fontSize:11, color:'var(--orange)' }}>
                  ⚠️ Format tidak dikenali. Coba link yang mengandung koordinat
                </div>
              )}
            </Field>

            {/* Change summary */}
            <div style={{ background:'rgba(245,158,11,0.06)', border:'1px solid rgba(245,158,11,0.2)', borderRadius:10, padding:'12px 14px', marginBottom:20, fontSize:12, color:'var(--text3)' }}>
              ⚠️ Perubahan total slot akan menghitung ulang % ocupansi secara otomatis.
            </div>

            <div style={{ display:'flex', gap:10 }}>
              <button type="button" className="btn btn-ghost" onClick={onClose} style={{ flex:1, justifyContent:'center' }}>Batal</button>
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex:2, justifyContent:'center', padding:11 }}>
                {loading
                  ? <span style={{ display:'flex', alignItems:'center', gap:8 }}><span style={{ width:15, height:15, border:'2px solid rgba(0,0,0,0.25)', borderTopColor:'#000', borderRadius:'50%', animation:'spin .7s linear infinite', display:'inline-block' }} />Menyimpan...</span>
                  : <><Save size={14} /> Simpan Perubahan</>}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

/* ── Main Page ────────────────────────────────────────────────────────── */
export default function ParkingsPage() {
  const [parkings, setParkings] = useState(INITIAL_PARKINGS)
  const [search, setSearch]     = useState('')
  const [filter, setFilter]     = useState('all')
  const [selected, setSelected] = useState(null)
  const [showAdd, setShowAdd]   = useState(false)
  const [editTarget, setEditTarget] = useState(null)

  const handleAdd = (newParking) => setParkings(prev => [...prev, newParking])

  const handleEdit = (updated) => {
    setParkings(prev => prev.map(p => p.id === updated.id ? updated : p))
    setEditTarget(null)
  }

  const filtered = parkings.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' ||
      (filter === 'tersedia' && p.occupancy < 75) ||
      (filter === 'ramai'    && p.occupancy >= 75 && p.occupancy < 90) ||
      (filter === 'penuh'    && p.occupancy >= 90)
    return matchSearch && matchFilter
  })

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">🏢 Gedung Parkir</h1>
          <p className="page-sub">Monitor status seluruh gedung parkir secara real-time</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
          <Plus size={15} /> Tambah Gedung
        </button>
      </div>

      {/* Summary cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(155px,1fr))', gap:14, marginBottom:20 }}>
        {[
          { label:'Total Gedung', value: parkings.length,                                                    color:'var(--accent)' },
          { label:'Tersedia',     value: parkings.filter(p => p.occupancy < 75).length,                      color:'var(--green)' },
          { label:'Ramai',        value: parkings.filter(p => p.occupancy >= 75 && p.occupancy < 90).length, color:'var(--orange)' },
          { label:'Penuh',        value: parkings.filter(p => p.occupancy >= 90).length,                     color:'var(--red)' },
          { label:'Total Slot',   value: parkings.reduce((s, p) => s + p.totalSlots, 0),                     color:'var(--text)' },
        ].map((s, i) => (
          <div key={i} className="card" style={{ padding:'16px 20px', textAlign:'center' }}>
            <div style={{ fontSize:24, fontWeight:800, color:s.color }}>{s.value}</div>
            <div style={{ fontSize:12, color:'var(--text3)', marginTop:4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter & Search */}
      <div className="filter-bar">
        <div className="input-icon-wrap" style={{ flex:1, minWidth:200 }}>
          <Search size={14} className="input-icon" />
          <input className="input" placeholder="Cari nama gedung..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="filter-tabs">
          {[['all','Semua'],['tersedia','Tersedia'],['ramai','Ramai'],['penuh','Penuh']].map(([v,l]) => (
            <button key={v} className={`filter-tab ${filter === v ? 'active' : ''}`} onClick={() => setFilter(v)}>{l}</button>
          ))}
        </div>
      </div>

      {/* Parking Cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(320px,1fr))', gap:16 }}>
        {filtered.map((p, i) => (
          <div key={p.id} className="card animate-fade-up" style={{ animationDelay:`${i * 0.06}s` }}>
            <div style={{ padding:'18px 20px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
                <div style={{ flex:1, minWidth:0, paddingRight:10 }}>
                  <div style={{ fontSize:15, fontWeight:700, color:'var(--text)', marginBottom:3 }}>{p.name}</div>
                  <div style={{ fontSize:12, color:'var(--text3)', display:'flex', alignItems:'center', gap:4 }}>
                    <MapPin size={11} /> {p.address}
                  </div>
                </div>
                <span className={`badge ${p.tag === 'Tersedia' ? 'badge-green' : p.tag === 'Ramai' ? 'badge-orange' : 'badge-red'}`}>
                  {p.tag}
                </span>
              </div>

              <OccupancyBar pct={p.occupancy} />

              <div style={{ display:'flex', justifyContent:'space-between', marginTop:14, paddingTop:14, borderTop:'1px solid var(--border)' }}>
                <div style={{ display:'flex', gap:16 }}>
                  {[['Total Slot', p.totalSlots, 'var(--text)'],['Terisi', p.usedSlots, 'var(--red)'],['Kosong', p.totalSlots - p.usedSlots, 'var(--green)']].map(([l, v, c]) => (
                    <div key={l}>
                      <div style={{ fontSize:11, color:'var(--text3)' }}>{l}</div>
                      <div style={{ fontSize:15, fontWeight:700, color:c }}>{v}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display:'flex', gap:6 }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => setSelected(p)}>Detail →</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => setEditTarget(p)}
                    style={{ color:'var(--orange)', borderColor:'rgba(245,158,11,0.2)', background:'rgba(245,158,11,0.06)' }}>
                    <Edit2 size={13} /> Edit
                  </button>
                </div>
              </div>

              <div style={{ marginTop:10, display:'flex', gap:6, flexWrap:'wrap' }}>
                {p.floors.map(f => (
                  <span key={f} style={{ fontSize:11, background:'var(--bg-hover)', border:'1px solid var(--border)', borderRadius:6, padding:'2px 8px', color:'var(--text3)' }}>
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Map ─ Real Google Maps Embeds */}
      <div className="card" style={{ marginTop:20 }}>
        <div className="card-header">
          <span className="card-title">🗺️ Peta Lokasi Gedung Parkir</span>
          <span className="badge badge-accent">Bandar Lampung</span>
        </div>
        <div className="card-body">
          <p style={{ fontSize:13, color:'var(--text3)', marginBottom:16 }}>
            Klik <strong style={{ color:'var(--accent)' }}>Edit</strong> pada kartu gedung untuk mengubah link Google Maps.
            Data peta diambil langsung dari koordinat yang diberikan admin.
          </p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px,1fr))', gap:16 }}>
            {parkings.map(p => {
              const embedUrl = getEmbedUrl(p.googleMapsUrl)
              const occColor = p.occupancy >= 90 ? 'var(--red)' : p.occupancy >= 75 ? 'var(--orange)' : 'var(--green)'
              return (
                <div key={p.id} style={{ border:'1px solid var(--border)', borderRadius:'var(--radius)', overflow:'hidden' }}>
                  {/* Mini header */}
                  <div style={{ padding:'10px 14px', background:'var(--bg-hover)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <div>
                      <div style={{ fontSize:13, fontWeight:700, color:'var(--text)' }}>{p.name}</div>
                      <div style={{ fontSize:11, color:'var(--text3)', marginTop:1 }}>{p.address}</div>
                    </div>
                    <span className={`badge badge-${p.tagClass}`}>{p.tag}</span>
                  </div>
                  {/* Map or placeholder */}
                  {embedUrl ? (
                    <>
                      <iframe
                        src={embedUrl}
                        width="100%" height="180" style={{ border:'none', display:'block' }}
                        title={`Peta ${p.name}`}
                        loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                      />
                      <div style={{ padding:'8px 14px', display:'flex', justifyContent:'space-between', alignItems:'center', background:'var(--bg-card)' }}>
                        <span style={{ fontSize:11, fontWeight:700, color:occColor }}>{p.occupancy}% Terisi</span>
                        <a href={p.googleMapsUrl} target="_blank" rel="noreferrer"
                          style={{ fontSize:11, color:'var(--accent)', display:'flex', alignItems:'center', gap:3, textDecoration:'none' }}>
                          <ExternalLink size={11} /> Buka Maps
                        </a>
                      </div>
                    </>
                  ) : (
                    <div style={{ height:180, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'var(--bg-base)', gap:8 }}>
                      <Map size={28} color="var(--text3)" />
                      <div style={{ fontSize:12, color:'var(--text3)' }}>Belum ada link Google Maps</div>
                      <button className="btn btn-ghost btn-sm" onClick={() => setEditTarget(p)} style={{ fontSize:11 }}>
                        + Tambah Link Maps
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Modals */}
      {selected    && <ParkingDetailModal parking={selected}    onClose={() => setSelected(null)} />}
      {showAdd     && <AddParkingModal     onClose={() => setShowAdd(false)}   onAdd={handleAdd} />}
      {editTarget  && <EditParkingModal    parking={editTarget}  onClose={() => setEditTarget(null)} onSave={handleEdit} />}
    </div>
  )
}
