import pg from 'pg';
import bcrypt from 'bcryptjs';
import fs from 'fs';
const c = new pg.Client({ connectionString: process.env.DATABASE_URL });
await c.connect();
await c.query(fs.readFileSync('schema.sql', 'utf8'));
if ((await c.query('SELECT 1 FROM users')).rowCount) {
  console.log('Data sudah ada, seed dilewati');
  process.exit();
}
const h = await bcrypt.hash('password123', 10);
for (const u of [
  ['Administrator', 'admin@kampus.ac.id', 'Admin', 'ADM001'],
  ['Siti Pegawai', 'pegawai@kampus.ac.id', 'Pegawai', 'PGW001'],
  ['Budi Santoso', 'budi@student.ac.id', 'Mahasiswa', '2024001'],
])
  await c.query(
    'INSERT INTO users(name,email,password,role,nim) VALUES($1,$2,$3,$4,$5)',
    [u[0], u[1], h, u[2], u[3]]
  );
for (const k of [
  ['Teknologi Informasi', 'TI', 'Komputer, pemrograman, jaringan'],
  ['Hukum', 'HK', 'Ilmu hukum dan perundang-undangan'],
  ['Kedokteran', 'KD', 'Ilmu kesehatan dan medis'],
  ['Sastra & Bahasa', 'SB', 'Sastra, linguistik, bahasa'],
])
  await c.query(
    'INSERT INTO categories(name,code,description) VALUES($1,$2,$3)',
    k
  );
for (const b of [
  [
    'Algoritma dan Pemrograman',
    '978-100-001',
    'Rinaldi Munir',
    'Informatika',
    2020,
    1,
    5,
    7,
    1000,
  ],
  [
    'Basis Data Modern',
    '978-100-002',
    'Fathansyah',
    'Informatika',
    2019,
    1,
    4,
    7,
    1000,
  ],
  [
    'Jaringan Komputer',
    '978-100-003',
    'Andrew Tanenbaum',
    'Pearson',
    2021,
    1,
    3,
    7,
    1500,
  ],
  [
    'Pengantar Ilmu Hukum',
    '978-100-004',
    'Soerjono Soekanto',
    'Rajawali',
    2018,
    2,
    4,
    14,
    1000,
  ],
  ['Anatomi Manusia', '978-100-005', 'Sobotta', 'EGC', 2022, 3, 2, 7, 2000],
  [
    'Laskar Pelangi',
    '978-100-006',
    'Andrea Hirata',
    'Bentang',
    2005,
    4,
    6,
    14,
    500,
  ],
])
  await c.query(
    'INSERT INTO books(title,isbn,author,publisher,year,category_id,stock_total,stock_avail,max_days,fine_per_day,cover_url) VALUES($1,$2,$3,$4,$5,$6,$7,$7,$8,$9,$10)',
    [...b.slice(0, 7), b[7], b[8], `https://picsum.photos/seed/${b[1]}/400/600`]
  );
await c.query(`INSERT INTO announcements(title,content,category,release_date,status,location,event_date,author) VALUES
(E'Jadwal Layanan Selama Libur Semester',E'Dalam rangka libur semester ganjil, layanan sirkulasi perpustakaan mengalami penyesuaian jadwal.

Ketentuan selama masa libur:
- Layanan peminjaman dan pengembalian di meja sirkulasi ditutup pada 24–31 Desember.
- Pengembalian buku tetap dapat dilakukan melalui drop box di depan gedung perpustakaan.
- Denda keterlambatan tidak dihitung selama masa penutupan layanan.
- Layanan kembali normal pada hari kerja pertama di bulan Januari.

Mahasiswa yang membutuhkan buku selama libur dianjurkan mengajukan peminjaman sebelum tanggal penutupan. Informasi lebih lanjut dapat ditanyakan langsung kepada petugas di meja informasi.','Operasional',CURRENT_DATE,'Published','Meja Sirkulasi, Lantai 1',CURRENT_DATE+30,'Siti Rahmawati'),
(E'Pengadaan 200 Buku Baru',E'Perpustakaan telah menambah 200 judul buku baru untuk mendukung kebutuhan perkuliahan semester ini.

Koleksi baru mencakup bidang:
- Teknologi Informasi: pemrograman, basis data, dan kecerdasan buatan.
- Hukum: hukum pidana, perdata, dan tata negara.
- Kedokteran: anatomi, fisiologi, dan farmakologi.
- Sastra dan umum: novel klasik, biografi, dan pengembangan diri.

Seluruh judul sudah dapat dicari melalui katalog dan dipinjam mulai hari ini. Mahasiswa dapat mengusulkan judul lain melalui kotak saran di lantai 1.','Layanan',CURRENT_DATE-3,'Published','Rak Koleksi Baru, Lantai 2',CURRENT_DATE-3,'Rahmat Hidayat'),
(E'Workshop Literasi Informasi',E'Perpustakaan mengadakan workshop gratis untuk meningkatkan kemampuan mencari dan mengelola referensi ilmiah.

Materi yang akan dibahas:
- Teknik pencarian jurnal dan artikel ilmiah.
- Cara menyusun daftar pustaka dan sitasi dengan benar.
- Mengenali sumber terpercaya dan menghindari plagiarisme.

Peserta akan mendapatkan sertifikat kehadiran. Kuota terbatas 40 peserta dan pendaftaran dilakukan langsung di meja informasi dengan menunjukkan kartu mahasiswa.','Acara',CURRENT_DATE-7,'Published','Ruang Multimedia, Lantai 2',CURRENT_DATE+7,'Siti Rahmawati'),
(E'Perubahan Jam Operasional Selama Ujian',E'Selama pekan ujian tengah dan akhir semester, jam operasional perpustakaan diperpanjang.

Jadwal selama masa ujian:
- Senin sampai Jumat: 08.00–21.00.
- Sabtu: 09.00–17.00.
- Minggu: tutup.

Ruang baca tenang tetap tersedia dan dapat digunakan tanpa reservasi. Harap menjaga ketenangan dan kebersihan selama berada di dalam perpustakaan.','Operasional',CURRENT_DATE-10,'Published','Seluruh Area Perpustakaan',CURRENT_DATE-10,'Rahmat Hidayat'),
(E'Pengingat: Denda Keterlambatan',E'Setiap buku yang dikembalikan melewati tanggal jatuh tempo dikenakan denda sesuai tarif per hari yang tertera pada halaman buku.

Perlu diperhatikan:
- Mahasiswa dengan denda berstatus tertunggak tidak dapat mengajukan peminjaman baru.
- Pelunasan denda dilakukan langsung di meja sirkulasi dan dicatat oleh pegawai.
- Perpanjangan masa pinjam dapat diajukan satu kali sebelum jatuh tempo.

Hindari denda dengan memantau tanggal jatuh tempo pada halaman Beranda Anda.','Layanan',CURRENT_DATE-14,'Published','Meja Sirkulasi, Lantai 1',CURRENT_DATE-14,'Siti Rahmawati')`);
console.log(
  'Seed selesai. Login: admin@kampus.ac.id / pegawai@kampus.ac.id / budi@student.ac.id — password: password123'
);
process.exit();
