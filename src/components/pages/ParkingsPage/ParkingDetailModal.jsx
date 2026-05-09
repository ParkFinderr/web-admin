import OccupancyBar from "./OccupancyBar";
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
export default /* ── Modal Detail Gedung ──────────────────────────────────────────────── */
function ParkingDetailModal({
  parking,
  onClose
}) {
  if (!parking) return null;
  const [floor, setFloor] = useState(parking.floors[0]);
  const SLOT_NAMES = ['A01', 'A02', 'A03', 'A04', 'A05', 'A06', 'B01', 'B02', 'B03', 'B04', 'B05', 'B06'];
  const available = Array.from({
    length: 12
  }, () => Math.random() > 0.4);
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
      maxWidth: 600,
      maxHeight: '90vh',
      overflow: 'auto'
    }} onClick={e => e.stopPropagation()}>
        <div style={{
        padding: '20px 24px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
      }}>
          <div>
            <h3 style={{
            fontSize: 18,
            fontWeight: 800,
            color: 'var(--text)',
            marginBottom: 4
          }}>{parking.name}</h3>
            <p style={{
            fontSize: 13,
            color: 'var(--text3)'
          }}>📍 {parking.address}</p>
          </div>
          <button onClick={onClose} style={{
          background: 'none',
          border: 'none',
          color: 'var(--text3)',
          cursor: 'pointer',
          fontSize: 20,
          lineHeight: 1
        }}>✕</button>
        </div>

        <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3,1fr)',
        gap: 1,
        background: 'var(--border)'
      }}>
          {[{
          label: 'Total Slot',
          value: parking.totalSlots,
          color: 'var(--text)'
        }, {
          label: 'Terpakai',
          value: parking.usedSlots,
          color: 'var(--red)'
        }, {
          label: 'Kosong',
          value: parking.totalSlots - parking.usedSlots,
          color: 'var(--green)'
        }].map((s, i) => <div key={i} style={{
          background: 'var(--bg-card)',
          padding: '16px 20px',
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
            marginTop: 2
          }}>{s.label}</div>
            </div>)}
        </div>

        <div style={{
        padding: '20px 24px'
      }}>
          <OccupancyBar pct={parking.occupancy} />
          <div style={{
          marginTop: 20,
          marginBottom: 12
        }}>
            <div style={{
            fontSize: 13,
            fontWeight: 700,
            color: 'var(--text)',
            marginBottom: 10
          }}>Pilih Lantai:</div>
            <div style={{
            display: 'flex',
            gap: 8
          }}>
              {parking.floors.map(f => <button key={f} className={`btn btn-sm ${f === floor ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFloor(f)}>{f}</button>)}
            </div>
          </div>
          <div style={{
          fontSize: 12,
          fontWeight: 700,
          color: 'var(--text2)',
          marginBottom: 8
        }}>Denah Slot – {floor}</div>
          <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6,1fr)',
          gap: 6,
          marginBottom: 16
        }}>
            {SLOT_NAMES.map((slot, i) => <div key={slot} style={{
            padding: '8px 4px',
            borderRadius: 8,
            textAlign: 'center',
            fontSize: 11,
            fontWeight: 700,
            background: available[i] ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
            color: available[i] ? 'var(--green)' : 'var(--red)',
            border: `1px solid ${available[i] ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`
          }}>
                {floor}-{slot}
              </div>)}
          </div>
        </div>
        {/* Map embed */}
        {parking.googleMapsUrl && getEmbedUrl(parking.googleMapsUrl) ? <div style={{
        borderTop: '1px solid var(--border)'
      }}>
            <div style={{
          padding: '14px 24px 10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
              <span style={{
            fontSize: 13,
            fontWeight: 700,
            color: 'var(--text2)'
          }}>📍 Lokasi di Google Maps</span>
              <a href={parking.googleMapsUrl} target="_blank" rel="noreferrer" style={{
            fontSize: 12,
            color: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            textDecoration: 'none'
          }}>
                <ExternalLink size={12} /> Buka di Maps
              </a>
            </div>
            <iframe src={getEmbedUrl(parking.googleMapsUrl)} width="100%" height="220" style={{
          border: 'none',
          display: 'block'
        }} title={`Peta ${parking.name}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div> : <div style={{
        padding: '16px 24px',
        borderTop: '1px solid var(--border)',
        fontSize: 13,
        color: 'var(--text3)',
        textAlign: 'center'
      }}>
            📍 Belum ada link Google Maps
          </div>}
      </div>
    </div>;
}

/* ── Modal Tambah Gedung ──────────────────────────────────────────────── */