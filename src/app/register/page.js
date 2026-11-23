'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, UserRound, Contact, Compass, ArrowLeft } from 'lucide-react';
import { useApp } from '@/components/AppProvider';
import { Logo, InputField, PanelAuth } from '@/components/ui';
import { api } from '@/lib/client';

export default function RegisterPage() {
  const router = useRouter();
  const { say, simpanUser, masukSebagaiTamu } = useApp();
  const [form, setForm] = useState({
    name: '',
    nim: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  async function kirim(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const hasil = await api('register', 'POST', form);
      simpanUser(hasil.user);
      router.push('/');
    } catch (error) {
      say(error.message, true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      <PanelAuth />

      <div className="flex items-center justify-center p-6">
        <form onSubmit={kirim} className="animate-rise w-full max-w-md">
          <div className="mb-8 flex justify-center lg:hidden">
            <Logo textColor="text-blue-800" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800">
            Buat akun Mahasiswa
          </h1>
          <p className="mb-7 mt-1 text-sm text-slate-500">
            Gunakan email kampus berakhiran .ac.id
          </p>

          <div className="grid gap-3.5">
            <InputField
              icon={UserRound}
              type="text"
              required
              placeholder="Nama lengkap"
              value={form.name}
              onChange={(nilai) => setForm({ ...form, name: nilai })}
            />
            <InputField
              icon={Contact}
              type="text"
              required
              placeholder="NIM"
              value={form.nim}
              onChange={(nilai) => setForm({ ...form, nim: nilai })}
            />
            <InputField
              icon={Mail}
              type="email"
              required
              placeholder="Email"
              value={form.email}
              onChange={(nilai) => setForm({ ...form, email: nilai })}
            />
            <InputField
              icon={Lock}
              type="password"
              required
              placeholder="Password"
              value={form.password}
              onChange={(nilai) => setForm({ ...form, password: nilai })}
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold transition active:scale-[.98] disabled:opacity-50 disabled:cursor-not-allowed bg-blue-700 text-white hover:bg-blue-800 mt-1 py-3"
              disabled={loading}
            >
              {loading ? 'Memproses…' : 'Daftar Sekarang'}
            </button>

            <div className="my-1 flex items-center gap-3 text-xs text-slate-400">
              <span className="h-px flex-1 bg-slate-200" />
              atau
              <span className="h-px flex-1 bg-slate-200" />
            </div>

            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold transition active:scale-[.98] disabled:opacity-50 disabled:cursor-not-allowed bg-white border border-slate-300 text-slate-700 hover:border-blue-600 hover:text-blue-700 py-3"
              onClick={masukSebagaiTamu}
            >
              <Compass className="h-4 w-4" />
              Continue as Guest
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-slate-500">
            Sudah punya akun?{' '}
            <button
              type="button"
              className="font-bold text-blue-600"
              onClick={() => router.push('/login')}
            >
              Masuk
            </button>
          </p>
          <button
            type="button"
            onClick={() => router.push('/')}
            className="mx-auto mt-4 flex items-center gap-1 text-xs text-slate-400 hover:text-blue-600"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Kembali ke beranda
          </button>
        </form>
      </div>
    </div>
  );
}