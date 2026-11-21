import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const kunci = new TextEncoder().encode(process.env.JWT_SECRET || 'dev');

const STAFF = ['Pegawai', 'Admin'];
const SEMUA = ['Admin', 'Pegawai', 'Mahasiswa'];

const halamanDibatasi = [
  ['/admin', ['Admin']],
  ['/kelola', STAFF],
];

const apiDibatasi = [
  ['/api/users', ['Admin']],
  ['/api/stats', ['Admin']],
  ['/api/loans', SEMUA],
  ['/api/reviews', ['Mahasiswa']],
];

const apiTulisDibatasi = [
  ['/api/books', STAFF],
  ['/api/categories', ['Admin']],
  ['/api/announcements', STAFF],
];

function cariAturan(daftar, alamat) {
  for (const aturan of daftar) {
    if (alamat.startsWith(aturan[0])) {
      return aturan;
    }
  }
  return null;
}

export async function middleware(request) {
  const alamat = request.nextUrl.pathname;
  const method = request.method;

  let user = null;
  try {
    const token = request.cookies.get('t');
    const hasil = await jwtVerify(token ? token.value : '', kunci);
    user = hasil.payload;
  } catch (error) {
    user = null;
  }
  const sudahLogin = user !== null && user.role !== 'Guest';

  if (alamat.startsWith('/api/')) {
    let aturan = cariAturan(apiDibatasi, alamat);
    if (!aturan && method !== 'GET') {
      aturan = cariAturan(apiTulisDibatasi, alamat);
    }
    if (!aturan) {
      return NextResponse.next();
    }
    if (!sudahLogin) {
      return NextResponse.json(
        { error: 'Silakan masuk terlebih dahulu' },
        { status: 401 }
      );
    }
    if (!aturan[1].includes(user.role)) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }
    return NextResponse.next();
  }

  if (alamat === '/login' || alamat === '/register') {
    if (sudahLogin) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  const aturan = cariAturan(halamanDibatasi, alamat);
  if (!aturan) {
    return NextResponse.next();
  }
  if (!sudahLogin) {
    const urlLogin = new URL('/login', request.url);
    urlLogin.searchParams.set('next', alamat);
    return NextResponse.redirect(urlLogin);
  }
  if (!aturan[1].includes(user.role)) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/kelola/:path*',
    '/login',
    '/register',
    '/api/:path*',
  ],
};