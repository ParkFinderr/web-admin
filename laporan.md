# ANALISIS FUNCTION POINT WEBSITE ADMINISTRATOR PARKFINDER

## 1. Tujuan Analisis

Analisis Function Point (FP) dilakukan untuk mengukur ukuran fungsional Website Administrator ParkFinder berdasarkan fungsi yang diberikan kepada pengguna akhir. Pengukuran dilakukan terhadap implementasi source code frontend sehingga setiap fungsi yang dicatat dapat ditelusuri kebenarannya dari kode program. Hasil pengukuran berupa nilai Unadjusted Function Point (UFP), Total Degree of Influence (TDI), General Characteristics Adjustment (GCA), dan nilai Function Point akhir, yang selanjutnya digunakan sebagai dasar estimasi ukuran proyek serta analisis waktu pengembangan dengan metode Rapid Application Development (RAD).

Pengukuran menggunakan kategori External Input (EI), External Output (EO), External Query (EQ), Internal Logical File (ILF), dan External Interface File (EIF). Penentuan kompleksitas dilakukan berdasarkan matriks standar Function Point dengan mempertimbangkan jumlah Data Element Type (DET), File Type Referenced (FTR), serta Record Element Type (RET) dan DET untuk file logis.

## 2. Ruang Lingkup dan Batas Aplikasi

Boundary Website Administrator ditentukan berdasarkan fungsi yang diberikan kepada aktor melalui aplikasi, bukan berdasarkan struktur folder atau repository. Aplikasi merupakan perangkat lunak sisi klien (frontend) berbasis React yang seluruh data operasionalnya dikelola oleh sistem backend eksternal melalui REST API. Seluruh persisten data dilakukan di luar boundary; aplikasi yang dianalisis menginisiasi transaksi dan menyajikan data kepada pengguna.

| No | Elemen | Keterangan |
|---|---|---|
| 1 | Nama aplikasi | Website Administrator ParkFinder |
| 2 | Aktor | 1) Super Admin; 2) Admin Area |
| 3 | Boundary aplikasi | Antarmuka pengguna (frontend) yang mencakup autentikasi, dashboard monitoring, pengelolaan area dan slot parkir, pengelolaan akun petugas, pemantauan data pengguna, serta penelusuran riwayat aktivitas parkir |
| 4 | Sistem eksternal | Backend API service `https://backend-api-services-173368161554.asia-southeast2.run.app` |
| 5 | Sumber data eksternal | Data area/slot parkir, akun admin area dan staff, data pengguna, data booking, data log scan, data swap slot, serta data statistik analitik |

Source code memuat peran ketiga (Staff Gedung) yang mengakses portal terpisah melalui `StaffLayout` dan `StaffDashboard`. Peran tersebut berada di luar ruang lingkup analisis yang ditetapkan sehingga fungsi khusus peran tersebut tidak dihitung; hal ini dibahas pada Bagian 10.

## 3. Identifikasi Fungsi Fungsional

Fungsi diidentifikasi berdasarkan kemampuan bisnis yang benar-benar dapat dilakukan aktor. Halaman, komponen, route, dan endpoint API tidak dihitung sebagai Function Point; endpoint hanya digunakan sebagai bukti bahwa fungsi diimplementasikan.

