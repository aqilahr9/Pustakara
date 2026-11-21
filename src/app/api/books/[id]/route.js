import { NextResponse } from 'next/server';
import { query, SQL_BUKU } from '@/lib/db';
import { getUser, cekAkses, aksesDitolak, responError, errorDatabase, fieldKosong, nullKalauKosong } from '@/lib/server';

export const dynamic = 'force-dynamic';

const FIELD_WAJIB = ['title', 'isbn', 'author', 'publisher', 'year', 'category_id', 'stock_total', 'max_days', 'fine_per_day'];

export async function GET(request, { params }) {
  try {
    const hasilBuku = await query(`${SQL_BUKU} WHERE b.id = $1`, [params.id]);
    const buku = hasilBuku.rows[0];
    if (!buku) {
      return responError('Buku tidak ditemukan', 404);
    }

    const hasilUlasan = await query(
      `SELECT r.*, u.name
       FROM reviews r
       JOIN users u ON u.id = r.user_id
       WHERE r.book_id = $1
       ORDER BY r.id DESC`,
      [params.id]
    );

    let blocked = false;
    const user = getUser();
    if (user && user.role === 'Mahasiswa') {
      const cek = await query(
        `SELECT 1 FROM loans
         WHERE user_id = $1 AND fine_status = 'Tertunggak'`,
        [user.id]
      );
      blocked = cek.rows.length > 0;
    }

    return NextResponse.json({
      book: buku,
      reviews: hasilUlasan.rows,
      blocked: blocked,
    });
  } catch (error) {
    return errorDatabase(error);
  }
}

export async function PUT(request, { params }) {
  if (!cekAkses(['Pegawai', 'Admin'])) {
    return aksesDitolak();
  }
  try {
    const data = await request.json();
    const kosong = fieldKosong(data, FIELD_WAJIB);
    if (kosong) {
      return responError(`Kolom "${kosong}" wajib diisi`, 400);
    }
    if (
      data.year < 0 ||
      data.stock_total < 0 ||
      data.max_days < 0 ||
      data.fine_per_day < 0
    ) {
      return responError('Nilai angka tidak boleh negatif', 400);
    }

    const lama = await query('SELECT stock_total FROM books WHERE id = $1', [
      params.id,
    ]);
    const selisih = data.stock_total - lama.rows[0].stock_total;
    await query(
      'UPDATE books SET stock_avail = GREATEST(0, stock_avail + $1) WHERE id = $2',
      [selisih, params.id]
    );

    const hasil = await query(
      `UPDATE books
       SET title = $1, isbn = $2, author = $3, publisher = $4, year = $5,
           category_id = $6, stock_total = $7, max_days = $8,
           fine_per_day = $9, cover_url = $10
       WHERE id = $11
       RETURNING *`,
      [
        data.title,
        data.isbn,
        data.author,
        data.publisher,
        data.year,
        data.category_id,
        data.stock_total,
        data.max_days,
        data.fine_per_day,
        nullKalauKosong(data.cover_url),
        params.id,
      ]
    );
    return NextResponse.json(hasil.rows[0]);
  } catch (error) {
    return errorDatabase(error);
  }
}

export async function DELETE(request, { params }) {
  if (!cekAkses(['Pegawai', 'Admin'])) {
    return aksesDitolak();
  }
  try {
    const cek = await query(
      `SELECT 1 FROM loans
       WHERE book_id = $1
         AND status IN ('Menunggu Konfirmasi', 'Sedang Dipinjam')`,
      [params.id]
    );
    if (cek.rows.length > 0) {
      return responError(
        'Buku sedang dipinjam/diajukan, tidak dapat dihapus',
        400
      );
    }
    await query('DELETE FROM books WHERE id = $1', [params.id]);
    return NextResponse.json({});
  } catch (error) {
    return errorDatabase(error);
  }
}