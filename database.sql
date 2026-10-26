-- ==========================================================
-- Database: db_pakdul_uinsu
-- Sistem Peminjaman Alat Perkuliahan FST UINSU Medan
-- Khusus Program Studi: S1 ILMU KOMPUTER (FST)
-- Sarana Peminjaman: Kabel HDMI, Proyektor, dan Cok Sambung
-- ==========================================================

CREATE DATABASE IF NOT EXISTS `db_pakdul_uinsu` 
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `db_pakdul_uinsu`;

-- ----------------------------------------------------------
-- 1. Tabel Users (Mahasiswa Ilmu Komputer & Admin Sarpras)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(50) PRIMARY KEY COMMENT 'Contoh: acct_student_0701222012, acct_admin',
  `nim` VARCHAR(50) NOT NULL UNIQUE COMMENT 'NIM Mahasiswa atau Username Admin',
  `nama_lengkap` VARCHAR(100) NOT NULL,
  `role` ENUM('student', 'admin') NOT NULL DEFAULT 'student',
  `kelas` VARCHAR(50) DEFAULT 'ILKOM-1' COMMENT 'Kelas Asal ILKOM-1, ILKOM-2, dll',
  `prodi` VARCHAR(100) NOT NULL DEFAULT 'S1 Ilmu Komputer (FST)' COMMENT 'Khusus Ilmu Komputer FST',
  `no_telepon` VARCHAR(20) DEFAULT NULL,
  `password` VARCHAR(255) NOT NULL DEFAULT '123',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ----------------------------------------------------------
