export const NAMA_APLIKASI = 'Pustakara';

export function rupiah(angka) {
  return 'Rp ' + Number(angka || 0).toLocaleString('id-ID');
}

export function tanggal(nilai) {
  if (!nilai) {
    return '-';
  }
  let teks = String(nilai);
  if (teks.length === 10) {
    teks = teks + 'T00:00';
  }
  return new Date(teks).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function tanggalLengkap(nilai) {
  if (!nilai) {
    return '-';
  }
  const teks = String(nilai).slice(0, 10) + 'T00:00';
  return new Date(teks).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function inisial(nama) {
  if (!nama) {
    return '?';
  }
  const kata = nama.split(' ').slice(0, 2);
  let hasil = '';
  for (const k of kata) {
    hasil = hasil + k[0];
  }
  return hasil.toUpperCase();
}

export function ringkasan(isi) {
  const baris = (isi || '').split('\n');
  for (const b of baris) {
    if (b.trim() !== '') {
      return b.trim();
    }
  }
  return '';
}

export async function api(alamat, method, data) {
  const respon = await fetch('/api/' + alamat, {
    method: method || 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: data ? JSON.stringify(data) : undefined,
  });
  const hasil = await respon.json().catch(() => ({}));
  if (!respon.ok) {
    throw new Error(hasil.error || 'Terjadi kesalahan');
  }
  return hasil;
}