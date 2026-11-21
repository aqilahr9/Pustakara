import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUser, cekAkses, aksesDitolak, responError, errorDatabase, fieldKosong, nullKalauKosong } from '@/lib/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = getUser();
    let filter = "WHERE status = 'Published'";
    if (user && (user.role === 'Pegawai' || user.role === 'Admin')) {
      filter = '';
    }
    const hasil = await query(
      `SELECT * FROM announcements ${filter}
       ORDER BY release_date DESC, id DESC`
    );
    return NextResponse.json(hasil.rows);
  } catch (error) {
    return errorDatabase(error);
  }
}

export async function POST(request) {
  const user = cekAkses(['Pegawai', 'Admin']);
  if (!user) {
    return aksesDitolak();
  }
  try {
    const data = await request.json();
    const kosong = fieldKosong(data, [
      'title',
      'content',
      'category',
      'release_date',
      'status',
    ]);
    if (kosong) {
      return responError(`Kolom "${kosong}" wajib diisi`, 400);
    }
    const hasil = await query(
      `INSERT INTO announcements
         (title, content, category, release_date, status,
          location, event_date, author)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        data.title,
        data.content,
        data.category,
        data.release_date,
        data.status,
        nullKalauKosong(data.location),
        nullKalauKosong(data.event_date),
        user.name,
      ]
    );
    return NextResponse.json(hasil.rows[0]);
  } catch (error) {
    return errorDatabase(error);
  }
}