# Laporan Penyelesaian API - Dashboard Admin ParkFinder

## Ringkasan

Dokumen ini menguraikan endpoint API yang hilang, tidak lengkap, atau memerlukan implementasi tambahan untuk sepenuhnya mendukung fitur Dashboard Admin ParkFinder.

---

## Endpoint yang Hilang

### 1. Endpoint Statistik Dashboard
**Status**: ❌ TIDAK ADA DI DOKUMENTASI API

Dashboard memerlukan statistik agregat yang tidak terdokumentasi dalam spesifikasi API saat ini. Ini perlu dibuat:

#### GET `/stats/dashboard`
- **Tujuan**: Dapatkan statistik dashboard keseluruhan
- **Header**: `Authorization: Bearer <token>`
- **Respons**:
```json
{
  "totalUsers": "number",
  "activeBookings": "number",
  "totalParkings": "number",
  "todayBookings": "number",
  "successRate": "number (persentase)",
  "swapRequests": "number",
  "activeScans": "number"
}
```

#### GET `/stats/bookings?days=7`
- **Tujuan**: Dapatkan statistik booking untuk periode tertentu
- **Header**: `Authorization: Bearer <token>`
- **Parameter Query**:
  - `days`: jumlah hari untuk diambil (default: 7)
- **Respons**:
```json
[
  {
    "name": "hari_dalam_minggu",
    "bookings": "number",
    "scans": "number",
    "swaps": "number"
  }
]
```

#### GET `/stats/scans`
- **Tujuan**: Dapatkan statistik scan per jam untuk hari ini
- **Header**: `Authorization: Bearer <token>`
- **Respons**:
```json
[
  {
    "hour": "HH:00",
    "masuk": "number",
    "keluar": "number"
  }
]
```

#### GET `/stats/analytics?period=week`
- **Tujuan**: Dapatkan analitik terperinci untuk berbagai periode
- **Header**: `Authorization: Bearer <token>`
- **Parameter Query**:
  - `period`: 'today' | 'week' | 'month' | 'year'
- **Respons**:
```json
{
  "bookingTrend": [...],
  "platformBreakdown": [...],
  "successRate": [...],
  "occupancyByParking": [...]
}
```

---

### 2. Endpoint Manajemen Booking
**Status**: ⚠️ SEBAGIAN TERDOKUMENTASI

API tidak memiliki endpoint untuk mengambil booking. Perlu ditambahkan:

#### GET `/bookings`
- **Tujuan**: Dapatkan semua booking dengan filter dan paginasi
- **Header**: `Authorization: Bearer <token>`
- **Parameter Query**:
  - `page`: nomor halaman (default: 1)
  - `limit`: item per halaman (default: 10)
  - `status`: filter berdasarkan status ('active', 'completed', 'swapped', 'cancelled')
  - `parkingId`: filter berdasarkan area parkir
- **Respons**:
```json
{
  "data": [
    {
      "id": "string",
      "userId": "string",
      "userName": "string",
      "userPhone": "string",
      "plate": "string",
      "parkingId": "string",
      "parkingName": "string",
      "floor": "string",
      "slot": "string",
      "status": "active|completed|swapped|cancelled",
      "createdAt": "ISO8601",
      "scanTime": "ISO8601",
      "duration": "string",
      "exitTime": "ISO8601"
    }
  ],
  "total": "number",
  "page": "number",
  "limit": "number"
}
```

#### GET `/bookings/{bookingId}`
- **Tujuan**: Dapatkan detail booking
- **Header**: `Authorization: Bearer <token>`
- **Respons**: Objek booking tunggal

#### DELETE `/bookings/{bookingId}`
- **Tujuan**: Batalkan booking
- **Header**: `Authorization: Bearer <token>`

---

### 3. Endpoint Log Scan
**Status**: ❌ TIDAK ADA DI DOKUMENTASI API

#### GET `/scans`
- **Tujuan**: Dapatkan semua log scan dengan filter
- **Header**: `Authorization: Bearer <token>`
- **Parameter Query**:
  - `page`: nomor halaman
  - `limit`: item per halaman
  - `status`: 'success' | 'failed'
  - `action`: 'masuk' | 'keluar'
  - `parkingId`: filter berdasarkan parkir
  - `startDate`: tanggal ISO8601
  - `endDate`: tanggal ISO8601
- **Respons**:
```json
{
  "data": [
    {
      "id": "string",
      "ticketCode": "string",
      "userName": "string",
      "plate": "string",
      "parking": "string",
      "scanTime": "ISO8601",
      "action": "masuk|keluar",
      "status": "success|failed"
    }
  ],
  "total": "number"
}
```

---

### 4. Endpoint Pertukaran Slot/Tiket
**Status**: ❌ TIDAK ADA DI DOKUMENTASI API

#### GET `/swaps`
- **Tujuan**: Dapatkan semua permintaan pertukaran slot
- **Header**: `Authorization: Bearer <token>`
- **Parameter Query**:
  - `page`: nomor halaman
  - `status`: 'pending' | 'success' | 'failed'
- **Respons**:
```json
{
  "data": [
    {
      "id": "string",
      "ticketOld": "string",
      "ticketNew": "string|null",
      "userName": "string",
      "plate": "string",
      "fromParking": "string",
      "fromSlot": "string",
      "toParking": "string",
      "toSlot": "string",
      "swapTime": "ISO8601",
      "status": "pending|success|failed"
    }
  ],
  "total": "number"
}
```

