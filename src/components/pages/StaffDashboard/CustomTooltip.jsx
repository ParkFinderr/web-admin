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
const CustomTooltip = ({
  active,
  payload,
  label
}) => {
  if (!active || !payload?.length) return null;
  return <div style={{
    background: 'var(--bg-card2)',
    border: '1px solid var(--border2)',
    borderRadius: 10,
    padding: '10px 14px',
    fontSize: 13
  }}>
      <div style={{
      color: 'var(--text3)',
      marginBottom: 6,
      fontWeight: 600
    }}>{label}</div>
      {payload.map((p, i) => <div key={i} style={{
      color: p.color,
      fontWeight: 700
    }}>{p.name}: {p.value}</div>)}
    </div>;
};
export default CustomTooltip;
