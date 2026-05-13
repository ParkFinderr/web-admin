# Panduan Integrasi API - Dashboard Admin ParkFinder

## Ringkasan Perubahan

Dokumen ini menjelaskan semua perubahan yang dilakukan untuk mengintegrasikan Dashboard Admin ParkFinder dengan API backend.

---

## File yang Dibuat

### 1. **`src/services/apiService.js`** (Baru)
Lapisan layanan API terpusat yang menangani semua permintaan HTTP ke backend.

**Fitur Utama:**
- URL Base: `https://backend-api-services-291631508657.asia-southeast2.run.app`
- Manajemen token otomatis dari localStorage
- Penanganan kesalahan dan logging
- Wrapper fetch dengan header otorisasi
- Diorganisir berdasarkan kelompok fungsional:
  - `authService` - Login, logout, registrasi
  - `adminService` - Operasi CRUD admin
  - `userService` - Manajemen pengguna dan profil
  - `vehicleService` - Manajemen kendaraan
  - `parkingService` - Manajemen area parkir
  - `slotService` - Manajemen slot parkir
  - `accessService` - Akses tiket (pengguna terautentikasi)
  - `guestAccessService` - Akses tiket tamu
  - `statsService` - Statistik dashboard (BELUM ADA DI BACKEND)

### 2. **`src/services/dataService.js`** (Baru)
Lapisan abstraksi data yang menghubungkan data mock dan panggilan API.

**Fitur Utama:**
- Menyediakan antarmuka terpadu untuk semua pengambilan data
- Mendukung fallback ke data mock (untuk development/testing)
- Fungsi berbasis async/await:
  - `getParkings(useAPI)` - Ambil semua parkir
  - `getUsers(useAPI)` - Ambil semua pengguna
  - `getDashboardStats(useAPI)` - Statistik ringkasan dashboard
  - `getBookingStats(days, useAPI)` - Tren booking
  - `getScanStats(useAPI)` - Data scan per jam
  - `getOccupancyData(useAPI)` - Okupansi parkir
  - `getPlatformData(useAPI)` - Rincian platform pengguna
  - Dan lainnya...

### 3. **`fix-admin.md`** (Baru)
Dokumentasi komprehensif tentang endpoint API yang hilang dan tidak lengkap.

**Masalah yang Didokumentasikan:**
- Endpoint `/stats/*` yang hilang untuk dashboard
- Endpoint GET `/bookings` yang hilang
- Endpoint GET `/scans` yang hilang
- Endpoint GET `/swaps` yang hilang
- Endpoint manajemen staff yang tidak lengkap
- Endpoint okupansi real-time yang hilang
- Endpoint login staff spesifik yang hilang

---

## File yang Dimodifikasi

### **Halaman yang Diperbarui dengan Integrasi API**

Semua halaman sekarang menggunakan `useState` dan `useEffect` untuk mengambil data dari API dengan fallback ke data mock.

#### 1. **`src/pages/Dashboard.jsx`**
- Menambahkan pemuatan data dari `dataService`
- Manajemen state: `stats`, `parkings`, `bookings`, `scans`, `chartData`, `occupancyData`, `platformData`, `scanHourlyData`
- Menggunakan `useEffect` untuk memuat semua data saat mount
- Fallback ke data mock jika API gagal
- Generasi STATS_CONFIG dinamis dari data yang dimuat

#### 2. **`src/pages/ParkingsPage.jsx`**
- Menambahkan state loading dan penanganan kesalahan
- Mengambil parkir dari API melalui `dataService.getParkings(false)`
- Mempertahankan state lokal untuk modifikasi pengguna

#### 3. **`src/pages/UsersPage.jsx`**
- Menambahkan state loading
- Mengambil pengguna dari API melalui `dataService.getUsers(false)`
- Menghitung statistik dari data pengguna yang dimuat

#### 4. **`src/pages/BookingsPage.jsx`**
- Menambahkan state loading dan dukungan paginasi
- Mengambil booking dari API melalui `dataService.getBookings()`
- Mempertahankan state pencarian dan filter

#### 5. **`src/pages/ScansPage.jsx`**
- Menambahkan state loading
- Mengambil scan dari API melalui `dataService.getScans()`
- Menggabungkan dengan EXTRA_SCANS lokal untuk kelengkapan
- Mengimplementasikan filter kompleks (aksi, status, pencarian)

