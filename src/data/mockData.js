// ── ParkFinder Admin Mock Data ──────────────────────────────────────────────

export const STATS_OVERVIEW = {
  totalUsers: 52847,
  activeBookings: 1243,
  totalParkings: 6,
  todayBookings: 347,
  successRate: 98.7,
  swapRequests: 89,
  activeScans: 214,
}

export const PARKINGS = [
  { id: 1, name: 'Jurusan Teknik Elektro UNILA', shortName: 'UNILA Teknik',    address: 'Jl. Prof. Soemantri Brojonegoro, Bandar Lampung', occupancy: 78, totalSlots: 5,    usedSlots: 4,   distance: '0.3 km', tag: 'Tersedia', tagClass: 'green',  floors: ['B1','L1','L2'],          lat: -5.3632, lng: 105.2568, googleMapsUrl: 'https://www.google.com/maps?q=-5.3632,105.2568' },
  { id: 2, name: 'Mall Boemi Kedaton',           shortName: 'MBK',             address: 'Jl. Z.A. Pagar Alam, Bandar Lampung',             occupancy: 81, totalSlots: 1384, usedSlots: 749, distance: '1.2 km', tag: 'Ramai',    tagClass: 'orange', floors: ['B1','B2','L1','L2','L3'], lat: -5.3682, lng: 105.2385, googleMapsUrl: 'https://www.google.com/maps?q=-5.3682,105.2385' },
  { id: 3, name: 'Lampung City Mall',            shortName: 'LCM',             address: 'Jl. Hayam Wuruk, Bandar Lampung',                 occupancy: 81, totalSlots: 1384, usedSlots: 749, distance: '2.1 km', tag: 'Ramai',    tagClass: 'orange', floors: ['B1','L1','L2','L3'],      lat: -5.3883, lng: 105.2661, googleMapsUrl: 'https://www.google.com/maps?q=-5.3883,105.2661' },
  { id: 4, name: 'Pasar Bambu Kuning',           shortName: 'P. Bambu Kuning', address: 'Jl. Imam Bonjol, Bandar Lampung',                 occupancy: 45, totalSlots: 220,  usedSlots: 100, distance: '0.8 km', tag: 'Tersedia', tagClass: 'green',  floors: ['L1','L2'],                lat: -5.4238, lng: 105.2548, googleMapsUrl: 'https://www.google.com/maps?q=-5.4238,105.2548' },
  { id: 5, name: 'RSUD Abdul Moeloek',           shortName: 'RSUD AM',         address: 'Jl. Dr. Rivai, Bandar Lampung',                   occupancy: 92, totalSlots: 220,  usedSlots: 202, distance: '3.2 km', tag: 'Penuh',    tagClass: 'red',    floors: ['L1','L2'],                lat: -5.4261, lng: 105.2638, googleMapsUrl: 'https://www.google.com/maps?q=-5.4261,105.2638' },
  { id: 6, name: 'Stasiun Tanjungkarang',        shortName: 'Stasiun TK',      address: 'Jl. Kepodang, Bandar Lampung',                    occupancy: 55, totalSlots: 200,  usedSlots: 110, distance: '1.8 km', tag: 'Tersedia', tagClass: 'green',  floors: ['L1'],                     lat: -5.4158, lng: 105.2623, googleMapsUrl: 'https://www.google.com/maps?q=-5.4158,105.2623' },
]