| No | Nama Fungsi | Deskripsi Fungsi | Aktor/Sumber | Jenis Fungsi |
|---|---|---|---|---|
| 1 | Login | Autentikasi kredensial email dan kata sandi; penerbitan dan penyimpanan sesi JWT | Super Admin, Admin Area | EI |
| 2 | Logout | Pengakhiran sesi pengguna | Super Admin, Admin Area | EI |
| 3 | Tambah area parkir | Pendaftaran gedung/area parkir baru beserta konfigurasi awal | Super Admin | EI |
| 4 | Ubah area parkir | Pemutakhiran nama dan alamat area parkir | Super Admin | EI |
| 5 | Hapus area parkir | Penghapusan area parkir beserta seluruh slot di dalamnya | Super Admin | EI |
| 6 | Tambah slot parkir | Penambahan slot parkir pada area terpilih dengan sensor ID yang dibangkitkan sistem | Super Admin, Admin Area | EI |
| 7 | Ubah slot parkir | Pemutakhiran data slot (lantai, nama) dan status slot (termasuk peralihan maintenance/aktif) | Super Admin, Admin Area | EI |
| 8 | Hapus slot parkir | Penghapusan slot parkir | Super Admin, Admin Area | EI |
| 9 | Tambah akun Admin Area | Pembuatan akun admin area beserta penugasan area yang dikelola | Super Admin | EI |
| 10 | Ubah akun Admin Area | Pemutakhiran nama, area penugasan, dan kata sandi akun admin area | Super Admin | EI |
| 11 | Hapus akun Admin Area | Penghapusan akun admin area | Super Admin | EI |
| 12 | Tambah akun Staff Gedung | Pembuatan akun staff beserta penugasan area dan jadwal shift | Super Admin | EI |
| 13 | Ubah akun Staff Gedung | Pemutakhiran data akun staff, penugasan area, dan status aktif/nonaktif | Super Admin | EI |
| 14 | Ubah password Staff Gedung | Pengaturan ulang kata sandi akun staff | Super Admin | EI |
| 15 | Hapus akun Staff Gedung | Penghapusan akun staff | Super Admin | EI |
| 16 | Unggah foto profil | Pengunggahan foto profil pengguna yang sedang aktif | Super Admin, Admin Area | EI |
| 17 | Melihat ringkasan kondisi parkir | Penyajian statistik okupansi: total area, total slot, slot terisi, slot kosong, dan persentase okupansi (data turunan hasil agregasi) | Super Admin, Admin Area | EO |
| 18 | Melihat analitik dan statistik | Penyajian tren booking 7 hari, perbandingan okupansi gedung, distribusi platform, dan pola scan per jam (data turunan) | Super Admin | EO |
| 19 | Melihat daftar gedung | Penampilan daftar area parkir beserta informasi umum | Super Admin, Admin Area | EQ |
| 20 | Melihat daftar slot | Penampilan daftar slot pada area terpilih | Super Admin, Admin Area | EQ |
| 21 | Melihat daftar booking | Penampilan daftar reservasi dengan pencarian, filter status, dan paginasi | Super Admin, Admin Area | EQ |
| 22 | Melihat daftar pengguna | Penampilan data pengguna mobile dan tamu web dengan pencarian, filter platform, paginasi, dan detail | Super Admin | EQ |
| 23 | Melihat riwayat scan QR | Penampilan log scan tiket dengan filter aksi dan status | Super Admin | EQ |
| 24 | Melihat riwayat swap slot | Penampilan riwayat penukaran slot dengan filter status | Super Admin | EQ |
| 25 | Melihat daftar akun Admin Area | Penampilan daftar akun admin area | Super Admin | EQ |
| 26 | Melihat daftar akun Staff Gedung | Penampilan daftar akun staff | Super Admin | EQ |
| 27 | Data pengguna (file logis) | Kelompok data pengguna terdaftar dan tamu yang dirujuk untuk penelusuran | Super Admin | EIF |
| 28 | Data booking (file logis) | Kelompok data reservasi parkir yang dirujuk untuk penelusuran | Super Admin | EIF |
| 29 | Data log scan (file logis) | Kelompok data riwayat scan QR yang dirujuk untuk penelusuran | Super Admin | EIF |
| 30 | Data swap (file logis) | Kelompok data penukaran slot yang dirujuk untuk penelusuran | Super Admin | EIF |

## 4. Penentuan Kompleksitas Fungsi

Kompleksitas ditentukan menggunakan matriks standar Function Point. Untuk EI/EO/EQ digunakan jumlah DET dan FTR; untuk EIF digunakan jumlah DET dan RET. DET dihitung sebagai jumlah elemen data yang diproses oleh transaksi, FTR sebagai jumlah file logis yang dirujuk, dan RET sebagai jumlah tipe rekaman dalam file logis.