#### 6. **`src/pages/SwapsPage.jsx`**
- Menambahkan state loading
- Mengambil swap dari API melalui `dataService.getSwaps()`
- Menggabungkan dengan MORE_SWAPS lokal untuk kelengkapan
- Mendukung filter status (pending, success, failed)

#### 7. **`src/pages/AnalyticsPage.jsx`**
- Menambahkan state loading untuk data analitik
- Mengambil okupansi, platform, bagan booking, dan data scan per jam
- Menggunakan struktur data fallback yang aman
- Mempertahankan MONTHLY_DATA dan SUCCESS_RATE_DATA lokal

#### 8. **`src/pages/StaffDashboard.jsx`**
- Menambahkan state loading
- Mengambil parkir, booking, scan, swap, dan data scan per jam
- Mengorganisir ulang logika filter:
  - Filter pertama berdasarkan parkir (berdasarkan parkir yang ditugaskan ke staff)
  - Kemudian filter berdasarkan istilah pencarian
- Memperbarui nama variabel untuk kejelasan (searchFilteredScans, searchFilteredBookings, searchFilteredSwaps)

### **`src/context/AppContext.jsx`**
- Menambahkan import untuk `authService` dari apiService
- Siap untuk autentikasi berbasis API (saat ini menggunakan fallback ke validasi lokal)
- Manajemen token melalui localStorage

---

## Status Implementasi Saat Ini

### ✅ Selesai
- Lapisan layanan API dengan semua endpoint yang terdokumentasi
- Layanan data dengan fallback ke data mock
- Semua halaman terhubung ke layanan data
- Dukungan pemuatan data bersamaan dengan Promise.all
- Penanganan kesalahan dan logging

### ⚠️ Sebagian Selesai
- Autentikasi (memerlukan endpoint `/auth/staff/login`)
- Manajemen staff (endpoint parsial)

### ❌ Belum Diimplementasikan (Sisi Backend)
- Endpoint `/stats/dashboard`
- Endpoint `/stats/bookings`
- Endpoint `/stats/scans`
- Endpoint `/stats/analytics`
- Endpoint GET `/bookings`
- Endpoint GET `/scans`
- Endpoint GET `/swaps`
- Endpoint `/areas/{areaId}/occupancy`
- Endpoint `/auth/staff/login`
- Endpoint manajemen staff

**Lihat `fix-admin.md` untuk spesifikasi detail.**

---

## Cara Mengaktifkan Panggilan API

Saat ini, semua layanan data menggunakan `useAPI=false` (fallback ke data mock). Untuk mengaktifkan panggilan API nyata:

### Opsi 1: Aktifkan untuk Layanan Spesifik
Perbarui panggilan fungsi di `src/services/dataService.js`:

```javascript
// Sebelum (menggunakan data mock)
const data = await dataService.getParkings(false);

// Sesudah (menggunakan API)
const data = await dataService.getParkings(true);
```

### Opsi 2: Buat Konfigurasi Environment
Buat file `.env`:
```
VITE_USE_API=false  # Ubah menjadi true saat backend siap
```

Kemudian di dataService:
```javascript
const useAPI = import.meta.env.VITE_USE_API === 'true';
const data = await dataService.getParkings(useAPI);
```

---

## Alur Autentikasi

1. Pengguna memasukkan kredensial di halaman login
2. `AppContext.loginAdmin()` atau `loginStaff()` dipanggil
3. Saat ini memvalidasi terhadap penyimpanan lokal
4. Token harus disimpan di localStorage sebagai `pf_token` setelah login API
5. Semua panggilan API berikutnya menyertakan token di header Authorization

**Catatan:** Ini akan diperbarui ketika endpoint API login staff diimplementasikan.

---

## Strategi Penanganan Kesalahan

Semua fungsi layanan data mengimplementasikan try-catch:
```javascript
try {
  const data = await apiService.getParkings();
  setData(data);
} catch (error) {
  console.error('Error loading data:', error);
  // Fallback ke state kosong atau data mock
  setLoading(false);
}
```

---

## Data Mock untuk Development