export const BOOKINGS = [
  { id: 'PKF-A8C2F1D0', userId: 'USR-001', userName: 'Ahmad Fauzi',    userPhone: '0812-3456-7890', plate: 'BE 1234 AB', parkingId: 1, parkingName: 'UNILA Teknik',          floor: 'L1', slot: 'A02', status: 'active',    createdAt: '2026-05-08T08:30:00Z', scanTime: '2026-05-08T08:35:00Z', duration: '2j 28m' },
  { id: 'PKF-B7E3A2C1', userId: 'USR-002', userName: 'Siti Rahayu',    userPhone: '0821-9876-5432', plate: 'BE 5678 CD', parkingId: 2, parkingName: 'Mall Boemi Kedaton',    floor: 'B1', slot: 'B1-04', status: 'active', createdAt: '2026-05-08T09:15:00Z', scanTime: '2026-05-08T09:20:00Z', duration: '1j 43m' },
  { id: 'PKF-C6D4B3E2', userId: 'USR-003', userName: 'Budi Santoso',   userPhone: '0856-1234-5678', plate: 'BG 9012 EF', parkingId: 3, parkingName: 'Lampung City Mall',     floor: 'L2', slot: 'B03',  status: 'active',    createdAt: '2026-05-08T07:45:00Z', scanTime: '2026-05-08T07:50:00Z', duration: '3j 13m' },
  { id: 'PKF-D5C5D4F3', userId: 'USR-004', userName: 'Dewi Lestari',   userPhone: '0878-5678-9012', plate: 'BE 3456 GH', parkingId: 4, parkingName: 'Pasar Bambu Kuning',   floor: 'L1', slot: 'A05',  status: 'completed', createdAt: '2026-05-08T06:00:00Z', scanTime: '2026-05-08T06:05:00Z', exitTime: '2026-05-08T08:30:00Z', duration: '2j 25m' },
  { id: 'PKF-E4B6E5G4', userId: 'USR-005', userName: 'Eko Prasetyo',   userPhone: '0813-4321-8765', plate: 'BE 7890 IJ', parkingId: 6, parkingName: 'Stasiun Tanjungkarang', floor: 'L1', slot: 'A08',  status: 'active',    createdAt: '2026-05-08T10:00:00Z', scanTime: '2026-05-08T10:05:00Z', duration: '0j 58m' },
  { id: 'PKF-F3A7F6H5', userId: 'USR-006', userName: 'Farah Amelia',   userPhone: '0857-2345-6789', plate: 'BG 2345 KL', parkingId: 1, parkingName: 'UNILA Teknik',          floor: 'B1', slot: 'B1-01', status: 'swapped',  createdAt: '2026-05-08T07:00:00Z', scanTime: '2026-05-08T07:10:00Z', duration: '3j 53m' },
  { id: 'PKF-G2E8G7I6', userId: 'USR-007', userName: 'Gunawan Halim',  userPhone: '0811-9876-5432', plate: 'BE 4567 MN', parkingId: 2, parkingName: 'Mall Boemi Kedaton',    floor: 'L1', slot: 'A03',  status: 'completed', createdAt: '2026-05-07T14:00:00Z', scanTime: '2026-05-07T14:05:00Z', exitTime: '2026-05-07T16:30:00Z', duration: '2j 25m' },
  { id: 'PKF-H1F9H8J7', userId: 'USR-008', userName: 'Hana Putri',     userPhone: '0822-3456-7890', plate: 'BE 6789 OP', parkingId: 5, parkingName: 'RSUD Abdul Moeloek',    floor: 'L2', slot: 'B04',  status: 'active',    createdAt: '2026-05-08T11:00:00Z', scanTime: '2026-05-08T11:10:00Z', duration: '0j 3m' },
]

