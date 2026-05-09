import { useState, useMemo } from 'react'
import { X, Save, RotateCcw } from 'lucide-react'

// ── Status config ───────────────────────────────────────────────────────────
export const SLOT_STATUS = {
  available:   { label: 'Tersedia',    color: 'var(--green)',  bg: 'rgba(34,197,94,0.12)',   border: 'rgba(34,197,94,0.3)',    icon: '🟢' },
  occupied:    { label: 'Terisi',      color: 'var(--red)',    bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.3)',    icon: '🔴' },
  rusak:       { label: 'Rusak',       color: '#f43f5e',       bg: 'rgba(244,63,94,0.1)',    border: 'rgba(244,63,94,0.35)',   icon: '⛔' },
  maintenance: { label: 'Maintenance', color: 'var(--orange)', bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.35)', icon: '🔧' },
  nonaktif:    { label: 'Nonaktif',    color: 'var(--text3)',  bg: 'var(--bg-hover)',         border: 'var(--border)',          icon: '⚫' },
}

// Generate slot names for a floor, e.g. L1: A01..A12
function generateSlots(floor, totalSlots) {
  const perFloor = Math.ceil(totalSlots / 3) || 8 // distribute evenly
  const capped   = Math.min(perFloor, 24)
  const rows     = ['A','B','C','D']
  const slots    = []
  let count = 0
  for (const row of rows) {
    for (let n = 1; n <= 6 && count < capped; n++, count++) {
      slots.push(`${floor}-${row}${String(n).padStart(2,'0')}`)
    }
  }
  return slots
}

