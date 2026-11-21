import { NextResponse } from 'next/server';
import { pool, query } from '@/lib/db';
import { cekAkses, aksesDitolak, responError, errorDatabase } from '@/lib/server';

async function setujuiPeminjaman(id) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const cek = await client.query(
      `SELECT * FROM loans
       WHERE id = $1 AND status = 'Menunggu Konfirmasi'
       FOR UPDATE`,
      [id]
    );
    if (cek.rows.length === 0) {
      throw new Error('Status transaksi tidak valid');
    }

    const stok = await client.query(
      `UPDATE books SET stock_avail = stock_avail - 1
       WHERE id = $1 AND stock_avail > 0
       RETURNING max_days`,
      [cek.rows[0].book_id]
    );
    if (stok.rows.length === 0) {
      throw new Error('Stok buku habis');
    }

    await client.query(
      `UPDATE loans
       SET status = 'Sedang Dipinjam',
           loan_date = CURRENT_DATE,
           due_date = CURRENT_DATE + $2::int
       WHERE id = $1`,
      [id, stok.rows[0].max_days]
    );

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function terimaPengembalian(id) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const hasil = await client.query(
      `UPDATE loans l
       SET status = 'Selesai',
           returned_at = CURRENT_DATE,
           fine_amount = GREATEST(0, CURRENT_DATE - l.due_date) * bk.fine_per_day,
           fine_status = CASE
             WHEN CURRENT_DATE > l.due_date AND bk.fine_per_day > 0
             THEN 'Tertunggak'
             ELSE 'Tidak Ada'
           END
       FROM books bk
       WHERE bk.id = l.book_id AND l.id = $1 AND l.status = 'Sedang Dipinjam'
       RETURNING l.book_id`,
      [id]
    );
    if (hasil.rows.length === 0) {
      throw new Error('Transaksi tidak valid');
    }

    await client.query(
      'UPDATE books SET stock_avail = stock_avail + 1 WHERE id = $1',
      [hasil.rows[0].book_id]
    );

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function PUT(request, { params }) {
  const id = Number(params.id);
  const aksi = params.action;

  const user = cekAkses();
  if (!user) {
    return aksesDitolak();
  }

  try {
    if (aksi === 'extend') {
      if (user.role !== 'Mahasiswa') {
        return aksesDitolak();
      }
      const hasil = await query(
        `UPDATE loans SET ext_status = 'Perpanjangan Diajukan'
         WHERE id = $1 AND user_id = $2
           AND status = 'Sedang Dipinjam' AND ext_status IS NULL`,
        [id, user.id]
      );
      if (hasil.rowCount === 0) {
        return responError(
          'Perpanjangan tidak dapat diajukan (maksimal satu kali)',
          400
        );
      }
      return NextResponse.json({});
    }

    if (user.role !== 'Pegawai' && user.role !== 'Admin') {
      return aksesDitolak();
    }

    if (aksi === 'approve') {
      await setujuiPeminjaman(id);
    } else if (aksi === 'reject') {
      const data = await request.json();
      if (!data.reason) {
        return responError('Alasan penolakan wajib diisi', 400);
      }
      await query(
        `UPDATE loans SET status = 'Ditolak', reject_reason = $2
         WHERE id = $1 AND status = 'Menunggu Konfirmasi'`,
        [id, data.reason]
      );
    } else if (aksi === 'return') {
      await terimaPengembalian(id);
    } else if (aksi === 'ext-approve') {
      await query(
        `UPDATE loans l
         SET ext_status = 'Perpanjangan Disetujui',
             due_date = l.due_date + bk.max_days
         FROM books bk
         WHERE bk.id = l.book_id AND l.id = $1
           AND l.ext_status = 'Perpanjangan Diajukan'`,
        [id]
      );
    } else if (aksi === 'ext-reject') {
      await query(
        `UPDATE loans SET ext_status = 'Perpanjangan Ditolak'
         WHERE id = $1 AND ext_status = 'Perpanjangan Diajukan'`,
        [id]
      );
    } else if (aksi === 'paid') {
      await query(
        `UPDATE loans SET fine_status = 'Lunas', paid_at = CURRENT_DATE
         WHERE id = $1 AND fine_status = 'Tertunggak'`,
        [id]
      );
    } else {
      return responError('Aksi tidak dikenal', 400);
    }

    return NextResponse.json({});
  } catch (error) {
    return errorDatabase(error);
  }
}