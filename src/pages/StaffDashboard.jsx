import CustomTooltip from "../components/pages/StaffDashboard/CustomTooltip";
import EditGedungModal from "../components/pages/StaffDashboard/EditGedungModal";
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useApp } from '../context/AppContext';
import { PARKINGS, BOOKINGS, SCAN_LOGS, SWAP_LOGS, HOURLY_SCAN_DATA } from '../data/mockData';
import { Search, Edit2, X, Save, LayoutGrid } from 'lucide-react';
import SlotManagerModal from '../components/SlotManagerModal';

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
export default function StaffDashboard() {
  const {
    user
  } = useApp();
  const [tab, setTab] = useState('scan');
  const [search, setSearch] = useState('');
  const [showEdit, setShowEdit] = useState(false);
  const [showSlots, setShowSlots] = useState(false);

  // Data gedung – bisa diupdate via edit modal
  const baseParkings = PARKINGS;
  const [localParking, setLocalParking] = useState(() => baseParkings.find(p => p.id === user?.parkingId) || baseParkings[0]);
  const parking = localParking;
  const bookings = BOOKINGS.filter(b => b.parkingName === parking.name);
  const scans = SCAN_LOGS.filter(s => s.parking === parking.name);
  const swaps = SWAP_LOGS.filter(s => s.fromParking === parking.name || s.toParking === parking.name);

  // Stats
  const available = parking.totalSlots - parking.usedSlots;
  const successScans = scans.filter(s => s.status === 'success').length;
  const failedScans = scans.filter(s => s.status === 'failed').length;
  const activeBook = bookings.filter(b => b.status === 'active').length;
  const occupancyColor = parking.occupancy >= 90 ? 'var(--red)' : parking.occupancy >= 75 ? 'var(--orange)' : 'var(--green)';

  // Search filter
  const filteredScans = scans.filter(s => s.ticketCode.toLowerCase().includes(search.toLowerCase()) || s.userName.toLowerCase().includes(search.toLowerCase()));
  const filteredBookings = bookings.filter(b => b.userName.toLowerCase().includes(search.toLowerCase()) || b.id.toLowerCase().includes(search.toLowerCase()) || b.plate.toLowerCase().includes(search.toLowerCase()));
  const filteredSwaps = swaps.filter(s => s.userName.toLowerCase().includes(search.toLowerCase()) || s.ticketOld.toLowerCase().includes(search.toLowerCase()));

  // Chart data (hourly dari mock, nanti bisa difilter per gedung)
  const chartData = HOURLY_SCAN_DATA;
  return <div>
      {/* Welcome */}
      <div style={{
      marginBottom: 24,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      flexWrap: 'wrap',
      gap: 12
    }}>
        <div>
          <h1 style={{
          fontSize: 22,
          fontWeight: 800,
          color: 'var(--text)',
          marginBottom: 4
        }}>
            👋 Halo, <span style={{
            color: 'var(--accent)'
          }}>{user?.name}</span>
          </h1>
          <p style={{
          fontSize: 14,
          color: 'var(--text2)'
        }}>
            Monitoring gedung <strong style={{
            color: 'var(--text)'
          }}>{parking.name}</strong> · Real-time
          </p>
        </div>
        <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }}>
          <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
            <div className="status-dot status-dot-green" />
            <span style={{
            fontSize: 13,
            color: 'var(--green)',
            fontWeight: 600
          }}>Sistem Online</span>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => setShowSlots(true)} style={{
          color: 'var(--accent)',
          borderColor: 'rgba(0,210,255,0.2)',
          background: 'rgba(0,210,255,0.06)'
        }}>
            <LayoutGrid size={13} /> Kelola Slot
          </button>
          <button className="btn btn-ghost btn-sm" onClick={() => setShowEdit(true)} style={{
          color: 'var(--orange)',
          borderColor: 'rgba(245,158,11,0.25)',
          background: 'rgba(245,158,11,0.06)'
        }}>
            <Edit2 size={13} /> Edit Gedung
          </button>
        </div>
      </div>

      {/* Catatan operasional – tampil jika ada */}
      {parking.catatan && <div style={{
      background: 'rgba(245,158,11,0.08)',
      border: '1px solid rgba(245,158,11,0.25)',
      borderRadius: 'var(--radius)',
      padding: '10px 16px',
      marginBottom: 18,
      fontSize: 13,
      color: 'var(--orange)',
      display: 'flex',
      gap: 8
    }}>
          <span>📋</span><span><strong>Catatan:</strong> {parking.catatan}</span>
        </div>}

      {/* ── KPI Cards ── */}
      <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px,1fr))',
      gap: 16,
      marginBottom: 24
    }}>
        {[{
        label: 'Kapasitas Total',
        value: parking.totalSlots,
        color: 'var(--text)',
        suffix: ' slot',
        icon: '🅿️'
      }, {
        label: 'Slot Terisi',
        value: parking.usedSlots,
        color: 'var(--red)',
        suffix: ' slot',
        icon: '🔴'
      }, {
        label: 'Slot Tersedia',
        value: available,
        color: 'var(--green)',
        suffix: ' slot',
        icon: '🟢'
      }, {
        label: 'Booking Aktif',
        value: activeBook,
        color: 'var(--accent)',
        suffix: '',
        icon: '📋'
      }, {
        label: 'Scan Berhasil',
        value: successScans,
        color: 'var(--green)',
        suffix: '',
        icon: '✅'
      }, {
        label: 'Scan Gagal',
        value: failedScans,
        color: failedScans > 0 ? 'var(--red)' : 'var(--text3)',
        suffix: '',
        icon: '❌'
      }].map((k, i) => <div key={i} className="stat-card" style={{
        padding: '18px 20px'
      }}>
            <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 10
        }}>
              <span style={{
            fontSize: 20
          }}>{k.icon}</span>
            </div>
            <div style={{
          fontSize: 28,
          fontWeight: 800,
          color: k.color,
          lineHeight: 1
        }}>
              {k.value}<span style={{
            fontSize: 14
          }}>{k.suffix}</span>
            </div>
            <div style={{
          fontSize: 13,
          color: 'var(--text2)',
          marginTop: 6
        }}>{k.label}</div>
          </div>)}
      </div>

      {/* ── Occupancy Bar + Chart ── */}
      <div className="section-grid section-grid-2" style={{
      marginBottom: 20
    }}>
        {/* Occupancy Detail */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">🏢 Status Occupancy Real-time</span>
            <span className="badge badge-accent">Live</span>
          </div>
          <div className="card-body">
            {/* Big gauge */}
            <div style={{
            textAlign: 'center',
            padding: '10px 0 20px'
          }}>
              <div style={{
              fontSize: 60,
              fontWeight: 900,
              color: occupancyColor,
              lineHeight: 1
            }}>
                {parking.occupancy}%
              </div>
              <div style={{
              fontSize: 13,
              color: 'var(--text3)',
              marginTop: 4
            }}>Tingkat Penggunaan</div>
              <div style={{
              marginTop: 16,
              maxWidth: 320,
              margin: '16px auto 0'
            }}>
                <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 12,
                color: 'var(--text3)',
                marginBottom: 6
              }}>
                  <span>0%</span><span>50%</span><span>100%</span>
                </div>
                <div className="progress" style={{
                height: 14,
                borderRadius: 99
              }}>
                  <div className="progress-bar" style={{
                  width: parking.occupancy + '%',
                  background: occupancyColor,
                  borderRadius: 99,
                  transition: 'width .8s ease'
                }} />
                </div>
              </div>
            </div>

            {/* Slot breakdown */}
            <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 10,
            marginTop: 8
          }}>
              {[{
              label: 'Total Slot',
              value: parking.totalSlots,
              color: 'var(--text)',
              bg: 'var(--bg-hover)'
            }, {
              label: 'Terisi',
              value: parking.usedSlots,
              color: 'var(--red)',
              bg: 'rgba(239,68,68,0.08)'
            }, {
              label: 'Tersedia',
              value: available,
              color: 'var(--green)',
              bg: 'rgba(34,197,94,0.08)'
            }, {
              label: 'Lantai Aktif',
              value: parking.floors?.length || 0,
              color: 'var(--accent)',
              bg: 'var(--accent-glow)'
            }].map((s, i) => <div key={i} style={{
              background: s.bg,
              border: '1px solid var(--border)',
              borderRadius: 12,
              padding: '12px 16px',
              textAlign: 'center'
            }}>
                  <div style={{
                fontSize: 24,
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

            {/* Lantai */}
            {parking.floors?.length > 0 && <div style={{
            marginTop: 16,
            paddingTop: 14,
            borderTop: '1px solid var(--border)'
          }}>
                <div style={{
              fontSize: 12,
              fontWeight: 700,
              color: 'var(--text2)',
              marginBottom: 8
            }}>Lantai Tersedia:</div>
                <div style={{
              display: 'flex',
              gap: 6,
              flexWrap: 'wrap'
            }}>
                  {parking.floors.map(f => <span key={f} style={{
                fontSize: 12,
                background: 'var(--bg-hover)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: '4px 10px',
                color: 'var(--text3)',
                fontWeight: 600
              }}>{f}</span>)}
                </div>
              </div>}
          </div>
        </div>

        {/* Hourly Scan Chart */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">📊 Aktivitas Scan per Jam</span>
            <div style={{
            display: 'flex',
            gap: 12,
            fontSize: 12
          }}>
              <span style={{
              color: 'var(--accent)'
            }}>● Masuk</span>
              <span style={{
              color: 'var(--orange)'
            }}>● Keluar</span>
            </div>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData} barGap={2}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                <XAxis dataKey="hour" tick={{
                fill: 'var(--text3)',
                fontSize: 10
              }} axisLine={false} tickLine={false} />
                <YAxis tick={{
                fill: 'var(--text3)',
                fontSize: 11
              }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="masuk" name="Masuk" fill="var(--accent)" radius={[3, 3, 0, 0]} maxBarSize={16} />
                <Bar dataKey="keluar" name="Keluar" fill="var(--orange)" radius={[3, 3, 0, 0]} maxBarSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Log Section ── */}
      <div className="card">
        <div className="card-header">
          <div style={{
          display: 'flex',
          gap: 0,
          background: 'var(--bg-base)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          overflow: 'hidden'
        }}>
            {[['scan', '📡 Log Scan QR'], ['booking', '📋 Booking'], ['swap', '🔄 Tukar Slot']].map(([t, l]) => <button key={t} onClick={() => {
            setTab(t);
            setSearch('');
          }} className={`filter-tab ${tab === t ? 'active' : ''}`}>
                {l}
              </button>)}
          </div>
          <div style={{
          display: 'flex',
          gap: 8,
          alignItems: 'center'
        }}>
            <div className="input-icon-wrap" style={{
            minWidth: 200
          }}>
              <Search size={13} className="input-icon" />
              <input className="input" placeholder="Cari..." value={search} onChange={e => setSearch(e.target.value)} style={{
              paddingLeft: 34,
              fontSize: 13
            }} />
            </div>
          </div>
        </div>

        {/* Live indicator */}
        <div style={{
        padding: '10px 20px',
        background: 'rgba(34,197,94,0.04)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 12,
        color: 'var(--green)'
      }}>
          <span className="status-dot status-dot-green" />
          Monitoring aktif · {tab === 'scan' ? filteredScans.length : tab === 'booking' ? filteredBookings.length : filteredSwaps.length} data ditemukan untuk gedung ini
        </div>

        {/* ── Scan Tab ── */}
        {tab === 'scan' && <div className="table-wrap">
            <table className="data-table">
              <thead><tr>
                <th>Kode Tiket</th><th>Pengguna</th><th>Plat</th>
                <th>Aksi</th><th>Waktu Scan</th><th>Status</th>
              </tr></thead>
              <tbody>
                {filteredScans.length === 0 ? <tr><td colSpan={6}><div className="empty-state"><div className="empty-icon">📡</div><div>Belum ada aktivitas scan</div></div></td></tr> : filteredScans.map(s => <tr key={s.id}>
                    <td><span className="ticket-code">{s.ticketCode}</span></td>
                    <td>
                      {s.userName !== '—' ? <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}>
                            <div className="avatar avatar-sm">{s.userName[0]}</div>
                            <span style={{
                    fontSize: 13,
                    color: 'var(--text)'
                  }}>{s.userName}</span>
                          </div> : <span style={{
                  fontSize: 13,
                  color: 'var(--red)'
                }}>⚠ Tidak dikenal</span>}
                    </td>
                    <td><span style={{
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  fontSize: 13
                }}>{s.plate}</span></td>
                    <td><span className={`badge ${s.action === 'masuk' ? 'badge-accent' : 'badge-orange'}`}>{s.action === 'masuk' ? '⬆ Masuk' : '⬇ Keluar'}</span></td>
                    <td style={{
                fontSize: 12
              }}>{fmtTime(s.scanTime)}</td>
                    <td><span className={`badge ${s.status === 'success' ? 'badge-green' : 'badge-red'}`}>{s.status === 'success' ? '✓ Berhasil' : '✕ Gagal'}</span></td>
                  </tr>)}
              </tbody>
            </table>
          </div>}

        {/* ── Booking Tab ── */}
        {tab === 'booking' && <div className="table-wrap">
            <table className="data-table">
              <thead><tr>
                <th>Kode Tiket</th><th>Pengguna</th><th>Plat</th>
                <th>Lantai / Slot</th><th>Durasi</th><th>Status</th>
              </tr></thead>
              <tbody>
                {filteredBookings.length === 0 ? <tr><td colSpan={6}><div className="empty-state"><div className="empty-icon">📋</div><div>Belum ada booking untuk gedung ini</div></div></td></tr> : filteredBookings.map(b => <tr key={b.id}>
                    <td><span className="ticket-code">{b.id}</span></td>
                    <td>
                      <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}>
                        <div className="avatar avatar-sm">{b.userName[0]}</div>
                        <div>
                          <div style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: 'var(--text)'
                    }}>{b.userName}</div>
                          <div style={{
                      fontSize: 11,
                      color: 'var(--text3)'
                    }}>{b.userPhone}</div>
                        </div>
                      </div>
                    </td>
                    <td><span style={{
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  fontSize: 13
                }}>{b.plate}</span></td>
                    <td style={{
                fontSize: 13
              }}>{b.floor} / {b.slot}</td>
                    <td><span style={{
                  fontSize: 13,
                  color: 'var(--accent)',
                  fontWeight: 700
                }}>{b.duration || '—'}</span></td>
                    <td>
                      <span className={`badge ${b.status === 'active' ? 'badge-green' : b.status === 'completed' ? 'badge-gray' : b.status === 'swapped' ? 'badge-accent' : 'badge-orange'}`}>
                        {b.status === 'active' ? '● Aktif' : b.status === 'completed' ? '✓ Selesai' : b.status === 'swapped' ? '⇄ Ditukar' : b.status}
                      </span>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>}

        {/* ── Swap Tab ── */}
        {tab === 'swap' && <div className="table-wrap">
            <table className="data-table">
              <thead><tr>
                <th>ID</th><th>Pengguna</th><th>Dari</th><th>Ke</th><th>Waktu</th><th>Status</th>
              </tr></thead>
              <tbody>
                {filteredSwaps.length === 0 ? <tr><td colSpan={6}><div className="empty-state"><div className="empty-icon">🔄</div><div>Belum ada tukar slot untuk gedung ini</div></div></td></tr> : filteredSwaps.map(s => <tr key={s.id}>
                    <td style={{
                fontSize: 12,
                fontFamily: 'monospace',
                color: 'var(--text3)'
              }}>{s.id}</td>
                    <td>
                      <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}>
                        <div className="avatar avatar-sm">{s.userName[0]}</div>
                        <div>
                          <div style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: 'var(--text)'
                    }}>{s.userName}</div>
                          <div style={{
                      fontSize: 11,
                      fontFamily: 'monospace',
                      color: 'var(--text3)'
                    }}>{s.plate}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{
                  fontSize: 13,
                  color: 'var(--text)'
                }}>{s.fromParking}</div>
                      <div style={{
                  fontSize: 11,
                  color: 'var(--text3)'
                }}>{s.fromSlot}</div>
                    </td>
                    <td>
                      <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5
                }}>
                        <span style={{
                    color: 'var(--accent)',
                    fontWeight: 700
                  }}>→</span>
                        <div>
                          <div style={{
                      fontSize: 13,
                      color: 'var(--text)'
                    }}>{s.toParking}</div>
                          <div style={{
                      fontSize: 11,
                      color: 'var(--text3)'
                    }}>{s.toSlot}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{
                fontSize: 12
              }}>{fmtTime(s.swapTime)}</td>
                    <td>
                      <span className={`badge ${s.status === 'success' ? 'badge-green' : s.status === 'failed' ? 'badge-red' : 'badge-orange'}`}>
                        {s.status === 'success' ? '✓ Berhasil' : s.status === 'failed' ? '✕ Gagal' : '⏳ Pending'}
                      </span>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>}
      </div>

      {/* Edit Modal */}
      {showEdit && <EditGedungModal parking={parking} onClose={() => setShowEdit(false)} onSave={updated => {
      setLocalParking(updated);
      setShowEdit(false);
    }} />}
      {showSlots && <SlotManagerModal parking={parking} readonly={true} onClose={() => setShowSlots(false)} onSave={data => {
      setLocalParking(prev => ({
        ...prev,
        slotStatus: data.slotStatus
      }));
      setShowSlots(false);
    }} />}
    </div>;
}