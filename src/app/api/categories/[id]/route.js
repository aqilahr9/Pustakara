import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { cekAkses, aksesDitolak, responError, errorDatabase, fieldKosong, nullKalauKosong } from '@/lib/server';

export async function PUT(request, { params }) {
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
      'UPDATE categories SET name = $1, code = $2, description = $3 WHERE id = $4 RETURNING *',
      [data.name, data.code, nullKalauKosong(data.description), params.id]
    );
    return NextResponse.json(hasil.rows[0]);
  } catch (error) {
    return errorDatabase(error);
  }
}

export async function DELETE(request, { params }) {
  if (!cekAkses(['Admin'])) {
    return aksesDitolak();
  }
  try {
    const cek = await query(
      'SELECT COUNT(*) AS n FROM books WHERE category_id = $1',
      [params.id]
    );
    const jumlah = cek.rows[0].n;
    if (jumlah > 0) {
      return responError(
        `Kategori masih digunakan oleh ${jumlah} buku, tidak dapat dihapus`,
        400
      );
    }
    await query('DELETE FROM categories WHERE id = $1', [params.id]);
    return NextResponse.json({});
  } catch (error) {
    return errorDatabase(error);
  }
}