| No | Fungsi | Jenis FP | Kompleksitas | Alasan Penentuan |
|---|---|---|---|---|
| 1 | Login | EI | Low | 2 DET (email, password), 1 FTR (data akun) |
| 2 | Logout | EI | Low | 1 DET (sesi/token), 1 FTR |
| 3 | Tambah area parkir | EI | Low | 5 DET (nama, alamat, total lantai, email kontak, status aktif), 1 FTR (data area) |
| 4 | Ubah area parkir | EI | Low | 3 DET, 1 FTR |
| 5 | Hapus area parkir | EI | Low | 1 DET, 1 FTR |
| 6 | Tambah slot parkir | EI | Low | 4 DET, 2 FTR (data area dan slot) |
| 7 | Ubah slot parkir | EI | Low | 4 DET (lantai, nama, status, ID slot), 2 FTR |
| 8 | Hapus slot parkir | EI | Low | 1 DET, 1 FTR |
| 9 | Tambah akun Admin Area | EI | Low | 4 DET, 2 FTR (data akun dan area) |
| 10 | Ubah akun Admin Area | EI | Low | 3–4 DET, 2 FTR |
| 11 | Hapus akun Admin Area | EI | Low | 1 DET, 1 FTR |
| 12 | Tambah akun Staff Gedung | EI | Medium | 6 DET (nama, email, password, telepon, area, shift), 2 FTR |
| 13 | Ubah akun Staff Gedung | EI | Medium | 6–7 DET, 2 FTR |
| 14 | Ubah password Staff Gedung | EI | Low | 2 DET, 1 FTR |
| 15 | Hapus akun Staff Gedung | EI | Low | 1 DET, 1 FTR |
| 16 | Unggah foto profil | EI | Low | 1–2 DET (berkas gambar), 1 FTR |
| 17 | Melihat ringkasan kondisi parkir | EO | High | DET > 16 (multi-area dan multi-slot), 2 FTR; output memuat hasil agregasi dan perhitungan persentase |
| 18 | Melihat analitik dan statistik | EO | High | DET > 16, 3 FTR; output agregat dari beberapa sumber data |
| 19 | Melihat daftar gedung | EQ | Low | 6 DET, 1 FTR |
| 20 | Melihat daftar slot | EQ | Low | 6 DET, 1 FTR |
| 21 | Melihat daftar booking | EQ | Low | 12 DET, 1 FTR |
| 22 | Melihat daftar pengguna | EQ | Medium | 11 DET, 2 FTR (data pengguna dan data booking) |
| 23 | Melihat riwayat scan QR | EQ | Low | 8 DET, 1 FTR |
| 24 | Melihat riwayat swap slot | EQ | Low | 11 DET, 1 FTR |
| 25 | Melihat daftar akun Admin Area | EQ | Low | 4 DET, 1 FTR |
| 26 | Melihat daftar akun Staff Gedung | EQ | Low | 7 DET, 1 FTR |
| 27 | Data pengguna | EIF | Medium | 11 DET, 1 RET |
| 28 | Data booking | EIF | Medium | 14 DET, 1 RET |
| 29 | Data log scan | EIF | Medium | 8 DET, 1 RET |
| 30 | Data swap | EIF | Medium | 11 DET, 1 RET |

## 5. Perhitungan Unadjusted Function Point

Bobot yang digunakan sesuai metode Function Point:

| Jenis Fungsi | Low | Medium | High |
|---|---:|---:|---:|
| External Input (EI) | 3 | 4 | 6 |
| External Output (EO) | 4 | 5 | 7 |
| External Query (EQ) | 3 | 4 | 6 |
| Internal Logical File (ILF) | 7 | 10 | 15 |
| External Interface File (EIF) | 5 | 7 | 10 |

Tabel perhitungan:

