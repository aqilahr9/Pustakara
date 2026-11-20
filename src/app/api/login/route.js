import bcrypt from 'bcryptjs';
import { query } from '@/lib/db';
import { responError, simpanLogin, errorDatabase } from '@/lib/server';

export async function POST(request) {
  try {
    const data = await request.json();
    const hasil = await query(
      'SELECT * FROM users WHERE email = $1 AND active',
      [data.email || '']
    );
    const user = hasil.rows[0];
    if (!user) {
      return responError('Email atau password salah', 401);
    }
    const cocok = await bcrypt.compare(data.password || '', user.password);
    if (!cocok) {
      return responError('Email atau password salah', 401);
    }
    return simpanLogin(user);
  } catch (error) {
    return errorDatabase(error);
  }
}