Data mock tersedia di `src/data/mockData.js`:
- `STATS_OVERVIEW` - Statistik dashboard
- `PARKINGS` - Daftar area parkir (6 lokasi)
- `BOOKINGS` - Booking aktif/selesai
- `USERS` - Pengguna mobile dan web
- `SCAN_LOGS` - Catatan scan QR
- `SWAP_LOGS` - Permintaan pertukaran parkir
- `BOOKING_CHART_DATA` - Tren booking 7 hari
- `OCCUPANCY_DATA` - Okupansi per parkir
- `HOURLY_SCAN_DATA` - Rincian scan per jam
- `PLATFORM_DATA` - Pembagian pengguna Mobile vs Web

---

## Rekomendasi Testing

### Testing Frontend
1. **Verifikasi panggilan API dilakukan:**
   - Buka DevTools > tab Network
   - Periksa endpoint API dipanggil dengan parameter yang benar
   - Verifikasi header Authorization dikirim

2. **Test perilaku fallback:**
   - Putuskan jaringan atau gunakan mode offline DevTools
   - Verifikasi aplikasi menampilkan data mock dan tidak crash

3. **Test autentikasi:**
   - Percobaan login dengan kredensial valid/invalid
   - Verifikasi token disimpan di localStorage
   - Verifikasi token dikirim di header API

### Testing API (Saat Backend Siap)
1. Test setiap endpoint secara individual dengan Postman/Insomnia
2. Verifikasi format respons sesuai dokumentasi
3. Test dengan token invalid (harapkan 401)
4. Test dengan field yang hilang (harapkan 400)
5. Test rate limiting dan respons kesalahan

---

## Langkah Selanjutnya

1. **Implementasi Backend:**
   - Implementasikan endpoint yang hilang (lihat fix-admin.md)
   - Pastikan format respons sesuai dokumentasi
   - Tambahkan penanganan kesalahan yang tepat

2. **Peningkatan Frontend:**
   - Ganti import data mock dengan panggilan API (set `useAPI=true`)
   - Tambahkan loading spinners/skeletons untuk UX lebih baik
   - Implementasikan pesan kesalahan yang tepat untuk pengguna
   - Tambahkan fungsionalitas refresh/refetch data

3. **Autentikasi:**
   - Implementasikan endpoint `/auth/staff/login`
   - Perbarui `AppContext.loginStaff()` untuk menggunakan API
   - Tambahkan logika refresh token jika diperlukan

4. **Update Real-time:**
   - Pertimbangkan WebSocket untuk update scan/booking langsung
   - Implementasikan mekanisme polling jika WebSocket tidak tersedia

---

## Referensi Struktur File

```
src/
├── pages/
│   ├── Dashboard.jsx (✓ Diperbarui)
│   ├── ParkingsPage.jsx (✓ Diperbarui)
│   ├── BookingsPage.jsx (✓ Diperbarui)
│   ├── UsersPage.jsx (✓ Diperbarui)
│   ├── ScansPage.jsx (✓ Diperbarui)
│   ├── SwapsPage.jsx (✓ Diperbarui)
│   ├── AnalyticsPage.jsx (✓ Diperbarui)
│   ├── StaffDashboard.jsx (✓ Diperbarui)
│   └── ...halaman lainnya
├── services/
│   ├── apiService.js (✓ BARU - Panggilan API)
│   └── dataService.js (✓ BARU - Abstraksi data)
├── context/
│   └── AppContext.jsx (✓ Diperbarui)
├── data/
│   └── mockData.js (Disimpan untuk fallback)
└── ...

Root:
└── fix-admin.md (✓ BARU - Dokumen persyaratan API)
```

---

## Referensi Cepat: Tugas Umum

### Tambahkan endpoint API baru
1. Tambahkan ke `apiService.js` dengan penanganan kesalahan yang tepat
2. Tambahkan wrapper di `dataService.js` dengan fallback
3. Perbarui komponen halaman untuk menggunakan fungsi `dataService`
4. Test dengan data mock terlebih dahulu

### Aktifkan API untuk fitur
1. Ubah `useAPI=false` menjadi `useAPI=true` dalam panggilan dataService
2. Verifikasi endpoint backend ada dan sesuai spesifikasi
3. Test dengan tab network terbuka
4. Verifikasi token dikirim untuk rute yang dilindungi

### Debug masalah API
1. Periksa tab Network di DevTools
2. Verifikasi URL endpoint dan method
3. Periksa header permintaan/respons
4. Lihat console untuk log kesalahan
5. Verifikasi backend mengembalikan format yang diharapkan

---

**Terakhir Diperbarui:** 13 Mei 2026  
**Status:** Siap untuk Implementasi API Backend
