import { useState } from 'react';
import { PARKINGS } from '../../../data/mockData';
import { useApp } from '../../../context/AppContext';
import { Search, Plus, X, UserPlus, Edit2, Trash2, Lock, Eye, EyeOff } from 'lucide-react';
const PARKING_LIST = PARKINGS || [];
const fmtDate = iso => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

// Initial staff list seeded dari AppContext
const INIT_STAFF = [{
  id: 'staff-1',
  name: 'Rizki Pratama',
  email: 'staff.unila@parkfinder.id',
  phone: '0812-1111-2222',
  parkingId: 1,
  parkingName: 'Jurusan Teknik Elektro UNILA',
  joinDate: '2026-01-10',
  status: 'active',
  shifts: 'Pagi (06:00–14:00)'
}, {
  id: 'staff-2',
  name: 'Maya Sari',
  email: 'staff.mbk@parkfinder.id',
  phone: '0821-3333-4444',
  parkingId: 2,
  parkingName: 'Mall Boemi Kedaton',
  joinDate: '2026-01-15',
  status: 'active',
  shifts: 'Pagi (06:00–14:00)'
}, {
  id: 'staff-3',
  name: 'Andi Wijaya',
  email: 'staff.lcm@parkfinder.id',
  phone: '0856-5555-6666',
  parkingId: 3,
  parkingName: 'Lampung City Mall',
  joinDate: '2026-02-01',
  status: 'active',
  shifts: 'Siang (14:00–22:00)'
}, {
  id: 'staff-4',
  name: 'Sari Dewi',
  email: 'staff.bambu@parkfinder.id',
  phone: '0878-7777-8888',
  parkingId: 4,
  parkingName: 'Pasar Bambu Kuning',
  joinDate: '2026-02-10',
  status: 'active',
  shifts: 'Pagi (06:00–14:00)'
}, {
  id: 'staff-5',
  name: 'Hendra Kusuma',
  email: 'staff.rsud@parkfinder.id',
  phone: '0813-9999-0000',
  parkingId: 5,
  parkingName: 'RSUD Abdul Moeloek',
  joinDate: '2026-03-05',
  status: 'active',
  shifts: 'Malam (22:00–06:00)'
}, {
  id: 'staff-6',
  name: 'Putri Lestari',
  email: 'staff.stasiun@parkfinder.id',
  phone: '0857-1212-3434',
  parkingId: 6,
  parkingName: 'Stasiun Tanjungkarang',
  joinDate: '2026-03-20',
  status: 'active',
  shifts: 'Siang (14:00–22:00)'
}];
const SHIFT_OPTIONS = ['Pagi (06:00–14:00)', 'Siang (14:00–22:00)', 'Malam (22:00–06:00)'];

/* ── Modal Tambah/Edit Staff ────────────────────────────────────────── */
export default /* ── Confirm Delete Modal ────────────────────────────────────────────── */
function DeleteModal({
  staff,
  onClose,
  onConfirm
}) {
  const [loading, setLoading] = useState(false);
  const handle = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    onConfirm(staff.id);
    onClose();
  };
  return <div style={{
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.7)',
    zIndex: 1001,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  }} onClick={onClose}>
      <div style={{
      background: 'var(--bg-card)',
      border: '1px solid rgba(239,68,68,0.3)',
      borderRadius: 'var(--radius-lg)',
      width: '100%',
      maxWidth: 400,
      padding: 28,
      animation: 'fadeUp .3s ease'
    }} onClick={e => e.stopPropagation()}>
        <div style={{
        textAlign: 'center',
        marginBottom: 20
      }}>
          <div style={{
          fontSize: 44,
          marginBottom: 12
        }}>⚠️</div>
          <h3 style={{
          fontSize: 17,
          fontWeight: 800,
          color: 'var(--text)',
          marginBottom: 8
        }}>Hapus Staff?</h3>
          <p style={{
          fontSize: 13,
          color: 'var(--text3)',
          lineHeight: 1.5
        }}>
            Akun <strong style={{
            color: 'var(--red)'
          }}>{staff.name}</strong> ({staff.parkingName}) akan dihapus permanen dari sistem.
          </p>
        </div>
        <div style={{
        display: 'flex',
        gap: 10
      }}>
          <button className="btn btn-ghost" onClick={onClose} style={{
          flex: 1,
          justifyContent: 'center'
        }}>Batal</button>
          <button className="btn btn-danger" onClick={handle} disabled={loading} style={{
          flex: 1,
          justifyContent: 'center'
        }}>
            {loading ? 'Menghapus...' : '🗑️ Ya, Hapus'}
          </button>
        </div>
      </div>
    </div>;
}

/* ── Modal Ubah Password Staff ──────────────────────────────────── */