export const USERS = [
  // Mobile App – punya akun login
  { id: 'USR-001', name: 'Ahmad Fauzi',    email: 'ahmad@email.com',  phone: '0812-3456-7890', plate: 'BE 1234 AB', platform: 'mobile', totalBookings: 24, activeBookings: 1, joinDate: '2026-01-15', lastActive: '2026-05-08', status: 'active' },
  { id: 'USR-003', name: 'Budi Santoso',   email: 'budi@email.com',   phone: '0856-1234-5678', plate: 'BG 9012 EF', platform: 'mobile', totalBookings: 42, activeBookings: 1, joinDate: '2025-12-10', lastActive: '2026-05-08', status: 'active' },
  { id: 'USR-005', name: 'Eko Prasetyo',   email: 'eko@email.com',    phone: '0813-4321-8765', plate: 'BE 7890 IJ', platform: 'mobile', totalBookings: 31, activeBookings: 1, joinDate: '2026-01-05', lastActive: '2026-05-08', status: 'active' },
  { id: 'USR-006', name: 'Farah Amelia',   email: 'farah@email.com',  phone: '0857-2345-6789', plate: 'BG 2345 KL', platform: 'mobile', totalBookings: 15, activeBookings: 1, joinDate: '2026-02-18', lastActive: '2026-05-08', status: 'active' },
  { id: 'USR-008', name: 'Hana Putri',     email: 'hana@email.com',   phone: '0822-3456-7890', plate: 'BE 6789 OP', platform: 'mobile', totalBookings: 3,  activeBookings: 1, joinDate: '2026-04-25', lastActive: '2026-05-08', status: 'active' },
  { id: 'USR-010', name: 'Jeni Wulandari', email: 'jeni@email.com',   phone: '0896-2345-6789', plate: 'BE 1122 RS', platform: 'mobile', totalBookings: 28, activeBookings: 0, joinDate: '2026-01-20', lastActive: '2026-05-05', status: 'active' },
  { id: 'USR-011', name: 'Kevin Pratama',  email: 'kevin@email.com',  phone: '0878-8765-4321', plate: 'BE 3344 TU', platform: 'mobile', totalBookings: 7,  activeBookings: 0, joinDate: '2026-03-12', lastActive: '2026-05-07', status: 'active' },
  // Web User – tidak ada login, tampil sebagai Tamu/Guest
  { id: 'USR-002', name: 'Tamu', email: null, phone: null, plate: 'BE 5678 CD', platform: 'web', totalBookings: 18, activeBookings: 1, joinDate: null, lastActive: '2026-05-08', status: 'active' },
  { id: 'USR-004', name: 'Tamu', email: null, phone: null, plate: 'BE 3456 GH', platform: 'web', totalBookings: 9,  activeBookings: 0, joinDate: null, lastActive: '2026-05-08', status: 'active' },
  { id: 'USR-007', name: 'Tamu', email: null, phone: null, plate: 'BE 4567 MN', platform: 'web', totalBookings: 7,  activeBookings: 0, joinDate: null, lastActive: '2026-05-07', status: 'active' },
  { id: 'USR-009', name: 'Tamu', email: null, phone: null, plate: 'BG 7788 VW', platform: 'web', totalBookings: 11, activeBookings: 0, joinDate: null, lastActive: '2026-05-06', status: 'inactive' },
  { id: 'USR-012', name: 'Tamu', email: null, phone: null, plate: 'BE 9900 XY', platform: 'web', totalBookings: 4,  activeBookings: 0, joinDate: null, lastActive: '2026-05-05', status: 'active' },
]

export const SWAP_LOGS = [
  { id: 'SWP-001', ticketOld: 'PKF-F3A7F6H5', ticketNew: 'PKF-SW-ABCD01', userName: 'Farah Amelia',  plate: 'BG 2345 KL', fromParking: 'UNILA Teknik',       fromSlot: 'L1/A03',  toParking: 'UNILA Teknik',       toSlot: 'B1/B1-02', swapTime: '2026-05-08T09:45:00Z', status: 'success' },
  { id: 'SWP-002', ticketOld: 'PKF-A8C2F1D0', ticketNew: 'PKF-SW-ABCD02', userName: 'Ahmad Fauzi',   plate: 'BE 1234 AB', fromParking: 'UNILA Teknik',       fromSlot: 'B1/B1-03', toParking: 'UNILA Teknik',       toSlot: 'L1/A02',   swapTime: '2026-05-08T08:40:00Z', status: 'success' },
  { id: 'SWP-003', ticketOld: 'PKF-G2E8G7I6', ticketNew: null,            userName: 'Gunawan Halim', plate: 'BE 4567 MN', fromParking: 'Mall Boemi Kedaton', fromSlot: 'L1/A03',  toParking: 'Mall Boemi Kedaton', toSlot: 'L2/B03',   swapTime: '2026-05-07T15:00:00Z', status: 'failed' },
]