| No | Fungsi | Jenis | Kompleksitas | Bobot | FP |
|---|---|---|---|---:|---:|
| 1 | Login | EI | Low | 3 | 3 |
| 2 | Logout | EI | Low | 3 | 3 |
| 3 | Tambah area parkir | EI | Low | 3 | 3 |
| 4 | Ubah area parkir | EI | Low | 3 | 3 |
| 5 | Hapus area parkir | EI | Low | 3 | 3 |
| 6 | Tambah slot parkir | EI | Low | 3 | 3 |
| 7 | Ubah slot parkir | EI | Low | 3 | 3 |
| 8 | Hapus slot parkir | EI | Low | 3 | 3 |
| 9 | Tambah akun Admin Area | EI | Low | 3 | 3 |
| 10 | Ubah akun Admin Area | EI | Low | 3 | 3 |
| 11 | Hapus akun Admin Area | EI | Low | 3 | 3 |
| 12 | Tambah akun Staff Gedung | EI | Medium | 4 | 4 |
| 13 | Ubah akun Staff Gedung | EI | Medium | 4 | 4 |
| 14 | Ubah password Staff Gedung | EI | Low | 3 | 3 |
| 15 | Hapus akun Staff Gedung | EI | Low | 3 | 3 |
| 16 | Unggah foto profil | EI | Low | 3 | 3 |
| 17 | Melihat ringkasan kondisi parkir | EO | High | 7 | 7 |
| 18 | Melihat analitik dan statistik | EO | High | 7 | 7 |
| 19 | Melihat daftar gedung | EQ | Low | 3 | 3 |
| 20 | Melihat daftar slot | EQ | Low | 3 | 3 |
| 21 | Melihat daftar booking | EQ | Low | 3 | 3 |
| 22 | Melihat daftar pengguna | EQ | Medium | 4 | 4 |
| 23 | Melihat riwayat scan QR | EQ | Low | 3 | 3 |
| 24 | Melihat riwayat swap slot | EQ | Low | 3 | 3 |
| 25 | Melihat daftar akun Admin Area | EQ | Low | 3 | 3 |
| 26 | Melihat daftar akun Staff Gedung | EQ | Low | 3 | 3 |
| 27 | Data pengguna | EIF | Medium | 7 | 7 |
| 28 | Data booking | EIF | Medium | 7 | 7 |
| 29 | Data log scan | EIF | Medium | 7 | 7 |
| 30 | Data swap | EIF | Medium | 7 | 7 |

Rekapitulasi:

| Jenis Fungsi | Low | Medium | High | Total |
|---|---:|---:|---:|---:|
| EI | 14 | 2 | 0 | 16 |
| EO | 0 | 0 | 2 | 2 |
| EQ | 7 | 1 | 0 | 8 |
| ILF | 0 | 0 | 0 | 0 |
| EIF | 0 | 4 | 0 | 4 |
| Total | 21 | 7 | 2 | 30 |

Perhitungan UFP secara eksplisit:

UFP = (14 × 3) + (2 × 4) + (0 × 7) + (2 × 4) + (7 × 3) + (1 × 4) + (4 × 7)

UFP = 42 + 8 + 14 + 21 + 4 + 28

UFP = 117

## 6. Penilaian Degree of Influence