#### POST `/swaps/{swapId}/approve`
- **Tujuan**: Setujui pertukaran yang tertunda
- **Header**: `Authorization: Bearer <token>`

#### POST `/swaps/{swapId}/reject`
- **Tujuan**: Tolak pertukaran yang tertunda
- **Header**: `Authorization: Bearer <token>`

---

### 5. Endpoint Manajemen Staff
**Status**: ⚠️ TIDAK LENGKAP

Dokumentasi saat ini kurang detail tentang manajemen staff. Tambahkan:

#### GET `/staff`
- **Tujuan**: Dapatkan semua akun staff
- **Header**: `Authorization: Bearer <token>`
- **Respons**:
```json
[
  {
    "id": "string",
    "name": "string",
    "email": "string",
    "phone": "string",
    "parkingId": "string",
    "parkingName": "string"
  }
]
```

#### POST `/staff`
- **Tujuan**: Buat akun staff baru
- **Header**: `Authorization: Bearer <token>`
- **Body Permintaan**:
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "phone": "string",
  "parkingId": "string"
}
```

#### PUT `/staff/{staffId}/password`
- **Tujuan**: Reset password staff
- **Header**: `Authorization: Bearer <token>`
- **Body Permintaan**:
```json
{
  "password": "string"
}
```

#### DELETE `/staff/{staffId}`
- **Tujuan**: Hapus akun staff
- **Header**: `Authorization: Bearer <token>`

---

### 6. Endpoint Pembaruan Profil yang Ditingkatkan
**Status**: ⚠️ TIDAK LENGKAP

Endpoint saat ini hanya mendukung pembaruan profil dasar. Tambahkan upload foto melalui file:

#### POST `/users/profile/photo`
**Implementasi Saat Ini**: ✓ Sudah terdokumentasi
**Catatan**: Pastikan ini mengembalikan URL foto yang diunggah

---

### 7. Endpoint Okupansi Real-time Parkir
**Status**: ❌ TIDAK ADA DI DOKUMENTASI API

#### GET `/areas/{areaId}/occupancy`
- **Tujuan**: Dapatkan info okupansi real-time untuk area parkir
- **Header**: `Authorization: Bearer <token>`
- **Respons**:
```json
{
  "areaId": "string",
  "totalSlots": "number",
  "usedSlots": "number",
  "availableSlots": "number",
  "occupancy": "number (persentase)",
  "status": "tersedia|ramai|penuh",
  "lastUpdated": "ISO8601"
}
```

---

### 8. Autentikasi - Endpoint Login Staff
**Status**: ⚠️ TIDAK LENGKAP

API saat ini hanya mendokumentasikan login umum. Butuh dukungan login staff khusus:

#### POST `/auth/staff/login`
- **Tujuan**: Login untuk staff
- **Body Permintaan**:
```json
{
  "email": "string",
  "password": "string"
}
```
- **Respons**:
```json
{
  "token": "jwt_token",
  "staff": {
    "id": "string",
    "name": "string",
    "email": "string",
    "parkingId": "string",
    "parkingName": "string"
  }
}
```

---

## Ringkasan Item Aksi

### Prioritas Tinggi (Kritis untuk Dashboard)
- [ ] Implementasikan endpoint `/stats/dashboard`
- [ ] Implementasikan endpoint `/stats/bookings`
- [ ] Implementasikan endpoint `/stats/scans`
- [ ] Implementasikan endpoint GET `/bookings`
- [ ] Implementasikan endpoint GET `/scans`
- [ ] Implementasikan endpoint GET `/swaps`

### Prioritas Menengah (Penting untuk Fitur Lengkap)
- [ ] Implementasikan endpoint manajemen `/staff`
- [ ] Implementasikan endpoint `/areas/{areaId}/occupancy`
- [ ] Tingkatkan `/auth/login` atau buat `/auth/staff/login`
- [ ] Tambahkan persetujuan/penolakan untuk permintaan swap

### Prioritas Rendah (Bagus Jika Ada)
- [ ] Tingkatkan analitik dengan data yang lebih granular
- [ ] Tambahkan kemampuan ekspor/unduh
- [ ] Update WebSocket real-time untuk scan

---

## Catatan Integrasi

1. **Fallback ke Data Mock**: Frontend saat ini menggunakan data mock sebagai fallback saat API sedang diimplementasikan. Lihat `src/services/dataService.js` untuk logika fallback.

2. **Lokasi Layanan API**: Semua panggilan API terpusat di `src/services/apiService.js`.

3. **Data Test**: Data mock tersedia di `src/data/mockData.js` untuk referensi dan testing.

4. **Manajemen Token**: Token autentikasi disimpan di `localStorage` sebagai `pf_token`.

---

## Checklist Implementasi

Setelah mengimplementasikan endpoint yang hilang:

- [ ] Test setiap endpoint dengan token valid
- [ ] Verifikasi format respons sesuai dokumentasi
- [ ] Perbarui `src/services/apiService.js` jika endpoint berbeda
- [ ] Perbarui `src/services/dataService.js` untuk mengaktifkan panggilan API (set `useAPI=true`)
- [ ] Test dashboard dengan data nyata
- [ ] Verifikasi semua halaman bekerja dengan benar
- [ ] Hapus import data mock setelah fully integrated

---

**Terakhir Diperbarui**: 13 Mei 2026  
**Status**: Menunggu Implementasi Backend
