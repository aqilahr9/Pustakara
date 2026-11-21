import { NextResponse } from 'next/server';
import { query, SQL_BUKU } from '@/lib/db';
import { cekAkses, aksesDitolak, responError, errorDatabase, fieldKosong, nullKalauKosong } from '@/lib/server';

export const dynamic = 'force-dynamic';

const FIELD_WAJIB = ['title', 'isbn', 'author', 'publisher', 'year', 'category_id', 'stock_total', 'max_days', 'fine_per_day'];

export async function GET(request) {
  try {
    const params = request.nextUrl.searchParams;
    const cari = params.get('search') || '';
    const kategori = params.get('cat') || '';

    let urutan = 'b.title';
    if (params.get('sort') === 'year') {
      urutan = 'b.year DESC';
    }
    if (params.get('sort') === 'rating') {
      urutan = 'rating DESC';
    }

    const hasil = await query(
      `${SQL_BUKU}
       WHERE ($1 = '' OR b.title ILIKE '%' || $1 || '%'
                      OR b.author ILIKE '%' || $1 || '%')
         AND ($2 = '' OR b.category_id::text = $2)
       ORDER BY ${urutan}`,
      [cari, kategori]
    );
    return NextResponse.json(hasil.rows);
  } catch (error) {
    return errorDatabase(error);
  }
}

export async function POST(request) {
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

    const hasil = await query(
      `INSERT INTO books
         (title, isbn, author, publisher, year, category_id,
          stock_total, max_days, fine_per_day, cover_url, stock_avail)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $7)
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
      ]
    );
    return NextResponse.json(hasil.rows[0]);
  } catch (error) {
    return errorDatabase(error);
  }
}