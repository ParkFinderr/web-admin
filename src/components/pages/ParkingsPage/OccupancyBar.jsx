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
export default function OccupancyBar({
  pct
}) {
  const color = pct >= 90 ? 'var(--red)' : pct >= 75 ? 'var(--orange)' : 'var(--green)';
  return <div>
      <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4
    }}>
        <span style={{
        fontSize: 12,
        color: 'var(--text3)'
      }}>Okupansi</span>
        <span style={{
        fontSize: 14,
        fontWeight: 800,
        color
      }}>{pct}%</span>
      </div>
      <div className="progress">
        <div className="progress-bar" style={{
        width: pct + '%',
        background: color
      }} />
      </div>
    </div>;
}

/* ── Modal Detail Gedung ──────────────────────────────────────────────── */