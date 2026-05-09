import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Users, CalendarCheck, Car, QrCode, ArrowLeftRight, TrendingUp, Activity, CheckCircle, XCircle, Clock, Zap } from 'lucide-react';
import { STATS_OVERVIEW, PARKINGS, BOOKINGS, BOOKING_CHART_DATA, OCCUPANCY_DATA, HOURLY_SCAN_DATA, PLATFORM_DATA, SCAN_LOGS } from '../../../data/mockData';
const fmtNumber = n => n >= 1000000 ? (n / 1000000).toFixed(1) + 'Jt' : n >= 1000 ? (n / 1000).toFixed(1) + 'K' : n;
const STATS = [{
  label: 'Total Pengguna',
  value: STATS_OVERVIEW.totalUsers,
  icon: Users,
  color: 'var(--accent)',
  bg: 'rgba(0,210,255,0.1)',
  fmt: fmtNumber,
  change: '+12.4%',
  up: true
}, {
  label: 'Booking Aktif',
  value: STATS_OVERVIEW.activeBookings,
  icon: CalendarCheck,
  color: 'var(--green)',
  bg: 'rgba(34,197,94,0.1)',
  fmt: fmtNumber,
  change: '+5.2%',
  up: true
}, {
  label: 'Total Gedung',
  value: STATS_OVERVIEW.totalParkings,
  icon: Car,
  color: 'var(--accent2)',
  bg: 'rgba(123,97,255,0.1)',
  fmt: n => n,
  change: '0%',
  up: null
}, {
  label: 'Booking Hari Ini',
  value: STATS_OVERVIEW.todayBookings,
  icon: TrendingUp,
  color: 'var(--blue)',
  bg: 'rgba(59,130,246,0.1)',
  fmt: fmtNumber,
  change: '+3.1%',
  up: true
}, {
  label: 'Tingkat Keberhasilan',
  value: STATS_OVERVIEW.successRate,
  icon: CheckCircle,
  color: 'var(--green)',
  bg: 'rgba(34,197,94,0.1)',
  fmt: n => n + '%',
  change: '+0.3%',
  up: true
}, {
  label: 'Tukar Slot Hari Ini',
  value: STATS_OVERVIEW.swapRequests,
  icon: ArrowLeftRight,
  color: 'var(--accent2)',
  bg: 'rgba(123,97,255,0.1)',
  fmt: fmtNumber,
  change: '+18%',
  up: true
}, {
  label: 'Scan Aktif',
  value: STATS_OVERVIEW.activeScans,
  icon: QrCode,
  color: 'var(--accent)',
  bg: 'rgba(0,210,255,0.1)',
  fmt: fmtNumber,
  change: '+2.4%',
  up: true
}];
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
    }}>
          {p.name}: {p.value}
        </div>)}
    </div>;
};
export default CustomTooltip;
