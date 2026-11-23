'use client';
import { useState, useEffect } from 'react';
import { Users, Plus, Pencil, Trash2, Search } from 'lucide-react';
import { useApp } from '@/components/AppProvider';
import Modal from '@/components/Modal';
import { Empty, Badge } from '@/components/ui';
import { api } from '@/lib/client';

export default function PenggunaPage() {
  const { say, ask } = useApp();
  const [data, setData] = useState(null);
  const [form, setForm] = useState(null);
  const [kataCari, setKataCari] = useState('');
  const [filterRole, setFilterRole] = useState('');

  function ambilData() {
    api(
      'users' + (filterRole ? '?role=' + encodeURIComponent(filterRole) : '')
    ).then(setData);
  }

  useEffect(() => {
    ambilData();
  }, [filterRole]);

  function ubahForm(nama, nilai) {
    setForm({ ...form, [nama]: nilai });
  }

  async function simpan(e) {
    e.preventDefault();
    try {
      if (form.id) {
        await api('users/' + form.id, 'PUT', form);
      } else {
        await api('users', 'POST', form);
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
          await api('users/' + baris.id, 'DELETE');
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
            <Users className="h-7 w-7" />
          </span>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800">
              Manajemen Pengguna
            </h2>
            <p className="text-sm text-slate-500">
              Kelola akun Admin, Pegawai, dan Mahasiswa
            </p>
          </div>
        </div>
        <button
          className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition active:scale-[.98] disabled:opacity-50 disabled:cursor-not-allowed bg-blue-700 text-white hover:bg-blue-800"
          onClick={() => setForm({ active: true })}
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
        <select
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100 sm:w-56"
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
        >
          <option value="">Semua role</option>
          <option value="Admin">Admin</option>
          <option value="Pegawai">Pegawai</option>
          <option value="Mahasiswa">Mahasiswa</option>
        </select>
      </div>

      <div className="rounded-[1.25rem] border border-slate-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-blue-50 text-left text-[11px] font-bold uppercase tracking-wider text-blue-900/70">
                <th className="whitespace-nowrap px-5 py-4">Nama</th>
                <th className="whitespace-nowrap px-5 py-4">Email</th>
                <th className="whitespace-nowrap px-5 py-4">NIM / ID</th>
                <th className="whitespace-nowrap px-5 py-4">Role</th>
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
                    {baris.name}
                  </td>
                  <td className="max-w-[260px] truncate px-5 py-3.5 text-slate-700">
                    {baris.email}
                  </td>
                  <td className="max-w-[260px] truncate px-5 py-3.5 text-slate-700">
                    {baris.nim}
                  </td>
                  <td className="max-w-[260px] truncate px-5 py-3.5 text-slate-700">
                    <Badge text={baris.role} />
                  </td>
                  <td className="max-w-[260px] truncate px-5 py-3.5 text-slate-700">
                    <Badge text={baris.active ? 'Published' : 'Draft'} />
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-right">
                    <button
                      title="Edit"
                      className="mr-2 inline-grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100"
                      onClick={() => setForm({ ...baris })}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
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
                Nama lengkap
              </span>
              <input
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                type="text"
                required
                value={form.name || ''}
                onChange={(e) => ubahForm('name', e.target.value)}
              />
            </label>
            <label>
              <span className="mb-1 block text-xs font-bold text-slate-500">
                Email
              </span>
              <input
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                type="email"
                required
                value={form.email || ''}
                onChange={(e) => ubahForm('email', e.target.value)}
              />
            </label>
            {!form.id && (
              <label>
                <span className="mb-1 block text-xs font-bold text-slate-500">
                  Password
                </span>
                <input
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  type="password"
                  required
                  value={form.password || ''}
                  onChange={(e) => ubahForm('password', e.target.value)}
                />
              </label>
            )}
            <label>
              <span className="mb-1 block text-xs font-bold text-slate-500">
                Role
              </span>
              <select
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                required
                value={form.role || ''}
                onChange={(e) => ubahForm('role', e.target.value)}
              >
                <option value="">Pilih…</option>
                <option value="Admin">Admin</option>
                <option value="Pegawai">Pegawai</option>
                <option value="Mahasiswa">Mahasiswa</option>
              </select>
            </label>
            <label>
              <span className="mb-1 block text-xs font-bold text-slate-500">
                NIM / Nomor identitas
              </span>
              <input
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                type="text"
                required
                value={form.nim || ''}
                onChange={(e) => ubahForm('nim', e.target.value)}
              />
            </label>
            <label>
              <span className="mb-1 block text-xs font-bold text-slate-500">
                Akun aktif
              </span>
              <button
                type="button"
                onClick={() => ubahForm('active', !form.active)}
                className={`mt-1 flex h-8 w-14 items-center rounded-full p-1 transition ${
                  form.active ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`h-6 w-6 rounded-full bg-white shadow transition ${
                    form.active ? 'translate-x-6' : ''
                  }`}
                />
              </button>
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