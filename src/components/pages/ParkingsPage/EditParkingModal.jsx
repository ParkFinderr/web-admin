import { useState } from 'react';
import { PARKINGS as INITIAL_PARKINGS } from '../../../data/mockData';
import { Search, MapPin, Plus, X, Building2, Edit2, Save, ExternalLink, Map, LayoutGrid } from 'lucide-react';
import SlotManagerModal from '../../SlotManagerModal';
const FLOOR_OPTIONS = ['B2', 'B1', 'L1', 'L2', 'L3', 'L4', 'L5'];

// ── Google Maps helpers ───────────────────────────────────────────────
function parseGoogleMapsUrl(url) {
  if (!url) return null;
  // Format: @lat,lng,zoom (standard share link)
  let m = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (m) return {
    lat: m[1],
    lng: m[2]
  };
  // Format: ?q=lat,lng
  m = url.match(/[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (m) return {
    lat: m[1],
    lng: m[2]
  };
  // Format: ll=lat,lng
  m = url.match(/ll=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (m) return {
    lat: m[1],
    lng: m[2]
  };
  return null;
}
function getEmbedUrl(url) {
  const coords = parseGoogleMapsUrl(url);
  if (!coords) return null;
  return `https://maps.google.com/maps?q=${coords.lat},${coords.lng}&z=17&output=embed`;
}
export default /* ── Modal Edit Gedung ────────────────────────────────────────────────── */
function EditParkingModal({
  parking,
  onClose,
  onSave
}) {
  const [form, setForm] = useState({
    name: parking.name,
    shortName: parking.shortName,
    address: parking.address,
    totalSlots: String(parking.totalSlots),
    floors: [...parking.floors],
    googleMapsUrl: parking.googleMapsUrl || ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const set = (k, v) => {
    setForm(f => ({
      ...f,
      [k]: v
    }));
    setErrors(e => ({
      ...e,
      [k]: null
    }));
  };
  const toggleFloor = f => set('floors', form.floors.includes(f) ? form.floors.filter(x => x !== f) : [...form.floors, f].sort((a, b) => FLOOR_OPTIONS.indexOf(a) - FLOOR_OPTIONS.indexOf(b)));
  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Nama gedung wajib diisi';
    if (!form.shortName.trim()) e.shortName = 'Nama singkat wajib diisi';
    if (!form.address.trim()) e.address = 'Alamat wajib diisi';
    if (!form.totalSlots || isNaN(form.totalSlots) || Number(form.totalSlots) < 1) e.totalSlots = 'Jumlah slot harus angka positif';
    if (form.floors.length === 0) e.floors = 'Pilih minimal 1 lantai';
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    const slots = Number(form.totalSlots);
    const used = Math.min(parking.usedSlots, slots);
    const occ = Math.round(used / slots * 100);
    onSave({
      ...parking,
      name: form.name.trim(),
      shortName: form.shortName.trim(),
      address: form.address.trim(),
      totalSlots: slots,
      usedSlots: used,
      occupancy: occ,
      tag: occ >= 90 ? 'Penuh' : occ >= 75 ? 'Ramai' : 'Tersedia',
      floors: form.floors,
      googleMapsUrl: form.googleMapsUrl.trim()
    });
    setLoading(false);
    setSuccess(true);
  };
  const Field = ({
    label,
    id,
    error,
    children
  }) => <div style={{
    marginBottom: 14
  }}>
      <label htmlFor={id} style={{
      display: 'block',
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--text2)',
      marginBottom: 6
    }}>{label}</label>
      {children}
      {error && <div style={{
      fontSize: 12,
      color: 'var(--red)',
      marginTop: 4
    }}>⚠ {error}</div>}
    </div>;
  return <div style={{
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.7)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  }} onClick={onClose}>
      <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border2)',
      borderRadius: 'var(--radius-lg)',
      width: '100%',
      maxWidth: 520,
      maxHeight: '92vh',
      overflow: 'auto',
      animation: 'fadeUp .35s ease both'
    }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{
        padding: '20px 24px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
          <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10
        }}>
            <div style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: 'rgba(245,158,11,0.12)',
            border: '1px solid rgba(245,158,11,0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
              <Edit2 size={16} color="var(--orange)" />
            </div>
            <div>
              <div style={{
              fontSize: 16,
              fontWeight: 800,
              color: 'var(--text)'
            }}>Edit Gedung Parkir</div>
              <div style={{
              fontSize: 12,
              color: 'var(--text3)'
            }}>Mengubah data: {parking.name}</div>
            </div>
          </div>
          <button onClick={onClose} style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--text3)',
          display: 'flex'
        }}><X size={18} /></button>
        </div>

        {success ? <div style={{
        padding: '48px 24px',
        textAlign: 'center'
      }}>
            <div style={{
          fontSize: 52,
          marginBottom: 14
        }}>✅</div>
            <h3 style={{
          fontSize: 18,
          fontWeight: 800,
          color: 'var(--text)',
          marginBottom: 8
        }}>Data Berhasil Diperbarui!</h3>
            <p style={{
          fontSize: 13,
          color: 'var(--text3)',
          marginBottom: 24
        }}>
              <strong style={{
            color: 'var(--accent)'
          }}>{form.name}</strong> telah berhasil diperbarui.
            </p>
            <button className="btn btn-primary" onClick={onClose} style={{
          width: '100%',
          justifyContent: 'center',
          padding: 11
        }}>Tutup</button>
          </div> : <form onSubmit={handleSubmit} style={{
        padding: 24
      }}>

            <Field label="Nama Gedung *" id="en" error={errors.name}>
              <input id="en" className="input" value={form.name} onChange={e => set('name', e.target.value)} style={{
            borderColor: errors.name ? 'var(--red)' : undefined
          }} />
            </Field>

            <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 14
        }}>
              <Field label="Nama Singkat *" id="esn" error={errors.shortName}>
                <input id="esn" className="input" value={form.shortName} onChange={e => set('shortName', e.target.value.slice(0, 12))} style={{
              borderColor: errors.shortName ? 'var(--red)' : undefined
            }} />
              </Field>
              <Field label="Total Slot *" id="ets" error={errors.totalSlots}>
                <input id="ets" className="input" type="number" min="1" value={form.totalSlots} onChange={e => set('totalSlots', e.target.value)} style={{
              borderColor: errors.totalSlots ? 'var(--red)' : undefined
            }} />
              </Field>
            </div>

            <Field label="Alamat Lengkap *" id="ea" error={errors.address}>
              <textarea id="ea" className="input" rows={2} value={form.address} onChange={e => set('address', e.target.value)} style={{
            resize: 'vertical',
            minHeight: 64,
            borderColor: errors.address ? 'var(--red)' : undefined
          }} />
            </Field>

            <Field label="Lantai / Level *" id="ef" error={errors.floors}>
              <div style={{
            display: 'flex',
            gap: 8,
            flexWrap: 'wrap'
          }}>
                {FLOOR_OPTIONS.map(f => <button key={f} type="button" onClick={() => toggleFloor(f)} className={`btn btn-sm ${form.floors.includes(f) ? 'btn-primary' : 'btn-ghost'}`} style={{
              minWidth: 46
            }}>
                    {f}
                  </button>)}
              </div>
              {form.floors.length > 0 && <div style={{
            marginTop: 8,
            fontSize: 12,
            color: 'var(--text3)'
          }}>
                  Dipilih: <span style={{
              color: 'var(--accent)',
              fontWeight: 600
            }}>{form.floors.join(', ')}</span>
                </div>}
            </Field>

            {/* Link Google Maps */}
            <Field label="Link Google Maps" id="egmaps" error={null}>
              <input id="egmaps" className="input" placeholder="https://maps.google.com/?q=... atau paste link share Google Maps" value={form.googleMapsUrl} onChange={e => set('googleMapsUrl', e.target.value)} />
              {form.googleMapsUrl && parseGoogleMapsUrl(form.googleMapsUrl) && <div style={{
            marginTop: 6,
            fontSize: 11,
            color: 'var(--green)',
            display: 'flex',
            alignItems: 'center',
            gap: 4
          }}>
                  ✅ Koordinat terdeteksi — peta akan tampil di detail gedung
                </div>}
              {form.googleMapsUrl && !parseGoogleMapsUrl(form.googleMapsUrl) && <div style={{
            marginTop: 6,
            fontSize: 11,
            color: 'var(--orange)'
          }}>
                  ⚠️ Format tidak dikenali. Coba link yang mengandung koordinat
                </div>}
            </Field>

            {/* Change summary */}
            <div style={{
          background: 'rgba(245,158,11,0.06)',
          border: '1px solid rgba(245,158,11,0.2)',
          borderRadius: 10,
          padding: '12px 14px',
          marginBottom: 20,
          fontSize: 12,
          color: 'var(--text3)'
        }}>
              ⚠️ Perubahan total slot akan menghitung ulang % ocupansi secara otomatis.
            </div>

            <div style={{
          display: 'flex',
          gap: 10
        }}>
              <button type="button" className="btn btn-ghost" onClick={onClose} style={{
            flex: 1,
            justifyContent: 'center'
          }}>Batal</button>
              <button type="submit" className="btn btn-primary" disabled={loading} style={{
            flex: 2,
            justifyContent: 'center',
            padding: 11
          }}>
                {loading ? <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}><span style={{
                width: 15,
                height: 15,
                border: '2px solid rgba(0,0,0,0.25)',
                borderTopColor: '#000',
                borderRadius: '50%',
                animation: 'spin .7s linear infinite',
                display: 'inline-block'
              }} />Menyimpan...</span> : <><Save size={14} /> Simpan Perubahan</>}
              </button>
            </div>
          </form>}
      </div>
    </div>;
}

/* ── Main Page ────────────────────────────────────────────────────────── */