| No | General System Characteristic | Nilai | Dasar Penilaian |
|---|---|---:|---|
| 1 | Data Communications | 3 | Komunikasi data jarak jauh melalui HTTP/HTTPS ke backend eksternal pada `apiClient.js`; sebagian pemrosesan dilakukan lokal |
| 2 | Distributed Functions | 3 | Arsitektur frontend dan backend terpisah; pemrosesan data terdistribusi pada sistem eksternal |
| 3 | Performance | 2 | Aplikasi berorientasi monitoring, namun tidak ditemukan target kinerja eksplisit; penyegaran data dilakukan manual |
| 4 | Heavily Used Configuration | 0 | Tidak terdapat tabel konfigurasi kompleks; konfigurasi terbatas pada URL API dan tema |
| 5 | Transaction Rate | 1 | Tidak ditemukan kriteria volume transaksi eksplisit pada source code |
| 6 | On-Line Data Entry | 4 | Mayoritas transaksi masukan melalui formulir daring (login, CRUD area/slot/akun, unggah foto) |
| 7 | End-User Efficiency | 3 | Terdapat dashboard, pencarian/filter, paginasi, umpan balik toast, dan mode tema |
| 8 | On-Line Updating | 4 | Banyak transaksi pemutakhiran daring (area, slot, akun petugas, foto profil) |
| 9 | Complex Processing | 2 | Terdapat agregasi okupansi, perhitungan statistik, pembangkitan sensor ID, dan sintesis data tamu; tidak terdapat algoritma kompleks |
| 10 | Reusability | 2 | Komponen bersama (Modal, FormField, Avatar, layout) dan modul service dapat digunakan ulang |
| 11 | Installation Ease | 1 | Aplikasi berupa SPA statis; pemasangan sederhana tanpa kebutuhan konversi khusus |
| 12 | Operational Ease | 2 | Operasional didukung dashboard dan umpan balik visual, namun otomasi operasional tidak ditemukan pada frontend |
| 13 | Multiple Sites | 0 | Tidak terdapat kebutuhan pemasangan di banyak lokasi |
| 14 | Facilitate Change | 3 | Struktur fitur modular (features/), lapisan service, dan komponen bersama memudahkan pemeliharaan |
| | Total | 30 | |

## 7. Perhitungan General Characteristics Adjustment

GCA = 0,65 + (0,01 × TDI)

GCA = 0,65 + (0,01 × 30)

GCA = 0,95

## 8. Perhitungan Function Point

FP = UFP × GCA

FP = 117 × 0,95

FP = 111,15

Nilai Function Point yang diperoleh untuk Website Administrator ParkFinder adalah sebesar **111,15 FP**.

## 9. Rekapitulasi Hasil

| Komponen | Nilai |
|---|---:|
| External Input | 16 |
| External Output | 2 |
| External Query | 8 |
| Internal Logical File | 0 |
| External Interface File | 4 |
| Unadjusted Function Point | 117 |
| Total Degree of Influence | 30 |
| General Characteristics Adjustment | 0,95 |
| Function Point | 111,15 |

Hasil tersebut menunjukkan bahwa Website Administrator ParkFinder merupakan aplikasi bertipe thin client yang tidak memelihara file logis internal; seluruh persisten data dikelola sistem backend eksternal. Porsi terbesar ukuran fungsional berasal dari transaksi pemeliharaan data (EI) dan penelusuran data (EQ), yang sesuai dengan karakteristik aplikasi administrasi berbasis antarmuka. Nilai TDI sebesar 30 menghasilkan GCA di bawah 1,00 yang menandakan karakteristik sistem tidak memberikan penambahan kompleksitas yang signifikan terhadap ukuran fungsional dasar.

## 10. Validasi dan Keputusan Klasifikasi

Pengukuran tidak dilakukan dengan menghitung jumlah halaman, komponen, route, atau endpoint API. Beberapa keputusan klasifikasi yang berpotensi ambigu ditetapkan sebagai berikut.

