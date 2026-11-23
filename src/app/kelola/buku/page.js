'use client';
import { useState, useEffect, useCallback } from 'react';
import { BookCopy, Plus, Pencil, Trash2, Search } from 'lucide-react';
import { useApp } from '@/components/AppProvider';
import Modal from '@/components/Modal';
import { Empty } from '@/components/ui';
import { api } from '@/lib/client';

export default function DataBukuPage() {
  const { say, ask } = useApp();
  const [data, setData] = useState(null);
  const [form, setForm] = useState(null);
  const [kataCari, setKataCari] = useState('');
  const [daftarKategori, setDaftarKategori] = useState([]);

  const ambilData = useCallback(() => {
    api('books').then(setData);
  }, []);

  useEffect(() => {
    ambilData();
  }, [ambilData]);

  useEffect(() => {
    api('categories').then(setDaftarKategori);
  }, []);

  function ubahForm(nama, nilai) {
    setForm({ ...form, [nama]: nilai });
  }

  async function simpan(e) {
    e.preventDefault();
    try {
      if (form.id) {
        await api('books/' + form.id, 'PUT', form);
      } else {
        await api('books', 'POST', form);
      }
      say('Data berhasil disimpan');
      setForm(null);
      ambilData();
    } catch (error) {
      say(error.message, true);
    }
  }

  function hapus(baris) {
    ask({
      title: 'Hapus data ini?',
      text: 'Data yang sudah dihapus tidak dapat dikembalikan.',
      yes: 'Ya, hapus',
      no: 'Batal',
      icon: Trash2,
      onYes: async () => {
        try {
          await api('books/' + baris.id, 'DELETE');
          say('Data berhasil dihapus');
          ambilData();
        } catch (error) {
          say(error.message, true);
        }
      },
    });
  }

  let daftarBaris = [];
  if (data) {
    daftarBaris = data.filter((b) =>
      JSON.stringify(b).toLowerCase().includes(kataCari.toLowerCase())
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="grid h-14 w-14 place-items-center rounded-3xl bg-blue-600 text-white">
            <BookCopy className="h-7 w-7" />
          </span>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800">
              Data Buku
            </h2>
            <p className="text-sm text-slate-500">
              Kelola koleksi dan stok buku
            </p>
          </div>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition active:scale-[.98] disabled:opacity-50 disabled:cursor-not-allowed bg-blue-700 text-white hover:bg-blue-800"
          onClick={() => setForm({})}
        >
          <Plus className="h-4 w-4" />
          Tambah Data
        </button>
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative min-w-[220px] flex-1 sm:max-w-sm">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100 !pl-10"
            placeholder="Cari data…"
            value={kataCari}
            onChange={(e) => setKataCari(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-[1.25rem] border border-slate-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-blue-50 text-left text-[11px] font-bold uppercase tracking-wider text-blue-900/70">
                <th className="whitespace-nowrap px-5 py-4">Judul</th>
                <th className="whitespace-nowrap px-5 py-4">Pengarang</th>
                <th className="whitespace-nowrap px-5 py-4">Kategori</th>
                <th className="whitespace-nowrap px-5 py-4">Stok</th>
                <th className="whitespace-nowrap px-5 py-4">Tersedia</th>
                <th className="whitespace-nowrap px-5 py-4">ISBN</th>
                <th className="px-5 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {daftarBaris.map((baris) => (
                <tr
                  key={baris.id}
                  className="border-t border-slate-100 transition hover:bg-sky-50/60"
                >
                  <td className="max-w-[260px] truncate px-5 py-3.5 text-slate-700">
                    {baris.title}
                  </td>
                  <td className="max-w-[260px] truncate px-5 py-3.5 text-slate-700">
                    {baris.author}
                  </td>
                  <td className="max-w-[260px] truncate px-5 py-3.5 text-slate-700">
                    {baris.cat}
                  </td>
                  <td className="max-w-[260px] truncate px-5 py-3.5 text-slate-700">
                    {baris.stock_total}
                  </td>
                  <td className="max-w-[260px] truncate px-5 py-3.5 text-slate-700">
                    {baris.stock_avail}
                  </td>
                  <td className="max-w-[260px] truncate px-5 py-3.5 text-slate-700">
                    {baris.isbn}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-right">
                    <button
                      type="button"
                      title="Edit"
                      className="mr-2 inline-grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100"
                      onClick={() => setForm({ ...baris })}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      title="Hapus"
                      className="inline-grid h-9 w-9 place-items-center rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100"
                      onClick={() => hapus(baris)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data && daftarBaris.length === 0 && <Empty text="Belum ada data." />}
          {!data && <Empty text="Memuat data…" />}
        </div>
      </div>

      {form && (
        <Modal
          title={form.id ? 'Edit Data' : 'Tambah Data'}
          onClose={() => setForm(null)}
        >
          <form onSubmit={simpan} className="grid gap-4 sm:grid-cols-2">
            <label>
              <span className="mb-1 block text-xs font-bold text-slate-500">
                Judul buku
              </span>
              <input
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                type="text"
                required
                value={form.title || ''}
                onChange={(e) => ubahForm('title', e.target.value)}
              />
            </label>
            <label>
              <span className="mb-1 block text-xs font-bold text-slate-500">
                ISBN
              </span>
              <input
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                type="text"
                required
                value={form.isbn || ''}
                onChange={(e) => ubahForm('isbn', e.target.value)}
              />
            </label>
            <label>
              <span className="mb-1 block text-xs font-bold text-slate-500">
                Pengarang
              </span>
              <input
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                type="text"
                required
                value={form.author || ''}
                onChange={(e) => ubahForm('author', e.target.value)}
              />
            </label>
            <label>
              <span className="mb-1 block text-xs font-bold text-slate-500">
                Penerbit
              </span>
              <input
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                type="text"
                required
                value={form.publisher || ''}
                onChange={(e) => ubahForm('publisher', e.target.value)}
              />
            </label>
            <label>
              <span className="mb-1 block text-xs font-bold text-slate-500">
                Tahun terbit
              </span>
              <input
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                type="number"
                required
                min={0}
                value={form.year ?? ''}
                onChange={(e) => ubahForm('year', e.target.value)}
              />
            </label>
            <label>
              <span className="mb-1 block text-xs font-bold text-slate-500">
                Kategori
              </span>
              <select
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                required
                value={form.category_id || ''}
                onChange={(e) => ubahForm('category_id', e.target.value)}
              >
                <option value="">Pilih…</option>
                {daftarKategori.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="mb-1 block text-xs font-bold text-slate-500">
                Jumlah stok
              </span>
              <input
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                type="number"
                required
                min={0}
                value={form.stock_total ?? ''}
                onChange={(e) => ubahForm('stock_total', e.target.value)}
              />
            </label>
            <label>
              <span className="mb-1 block text-xs font-bold text-slate-500">
                Maks. pinjam (hari)
              </span>
              <input
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                type="number"
                required
                min={0}
                value={form.max_days ?? ''}
                onChange={(e) => ubahForm('max_days', e.target.value)}
              />
            </label>
            <label>
              <span className="mb-1 block text-xs font-bold text-slate-500">
                Denda per hari (Rp)
              </span>
              <input
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                type="number"
                required
                min={0}
                value={form.fine_per_day ?? ''}
                onChange={(e) => ubahForm('fine_per_day', e.target.value)}
              />
            </label>
            <label>
              <span className="mb-1 block text-xs font-bold text-slate-500">
                Link gambar sampul
              </span>
              <input
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                type="text"
                placeholder="(opsional)"
                value={form.cover_url || ''}
                onChange={(e) => ubahForm('cover_url', e.target.value)}
              />
            </label>
            <div className="flex justify-end gap-3 sm:col-span-2">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition active:scale-[.98] disabled:opacity-50 disabled:cursor-not-allowed bg-white border border-slate-300 text-slate-700 hover:border-blue-600 hover:text-blue-700"
                onClick={() => setForm(null)}
              >
                Batal
              </button>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition active:scale-[.98] disabled:opacity-50 disabled:cursor-not-allowed bg-blue-700 text-white hover:bg-blue-800"
              >
                Simpan
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}