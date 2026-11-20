import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { cekAkses, aksesDitolak, responError, errorDatabase, fieldKosong, nullKalauKosong } from '@/lib/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const hasil = await query('SELECT * FROM categories ORDER BY name');
    return NextResponse.json(hasil.rows);
  } catch (error) {
    return errorDatabase(error);
  }
}

export async function POST(request) {
  if (!cekAkses(['Admin'])) {
    return aksesDitolak();
  }
  try {
    const data = await request.json();
    const kosong = fieldKosong(data, ['name', 'code']);
    if (kosong) {
      return responError(`Kolom "${kosong}" wajib diisi`, 400);
    }
    const hasil = await query(
      'INSERT INTO categories (name, code, description) VALUES ($1, $2, $3) RETURNING *',
      [data.name, data.code, nullKalauKosong(data.description)]
    );
    return NextResponse.json(hasil.rows[0]);
  } catch (error) {
    return errorDatabase(error);
  }
}