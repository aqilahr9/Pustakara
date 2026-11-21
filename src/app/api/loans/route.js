import { NextResponse } from 'next/server';
import { query, SQL_PEMINJAMAN } from '@/lib/db';
import { cekAkses, aksesDitolak, responError, errorDatabase } from '@/lib/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = cekAkses();
  if (!user) {
    return aksesDitolak();
  }
  try {
    let hasil;
    if (user.role === 'Mahasiswa') {
      hasil = await query(
        `${SQL_PEMINJAMAN} WHERE l.user_id = $1 ORDER BY l.id DESC`,
        [user.id]
      );
    } else {
      hasil = await query(`${SQL_PEMINJAMAN} ORDER BY l.id DESC`);
    }
    return NextResponse.json(hasil.rows);
  } catch (error) {
    return errorDatabase(error);
  }
}

export async function POST(request) {
  const user = cekAkses(['Mahasiswa']);
  if (!user) {
    return aksesDitolak();
  }
  try {
    const data = await request.json();

    const denda = await query(
      `SELECT 1 FROM loans
       WHERE user_id = $1 AND fine_status = 'Tertunggak'`,
      [user.id]
    );
    if (denda.rows.length > 0) {
      return responError(
        'Peminjaman diblokir: lunasi denda tertunggak terlebih dahulu',
        400
      );
    }

    const buku = await query('SELECT stock_avail FROM books WHERE id = $1', [
      data.book_id,
    ]);
    if (buku.rows.length === 0 || buku.rows[0].stock_avail < 1) {
      return responError('Stok buku habis', 400);
    }

    const sama = await query(
      `SELECT 1 FROM loans
       WHERE user_id = $1 AND book_id = $2
         AND status IN ('Menunggu Konfirmasi', 'Sedang Dipinjam')`,
      [user.id, data.book_id]
    );
    if (sama.rows.length > 0) {
      return responError('Anda sudah mengajukan/meminjam buku ini', 400);
    }

    await query('INSERT INTO loans (user_id, book_id) VALUES ($1, $2)', [
      user.id,
      data.book_id,
    ]);
    return NextResponse.json({});
  } catch (error) {
    return errorDatabase(error);
  }
}