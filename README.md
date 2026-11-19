# PUSTAKARA - MANAJEMEN PERPUSTAKAAN KAMPUS

Pustakara adalah aplikasi web manajemen perpustakaan kampus. Mahasiswa dapat menelusuri katalog, mengajukan peminjaman dan perpanjangan, memantau denda, serta memberi ulasan. Pegawai memproses peminjaman dan pengembalian di meja sirkulasi, sedangkan Admin mengelola akun, kategori, dan memantau seluruh aktivitas perpustakaan.

## Tentang

Aplikasi ini memiliki empat jenis pengguna:

- **Admin**: mengelola akun pengguna dan kategori buku, serta memantau statistik dan seluruh transaksi.
- **Pegawai Perpustakaan**: mengelola buku dan pengumuman, menyetujui peminjaman, menerima pengembalian, dan mencatat denda.
- **Mahasiswa**: meminjam buku, mengajukan perpanjangan, memantau denda, dan memberi ulasan.
- **Guest (Pengguna Umum)**: menjelajahi katalog dan pengumuman tanpa akun.

## Fitur

**Akses dan halaman awal**
- Pengunjung baru melihat halaman awal dengan tombol **Masuk** dan **Daftar**.
- Tombol **Continue as Guest** di halaman login dan register membuka aplikasi sebagai tamu tanpa akun. Tamu hanya dapat melihat katalog dan pengumuman, dan diajak masuk saat ingin meminjam.
- Pendaftaran khusus Mahasiswa dengan validasi email kampus (`.ac.id`), dan kolom password dapat ditampilkan atau disembunyikan.
- Menu di sisi kiri menyesuaikan peran pengguna. Di HP, menu berubah menjadi laci geser.
- Keluar akun selalu meminta konfirmasi lewat popup "Yakin ingin keluar?".

**Beranda (satu halaman untuk semua peran)**
- Banner sapaan sesuai peran dengan kolom pencarian cepat buku.
- Isi dashboard menyesuaikan peran (dijelaskan di bawah), diikuti 5 buku terpopuler, 3 pengumuman terbaru, dan informasi perpustakaan (lokasi, jam operasional, kontak, aturan pinjam).

**Katalog dan detail buku**
- Kartu buku menampilkan sampul, kategori, judul, penulis, tahun, rating bintang, dan label stok tersedia atau habis.
- Pencarian berdasarkan judul atau pengarang, filter kategori, serta pengurutan berdasarkan judul, tahun terbit terbaru, atau rating tertinggi.
- Halaman detail memuat ISBN, penerbit, tahun terbit, sisa stok, batas maksimal lama pinjam, denda per hari, dan daftar ulasan mahasiswa.
- Tombol **Ajukan Pinjam** hanya aktif untuk Mahasiswa yang tidak terblokir denda dan jika stok tersedia, lengkap dengan keterangan alasannya bila tidak aktif.

**Pengumuman**
- Daftar dapat difilter menurut kategori (Operasional, Layanan, Acara), dengan pengumuman terbaru tampil menonjol di atas.
- Halaman detail menampilkan isi lengkap (paragraf dan poin-poin) serta panel rincian: kategori, tanggal terbit, tanggal pelaksanaan atau berlaku, lokasi, penerbit, dan perkiraan waktu baca. Tersedia juga tombol salin tautan dan daftar pengumuman lainnya.

**Mahasiswa**
- Kartu ringkasan: jumlah buku sedang dipinjam, menunggu konfirmasi, selesai, dan total denda.
- Kartu peringatan denda tertunggak beserta status blokir peminjaman, dan peringatan denda berjalan untuk buku yang sudah lewat jatuh tempo.
- Tab **Aktif** berisi daftar peminjaman dengan tanggal jatuh tempo dan tombol **Ajukan Perpanjangan**. Tab **Riwayat** berisi transaksi sebelumnya, alasan penolakan, dan tombol **Tulis Ulasan**.
- Ulasan berupa rating bintang 1–5 dan komentar.

