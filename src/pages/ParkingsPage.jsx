import { Edit2, ExternalLink, LayoutGrid, Map, MapPin, Plus, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import AddParkingModal from "../components/pages/ParkingsPage/AddParkingModal";
import EditParkingModal from "../components/pages/ParkingsPage/EditParkingModal";
import OccupancyBar from "../components/pages/ParkingsPage/OccupancyBar";
import ParkingDetailModal from "../components/pages/ParkingsPage/ParkingDetailModal";
import SlotManagerModal from '../components/SlotManagerModal';
import * as dataService from '../services/dataService';
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
/* ── Main Page ────────────────────────────────────────────────────────── */
export default function ParkingsPage() {
  const [parkings, setParkings] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [slotTarget, setSlotTarget] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadParkings = async () => {
      try {
        const data = await dataService.getParkings(false);
        setParkings(data);
        setLoading(false);
      } catch (error) {
        console.error('Error loading parkings:', error);
        setLoading(false);
      }
    };
    loadParkings();
  }, []);

  const handleAdd = newParking => setParkings(prev => [...prev, newParking]);
  const handleEdit = updated => {
    setParkings(prev => prev.map(p => p.id === updated.id ? updated : p));
    setEditTarget(null);
  };
  const filtered = parkings.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || filter === 'tersedia' && p.occupancy < 75 || filter === 'ramai' && p.occupancy >= 75 && p.occupancy < 90 || filter === 'penuh' && p.occupancy >= 90;
    return matchSearch && matchFilter;
  });
  return <div>
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
      <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(155px,1fr))',
      gap: 14,
      marginBottom: 20
    }}>
        {[{
        label: 'Total Gedung',
        value: parkings.length,
        color: 'var(--accent)'
      }, {
        label: 'Tersedia',
        value: parkings.filter(p => p.occupancy < 75).length,
        color: 'var(--green)'
      }, {
        label: 'Ramai',
        value: parkings.filter(p => p.occupancy >= 75 && p.occupancy < 90).length,
        color: 'var(--orange)'
      }, {
        label: 'Penuh',
        value: parkings.filter(p => p.occupancy >= 90).length,
        color: 'var(--red)'
      }, {
        label: 'Total Slot',
        value: parkings.reduce((s, p) => s + p.totalSlots, 0),
        color: 'var(--text)'
      }].map((s, i) => <div key={i} className="card" style={{
        padding: '16px 20px',
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
          marginTop: 4
        }}>{s.label}</div>
          </div>)}
      </div>

      {/* Filter & Search */}
      <div className="filter-bar">
        <div className="input-icon-wrap" style={{
        flex: 1,
        minWidth: 200
      }}>
          <Search size={14} className="input-icon" />
          <input className="input" placeholder="Cari nama gedung..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="filter-tabs">
          {[['all', 'Semua'], ['tersedia', 'Tersedia'], ['ramai', 'Ramai'], ['penuh', 'Penuh']].map(([v, l]) => <button key={v} className={`filter-tab ${filter === v ? 'active' : ''}`} onClick={() => setFilter(v)}>{l}</button>)}
        </div>
      </div>

      {/* Parking Cards */}
      <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px,1fr))',
      gap: 16
    }}>
        {filtered.map((p, i) => <div key={p.id} className="card animate-fade-up" style={{
        animationDelay: `${i * 0.06}s`
      }}>
            <div style={{
          padding: '18px 20px'
        }}>
              <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 14
          }}>
                <div style={{
              flex: 1,
              minWidth: 0,
              paddingRight: 10
            }}>
                  <div style={{
                fontSize: 15,
                fontWeight: 700,
                color: 'var(--text)',
                marginBottom: 3
              }}>{p.name}</div>
                  <div style={{
                fontSize: 12,
                color: 'var(--text3)',
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}>
                    <MapPin size={11} /> {p.address}
                  </div>
                </div>
                <span className={`badge ${p.tag === 'Tersedia' ? 'badge-green' : p.tag === 'Ramai' ? 'badge-orange' : 'badge-red'}`}>
                  {p.tag}
                </span>
              </div>

              <OccupancyBar pct={p.occupancy} />

              {/* Stats row */}
              <div style={{
            display: 'flex',
            gap: 16,
            marginTop: 14,
            paddingTop: 14,
            borderTop: '1px solid var(--border)'
          }}>
                {[['Total Slot', p.totalSlots, 'var(--text)'], ['Terisi', p.usedSlots, 'var(--red)'], ['Kosong', p.totalSlots - p.usedSlots, 'var(--green)']].map(([l, v, c]) => <div key={l}>
                    <div style={{
                fontSize: 11,
                color: 'var(--text3)'
              }}>{l}</div>
                    <div style={{
                fontSize: 15,
                fontWeight: 700,
                color: c
              }}>{v}</div>
                  </div>)}
              </div>

              {/* Action buttons row — full width, 3 columns */}
              <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 6,
            marginTop: 10
          }}>
                <button className="btn btn-ghost btn-sm" onClick={() => setSelected(p)} style={{
              justifyContent: 'center'
            }}>
                  Detail →
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => setSlotTarget(p)} style={{
              color: 'var(--accent)',
              borderColor: 'rgba(0,210,255,0.2)',
              background: 'rgba(0,210,255,0.06)',
              justifyContent: 'center'
            }}>
                  <LayoutGrid size={13} /> Slot
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => setEditTarget(p)} style={{
              color: 'var(--orange)',
              borderColor: 'rgba(245,158,11,0.2)',
              background: 'rgba(245,158,11,0.06)',
              justifyContent: 'center'
            }}>
                  <Edit2 size={13} /> Edit
                </button>
              </div>

              {/* Floor tags */}
              <div style={{
            marginTop: 8,
            display: 'flex',
            gap: 6,
            flexWrap: 'wrap'
          }}>
                {p.floors.map(f => <span key={f} style={{
              fontSize: 11,
              background: 'var(--bg-hover)',
              border: '1px solid var(--border)',
              borderRadius: 6,
              padding: '2px 8px',
              color: 'var(--text3)'
            }}>
                    {f}
                  </span>)}
              </div>
            </div>
          </div>)}
      </div>

      {/* Map ─ Real Google Maps Embeds */}
      <div className="card" style={{
      marginTop: 20
    }}>
        <div className="card-header">
          <span className="card-title">🗺️ Peta Lokasi Gedung Parkir</span>
          <span className="badge badge-accent">Bandar Lampung</span>
        </div>
        <div className="card-body">
          <p style={{
          fontSize: 13,
          color: 'var(--text3)',
          marginBottom: 16
        }}>
            Klik <strong style={{
            color: 'var(--accent)'
          }}>Edit</strong> pada kartu gedung untuk mengubah link Google Maps.
            Data peta diambil langsung dari koordinat yang diberikan admin.
          </p>
          <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))',
          gap: 16
        }}>
            {parkings.map(p => {
            const embedUrl = getEmbedUrl(p.googleMapsUrl);
            const occColor = p.occupancy >= 90 ? 'var(--red)' : p.occupancy >= 75 ? 'var(--orange)' : 'var(--green)';
            return <div key={p.id} style={{
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              overflow: 'hidden'
            }}>
                  {/* Mini header */}
                  <div style={{
                padding: '10px 14px',
                background: 'var(--bg-hover)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                    <div>
                      <div style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: 'var(--text)'
                  }}>{p.name}</div>
                      <div style={{
                    fontSize: 11,
                    color: 'var(--text3)',
                    marginTop: 1
                  }}>{p.address}</div>
                    </div>
                    <span className={`badge badge-${p.tagClass}`}>{p.tag}</span>
                  </div>
                  {/* Map or placeholder */}
                  {embedUrl ? <>
                      <iframe src={embedUrl} width="100%" height="180" style={{
                  border: 'none',
                  display: 'block'
                }} title={`Peta ${p.name}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                      <div style={{
                  padding: '8px 14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'var(--bg-card)'
                }}>
                        <span style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: occColor
                  }}>{p.occupancy}% Terisi</span>
                        <a href={p.googleMapsUrl} target="_blank" rel="noreferrer" style={{
                    fontSize: 11,
                    color: 'var(--accent)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                    textDecoration: 'none'
                  }}>
                          <ExternalLink size={11} /> Buka Maps
                        </a>
                      </div>
                    </> : <div style={{
                height: 180,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--bg-base)',
                gap: 8
              }}>
                      <Map size={28} color="var(--text3)" />
                      <div style={{
                  fontSize: 12,
                  color: 'var(--text3)'
                }}>Belum ada link Google Maps</div>
                      <button className="btn btn-ghost btn-sm" onClick={() => setEditTarget(p)} style={{
                  fontSize: 11
                }}>
                        + Tambah Link Maps
                      </button>
                    </div>}
                </div>;
          })}
          </div>
        </div>
      </div>

      {/* Modals */}
      {selected && <ParkingDetailModal parking={selected} onClose={() => setSelected(null)} />}
      {showAdd && <AddParkingModal onClose={() => setShowAdd(false)} onAdd={handleAdd} />}
      {editTarget && <EditParkingModal parking={editTarget} onClose={() => setEditTarget(null)} onSave={handleEdit} />}
      {slotTarget && <SlotManagerModal parking={slotTarget} onClose={() => setSlotTarget(null)} onSave={() => {}} />}
    </div>;
}