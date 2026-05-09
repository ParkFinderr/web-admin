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
export default function ParkingOccupancyRow({
  p
}) {
  const color = p.occupancy >= 90 ? 'var(--red)' : p.occupancy >= 75 ? 'var(--orange)' : 'var(--green)';
  return <div className="parking-row">
      <div className="parking-row-name">
        <div className="name">{p.shortName}</div>
        <div className="address">{p.tag}</div>
      </div>
      <div className="parking-row-bar">
        <div className="progress">
          <div className="progress-bar" style={{
          width: p.occupancy + '%',
          background: color
        }} />
        </div>
      </div>
      <div className="parking-row-pct" style={{
      color
    }}>{p.occupancy}%</div>
    </div>;
}