**Pegawai**
- Kartu ringkasan: antrean verifikasi, buku sedang dipinjam, permintaan perpanjangan, dan denda tertunggak.
- Meja sirkulasi dengan empat tab:
  - **Antrean**: Approve atau Reject (alasan penolakan wajib diisi lewat popup).
  - **Perpanjangan**: setujui atau tolak permintaan.
  - **Pengembalian**: cari transaksi aktif berdasarkan judul, nama, atau NIM, lalu terima pengembalian. Denda dihitung otomatis.
  - **Denda**: tandai denda tertunggak menjadi lunas.
- **Data Buku**: tambah, ubah, dan hapus buku lengkap dengan kategori, stok, durasi pinjam, tarif denda, dan link gambar sampul. Jika stok total diubah, stok tersedia ikut menyesuaikan.
- **Kelola Pengumuman**: tambah, ubah, dan hapus dengan status Draft atau Published, tanggal rilis, lokasi, dan tanggal pelaksanaan. Nama penerbit terisi otomatis dari akun yang membuat.

**Admin**
- Seluruh fitur Pegawai.
- Kartu statistik: total judul buku, total eksemplar, mahasiswa terdaftar, transaksi aktif, dan total denda yang sudah lunas.
- Monitoring seluruh transaksi perpustakaan lengkap dengan status, perpanjangan, dan denda.
- **Pengguna**: tambah, ubah, dan hapus akun, filter berdasarkan role, serta saklar untuk mengaktifkan atau menonaktifkan akun.
- **Kategori**: kelola nama, kode klasifikasi, dan deskripsi kategori.

**Kenyamanan penggunaan**
- Semua tabel pengelolaan memiliki kolom pencarian, form tambah dan ubah berbentuk popup, dan konfirmasi sebelum menghapus.
- Notifikasi singkat muncul untuk setiap aksi yang berhasil atau gagal.
- Gambar sampul yang gagal dimuat otomatis diganti kotak berisi judul buku.
- Tampilan responsif di HP, tablet, dan desktop.

## Aturan

**Peminjaman**
- Mahasiswa mengajukan pinjam, status menjadi *Menunggu Konfirmasi*.
- Pegawai menyetujui di meja sirkulasi: status menjadi *Sedang Dipinjam*, stok berkurang 1, dan jatuh tempo dihitung otomatis. Jika ditolak, alasan wajib diisi.
- Saat buku dikembalikan, status menjadi *Selesai* dan stok bertambah 1. Perubahan stok dilakukan dalam satu transaksi database.
- Mahasiswa tidak dapat mengajukan buku yang sama dua kali, dan tidak dapat meminjam buku yang stoknya habis.

**Perpanjangan**
- Dapat diajukan satu kali untuk buku yang sedang dipinjam.
- Jika disetujui pegawai, jatuh tempo bertambah sesuai durasi pinjam buku.

**Denda**
- Keterlambatan dihitung otomatis: jumlah hari terlambat dikalikan denda per hari.
- Denda tercatat *Tertunggak* saat buku dikembalikan terlambat, lalu diubah pegawai menjadi *Lunas* setelah dibayar.
- Selama masih ada denda tertunggak, mahasiswa tidak dapat mengajukan peminjaman baru.

**Ulasan**
- Rating dan ulasan hanya untuk transaksi berstatus *Selesai*, satu kali per transaksi.

**Data**
- Email, NIM, ISBN, nama kategori, dan kode kategori harus unik.
- Buku yang sedang dipinjam atau diajukan tidak dapat dihapus.
- Kategori yang masih dipakai buku tidak dapat dihapus.
- Pengguna yang masih memiliki transaksi aktif tidak dapat dihapus, dan Admin tidak dapat menghapus akunnya sendiri.
- Pengumuman berstatus Draft hanya terlihat oleh Pegawai dan Admin.
- Halaman pengelolaan hanya dapat dibuka oleh peran yang berwenang.