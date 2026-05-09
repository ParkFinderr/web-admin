import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BOOKING_CHART_DATA, HOURLY_SCAN_DATA, OCCUPANCY_DATA, PLATFORM_DATA, PARKINGS } from '../../../data/mockData';
const MONTHLY_DATA = [{
  name: 'Jan',
  bookings: 4200,
  users: 3100,
  scans: 3800
}, {
  name: 'Feb',
  bookings: 4800,
  users: 3600,
  scans: 4400
}, {
  name: 'Mar',
  bookings: 5200,
  users: 4100,
  scans: 4900
}, {
  name: 'Apr',
  bookings: 6800,
  users: 5200,
  scans: 6300
}, {
  name: 'Mei',
  bookings: 7900,
  users: 6400,
  scans: 7400
}];
const SUCCESS_RATE_DATA = [{
  name: 'Sen',
  berhasil: 97,
  gagal: 3
}, {
  name: 'Sel',
  berhasil: 98,
  gagal: 2
}, {
  name: 'Rab',
  berhasil: 96,
  gagal: 4
}, {
  name: 'Kam',
  berhasil: 99,
  gagal: 1
}, {
  name: 'Jum',
  berhasil: 98,
  gagal: 2
}, {
  name: 'Sab',
  berhasil: 97,
  gagal: 3
}, {
  name: 'Min',
  berhasil: 99,
  gagal: 1
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
    }}>{p.name}: {p.value}</div>)}
    </div>;
};
export default CustomTooltip;
