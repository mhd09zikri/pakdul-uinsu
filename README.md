# 🎓 PAKDUL UINSU — Sistem Peminjaman Alat Perkuliahan FST UINSU

Aplikasi Web Modern untuk peminjaman sarana dan fasilitas perkuliahan Fakultas Sains dan Teknologi (FST) Kampus IV Tuntungan UIN Sumatera Utara Medan (**Kabel HDMI**, **Proyektor**, dan **Cok Sambung / Roll Kabel**).

---

## 🌟 Fitur Utama & Pembaruan Sistem

### 1. 🔒 Wajib Login Pertama Kali Dibuka (Auth Guard)
- Setiap kali pengguna membuka halaman utama web ([index.html](file:///d:/TUGAS%20WEB/index.html)), sistem akan langsung mengecek sesi aktif.
- Jika pengguna belum login, sistem akan **secara otomatis mengarahkan ke halaman login** ([login.html](file:///d:/TUGAS%20WEB/login.html)) terlebih dahulu.

### 2. 💻 Khusus Program Studi S1 Ilmu Komputer (FST)
- Hak akses peminjaman alat perkuliahan telah **dikhususkan hanya untuk Mahasiswa Program Studi S1 Ilmu Komputer (FST)**.
- Form registrasi akun baru dengan NIM dan formulir peminjaman telah dikunci secara otomatis ke **S1 Ilmu Komputer (FST)** dengan validasi kelas (contoh: `ILKOM-1`, `ILKOM-2`).
- Mahasiswa di luar Ilmu Komputer akan ditolak oleh sistem verifikasi.

### 3. 🗄️ Database Query Console & Struktur SQL
- Tersedia file skema dan query lengkap di [database.sql](file:///d:/TUGAS%20WEB/database.sql) dengan tabel `users`, `fasilitas`, dan `peminjaman`.
- Terdapat menu **Database Query Console** langsung di Panel Admin ([admin.html](file:///d:/TUGAS%20WEB/admin.html)) untuk menjalankan simulasi perintah query SQL nyata (`SELECT`, `INSERT`, `UPDATE`, `DELETE`) dan melihat tabel *result set*-nya secara interaktif.

---

## 🚀 Panduan Penggunaan & Akun Demo

1. Buka [index.html](file:///d:/TUGAS%20WEB/index.html) (otomatis diarahkan ke [login.html](file:///d:/TUGAS%20WEB/login.html) jika belum login).
2. Kredensial Akun Default:
   - **Mahasiswa Ilmu Komputer 1:** NIM `0701222012` | Password: `123` (Kelas ILKOM-1)
   - **Mahasiswa Ilmu Komputer 2:** NIM `0701223088` | Password: `123` (Kelas ILKOM-2)
   - **Admin Sarpras (Pakdul):** Username `admin` | Password: `admin`
3. Pengguna baru dapat mendaftar melalui menu **Daftar Akun (NIM)** khusus mahasiswa Ilmu Komputer.
