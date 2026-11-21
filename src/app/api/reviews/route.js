import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { cekAkses, aksesDitolak, responError, errorDatabase } from '@/lib/server';

export async function POST(request) {
  const user = cekAkses(['Mahasiswa']);
  if (!user) {
    return aksesDitolak();
  }
  try {
    const data = await request.json();
    const rating = Number(data.rating);
    if (!(rating >= 1 && rating <= 5)) {
      return responError('Rating harus 1–5', 400);
    }

    const hasil = await query(
      `INSERT INTO reviews (loan_id, user_id, book_id, rating, comment)
       SELECT id, user_id, book_id, $2, $3
       FROM loans
       WHERE id = $1 AND user_id = $4 AND status = 'Selesai'
       RETURNING id`,
      [data.loan_id, rating, data.comment || '', user.id]
    );
    if (hasil.rows.length === 0) {
      return responError(
        'Ulasan hanya untuk buku yang sudah selesai dipinjam',
        400
      );
    }
    return NextResponse.json({});
  } catch (error) {
    return errorDatabase(error);
  }
}