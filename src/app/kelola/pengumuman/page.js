'use client';
import { useState, useEffect, useCallback } from 'react';
import { FilePen, Plus, Pencil, Trash2, Search } from 'lucide-react';
import { useApp } from '@/components/AppProvider';
import Modal from '@/components/Modal';
import { Empty, Badge } from '@/components/ui';
import { api, tanggal } from '@/lib/client';

export default function KelolaPengumumanPage() {
  const { say, ask } = useApp();
  const [data, setData] = useState(null);
  const [form, setForm] = useState(null);
  const [kataCari, setKataCari] = useState('');

  const ambilData = useCallback(() => {
    api('announcements').then(setData);
  }, []);

  useEffect(() => {
    ambilData();
  }, [ambilData]);

  function ubahForm(nama, nilai) {
    setForm({ ...form, [nama]: nilai });
  }

  async function simpan(e) {
    e.preventDefault();
    try {
      if (form.id) {
        await api('announcements/' + form.id, 'PUT', form);
      } else {
        await api('announcements', 'POST', form);
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
          await api('announcements/' + baris.id, 'DELETE');
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
            <FilePen className="h-7 w-7" />
          </span>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800">
              Kelola Pengumuman
            </h2>
            <p className="text-sm text-slate-500">
              Pengumuman operasional dan agenda
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
                <th className="whitespace-nowrap px-5 py-4">Kategori</th>
                <th className="whitespace-nowrap px-5 py-4">Rilis</th>
                <th className="whitespace-nowrap px-5 py-4">Status</th>
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
                    <Badge text={baris.category} />
                  </td>
                  <td className="max-w-[260px] truncate px-5 py-3.5 text-slate-700">
                    {tanggal(baris.release_date)}
                  </td>
                  <td className="max-w-[260px] truncate px-5 py-3.5 text-slate-700">
                    <Badge text={baris.status} />
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
                Judul
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
                Kategori
              </span>
              <select
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                required
                value={form.category || ''}
                onChange={(e) => ubahForm('category', e.target.value)}
              >
                <option value="">Pilih…</option>
                <option value="Operasional">Operasional</option>
                <option value="Layanan">Layanan</option>
                <option value="Acara">Acara</option>
              </select>
            </label>
            <label>
              <span className="mb-1 block text-xs font-bold text-slate-500">
                Tanggal rilis
              </span>
              <input
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                type="date"
                required
                value={form.release_date || ''}
                onChange={(e) => ubahForm('release_date', e.target.value)}
              />
            </label>
            <label>
              <span className="mb-1 block text-xs font-bold text-slate-500">
                Status
              </span>
              <select
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                required
                value={form.status || ''}
                onChange={(e) => ubahForm('status', e.target.value)}
              >
                <option value="">Pilih…</option>
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </label>
            <label>
              <span className="mb-1 block text-xs font-bold text-slate-500">
                Tanggal pelaksanaan / berlaku
              </span>
              <input
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                type="date"
                value={form.event_date || ''}
                onChange={(e) => ubahForm('event_date', e.target.value)}
              />
            </label>
            <label>
              <span className="mb-1 block text-xs font-bold text-slate-500">
                Lokasi
              </span>
              <input
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                type="text"
                placeholder="(opsional)"
                value={form.location || ''}
                onChange={(e) => ubahForm('location', e.target.value)}
              />
            </label>
            <label className="sm:col-span-2">
              <span className="mb-1 block text-xs font-bold text-slate-500">
                Isi pengumuman (pisahkan paragraf dengan baris kosong, awali
                poin dengan tanda -)
              </span>
              <textarea
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                rows={4}
                required
                value={form.content || ''}
                onChange={(e) => ubahForm('content', e.target.value)}
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