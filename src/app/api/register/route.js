import bcrypt from 'bcryptjs';
import { query } from '@/lib/db';
import { responError, simpanLogin, errorDatabase } from '@/lib/server';

export async function POST(request) {
  try {
    const data = await request.json();
    const emailKampus = /^[^@\s]+@[^@\s]+\.ac\.id$/i;
    if (!emailKampus.test(data.email || '')) {
      return responError('Gunakan email kampus berakhiran .ac.id', 400);
    }
    if (!data.name || !data.nim || !data.password || data.password.length < 6) {
      return responError(
        'Semua data wajib diisi (password minimal 6 karakter)',
        400
      );
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const hasil = await query(
      `INSERT INTO users (name, email, password, role, nim)
       VALUES ($1, $2, $3, 'Mahasiswa', $4)
       RETURNING *`,
      [data.name, data.email, passwordHash, data.nim]
    );
    return simpanLogin(hasil.rows[0]);
  } catch (error) {
    return errorDatabase(error);
  }
}