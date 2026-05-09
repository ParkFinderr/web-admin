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
export default /* ── Modal Tambah Gedung ──────────────────────────────────────────────── */
function AddParkingModal({
  onClose,
  onAdd
}) {
  const [form, setForm] = useState({
    name: '',
    shortName: '',
    address: '',
    totalSlots: '',
    floors: ['L1'],
    googleMapsUrl: ''
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const set = (k, v) => {
    setForm(f => ({
      ...f,
      [k]: v
    }));
    if (errors[k]) setErrors(e => ({
      ...e,
      [k]: null
    }));
  };
  const toggleFloor = f => {
    setForm(prev => ({
      ...prev,
      floors: prev.floors.includes(f) ? prev.floors.filter(x => x !== f) : [...prev.floors, f].sort((a, b) => FLOOR_OPTIONS.indexOf(a) - FLOOR_OPTIONS.indexOf(b))
    }));
  };
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
    await new Promise(r => setTimeout(r, 800));
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
      distance: '—'
    };
    onAdd(newParking);
    setLoading(false);
    setSuccess(true);
  };
  const Field = ({
    label,
    id,
    error,
    children
  }) => <div style={{
    marginBottom: 16
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
      marginTop: 5
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
            background: 'var(--accent-glow)',
            border: '1px solid var(--border2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
              <Building2 size={18} color="var(--accent)" />
            </div>
            <div>
              <div style={{
              fontSize: 16,
              fontWeight: 800,
              color: 'var(--text)'
            }}>Tambah Gedung Parkir</div>
              <div style={{
              fontSize: 12,
              color: 'var(--text3)'
            }}>Isi data gedung parkir baru</div>
            </div>
          </div>
          <button onClick={onClose} style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--text3)',
          padding: 4,
          borderRadius: 8,
          display: 'flex'
        }}>
            <X size={18} />
          </button>
        </div>

        {/* Success state */}
        {success ? <div style={{
        padding: '48px 24px',
        textAlign: 'center'
      }}>
            <div style={{
          fontSize: 56,
          marginBottom: 16
        }}>✅</div>
            <h3 style={{
          fontSize: 20,
          fontWeight: 800,
          color: 'var(--text)',
          marginBottom: 8
        }}>Gedung Berhasil Ditambahkan!</h3>
            <p style={{
          fontSize: 14,
          color: 'var(--text3)',
          marginBottom: 24
        }}>
              <strong style={{
            color: 'var(--accent)'
          }}>{form.name}</strong> telah berhasil ditambahkan ke sistem.
            </p>
            <button className="btn btn-primary" onClick={onClose} style={{
          width: '100%',
          justifyContent: 'center',
          padding: '11px'
        }}>
              Tutup
            </button>
          </div> : <form onSubmit={handleSubmit} style={{
        padding: '24px'
      }}>

            {/* Nama Gedung */}
            <Field label="Nama Gedung *" id="name" error={errors.name}>
              <input id="name" className="input" placeholder="Contoh: Mal Kartika Sari" value={form.name} onChange={e => set('name', e.target.value)} style={{
            borderColor: errors.name ? 'var(--red)' : undefined
          }} />
            </Field>

            {/* Nama Singkat */}
            <Field label="Nama Singkat *" id="shortName" error={errors.shortName}>
              <input id="shortName" className="input" placeholder="Contoh: MKS (maks. 12 karakter)" value={form.shortName} onChange={e => set('shortName', e.target.value.slice(0, 12))} style={{
            borderColor: errors.shortName ? 'var(--red)' : undefined
          }} />
            </Field>

            {/* Alamat */}
            <Field label="Alamat Lengkap *" id="address" error={errors.address}>
              <textarea id="address" className="input" placeholder="Contoh: Jl. Ratu Dibalau No.1, Bandar Lampung" value={form.address} onChange={e => set('address', e.target.value)} rows={2} style={{
            resize: 'vertical',
            minHeight: 64,
            borderColor: errors.address ? 'var(--red)' : undefined
          }} />
            </Field>

            {/* Total Slot */}
            <Field label="Total Slot Parkir *" id="totalSlots" error={errors.totalSlots}>
              <input id="totalSlots" className="input" type="number" min="1" placeholder="Contoh: 250" value={form.totalSlots} onChange={e => set('totalSlots', e.target.value)} style={{
            borderColor: errors.totalSlots ? 'var(--red)' : undefined
          }} />
            </Field>

            {/* Lantai */}
            <Field label="Lantai / Level *" id="floors" error={errors.floors}>
              <div style={{
            display: 'flex',
            gap: 8,
            flexWrap: 'wrap'
          }}>
                {FLOOR_OPTIONS.map(f => {
              const active = form.floors.includes(f);
              return <button key={f} type="button" onClick={() => toggleFloor(f)} className={`btn btn-sm ${active ? 'btn-primary' : 'btn-ghost'}`} style={{
                minWidth: 50
              }}>
                      {f}
                    </button>;
            })}
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
            <Field label="Link Google Maps (opsional)" id="gmaps" error={null}>
              <input id="gmaps" className="input" placeholder="https://maps.google.com/?q=... atau https://goo.gl/maps/..." value={form.googleMapsUrl} onChange={e => set('googleMapsUrl', e.target.value)} />
              {form.googleMapsUrl && parseGoogleMapsUrl(form.googleMapsUrl) && <div style={{
            marginTop: 6,
            fontSize: 11,
            color: 'var(--green)',
            display: 'flex',
            alignItems: 'center',
            gap: 4
          }}>
                  ✅ Koordinat terdeteksi: {JSON.stringify(parseGoogleMapsUrl(form.googleMapsUrl))}
                </div>}
              {form.googleMapsUrl && !parseGoogleMapsUrl(form.googleMapsUrl) && <div style={{
            marginTop: 6,
            fontSize: 11,
            color: 'var(--orange)'
          }}>
                  ⚠️ Format tidak dikenali. Coba link yang mengandung koordinat (@lat,lng)
                </div>}
            </Field>

            {/* Divider */}
            <div style={{
          borderTop: '1px solid var(--border)',
          margin: '8px 0 20px'
        }} />

            {/* Info preview */}
            {(form.name || form.totalSlots) && <div style={{
          background: 'var(--accent-glow)',
          border: '1px solid var(--border2)',
          borderRadius: 10,
          padding: '12px 14px',
          marginBottom: 20
        }}>
                <div style={{
            fontSize: 12,
            color: 'var(--text3)',
            marginBottom: 6,
            fontWeight: 600
          }}>Preview Data</div>
                {form.name && <div style={{
            fontSize: 13,
            color: 'var(--text)',
            fontWeight: 700
          }}>🏢 {form.name}</div>}
                {form.address && <div style={{
            fontSize: 12,
            color: 'var(--text3)',
            marginTop: 2
          }}>📍 {form.address}</div>}
                <div style={{
            display: 'flex',
            gap: 16,
            marginTop: 8
          }}>
                  {form.totalSlots && <div style={{
              fontSize: 12
            }}><span style={{
                color: 'var(--text3)'
              }}>Slot: </span><span style={{
                color: 'var(--accent)',
                fontWeight: 700
              }}>{form.totalSlots}</span></div>}
                  {form.floors.length > 0 && <div style={{
              fontSize: 12
            }}><span style={{
                color: 'var(--text3)'
              }}>Lantai: </span><span style={{
                color: 'var(--accent)',
                fontWeight: 700
              }}>{form.floors.join(', ')}</span></div>}
                </div>
              </div>}

            {/* Actions */}
            <div style={{
          display: 'flex',
          gap: 10
        }}>
              <button type="button" className="btn btn-ghost" onClick={onClose} style={{
            flex: 1,
            justifyContent: 'center'
          }}>
                Batal
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading} style={{
            flex: 2,
            justifyContent: 'center',
            padding: '11px'
          }}>
                {loading ? <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
                    <span style={{
                width: 15,
                height: 15,
                border: '2px solid rgba(0,0,0,0.25)',
                borderTopColor: '#000',
                borderRadius: '50%',
                animation: 'spin .7s linear infinite',
                display: 'inline-block'
              }} />
                    Menyimpan...
                  </span> : <><Plus size={16} /> Tambah Gedung</>}
              </button>
            </div>
          </form>}
      </div>
    </div>;
}

/* ── Modal Edit Gedung ────────────────────────────────────────────────── */