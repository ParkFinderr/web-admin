import { ArrowLeftRight, CalendarCheck, Car, CheckCircle, QrCode, TrendingUp, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import CustomTooltip from "../components/pages/Dashboard/CustomTooltip";
import ParkingOccupancyRow from "../components/pages/Dashboard/ParkingOccupancyRow";
import * as dataService from '../services/dataService';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [parkings, setParkings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [scans, setScans] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [occupancyData, setOccupancyData] = useState([]);
  const [platformData, setPlatformData] = useState([]);
  const [scanHourlyData, setScanHourlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [
          statsData,
          parkingsData,
          bookingsData,
          scansData,
          chartDataRes,
          occupancyDataRes,
          platformDataRes,
          scanHourlyDataRes
        ] = await Promise.all([
          dataService.getDashboardStats(false),
          dataService.getParkings(false),
          dataService.getBookings(),
          dataService.getScans(),
          dataService.getBookingStats(7, false),
          dataService.getOccupancyData(false),
          dataService.getPlatformData(false),
          dataService.getScanStats(false)
        ]);

        setStats(statsData);
        setParkings(parkingsData);
        setBookings(bookingsData);
        setScans(scansData);
        setChartData(chartDataRes);
        setOccupancyData(occupancyDataRes);
        setPlatformData(platformDataRes);
        setScanHourlyData(scanHourlyDataRes);
        setLoading(false);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Use mock data as fallback if state is empty
  const safeStats = stats || {
    totalUsers: 52847,
    activeBookings: 1243,
    totalParkings: 6,
    todayBookings: 347,
    successRate: 98.7,
    swapRequests: 89,
    activeScans: 214,
  };
  const safeBookings = bookings.length > 0 ? bookings : [];
  const safeScans = scans.length > 0 ? scans : [];
  const safeChartData = chartData.length > 0 ? chartData : [];
  const safeOccupancy = occupancyData.length > 0 ? occupancyData : [];
  const safePlatform = platformData.length > 0 ? platformData : [];
  const safeScanHourly = scanHourlyData.length > 0 ? scanHourlyData : [];
  const safeParkings = parkings.length > 0 ? parkings : [];

  const STATS_CONFIG = [{
    label: 'Total Pengguna',
    value: safeStats.totalUsers,
    icon: Users,
    color: 'var(--accent)',
    bg: 'rgba(0,210,255,0.1)',
    fmt: n => n >= 1000000 ? (n / 1000000).toFixed(1) + 'Jt' : n >= 1000 ? (n / 1000).toFixed(1) + 'K' : n,
    change: '+12.4%',
    up: true
  }, {
    label: 'Booking Aktif',
    value: safeStats.activeBookings,
    icon: CalendarCheck,
    color: 'var(--green)',
    bg: 'rgba(34,197,94,0.1)',
    fmt: n => n >= 1000000 ? (n / 1000000).toFixed(1) + 'Jt' : n >= 1000 ? (n / 1000).toFixed(1) + 'K' : n,
    change: '+5.2%',
    up: true
  }, {
    label: 'Total Gedung',
    value: safeStats.totalParkings,
    icon: Car,
    color: 'var(--accent2)',
    bg: 'rgba(123,97,255,0.1)',
    fmt: n => n,
    change: '0%',
    up: null
  }, {
    label: 'Booking Hari Ini',
    value: safeStats.todayBookings,
    icon: TrendingUp,
    color: 'var(--blue)',
    bg: 'rgba(59,130,246,0.1)',
    fmt: n => n >= 1000000 ? (n / 1000000).toFixed(1) + 'Jt' : n >= 1000 ? (n / 1000).toFixed(1) + 'K' : n,
    change: '+3.1%',
    up: true
  }, {
    label: 'Tingkat Keberhasilan',
    value: safeStats.successRate,
    icon: CheckCircle,
    color: 'var(--green)',
    bg: 'rgba(34,197,94,0.1)',
    fmt: n => n + '%',
    change: '+0.3%',
    up: true
  }, {
    label: 'Tukar Slot Hari Ini',
    value: safeStats.swapRequests,
    icon: ArrowLeftRight,
    color: 'var(--accent2)',
    bg: 'rgba(123,97,255,0.1)',
    fmt: n => n >= 1000000 ? (n / 1000000).toFixed(1) + 'Jt' : n >= 1000 ? (n / 1000).toFixed(1) + 'K' : n,
    change: '+18%',
    up: true
  }, {
    label: 'Scan Aktif',
    value: safeStats.activeScans,
    icon: QrCode,
    color: 'var(--accent)',
    bg: 'rgba(0,210,255,0.1)',
    fmt: n => n >= 1000000 ? (n / 1000000).toFixed(1) + 'Jt' : n >= 1000 ? (n / 1000).toFixed(1) + 'K' : n,
    change: '+2.4%',
    up: true
  }];

  const recentBookings = safeBookings.slice(0, 5);
  const recentScans = safeScans.slice(0, 5);
  return <div>
      {/* ── Stats Grid ── */}
      <div className="stat-grid animate-fade-up">
        {STATS_CONFIG.map((s, i) => {
        const Icon = s.icon;
        return <div key={i} className="stat-card" style={{
          animationDelay: `${i * 0.04}s`
        }}>
              <div className="stat-card-icon" style={{
            background: s.bg
          }}>
                <Icon size={20} color={s.color} />
              </div>
              <div className="stat-card-value" style={{
            color: s.color
          }}>
                {s.fmt(s.value)}
              </div>
              <div className="stat-card-label">{s.label}</div>
              {s.change && <div className={`stat-card-change ${s.up ? 'change-up' : s.up === false ? 'change-down' : ''}`}>
                  {s.up === true ? '↑' : s.up === false ? '↓' : '·'} {s.change} dari kemarin
                </div>}
            </div>;
      })}
      </div>

      {/* ── Charts Row 1 ── */}
      <div className="section-grid section-grid-2-1 delay-1 animate-fade-up" style={{
      marginBottom: 20
    }}>
        {/* Booking trend */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">📊 Tren Booking 7 Hari Terakhir</span>
            <div style={{
            display: 'flex',
            gap: 14,
            fontSize: 12
          }}>
              <span style={{
              color: 'var(--accent)'
            }}>● Booking</span>
              <span style={{
              color: 'var(--green)'
            }}>● Scan</span>
              <span style={{
              color: 'var(--accent2)'
            }}>● Swap</span>
            </div>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={safeChartData}>
                <defs>
                  <linearGradient id="bookGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="scanGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--green)" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="var(--green)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{
                fill: 'var(--text3)',
                fontSize: 12
              }} axisLine={false} tickLine={false} />
                <YAxis tick={{
                fill: 'var(--text3)',
                fontSize: 12
              }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="bookings" name="Booking" stroke="var(--accent)" strokeWidth={2.5} fill="url(#bookGrad)" />
                <Area type="monotone" dataKey="scans" name="Scan" stroke="var(--green)" strokeWidth={2} fill="url(#scanGrad)" />
                <Line type="monotone" dataKey="swaps" name="Swap" stroke="var(--accent2)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Platform breakdown */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">📱 Platform Pengguna</span>
          </div>
          <div className="card-body" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 20
        }}>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={safePlatform} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                  {safePlatform.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            width: '100%'
          }}>
              {safePlatform.map((p, i) => <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
                  <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}>
                    <div style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: p.color
                }} />
                    <span style={{
                  fontSize: 13,
                  color: 'var(--text2)'
                }}>{p.name}</span>
                  </div>
                  <span style={{
                fontSize: 14,
                fontWeight: 800,
                color: p.color
              }}>{p.value}%</span>
                </div>)}
            </div>
          </div>
        </div>
      </div>

      {/* ── Charts Row 2 ── */}
      <div className="section-grid section-grid-2 delay-2 animate-fade-up" style={{
      marginBottom: 20
    }}>
        {/* Parking occupancy */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">🏢 Okupansi Gedung Parkir</span>
            <span className="badge badge-accent">Live</span>
          </div>
          <div className="card-body">
            {safeParkings.map(p => <ParkingOccupancyRow key={p.id} p={p} />)}
          </div>
        </div>

        {/* Hourly scan */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">🔄 Scan per Jam (Hari Ini)</span>
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
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={safeScanHourly} barGap={2}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                <XAxis dataKey="hour" tick={{
                fill: 'var(--text3)',
                fontSize: 11
              }} axisLine={false} tickLine={false} />
                <YAxis tick={{
                fill: 'var(--text3)',
                fontSize: 11
              }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="masuk" name="Masuk" fill="var(--accent)" radius={[3, 3, 0, 0]} maxBarSize={18} />
                <Bar dataKey="keluar" name="Keluar" fill="var(--orange)" radius={[3, 3, 0, 0]} maxBarSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Recent Activity ── */}
      <div className="section-grid section-grid-2 delay-3 animate-fade-up">
        {/* Recent Bookings */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">📋 Booking Terbaru</span>
            <a href="/bookings" className="btn btn-ghost btn-sm">Lihat Semua</a>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Pengguna</th>
                  <th>Lokasi</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map(b => <tr key={b.id}>
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
                          <div className="ticket-code" style={{
                        fontSize: 11
                      }}>{b.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{
                    fontSize: 13,
                    color: 'var(--text)'
                  }}>{b.parkingName}</div>
                      <div style={{
                    fontSize: 11,
                    color: 'var(--text3)'
                  }}>{b.floor}/{b.slot}</div>
                    </td>
                    <td>
                      <span className={`badge ${b.status === 'active' ? 'badge-green' : b.status === 'completed' ? 'badge-gray' : b.status === 'swapped' ? 'badge-accent' : 'badge-orange'}`}>
                        {b.status === 'active' ? '● Aktif' : b.status === 'completed' ? '✓ Selesai' : b.status === 'swapped' ? '⇄ Ditukar' : b.status}
                      </span>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Scans */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">🔍 Scan QR Terbaru</span>
            <a href="/scans" className="btn btn-ghost btn-sm">Lihat Semua</a>
          </div>
          <div style={{
          padding: '8px 0'
        }}>
            {recentScans.map((s, i) => <div key={s.id} className="log-item" style={{
            padding: '12px 20px'
          }}>
                <div className={`log-dot ${s.status === 'success' ? 'log-dot-green' : 'log-dot-red'}`} />
                <div style={{
              flex: 1
            }}>
                  <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: 8
              }}>
                    <div>
                      <span style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: 'var(--text)'
                  }}>
                        {s.userName !== '—' ? s.userName : 'Tiket Tidak Valid'}
                      </span>
                      <span style={{
                    marginLeft: 8
                  }} className={`badge ${s.action === 'masuk' ? 'badge-accent' : 'badge-orange'}`}>
                        {s.action === 'masuk' ? '⬆ Masuk' : '⬇ Keluar'}
                      </span>
                    </div>
                    <span className={`badge ${s.status === 'success' ? 'badge-green' : 'badge-red'}`}>
                      {s.status === 'success' ? '✓' : '✕'}
                    </span>
                  </div>
                  <div style={{
                fontSize: 12,
                color: 'var(--text3)',
                marginTop: 3
              }}>
                    {s.parking} · {new Date(s.scanTime).toLocaleTimeString('id-ID', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
                  </div>
                </div>
              </div>)}
          </div>
        </div>
      </div>
    </div>;
}