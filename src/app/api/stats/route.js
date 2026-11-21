import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { cekAkses, aksesDitolak, errorDatabase } from '@/lib/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!cekAkses(['Admin'])) {
    return aksesDitolak();
  }
  try {
    const hasil = await query(`
      SELECT
        (SELECT COUNT(*) FROM books) AS titles,
        (SELECT COALESCE(SUM(stock_total), 0) FROM books) AS copies,
        (SELECT COUNT(*) FROM users WHERE role = 'Mahasiswa') AS students,
        (SELECT COUNT(*) FROM loans WHERE status = 'Sedang Dipinjam') AS active,
        (SELECT COALESCE(SUM(fine_amount), 0) FROM loans
          WHERE fine_status = 'Lunas') AS paid
    `);
    return NextResponse.json(hasil.rows[0]);
  } catch (error) {
    return errorDatabase(error);
  }
}