import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUser, cekAkses, aksesDitolak, responError, errorDatabase, fieldKosong, nullKalauKosong } from '@/lib/server';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    const user = getUser();
    let staff = false;
    if (user && (user.role === 'Pegawai' || user.role === 'Admin')) {
      staff = true;
    }
    const hasil = await query(
      `SELECT * FROM announcements
       WHERE id = $1 AND (status = 'Published' OR $2::boolean)`,
      [params.id, staff]
    );
    if (hasil.rows.length === 0) {
      return responError('Pengumuman tidak ditemukan', 404);
    }
    return NextResponse.json(hasil.rows[0]);
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
      `UPDATE announcements
       SET title = $1, content = $2, category = $3, release_date = $4,
           status = $5, location = $6, event_date = $7
       WHERE id = $8
       RETURNING *`,
      [
        data.title,
        data.content,
        data.category,
        data.release_date,
        data.status,
        nullKalauKosong(data.location),
        nullKalauKosong(data.event_date),
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
    await query('DELETE FROM announcements WHERE id = $1', [params.id]);
    return NextResponse.json({});
  } catch (error) {
    return errorDatabase(error);
  }
}