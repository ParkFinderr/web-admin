import StaffFormModal from "../components/pages/StaffManagementPage/StaffFormModal";
import DeleteModal from "../components/pages/StaffManagementPage/DeleteModal";
import ChangeStaffPasswordModal from "../components/pages/StaffManagementPage/ChangeStaffPasswordModal";
import { useState } from 'react';
import { PARKINGS } from '../data/mockData';
import { useApp } from '../context/AppContext';
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

/* ── Main Page ──────────────────────────────────────────────────────── */
export default function StaffManagementPage() {
  const [staffList, setStaffList] = useState(INIT_STAFF);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [changePasswordTarget, setChangePasswordTarget] = useState(null);
  const filtered = staffList.filter(s => {
    const q = search.toLowerCase();
    const matchSearch = s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.parkingName.toLowerCase().includes(q) || s.phone.includes(q);
    const matchFilter = filter === 'all' || s.status === filter;
    return matchSearch && matchFilter;
  });
  const handleSave = data => {
    setStaffList(prev => {
      const idx = prev.findIndex(s => s.id === data.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = data;
        return next;
      }
      return [...prev, data];
    });
    setShowAdd(false);
    setEditData(null);
  };
  const handleDelete = id => {
    setStaffList(prev => prev.filter(s => s.id !== id));
  };
  const toggleStatus = id => {
    setStaffList(prev => prev.map(s => s.id === id ? {
      ...s,
      status: s.status === 'active' ? 'inactive' : 'active'
    } : s));
  };
  return <div>
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
      <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(155px,1fr))',
      gap: 12,
      marginBottom: 20
    }}>
        {[{
        label: 'Total Staff',
        value: staffList.length,
        color: 'var(--text)'
      }, {
        label: 'Aktif',
        value: staffList.filter(s => s.status === 'active').length,
        color: 'var(--green)'
      }, {
        label: 'Non-Aktif',
        value: staffList.filter(s => s.status !== 'active').length,
        color: 'var(--text3)'
      }, {
        label: 'Gedung Aktif',
        value: PARKING_LIST.length,
        color: 'var(--accent)'
      }].map((s, i) => <div key={i} className="card" style={{
        padding: '14px 18px',
        textAlign: 'center'
      }}>
            <div style={{
          fontSize: 22,
          fontWeight: 800,
          color: s.color
        }}>{s.value}</div>
            <div style={{
          fontSize: 12,
          color: 'var(--text3)',
          marginTop: 3
        }}>{s.label}</div>
          </div>)}
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <div className="input-icon-wrap" style={{
        flex: 1,
        minWidth: 200
      }}>
          <Search size={14} className="input-icon" />
          <input className="input" placeholder="Cari nama, email, gedung..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="filter-tabs">
          {[['all', 'Semua'], ['active', 'Aktif'], ['inactive', 'Non-Aktif']].map(([v, l]) => <button key={v} className={`filter-tab ${filter === v ? 'active' : ''}`} onClick={() => setFilter(v)}>{l}</button>)}
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
              {filtered.length === 0 ? <tr><td colSpan={8}>
                  <div className="empty-state"><div className="empty-icon">👷</div><div>Tidak ada staff ditemukan</div></div>
                </td></tr> : filtered.map(s => <tr key={s.id}>
                  <td>
                    <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10
                }}>
                      <div className="avatar">{s.name[0]}</div>
                      <div>
                        <div style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: 'var(--text)'
                    }}>{s.name}</div>
                        <div style={{
                      fontSize: 11,
                      color: 'var(--text3)'
                    }}>{s.id}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{
                fontSize: 13
              }}>{s.email}</td>
                  <td style={{
                fontSize: 13
              }}>{s.phone}</td>
                  <td>
                    <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}>
                      <span style={{
                    fontSize: 13
                  }}>🏢</span>
                      <span style={{
                    fontSize: 13,
                    color: 'var(--text)',
                    fontWeight: 600
                  }}>{s.parkingName}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{
                  fontSize: 11,
                  fontWeight: 600,
                  padding: '3px 8px',
                  borderRadius: 20,
                  background: s.shifts.includes('Pagi') ? 'rgba(245,158,11,0.1)' : s.shifts.includes('Siang') ? 'rgba(59,130,246,0.1)' : 'rgba(123,97,255,0.1)',
                  color: s.shifts.includes('Pagi') ? 'var(--orange)' : s.shifts.includes('Siang') ? 'var(--blue)' : 'var(--accent2)'
                }}>
                      {s.shifts.includes('Pagi') ? '🌅' : s.shifts.includes('Siang') ? '☀️' : '🌙'} {s.shifts}
                    </span>
                  </td>
                  <td style={{
                fontSize: 12
              }}>{fmtDate(s.joinDate)}</td>
                  <td>
                    <span className={`badge ${s.status === 'active' ? 'badge-green' : 'badge-gray'}`}>
                      {s.status === 'active' ? '● Aktif' : '○ Nonaktif'}
                    </span>
                  </td>
                  <td>
                    <div style={{
                  display: 'flex',
                  gap: 4
                }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => setEditData(s)} title="Edit">
                        <Edit2 size={13} />
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={() => setChangePasswordTarget(s)} title="Ubah Password" style={{
                    color: 'var(--orange)'
                  }}>
                        <Lock size={13} />
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={() => toggleStatus(s.id)} title={s.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'} style={{
                    color: s.status === 'active' ? 'var(--text3)' : 'var(--green)'
                  }}>
                        {s.status === 'active' ? '⏸' : '▶'}
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={() => setDeleteTarget(s)} title="Hapus" style={{
                    color: 'var(--red)'
                  }}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info box: login credentials */}
      <div className="card" style={{
      marginTop: 20
    }}>
        <div className="card-header">
          <span className="card-title">🔑 Info Akun Login Staff</span>
          <span className="badge badge-orange">⚠ Rahasia</span>
        </div>
        <div className="card-body">
          <p style={{
          fontSize: 13,
          color: 'var(--text3)',
          marginBottom: 14,
          lineHeight: 1.6
        }}>
            Setiap staff dapat login di halaman login menggunakan email dan password yang terdaftar.
            Setelah login, staff hanya bisa melihat data gedung yang ditugaskan.
          </p>
          <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px,1fr))',
          gap: 10
        }}>
            {staffList.filter(s => s.status === 'active').map(s => <div key={s.id} style={{
            background: 'var(--bg-hover)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 10
          }}>
                <div className="avatar avatar-sm">{s.name[0]}</div>
                <div style={{
              flex: 1,
              minWidth: 0
            }}>
                  <div style={{
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--text)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>{s.name}</div>
                  <div style={{
                fontSize: 11,
                color: 'var(--accent)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>{s.email}</div>
                </div>
                <span style={{
              fontSize: 11,
              color: 'var(--text3)',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 6,
              padding: '2px 8px',
              whiteSpace: 'nowrap'
            }}>
                  🏢 {s.parkingName.split(' ').slice(0, 2).join(' ')}
                </span>
              </div>)}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAdd && <StaffFormModal editData={null} onClose={() => setShowAdd(false)} onSave={handleSave} />}
      {editData && <StaffFormModal editData={editData} onClose={() => setEditData(null)} onSave={handleSave} />}
      {deleteTarget && <DeleteModal staff={deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} />}
      {changePasswordTarget && <ChangeStaffPasswordModal staff={changePasswordTarget} onClose={() => setChangePasswordTarget(null)} />}
    </div>;
}