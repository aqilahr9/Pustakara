import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query } from '@/lib/db';
import { cekAkses, aksesDitolak, responError, errorDatabase, fieldKosong } from '@/lib/server';

export async function PUT(request, { params }) {
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

    await query(
      `UPDATE users
       SET name = $1, email = $2, role = $3, nim = $4, active = $5
       WHERE id = $6`,
      [data.name, data.email, data.role, data.nim, data.active, params.id]
    );
    if (data.password) {
      const passwordHash = await bcrypt.hash(data.password, 10);
      await query('UPDATE users SET password = $1 WHERE id = $2', [
        passwordHash,
        params.id,
      ]);
    }
    return NextResponse.json({});
  } catch (error) {
    return errorDatabase(error);
  }
}

export async function DELETE(request, { params }) {
  const admin = cekAkses(['Admin']);
  if (!admin) {
    return aksesDitolak();
  }
  try {
    if (Number(params.id) === admin.id) {
      return responError('Tidak dapat menghapus akun sendiri', 400);
    }
    const cek = await query(
      `SELECT 1 FROM loans
       WHERE user_id = $1
         AND status IN ('Menunggu Konfirmasi', 'Sedang Dipinjam')`,
      [params.id]
    );
    if (cek.rows.length > 0) {
      return responError(
        'Pengguna masih memiliki transaksi aktif, tidak dapat dihapus',
        400
      );
    }
    await query('DELETE FROM users WHERE id = $1', [params.id]);
    return NextResponse.json({});
  } catch (error) {
    return errorDatabase(error);
  }
}