// ── Slot status picker popover ──────────────────────────────────────────────
function StatusPicker({ onSelect, onClose }) {
  return (
    <>
      <div onClick={onClose} style={{ position:'fixed', inset:0, zIndex:1100 }} />
      <div style={{
        position:'absolute', top:'calc(100% + 6px)', left:'50%', transform:'translateX(-50%)',
        background:'var(--bg-card)', border:'1px solid var(--border2)', borderRadius:12,
        boxShadow:'var(--shadow)', zIndex:1101, padding:8, minWidth:160,
      }}>
        {Object.entries(SLOT_STATUS).map(([key, s]) => (
          <button key={key} onClick={() => onSelect(key)} style={{
            display:'flex', alignItems:'center', gap:8, width:'100%', padding:'7px 10px',
            background:'none', border:'none', cursor:'pointer', borderRadius:8, fontSize:13,
            color:'var(--text)', fontWeight:600, textAlign:'left',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
          >
            <span>{s.icon}</span>
            <span style={{ color:s.color }}>{s.label}</span>
          </button>
        ))}
      </div>
    </>
  )
}

// ── Main Modal ──────────────────────────────────────────────────────────────
export default function SlotManagerModal({ parking, onClose, onSave, readonly = false }) {
  const floors = parking.floors || ['L1']

  // Seed initial slot states — occupied slots randomly assigned, rest available
  const initSlots = useMemo(() => {
    const map = {}
    floors.forEach(floor => {
      const names = generateSlots(floor, parking.totalSlots)
      const usedCount = Math.round((parking.usedSlots / (floors.length * names.length)) * names.length)
      names.forEach((name, i) => {
        map[name] = i < usedCount ? 'occupied' : 'available'
      })
    })
    return map
  }, []) // eslint-disable-line

  const [slotStatus, setSlotStatus] = useState(initSlots)
  const [activeFloor, setActiveFloor] = useState(floors[0])
  const [picker, setPicker] = useState(null) // slot name with open picker
  const [saved, setSaved] = useState(false)
  const [changed, setChanged] = useState({}) // track changes

  const currentSlots = useMemo(
    () => generateSlots(activeFloor, parking.totalSlots),
    [activeFloor, parking.totalSlots]
  )

  const handleStatusChange = (slot, status) => {
    setSlotStatus(prev => ({ ...prev, [slot]: status }))
    setChanged(prev => ({ ...prev, [slot]: status }))
    setPicker(null)
  }

  // Summary counts across all floors
  const summary = useMemo(() => {
    const counts = Object.fromEntries(Object.keys(SLOT_STATUS).map(k => [k, 0]))
    Object.values(slotStatus).forEach(s => { if (counts[s] !== undefined) counts[s]++ })
    return counts
  }, [slotStatus])

  const handleSave = () => {
    setSaved(true)
    onSave?.({ ...parking, slotStatus, changedCount: Object.keys(changed).length })
    setTimeout(onClose, 1400)
  }

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }} onClick={onClose}>
      <div style={{ background:'var(--bg-card)', border:'1px solid var(--border2)', borderRadius:'var(--radius-lg)', width:'100%', maxWidth:680, maxHeight:'92vh', overflow:'hidden', display:'flex', flexDirection:'column', animation:'fadeUp .35s ease both' }} onClick={e => e.stopPropagation()}>

        {/* ── Header ── */}
        <div style={{ padding:'18px 22px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink:0 }}>
          <div>
            <div style={{ fontSize:16, fontWeight:800, color:'var(--text)' }}>🅿️ Kelola Slot Parkir</div>
            <div style={{ fontSize:12, color:'var(--text3)', marginTop:2 }}>{parking.name} · {Object.keys(slotStatus).length} slot total</div>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text3)', display:'flex' }}><X size={18} /></button>
        </div>

        {/* ── Status Summary ── */}
        <div style={{ display:'flex', gap:0, borderBottom:'1px solid var(--border)', flexShrink:0, overflowX:'auto' }}>
          {Object.entries(SLOT_STATUS).map(([key, s]) => (
            <div key={key} style={{ flex:1, minWidth:80, padding:'10px 8px', textAlign:'center', borderRight:'1px solid var(--border)' }}>
              <div style={{ fontSize:18, marginBottom:2 }}>{s.icon}</div>
              <div style={{ fontSize:20, fontWeight:800, color:s.color }}>{summary[key]}</div>
              <div style={{ fontSize:10, color:'var(--text3)', fontWeight:600 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Floor Tabs ── */}
        <div style={{ display:'flex', borderBottom:'1px solid var(--border)', background:'var(--bg-base)', flexShrink:0, overflowX:'auto' }}>
          {floors.map(f => (
            <button key={f} onClick={() => setActiveFloor(f)} style={{
              padding:'10px 20px', border:'none', cursor:'pointer', fontSize:13, fontWeight:700,
              background: activeFloor === f ? 'var(--bg-card)' : 'transparent',
              color: activeFloor === f ? 'var(--accent)' : 'var(--text3)',
              borderBottom: activeFloor === f ? '2px solid var(--accent)' : '2px solid transparent',
              transition:'all .2s',
            }}>
              Lantai {f}
            </button>
          ))}
        </div>

        {/* ── Slot Grid ── */}
        <div style={{ flex:1, overflowY:'auto', padding:'20px 22px' }}>
          {/* Legend */}
          <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginBottom:16 }}>
            {Object.entries(SLOT_STATUS).map(([key, s]) => (
              <div key={key} style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, color:'var(--text3)' }}>
                <span style={{ width:10, height:10, borderRadius:3, background:s.bg, border:`1px solid ${s.border}`, display:'inline-block' }} />
                {s.icon} {s.label}
              </div>
            ))}
          </div>

          {/* Slots */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(88px,1fr))', gap:8 }}>
            {currentSlots.map(slot => {
              const status = slotStatus[slot] || 'available'
              const cfg    = SLOT_STATUS[status]
              const wasChanged = changed[slot] !== undefined
              return (
                <div key={slot} style={{ position:'relative' }}>
                  <button
                    disabled={readonly && status === 'occupied'} // staff can't free occupied slots
                    onClick={() => !readonly || status !== 'occupied' ? setPicker(picker === slot ? null : slot) : null}
                    style={{
                      width:'100%', padding:'10px 6px', borderRadius:10, border:`2px solid ${cfg.border}`,
                      background: cfg.bg, cursor: 'pointer', textAlign:'center',
                      outline: wasChanged ? `2px solid var(--accent)` : 'none',
                      outlineOffset:2, transition:'all .2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.filter='brightness(1.15)'}
                    onMouseLeave={e => e.currentTarget.style.filter='none'}
                  >
                    <div style={{ fontSize:16 }}>{cfg.icon}</div>
                    <div style={{ fontSize:11, fontWeight:700, color:cfg.color, marginTop:3, lineHeight:1.2 }}>{slot}</div>
                    <div style={{ fontSize:9, color:cfg.color, marginTop:2, opacity:.8 }}>{cfg.label}</div>
                  </button>
                  {picker === slot && (
                    <StatusPicker
                      onSelect={st => handleStatusChange(slot, st)}
                      onClose={() => setPicker(null)}
                    />
                  )}
                </div>
              )
            })}
          </div>

          {/* Info */}
          {!readonly && (
            <div style={{ marginTop:16, padding:'10px 14px', background:'var(--accent-glow)', border:'1px solid var(--border2)', borderRadius:10, fontSize:12, color:'var(--text3)' }}>
              💡 Klik slot untuk mengubah statusnya. Slot dengan <strong style={{ color:'var(--accent)' }}>outline biru</strong> menandakan ada perubahan yang belum disimpan.
            </div>
          )}
          {readonly && (
            <div style={{ marginTop:16, padding:'10px 14px', background:'rgba(245,158,11,0.08)', border:'1px solid rgba(245,158,11,0.2)', borderRadius:10, fontSize:12, color:'var(--orange)' }}>
              🛡️ Anda dapat mengubah status slot <strong>Tersedia, Rusak, Maintenance,</strong> dan <strong>Nonaktif</strong>. Slot yang sedang terisi tidak bisa diubah.
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div style={{ padding:'14px 22px', borderTop:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink:0, gap:10 }}>
          <div style={{ fontSize:12, color:'var(--text3)' }}>
            {Object.keys(changed).length > 0
              ? <span style={{ color:'var(--accent)', fontWeight:600 }}>✏️ {Object.keys(changed).length} slot diubah</span>
              : <span>Belum ada perubahan</span>}
          </div>
          <div style={{ display:'flex', gap:8 }}>
            {Object.keys(changed).length > 0 && (
              <button className="btn btn-ghost btn-sm" onClick={() => { setSlotStatus(initSlots); setChanged({}) }}>
                <RotateCcw size={13} /> Reset
              </button>
            )}
            <button className="btn btn-ghost btn-sm" onClick={onClose}>Tutup</button>
            {!saved ? (
              <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={Object.keys(changed).length === 0}>
                <Save size={13} /> Simpan Perubahan
              </button>
            ) : (
              <button className="btn btn-ghost btn-sm" style={{ color:'var(--green)', borderColor:'var(--green)' }}>
                ✅ Tersimpan!
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
