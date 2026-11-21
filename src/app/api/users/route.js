import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query } from '@/lib/db';
import { cekAkses, aksesDitolak, responError, errorDatabase, fieldKosong } from '@/lib/server';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  if (!cekAkses(['Admin'])) {
    return aksesDitolak();
  }
  try {
    const role = request.nextUrl.searchParams.get('role') || '';
    const hasil = await query(
      `SELECT id, name, email, role, nim, active
       FROM users
       WHERE ($1 = '' OR role = $1)
       ORDER BY id`,
      [role]
    );
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
    if (data.active === undefined) {
      data.active = true;
    }
    const kosong = fieldKosong(data, ['name', 'email', 'role', 'nim']);
    if (kosong) {
      return responError(`Kolom "${kosong}" wajib diisi`, 400);
    }
    if (!/^\S+@\S+\.\S+$/.test(data.email)) {
      return responError('Format email tidak valid', 400);
    }
    if (!data.password) {
      return responError('Password wajib diisi', 400);
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const hasil = await query(
      `INSERT INTO users (name, email, role, nim, active, password)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, name, email, role, nim, active`,
      [data.name, data.email, data.role, data.nim, data.active, passwordHash]
    );
    return NextResponse.json(hasil.rows[0]);
  } catch (error) {
    return errorDatabase(error);
  }
}