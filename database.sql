DROP TABLE IF EXISTS reviews, loans, announcements, books, categories, users CASCADE;

-- ======================== 1. STRUKTUR TABEL ==========================
CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN('Admin','Pegawai','Mahasiswa')),
  nim TEXT UNIQUE NOT NULL,
  active BOOLEAN DEFAULT TRUE
);
CREATE TABLE categories(
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  code TEXT UNIQUE NOT NULL,
  description TEXT
);
CREATE TABLE books(
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  isbn TEXT UNIQUE NOT NULL,
  author TEXT NOT NULL,
  publisher TEXT NOT NULL,
  year INT NOT NULL,
  category_id INT NOT NULL REFERENCES categories(id),
  stock_total INT NOT NULL CHECK(stock_total>=0),
  stock_avail INT NOT NULL CHECK(stock_avail>=0),
  max_days INT NOT NULL CHECK(max_days>=0),
  fine_per_day INT NOT NULL CHECK(fine_per_day>=0),
  cover_url TEXT                       
);
CREATE TABLE announcements(
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL CHECK(category IN('Operasional','Layanan','Acara')),
  release_date DATE NOT NULL,
  status TEXT NOT NULL CHECK(status IN('Draft','Published')),
  location TEXT,
  event_date DATE,
  author TEXT
);
CREATE TABLE loans(
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  book_id INT NOT NULL REFERENCES books(id),
  status TEXT NOT NULL DEFAULT 'Menunggu Konfirmasi'
    CHECK(status IN('Menunggu Konfirmasi','Sedang Dipinjam','Ditolak','Selesai')),
  request_date TIMESTAMP DEFAULT NOW(),
  loan_date DATE,
  due_date DATE,
  returned_at DATE,
  reject_reason TEXT,
  ext_status TEXT CHECK(ext_status IN('Perpanjangan Diajukan','Perpanjangan Disetujui','Perpanjangan Ditolak')),
  fine_status TEXT NOT NULL DEFAULT 'Tidak Ada' CHECK(fine_status IN('Tidak Ada','Tertunggak','Lunas')),
  fine_amount INT NOT NULL DEFAULT 0,
  paid_at DATE
);
CREATE TABLE reviews(
  id SERIAL PRIMARY KEY,
  loan_id INT UNIQUE NOT NULL REFERENCES loans(id),
  user_id INT NOT NULL REFERENCES users(id),
  book_id INT NOT NULL REFERENCES books(id),
  rating INT NOT NULL CHECK(rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_loans_user ON loans(user_id);
CREATE INDEX idx_loans_book ON loans(book_id);
CREATE INDEX idx_books_cat  ON books(category_id);

-- ======================== 2. DATA DUMMY ==============================
-- 2a. Pengguna 
INSERT INTO users(name,email,password,role,nim,active) VALUES
('Administrator Pustakara','admin@kampus.ac.id','$2a$10$BtjFdxbaxMazar1t88IuqeZheUxLCCNPGGtvOQA3aSWhUhb/hghAu','Admin','ADM001',TRUE),
('Siti Rahmawati','pegawai@kampus.ac.id','$2a$10$BtjFdxbaxMazar1t88IuqeZheUxLCCNPGGtvOQA3aSWhUhb/hghAu','Pegawai','PGW001',TRUE),
('Rahmat Hidayat','rahmat@kampus.ac.id','$2a$10$BtjFdxbaxMazar1t88IuqeZheUxLCCNPGGtvOQA3aSWhUhb/hghAu','Pegawai','PGW002',TRUE),
('Budi Santoso','budi@student.ac.id','$2a$10$BtjFdxbaxMazar1t88IuqeZheUxLCCNPGGtvOQA3aSWhUhb/hghAu','Mahasiswa','2024001',TRUE),
('Aisyah Putri','aisyah@student.ac.id','$2a$10$BtjFdxbaxMazar1t88IuqeZheUxLCCNPGGtvOQA3aSWhUhb/hghAu','Mahasiswa','2024002',TRUE),
('Muhammad Rizky','rizky@student.ac.id','$2a$10$BtjFdxbaxMazar1t88IuqeZheUxLCCNPGGtvOQA3aSWhUhb/hghAu','Mahasiswa','2024003',TRUE),
('Nur Fadilah','fadilah@student.ac.id','$2a$10$BtjFdxbaxMazar1t88IuqeZheUxLCCNPGGtvOQA3aSWhUhb/hghAu','Mahasiswa','2024004',TRUE),
('Andi Pratama','andi@student.ac.id','$2a$10$BtjFdxbaxMazar1t88IuqeZheUxLCCNPGGtvOQA3aSWhUhb/hghAu','Mahasiswa','2024005',TRUE),
('Dewi Lestari','dewi@student.ac.id','$2a$10$BtjFdxbaxMazar1t88IuqeZheUxLCCNPGGtvOQA3aSWhUhb/hghAu','Mahasiswa','2024006',TRUE),
('Fajar Nugroho','fajar@student.ac.id','$2a$10$BtjFdxbaxMazar1t88IuqeZheUxLCCNPGGtvOQA3aSWhUhb/hghAu','Mahasiswa','2023010',FALSE);

-- 2b. Kategori
INSERT INTO categories(name,code,description) VALUES
('Teknologi Informasi','TI','Pemrograman, basis data, jaringan, kecerdasan buatan'),
('Hukum','HK','Ilmu hukum dan perundang-undangan'),
('Kedokteran','KD','Anatomi, fisiologi, dan ilmu kesehatan'),
('Sastra & Bahasa','SB','Novel, sastra, dan linguistik'),
('Ekonomi & Bisnis','EB','Manajemen, ekonomi, dan kewirausahaan'),
('Pengembangan Diri','PD','Psikologi populer, kebiasaan, dan wawasan umum');

-- 2c. Buku
INSERT INTO books(title,isbn,author,publisher,year,category_id,stock_total,stock_avail,max_days,fine_per_day,cover_url) VALUES
('Clean Code','9780132350884','Robert C. Martin','Prentice Hall',2008,1,5,5,7,1000,'https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg?default=false'),
('Introduction to Algorithms','9780262033848','Thomas H. Cormen','MIT Press',2009,1,4,4,7,1500,'https://covers.openlibrary.org/b/isbn/9780262033848-L.jpg?default=false'),
('Computer Networks','9780132126953','Andrew S. Tanenbaum','Pearson',2010,1,3,3,7,1500,'https://covers.openlibrary.org/b/isbn/9780132126953-L.jpg?default=false'),
('Database System Concepts','9780078022159','Abraham Silberschatz','McGraw-Hill',2019,1,4,4,7,1000,'https://covers.openlibrary.org/b/isbn/9780078022159-L.jpg?default=false'),
('Operating System Concepts','9781118063330','Abraham Silberschatz','Wiley',2012,1,3,3,7,1500,'https://covers.openlibrary.org/b/isbn/9781118063330-L.jpg?default=false'),
('Artificial Intelligence: A Modern Approach','9780136042594','Stuart Russell','Pearson',2009,1,2,2,7,2000,'https://covers.openlibrary.org/b/isbn/9780136042594-L.jpg?default=false'),
('Algoritma dan Pemrograman','9786020000071','Rinaldi Munir','Informatika',2020,1,6,6,7,1000,'https://picsum.photos/seed/algoritma/400/600'),
('Python Crash Course','9781593279288','Eric Matthes','No Starch Press',2019,1,5,5,7,1000,'https://covers.openlibrary.org/b/isbn/9781593279288-L.jpg?default=false'),
('Pengantar Ilmu Hukum','9786020000088','Soerjono Soekanto','Rajawali Pers',2018,2,4,4,14,1000,'https://picsum.photos/seed/hukum1/400/600'),
('Hukum Pidana Indonesia','9786020000095','Moeljatno','Bumi Aksara',2015,2,3,3,14,1000,'https://picsum.photos/seed/hukum2/400/600'),
('Gray''s Anatomy for Students','9780323393041','Richard Drake','Elsevier',2019,3,2,2,7,2000,'https://covers.openlibrary.org/b/isbn/9780323393041-L.jpg?default=false'),
('Textbook of Medical Physiology','9781455770052','John E. Hall','Elsevier',2015,3,2,2,7,2000,'https://covers.openlibrary.org/b/isbn/9781455770052-L.jpg?default=false'),
('Laskar Pelangi','9789793062792','Andrea Hirata','Bentang Pustaka',2005,4,6,6,14,500,'https://covers.openlibrary.org/b/isbn/9789793062792-L.jpg?default=false'),
('Bumi Manusia','9789799731234','Pramoedya Ananta Toer','Lentera Dipantara',1980,4,4,4,14,500,'https://picsum.photos/seed/bumimanusia/400/600'),
('Pride and Prejudice','9780141439518','Jane Austen','Penguin Classics',2002,4,3,3,14,500,'https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg?default=false'),
('1984','9780451524935','George Orwell','Signet Classic',1961,4,3,3,14,500,'https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg?default=false'),
('Pengantar Manajemen','9786020000101','Stephen P. Robbins','Erlangga',2017,5,3,3,14,1000,'https://picsum.photos/seed/manajemen/400/600'),
('Principles of Economics','9781285165875','N. Gregory Mankiw','Cengage',2014,5,3,3,14,1000,'https://covers.openlibrary.org/b/isbn/9781285165875-L.jpg?default=false'),
('Atomic Habits','9780735211292','James Clear','Avery',2018,6,5,5,7,1000,'https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg?default=false'),
('Sapiens','9780062316097','Yuval Noah Harari','Harper',2015,6,4,4,14,1000,'https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg?default=false');

-- 2d. Pengumuman 
INSERT INTO announcements(title,content,category,release_date,status,location,event_date,author) VALUES
(E'Jadwal Layanan Selama Libur Semester',E'Dalam rangka libur semester ganjil, layanan sirkulasi perpustakaan mengalami penyesuaian jadwal.\n\nKetentuan selama masa libur:\n- Layanan peminjaman dan pengembalian di meja sirkulasi ditutup pada 24–31 Desember.\n- Pengembalian buku tetap dapat dilakukan melalui drop box di depan gedung perpustakaan.\n- Denda keterlambatan tidak dihitung selama masa penutupan layanan.\n- Layanan kembali normal pada hari kerja pertama di bulan Januari.\n\nMahasiswa yang membutuhkan buku selama libur dianjurkan mengajukan peminjaman sebelum tanggal penutupan. Informasi lebih lanjut dapat ditanyakan langsung kepada petugas di meja informasi.','Operasional',CURRENT_DATE,'Published','Meja Sirkulasi, Lantai 1',CURRENT_DATE+30,'Siti Rahmawati'),
(E'Pengadaan 200 Buku Baru',E'Perpustakaan telah menambah 200 judul buku baru untuk mendukung kebutuhan perkuliahan semester ini.\n\nKoleksi baru mencakup bidang:\n- Teknologi Informasi: pemrograman, basis data, dan kecerdasan buatan.\n- Hukum: hukum pidana, perdata, dan tata negara.\n- Kedokteran: anatomi, fisiologi, dan farmakologi.\n- Sastra dan umum: novel klasik, biografi, dan pengembangan diri.\n\nSeluruh judul sudah dapat dicari melalui katalog dan dipinjam mulai hari ini. Mahasiswa dapat mengusulkan judul lain melalui kotak saran di lantai 1.','Layanan',CURRENT_DATE-3,'Published','Rak Koleksi Baru, Lantai 2',CURRENT_DATE-3,'Rahmat Hidayat'),
(E'Workshop Literasi Informasi',E'Perpustakaan mengadakan workshop gratis untuk meningkatkan kemampuan mencari dan mengelola referensi ilmiah.\n\nMateri yang akan dibahas:\n- Teknik pencarian jurnal dan artikel ilmiah.\n- Cara menyusun daftar pustaka dan sitasi dengan benar.\n- Mengenali sumber terpercaya dan menghindari plagiarisme.\n\nPeserta akan mendapatkan sertifikat kehadiran. Kuota terbatas 40 peserta dan pendaftaran dilakukan langsung di meja informasi dengan menunjukkan kartu mahasiswa.','Acara',CURRENT_DATE-7,'Published','Ruang Multimedia, Lantai 2',CURRENT_DATE+7,'Siti Rahmawati'),
(E'Perubahan Jam Operasional Selama Ujian',E'Selama pekan ujian tengah dan akhir semester, jam operasional perpustakaan diperpanjang.\n\nJadwal selama masa ujian:\n- Senin sampai Jumat: 08.00–21.00.\n- Sabtu: 09.00–17.00.\n- Minggu: tutup.\n\nRuang baca tenang tetap tersedia dan dapat digunakan tanpa reservasi. Harap menjaga ketenangan dan kebersihan selama berada di dalam perpustakaan.','Operasional',CURRENT_DATE-10,'Published','Seluruh Area Perpustakaan',CURRENT_DATE-10,'Rahmat Hidayat'),
(E'Pengingat: Denda Keterlambatan',E'Setiap buku yang dikembalikan melewati tanggal jatuh tempo dikenakan denda sesuai tarif per hari yang tertera pada halaman buku.\n\nPerlu diperhatikan:\n- Mahasiswa dengan denda berstatus tertunggak tidak dapat mengajukan peminjaman baru.\n- Pelunasan denda dilakukan langsung di meja sirkulasi dan dicatat oleh pegawai.\n- Perpanjangan masa pinjam dapat diajukan satu kali sebelum jatuh tempo.\n\nHindari denda dengan memantau tanggal jatuh tempo pada halaman Beranda Anda.','Layanan',CURRENT_DATE-14,'Published','Meja Sirkulasi, Lantai 1',CURRENT_DATE-14,'Siti Rahmawati'),
(E'Bedah Buku: Laskar Pelangi',E'Komunitas literasi kampus berencana mengadakan bedah buku Laskar Pelangi karya Andrea Hirata.\n\nRencana kegiatan:\n- Diskusi bersama dosen sastra dan penulis tamu.\n- Sesi tanya jawab dengan peserta.\n\nJadwal dan tempat masih menunggu konfirmasi, pengumuman resmi akan diterbitkan setelahnya.','Acara',CURRENT_DATE+10,'Draft','Aula Perpustakaan',CURRENT_DATE+20,'Siti Rahmawati');

-- 2e. Transaksi peminjaman 
INSERT INTO loans(user_id,book_id,status,request_date,loan_date,due_date,returned_at,ext_status,fine_status,fine_amount,paid_at,reject_reason) VALUES
-- Selesai
(4,1 ,'Selesai',NOW()-INTERVAL '31 days',CURRENT_DATE-30,CURRENT_DATE-23,CURRENT_DATE-24,NULL,'Tidak Ada',0,NULL,NULL),
(5,1 ,'Selesai',NOW()-INTERVAL '29 days',CURRENT_DATE-28,CURRENT_DATE-21,CURRENT_DATE-20,NULL,'Lunas',1000,CURRENT_DATE-19,NULL),
(6,1 ,'Selesai',NOW()-INTERVAL '41 days',CURRENT_DATE-40,CURRENT_DATE-33,CURRENT_DATE-35,NULL,'Tidak Ada',0,NULL,NULL),
(4,7 ,'Selesai',NOW()-INTERVAL '27 days',CURRENT_DATE-26,CURRENT_DATE-19,CURRENT_DATE-21,NULL,'Tidak Ada',0,NULL,NULL),
(5,7 ,'Selesai',NOW()-INTERVAL '23 days',CURRENT_DATE-22,CURRENT_DATE-15,CURRENT_DATE-16,NULL,'Tidak Ada',0,NULL,NULL),
(7,13,'Selesai',NOW()-INTERVAL '51 days',CURRENT_DATE-50,CURRENT_DATE-36,CURRENT_DATE-38,NULL,'Tidak Ada',0,NULL,NULL),
(8,13,'Selesai',NOW()-INTERVAL '46 days',CURRENT_DATE-45,CURRENT_DATE-31,CURRENT_DATE-33,NULL,'Tidak Ada',0,NULL,NULL),
(9,13,'Selesai',NOW()-INTERVAL '41 days',CURRENT_DATE-40,CURRENT_DATE-26,CURRENT_DATE-27,NULL,'Tidak Ada',0,NULL,NULL),
(4,13,'Selesai',NOW()-INTERVAL '36 days',CURRENT_DATE-35,CURRENT_DATE-21,CURRENT_DATE-22,NULL,'Tidak Ada',0,NULL,NULL),
(6,19,'Selesai',NOW()-INTERVAL '34 days',CURRENT_DATE-33,CURRENT_DATE-26,CURRENT_DATE-28,NULL,'Tidak Ada',0,NULL,NULL),
(7,19,'Selesai',NOW()-INTERVAL '21 days',CURRENT_DATE-20,CURRENT_DATE-13,CURRENT_DATE-14,NULL,'Tidak Ada',0,NULL,NULL),
(5,2 ,'Selesai',NOW()-INTERVAL '19 days',CURRENT_DATE-18,CURRENT_DATE-11,CURRENT_DATE-12,NULL,'Tidak Ada',0,NULL,NULL),
(8,4 ,'Selesai',NOW()-INTERVAL '35 days',CURRENT_DATE-34,CURRENT_DATE-27,CURRENT_DATE-29,NULL,'Tidak Ada',0,NULL,NULL),
(9,8 ,'Selesai',NOW()-INTERVAL '16 days',CURRENT_DATE-15,CURRENT_DATE-8 ,CURRENT_DATE-9 ,NULL,'Tidak Ada',0,NULL,NULL),
(4,20,'Selesai',NOW()-INTERVAL '43 days',CURRENT_DATE-42,CURRENT_DATE-28,CURRENT_DATE-30,NULL,'Tidak Ada',0,NULL,NULL),
(6,9 ,'Selesai',NOW()-INTERVAL '61 days',CURRENT_DATE-60,CURRENT_DATE-46,CURRENT_DATE-48,NULL,'Tidak Ada',0,NULL,NULL),
-- Selesai + denda TERTUNGGAK (Andi diblokir: 5 hari x Rp1.500)
(8,3 ,'Selesai',NOW()-INTERVAL '26 days',CURRENT_DATE-25,CURRENT_DATE-18,CURRENT_DATE-13,NULL,'Tertunggak',7500,NULL,NULL),
-- Sedang Dipinjam
(4,3 ,'Sedang Dipinjam',NOW()-INTERVAL '4 days',CURRENT_DATE-3 ,CURRENT_DATE+4 ,NULL,NULL,'Tidak Ada',0,NULL,NULL),
(5,9 ,'Sedang Dipinjam',NOW()-INTERVAL '6 days',CURRENT_DATE-5 ,CURRENT_DATE+9 ,NULL,'Perpanjangan Diajukan','Tidak Ada',0,NULL,NULL),
(6,2 ,'Sedang Dipinjam',NOW()-INTERVAL '13 days',CURRENT_DATE-12,CURRENT_DATE-5 ,NULL,NULL,'Tidak Ada',0,NULL,NULL),   -- terlambat 5 hari (denda berjalan)
(7,1 ,'Sedang Dipinjam',NOW()-INTERVAL '3 days',CURRENT_DATE-2 ,CURRENT_DATE+5 ,NULL,NULL,'Tidak Ada',0,NULL,NULL),
(9,13,'Sedang Dipinjam',NOW()-INTERVAL '7 days',CURRENT_DATE-6 ,CURRENT_DATE+22,NULL,'Perpanjangan Disetujui','Tidak Ada',0,NULL,NULL),
-- Menunggu Konfirmasi
(4,6 ,'Menunggu Konfirmasi',NOW()-INTERVAL '1 day',NULL,NULL,NULL,NULL,'Tidak Ada',0,NULL,NULL),
(7,11,'Menunggu Konfirmasi',NOW()-INTERVAL '3 hours',NULL,NULL,NULL,NULL,'Tidak Ada',0,NULL,NULL),
(5,19,'Menunggu Konfirmasi',NOW()-INTERVAL '30 minutes',NULL,NULL,NULL,NULL,'Tidak Ada',0,NULL,NULL),
-- Ditolak
(6,12,'Ditolak',NOW()-INTERVAL '2 days',NULL,NULL,NULL,NULL,'Tidak Ada',0,NULL,'Buku referensi, hanya boleh dibaca di tempat.');

-- 2f. Ulasan (hanya untuk transaksi berstatus Selesai)
INSERT INTO reviews(loan_id,user_id,book_id,rating,comment)
SELECT l.id,l.user_id,l.book_id,v.r,v.c FROM (VALUES
 (1,5,'Wajib dibaca semua programmer. Contohnya jelas dan praktis.'),
 (2,4,'Bagus, tapi beberapa bab terasa terlalu panjang.'),
 (3,5,'Mengubah cara saya menulis kode sehari-hari.'),
 (4,4,'Penjelasan algoritmanya mudah dipahami pemula.'),
 (6,5,'Kisah inspiratif tentang semangat belajar. Favorit saya!'),
 (7,5,'Ceritanya hangat dan menyentuh, sangat direkomendasikan.'),
 (8,4,'Bahasanya indah, alurnya mengalir.'),
 (10,5,'Kebiasaan kecil yang berdampak besar, praktis sekali.'),
 (11,4,'Banyak tips yang bisa langsung dipraktikkan.'),
 (12,5,'Referensi utama kuliah algoritma, lengkap.'),
 (14,4,'Cocok untuk belajar Python dari nol.'),
 (15,5,'Sudut pandang sejarah manusia yang menarik.'),
 (16,3,'Isinya bagus namun bahasanya cukup berat.')
) v(id,r,c) JOIN loans l ON l.id=v.id;

-- 2g. Sinkronkan stok tersedia = stok total − buku yang sedang dipinjam
UPDATE books b SET stock_avail=b.stock_total-(SELECT COUNT(*) FROM loans l WHERE l.book_id=b.id AND l.status='Sedang Dipinjam');