| No | Fungsi | Permasalahan | Keputusan | Alasan |
|---|---|---|---|---|
| 1 | Dashboard (ringkasan kondisi parkir) | Klasifikasi EO atau EQ ambigu karena berupa tampilan data | EO | Transaksi menghasilkan data turunan berupa agregasi dan persentase okupansi yang dihitung dari beberapa area dan slot |
| 2 | Fungsi peran Staff Gedung | Peran ketiga tidak termasuk ruang lingkup aktor | Tidak dihitung | Analisis dibatasi pada Super Admin dan Admin Area sesuai ketetapan ruang lingkup |
| 3 | Bookings untuk Admin Area | Rute `/bookings` terbuka bagi Admin Area, namun tidak tersedia pada navigasi sidebar | Dihitung satu kali untuk kedua aktor | Kemampuan bisnis sama (penelusuran booking); perbedaan hak akses navigasi tidak menjadikan dua fungsi berbeda |
| 4 | Penambahan slot oleh Admin Area | Source code tidak membatasi peran pada aksi tambah slot, sedangkan README menyatakan hanya Super Admin | Dihitung satu kali untuk kedua aktor | Berdasarkan implementasi source code; ketidaksesuaian dokumentasi dicatat sebagai keterbatasan |
| 5 | Halaman `/staff` (AdminsPage) dan `/staff-management` (StaffManagementPage) | Keduanya mengelola akun petugas dengan penamaan serupa | Dihitung sebagai dua fungsi berbeda | Mengelola tipe peran berbeda melalui endpoint berbeda (`/superAdmin/admins` dan `/staff`); jika terbukti satu fungsi, terdapat risiko double counting |
| 6 | Ubah profil (nama/email) | Pemutakhiran hanya disimpan pada `localStorage` tanpa panggilan API | Tidak dihitung | Persistensi ke backend tidak terverifikasi dari source code |
| 7 | Pengaturan sistem (Settings) | Seluruh elemen statis; tombol simpan tidak memanggil API | Tidak dihitung | Merupakan elemen antarmuka tanpa transaksi bisnis |
| 8 | Notifikasi (bell) | Data notifikasi bersifat statis (mock) | Tidak dihitung | Tidak terdapat transaksi data ke sistem eksternal |
| 9 | Pencarian dan filter pada tabel | Dianggap sebagai fungsi bisnis tersendiri | Tidak dihitung terpisah | Merupakan kriteria seleksi dari satu transaksi penelusuran (EQ) yang sama |
| 10 | Endpoint API | Setiap endpoint berpotensi dihitung sebagai fungsi | Tidak dihitung sebagai FP | Endpoint hanya digunakan sebagai bukti implementasi fungsi |
| 11 | ILF | Seluruh data dikelola backend eksternal | Tidak ada ILF | Tidak terdapat file logis yang dipelihara di dalam boundary Website Administrator |
| 12 | EIF untuk area, slot, akun admin/staff | Data dirujuk dan dimutakhirkan melalui transaksi aplikasi | Tidak diklasifikasikan EIF | Tidak memenuhi definisi EIF (data dimutakhirkan oleh aplikasi) dan bukan ILF (dikelola sistem eksternal) |
| 13 | Tombol "Export CSV", "Force Checkout", "Nonaktifkan pengguna" | Tombol tanpa handler pada source code | Tidak dihitung | Tidak terdapat transaksi bisnis yang diimplementasikan |
| 14 | Login dan Logout | Berpotensi dianggap satu fungsi autentikasi | Dihitung sebagai dua EI | Merupakan dua transaksi terpisah: memulai dan mengakhiri sesi |
| 15 | Ubah data slot dan ubah status slot | Menggunakan transaksi pemutakhiran yang sama | Digabung sebagai satu EI | Satu proses elementer pemutakhiran file slot dengan tujuan berbeda |

## 11. Kesimpulan

Berikut ringkasan hasil pengukuran ukuran fungsional Website Administrator ParkFinder:

1. jumlah fungsi yang berhasil diidentifikasi sebanyak **30 fungsi**, terdiri atas 16 EI, 2 EO, 8 EQ, 0 ILF, dan 4 EIF;
2. nilai Unadjusted Function Point (UFP) sebesar **117**;
3. total Degree of Influence (TDI) sebesar **30**;
4. nilai General Characteristics Adjustment (GCA) sebesar **0,95**;
5. nilai Function Point akhir sebesar **111,15 FP**.

Nilai Function Point akhir sebesar 111,15 FP merupakan hasil pengukuran aktual yang dapat ditelusuri dari source code dan tidak dipaksakan untuk memenuhi nilai target tertentu. Jika nilai tersebut digunakan untuk membandingkan durasi pengembangan dengan tabel referensi RAD, nilai aktual tetap digunakan sebagai ukuran proyek sedangkan tabel referensi hanya berperan sebagai pembanding kategori ukuran proyek, bukan sebagai target angka Function Point.