-- 2. Tabel Fasilitas / Inventaris Alat FST
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `fasilitas` (
  `id` VARCHAR(50) PRIMARY KEY COMMENT 'Kode Unit: hdmi-01, proj-01, cok-01',
  `nama_barang` VARCHAR(150) NOT NULL,
  `kategori` ENUM('hdmi', 'proyektor', 'coksambung') NOT NULL,
  `spesifikasi` TEXT,
  `total_stok` INT NOT NULL DEFAULT 1,
  `tersedia_stok` INT NOT NULL DEFAULT 1,
  `lokasi_penyimpanan` VARCHAR(150) NOT NULL,
  `kondisi` VARCHAR(50) DEFAULT 'Sangat Baik',
  `icon_class` VARCHAR(50) DEFAULT 'fa-network-wired',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ----------------------------------------------------------
-- 3. Tabel Transaksi Peminjaman (Khusus Mahasiswa Ilmu Komputer)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `peminjaman` (
  `id` VARCHAR(50) PRIMARY KEY COMMENT 'Nomor Booking: BOOK-FST-XXXX',
  `fasilitas_id` VARCHAR(50) NOT NULL,
  `student_nim` VARCHAR(50) NOT NULL,
  `student_nama` VARCHAR(100) NOT NULL,
  `student_kelas` VARCHAR(50) NOT NULL DEFAULT 'ILKOM-1',
  `student_prodi` VARCHAR(100) NOT NULL DEFAULT 'S1 Ilmu Komputer (FST)',
  `no_telepon` VARCHAR(20) NOT NULL,
  `jumlah_unit` INT NOT NULL DEFAULT 1,
  `waktu_mulai` DATETIME NOT NULL,
  `waktu_selesai` DATETIME NOT NULL,
  `lokasi_ruangan` VARCHAR(150) NOT NULL,
  `keperluan` VARCHAR(150) NOT NULL,
  `catatan_peminjam` TEXT,
  `status` ENUM('pending', 'approved', 'rejected', 'returned') NOT NULL DEFAULT 'pending',
  `catatan_admin` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`fasilitas_id`) REFERENCES `fasilitas`(`id`) ON UPDATE CASCADE,
  FOREIGN KEY (`student_nim`) REFERENCES `users`(`nim`) ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ==========================================================
-- DATA SEEDING (DATA AWAL)
-- ==========================================================

-- 1. Users Default (Hanya Prodi Ilmu Komputer & Admin Sarpras)
INSERT INTO `users` (`id`, `nim`, `nama_lengkap`, `role`, `kelas`, `prodi`, `no_telepon`, `password`) VALUES
('acct_student_0', '0701222012', 'Ahmad Farhan', 'student', 'ILKOM-1', 'S1 Ilmu Komputer (FST)', '081234567890', '123'),
('acct_student_1', '0701223088', 'Siti Nurhaliza', 'student', 'ILKOM-2', 'S1 Ilmu Komputer (FST)', '082198765432', '123'),
('acct_admin', 'admin', 'Admin Sarpras FST (Pakdul)', 'admin', 'Pengelola Sarpras', 'Koordinator Fasilitas FST Kampus IV Tuntungan', '081122334455', 'admin')
ON DUPLICATE KEY UPDATE `nama_lengkap` = VALUES(`nama_lengkap`);

-- 2. Fasilitas Inventaris
INSERT INTO `fasilitas` (`id`, `nama_barang`, `kategori`, `spesifikasi`, `total_stok`, `tersedia_stok`, `lokasi_penyimpanan`, `kondisi`, `icon_class`) VALUES
('proj-01', 'Proyektor', 'proyektor', 'Lengkap dengan kabel power, kabel VGA/HDMI, dan remote', 10, 10, 'Ruangan Administrasi FST', 'Optimal / Sangat Baik', 'fa-video'),
('hdmi-01', 'Kabel HDMI', 'hdmi', 'Kabel penghubung proyektor ke laptop', 10, 10, 'Ruangan Administrasi FST', 'Sangat Baik', 'fa-network-wired'),
('cok-01', 'Cok Sambung', 'coksambung', 'Stop kontak / roll kabel untuk kebutuhan listrik di kelas', 10, 10, 'Ruangan Administrasi FST', 'Layak Pakai', 'fa-plug-circle-bolt')
ON DUPLICATE KEY UPDATE `nama_barang` = VALUES(`nama_barang`);

-- 3. Transaksi Peminjaman Sampel
INSERT INTO `peminjaman` (`id`, `fasilitas_id`, `student_nim`, `student_nama`, `student_kelas`, `student_prodi`, `no_telepon`, `jumlah_unit`, `waktu_mulai`, `waktu_selesai`, `lokasi_ruangan`, `keperluan`, `catatan_peminjam`, `status`, `catatan_admin`, `created_at`) VALUES
('BOOK-FST-001', 'proj-01', '0701222012', 'Ahmad Farhan', 'ILKOM-1', 'S1 Ilmu Komputer (FST)', '081234567890', 1, '2026-10-14 08:00:00', '2026-10-14 11:30:00', 'Lab Jaringan & Komputasi FST Lt. 2', 'Perkuliahan & Presentasi Kelas', 'Kebutuhan presentasi materi Jaringan Komputer', 'approved', 'Disetujui oleh Admin Sarpras FST (Pakdul). Silakan ambil di Pos Sarpras.', '2026-10-13 08:15:00'),
('BOOK-FST-002', 'hdmi-01', '0701222012', 'Ahmad Farhan', 'ILKOM-1', 'S1 Ilmu Komputer (FST)', '081234567890', 1, '2026-10-14 13:30:00', '2026-10-14 16:00:00', 'Ruang Kuliah FST-302 Gedung Sains', 'Perkuliahan & Presentasi Kelas', 'Untuk proyektor laptop di kelas', 'pending', '', '2026-10-13 10:00:00'),
('BOOK-FST-003', 'cok-01', '0701223088', 'Siti Nurhaliza', 'ILKOM-2', 'S1 Ilmu Komputer (FST)', '082198765432', 1, '2026-10-12 10:00:00', '2026-10-12 15:00:00', 'Ruang Seminar FST Kampus IV Tuntungan', 'Kegiatan Himpunan Mahasiswa (HIMA ILKOM)', 'Kebutuhan acara workshop HIMA ILKOM', 'returned', 'Telah dikembalikan lengkap dan dicek berfungsi baik.', '2026-10-12 08:30:00')
ON DUPLICATE KEY UPDATE `status` = VALUES(`status`);

-- ==========================================================
-- CONTOH QUERY DATABASE (CRUD OPERATIONS)
-- ==========================================================

-- Q1. Query Login Pengguna (Mahasiswa / Admin)
-- SELECT * FROM users WHERE nim = '0701222012' AND password = '123';

-- Q2. Query Pendaftaran Akun Mahasiswa Baru Menggunakan NIM (Hanya Ilmu Komputer)
-- INSERT INTO users (id, nim, nama_lengkap, role, kelas, prodi, no_telepon, password)
-- VALUES ('acct_student_0701231001', '0701231001', 'Budi Santoso', 'student', 'ILKOM-3', 'S1 Ilmu Komputer (FST)', '081234567899', '123456');

-- Q3. Query Ambil Daftar Alat yang Tersedia (Stok > 0)
-- SELECT * FROM fasilitas WHERE tersedia_stok > 0 ORDER BY nama_barang ASC;

-- Q4. Query Pengajuan Booking Alat oleh Mahasiswa Ilmu Komputer
-- INSERT INTO peminjaman (id, fasilitas_id, student_nim, student_nama, student_kelas, student_prodi, no_telepon, jumlah_unit, waktu_mulai, waktu_selesai, lokasi_ruangan, keperluan, catatan_peminjam, status)
-- VALUES ('BOOK-FST-9999', 'proj-01', '0701222012', 'Ahmad Farhan', 'ILKOM-1', 'S1 Ilmu Komputer (FST)', '081234567890', 1, '2026-10-25 08:00:00', '2026-10-25 11:00:00', 'Lab Komputasi Lt. 2', 'Praktikum', 'Butuh remote', 'pending');

-- Q5. Query Persetujuan (ACC) oleh Admin Sarpras & Pengurangan Stok
-- UPDATE peminjaman SET status = 'approved', catatan_admin = 'Di-ACC Admin Sarpras' WHERE id = 'BOOK-FST-9999';
-- UPDATE fasilitas SET tersedia_stok = tersedia_stok - 1 WHERE id = 'proj-01';

-- Q6. Query Pengembalian Alat oleh Admin Sarpras & Penambahan Stok Kembali
-- UPDATE peminjaman SET status = 'returned', catatan_admin = 'Alat diterima dalam kondisi baik' WHERE id = 'BOOK-FST-9999';
-- UPDATE fasilitas SET tersedia_stok = tersedia_stok + 1 WHERE id = 'proj-01';

-- Q7. Query Riwayat Peminjaman Mahasiswa Berdasarkan NIM
-- SELECT p.*, f.nama_barang, f.kategori 
-- FROM peminjaman p 
-- JOIN fasilitas f ON p.fasilitas_id = f.id 
-- WHERE p.student_nim = '0701222012' 
-- ORDER BY p.created_at DESC;

-- Q8. Query Rekap Semua Mahasiswa Ilmu Komputer Terdaftar Beserta Total Pinjam
-- SELECT u.nim, u.nama_lengkap, u.kelas, u.prodi, u.no_telepon, COUNT(p.id) AS total_pinjam
-- FROM users u
-- LEFT JOIN peminjaman p ON u.nim = p.student_nim
-- WHERE u.role = 'student' AND u.prodi LIKE '%Ilmu Komputer%'
-- GROUP BY u.nim, u.nama_lengkap, u.kelas, u.prodi, u.no_telepon
-- ORDER BY u.nim ASC;
