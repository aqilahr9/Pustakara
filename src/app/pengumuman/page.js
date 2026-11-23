'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, CalendarDays } from 'lucide-react';
import AnnouncementItem from '@/components/AnnouncementItem';
import { Badge, Empty } from '@/components/ui';
import { api, tanggalLengkap, ringkasan } from '@/lib/client';

export default function PengumumanPage() {
  const router = useRouter();
  const [daftar, setDaftar] = useState(null);
  const [kategori, setKategori] = useState('');

  useEffect(() => {
    api('announcements')
      .then((res) => setDaftar(Array.isArray(res) ? res : []))
      .catch(() => setDaftar([]));
  }, []);

  if (!daftar) {
    return <Empty text="Memuat…" />;
  }

  const tampil = daftar.filter((a) => !kategori || a.category === kategori);
  const utama = tampil[0];
  const lainnya = tampil.slice(1);

  const pilihanKategori = ['', 'Operasional', 'Layanan', 'Acara'];

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {pilihanKategori.map((k) => (
          <button
            key={k || 'semua'}
            type="button"
            onClick={() => setKategori(k)}
            className={`rounded-full border px-4 py-1.5 text-sm font-bold transition ${
              kategori === k
                ? 'border-[#0b1d5e] bg-[#0b1d5e] text-white'
                : 'border-slate-300 bg-white text-slate-600 hover:border-blue-600 hover:text-blue-700'
            }`}
          >
            {k || 'Semua'}
          </button>
        ))}
      </div>

      {!utama && <Empty text="Belum ada pengumuman." />}

      {utama && (
        <>
          <div
            role="button"
            tabIndex={0}
            onClick={() => router.push('/pengumuman/' + utama.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                router.push('/pengumuman/' + utama.id);
              }
            }}
            className="relative mb-6 cursor-pointer overflow-hidden rounded-3xl bg-[#0b1d5e] p-7 text-white md:p-10"
          >
            <span className="absolute -right-12 -top-12 h-52 w-52 rounded-full bg-[#16358f]" />
            <span className="absolute bottom-6 right-8 h-3 w-3 rounded-full bg-sky-400" />
            <div className="relative max-w-2xl">
              <p className="mb-3 text-xs font-extrabold uppercase tracking-[.2em] text-sky-300">
                Terbaru
              </p>
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <Badge text={utama.category} />
                <span className="flex items-center gap-1 text-sm text-blue-200">
                  <CalendarDays className="h-4 w-4" />
                  {tanggalLengkap(utama.release_date)}
                </span>
              </div>
              <h2 className="text-2xl font-extrabold leading-tight md:text-4xl">
                {utama.title}
              </h2>
              <p className="mt-3 text-blue-100">{ringkasan(utama.content)}</p>
              <span className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition active:scale-[.98] disabled:opacity-50 disabled:cursor-not-allowed bg-white text-blue-900 hover:bg-sky-100 mt-6">
                Baca selengkapnya
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
            {lainnya.map((a) => (
              <AnnouncementItem key={a.id} announcement={a} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}