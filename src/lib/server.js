import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'dev';

export function getUser() {
  const cookie = cookies().get('t');
  if (!cookie) {
    return null;
  }
  try {
    return jwt.verify(cookie.value, SECRET);
  } catch (error) {
    return null;
  }
}

export function cekAkses(rolesBoleh) {
  const user = getUser();
  if (!user || user.role === 'Guest') {
    return null;
  }
  if (rolesBoleh && !rolesBoleh.includes(user.role)) {
    return null;
  }
  return user;
}

export function responError(pesan, status) {
  return NextResponse.json({ error: pesan }, { status: status });
}

export function aksesDitolak() {
  return responError('Akses ditolak', 403);
}

export function errorDatabase(error) {
  if (error.code === '23503') {
    return responError(
      'Data memiliki riwayat transaksi/relasi sehingga tidak dapat dihapus (untuk pengguna, nonaktifkan akunnya)',
      409
    );
  }
  if (error.code === '23505') {
    return responError(
      'Data duplikat (email/NIM/ISBN/kode sudah terdaftar)',
      409
    );
  }
  return responError(error.message, 400);
}

export function simpanLogin(user) {
  const token = jwt.sign(
    { id: user.id, name: user.name, role: user.role },
    SECRET,
    { expiresIn: '7d' }
  );
  const respon = NextResponse.json({
    user: { id: user.id, name: user.name, role: user.role },
  });
  respon.cookies.set('t', token, {
    httpOnly: true,
    path: '/',
    maxAge: 604800,
    sameSite: 'lax',
  });
  return respon;
}

export function fieldKosong(data, daftarField) {
  for (const nama of daftarField) {
    const nilai = data[nama];
    if (nilai === undefined || nilai === null || nilai === '') {
      return nama;
    }
  }
  return null;
}

export function nullKalauKosong(nilai) {
  if (nilai === '' || nilai === undefined) {
    return null;
  }
  return nilai;
}