export const SCAN_LOGS = [
  { id: 'SCN-001', ticketCode: 'PKF-A8C2F1D0',  userName: 'Ahmad Fauzi',  plate: 'BE 1234 AB', parking: 'UNILA Teknik',          scanTime: '2026-05-08T08:35:00Z', action: 'masuk',  status: 'success' },
  { id: 'SCN-002', ticketCode: 'PKF-B7E3A2C1',  userName: 'Siti Rahayu',  plate: 'BE 5678 CD', parking: 'Mall Boemi Kedaton',    scanTime: '2026-05-08T09:20:00Z', action: 'masuk',  status: 'success' },
  { id: 'SCN-003', ticketCode: 'PKF-INVALID01', userName: '—',            plate: '—',           parking: 'Stasiun Tanjungkarang', scanTime: '2026-05-08T09:50:00Z', action: 'masuk',  status: 'failed'  },
  { id: 'SCN-004', ticketCode: 'PKF-D5C5D4F3',  userName: 'Dewi Lestari', plate: 'BE 3456 GH', parking: 'Pasar Bambu Kuning',    scanTime: '2026-05-08T08:30:00Z', action: 'keluar', status: 'success' },
  { id: 'SCN-005', ticketCode: 'PKF-C6D4B3E2',  userName: 'Budi Santoso', plate: 'BG 9012 EF', parking: 'Lampung City Mall',     scanTime: '2026-05-08T07:50:00Z', action: 'masuk',  status: 'success' },
  { id: 'SCN-006', ticketCode: 'PKF-E4B6E5G4',  userName: 'Eko Prasetyo', plate: 'BE 7890 IJ', parking: 'Stasiun TK',            scanTime: '2026-05-08T10:05:00Z', action: 'masuk',  status: 'success' },
]

export const BOOKING_CHART_DATA = [
  { name: 'Sen', bookings: 280, scans: 240, swaps: 12 },
  { name: 'Sel', bookings: 310, scans: 290, swaps: 18 },
  { name: 'Rab', bookings: 265, scans: 250, swaps: 9  },
  { name: 'Kam', bookings: 340, scans: 310, swaps: 21 },
  { name: 'Jum', bookings: 420, scans: 390, swaps: 34 },
  { name: 'Sab', bookings: 510, scans: 480, swaps: 45 },
  { name: 'Min', bookings: 347, scans: 320, swaps: 28 },
]

export const OCCUPANCY_DATA = [
  { name: 'UNILA Teknik',    value: 78 },
  { name: 'Mall BK',         value: 81 },
  { name: 'LCM',             value: 81 },
  { name: 'P.Bambu Kuning',  value: 45 },
  { name: 'RSUD AM',         value: 92 },
  { name: 'Stasiun TK',      value: 55 },
]

export const HOURLY_SCAN_DATA = [
  { hour: '06:00', masuk: 12, keluar: 3  },
  { hour: '07:00', masuk: 45, keluar: 8  },
  { hour: '08:00', masuk: 87, keluar: 15 },
  { hour: '09:00', masuk: 64, keluar: 22 },
  { hour: '10:00', masuk: 48, keluar: 31 },
  { hour: '11:00', masuk: 35, keluar: 28 },
  { hour: '12:00', masuk: 52, keluar: 41 },
  { hour: '13:00', masuk: 39, keluar: 35 },
  { hour: '14:00', masuk: 28, keluar: 47 },
  { hour: '15:00', masuk: 31, keluar: 58 },
  { hour: '16:00', masuk: 24, keluar: 72 },
  { hour: '17:00', masuk: 18, keluar: 85 },
]

export const PLATFORM_DATA = [
  { name: 'Mobile App', value: 68, color: '#00D2FF' },
  { name: 'Web User',   value: 32, color: '#7B61FF' },
]
