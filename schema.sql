CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN('Admin','Pegawai','Mahasiswa')),
    nim TEXT UNIQUE NOT NULL,
    active BOOLEAN DEFAULT TRUE
);
CREATE TABLE IF NOT EXISTS categories(
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    code TEXT UNIQUE NOT NULL,
    description TEXT
);
CREATE TABLE IF NOT EXISTS books(
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
CREATE TABLE IF NOT EXISTS announcements(
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
CREATE TABLE IF NOT EXISTS loans(
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    book_id INT NOT NULL REFERENCES books(id),
    status TEXT NOT NULL DEFAULT 'Menunggu Konfirmasi' CHECK(status IN('Menunggu Konfirmasi','Sedang Dipinjam','Ditolak','Selesai')),
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
CREATE TABLE IF NOT EXISTS reviews(
    id SERIAL PRIMARY KEY,
    loan_id INT UNIQUE NOT NULL REFERENCES loans(id),
    user_id INT NOT NULL REFERENCES users(id),
    book_id INT NOT NULL REFERENCES books(id),
    rating INT NOT NULL CHECK(rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
