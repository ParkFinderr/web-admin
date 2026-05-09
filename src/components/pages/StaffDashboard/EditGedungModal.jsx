import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useApp } from '../../../context/AppContext';
import { PARKINGS, BOOKINGS, SCAN_LOGS, SWAP_LOGS, HOURLY_SCAN_DATA } from '../../../data/mockData';
import { Search, Edit2, X, Save, LayoutGrid } from 'lucide-react';
import SlotManagerModal from '../../SlotManagerModal';

/* ── Modal Edit Gedung (Staff – field terbatas) ────────────────── */

const fmtTime = iso => {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  }) + ' · ' + d.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short'
  });
};
export default function EditGedungModal({
  parking,
  onClose,
  onSave
}) {
  const [form, setForm] = useState({
    address: parking.address,
    catatan: parking.catatan || '',
    usedSlots: String(parking.usedSlots)
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [err, setErr] = useState('');
  const handleSubmit = async e => {
    e.preventDefault();
    const used = Number(form.usedSlots);
    if (isNaN(used) || used < 0 || used > parking.totalSlots) {
      setErr(`Slot terisi harus antara 0 – ${parking.totalSlots}`);
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    const occ = Math.round(used / parking.totalSlots * 100);
    onSave({
      ...parking,
      address: form.address.trim(),
      catatan: form.catatan.trim(),
      usedSlots: used,
      occupancy: occ,
      tag: occ >= 90 ? 'Penuh' : occ >= 75 ? 'Ramai' : 'Tersedia'
    });
    setLoading(false);
    setSuccess(true);
  };
  return <div style={{
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.7)',
    zIndex: 999,
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
      maxWidth: 460,
      overflow: 'hidden',
      animation: 'fadeUp .35s ease both'
    }} onClick={e => e.stopPropagation()}>

        <div style={{
        padding: '18px 22px',
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
            width: 34,
            height: 34,
            borderRadius: 9,
            background: 'rgba(245,158,11,0.12)',
            border: '1px solid rgba(245,158,11,0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
              <Edit2 size={15} color="var(--orange)" />
            </div>
            <div>
              <div style={{
              fontSize: 15,
              fontWeight: 800,
              color: 'var(--text)'
            }}>Edit Info Gedung</div>
              <div style={{
              fontSize: 11,
              color: 'var(--text3)'
            }}>{parking.name}</div>
            </div>
          </div>
          <button onClick={onClose} style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--text3)',
          display: 'flex'
        }}><X size={17} /></button>
        </div>

        {/* Staff notice */}
        <div style={{
        padding: '9px 22px',
        background: 'rgba(245,158,11,0.06)',
        borderBottom: '1px solid var(--border)',
        fontSize: 12,
        color: 'var(--orange)'
      }}>
          🛡️ Anda dapat mengubah alamat, catatan operasional, dan slot terisi saat ini.
        </div>

        {success ? <div style={{
        padding: '40px 22px',
        textAlign: 'center'
      }}>
            <div style={{
          fontSize: 48,
          marginBottom: 12
        }}>✅</div>
            <h3 style={{
          fontSize: 17,
          fontWeight: 800,
          color: 'var(--text)',
          marginBottom: 8
        }}>Berhasil Diperbarui!</h3>
            <p style={{
          fontSize: 13,
          color: 'var(--text3)',
          marginBottom: 20
        }}>Data gedung telah berhasil disimpan.</p>
            <button className="btn btn-primary" onClick={onClose} style={{
          width: '100%',
          justifyContent: 'center'
        }}>Tutup</button>
          </div> : <form onSubmit={handleSubmit} style={{
        padding: 22
      }}>
            <div style={{
          marginBottom: 14
        }}>
              <label style={{
            display: 'block',
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--text2)',
            marginBottom: 6
          }}>Alamat Gedung</label>
              <textarea className="input" rows={2} value={form.address} onChange={e => {
            setForm(f => ({
              ...f,
              address: e.target.value
            }));
            setErr('');
          }} style={{
            resize: 'vertical',
            minHeight: 60
          }} />
            </div>
            <div style={{
          marginBottom: 14
        }}>
              <label style={{
            display: 'block',
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--text2)',
            marginBottom: 6
          }}>Catatan Operasional</label>
              <textarea className="input" rows={2} placeholder="Contoh: Lantai B1 sedang perbaikan, gunakan L1..." value={form.catatan} onChange={e => setForm(f => ({
            ...f,
            catatan: e.target.value
          }))} style={{
            resize: 'vertical',
            minHeight: 60
          }} />
            </div>
            <div style={{
          marginBottom: err ? 8 : 20
        }}>
              <label style={{
            display: 'block',
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--text2)',
            marginBottom: 6
          }}>
                Slot Terisi Saat Ini <span style={{
              fontWeight: 400,
              color: 'var(--text3)'
            }}>(maks. {parking.totalSlots})</span>
              </label>
              <input className="input" type="number" min="0" max={parking.totalSlots} value={form.usedSlots} onChange={e => {
            setForm(f => ({
              ...f,
              usedSlots: e.target.value
            }));
            setErr('');
          }} style={{
            borderColor: err ? 'var(--red)' : undefined
          }} />
            </div>
            {err && <div style={{
          fontSize: 12,
          color: 'var(--red)',
          marginBottom: 14
        }}>⚠ {err}</div>}
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
            justifyContent: 'center'
          }}>
                {loading ? <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}><span style={{
                width: 14,
                height: 14,
                border: '2px solid rgba(0,0,0,0.25)',
                borderTopColor: '#000',
                borderRadius: '50%',
                animation: 'spin .7s linear infinite',
                display: 'inline-block'
              }} />Menyimpan...</span> : <><Save size={14} /> Simpan</>}
              </button>
            </div>
          </form>}
      </div>
    </div>;
}