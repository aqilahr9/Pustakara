'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, CalendarDays, MapPin, UserRound, Clock, Tag, CalendarCheck, Link2, CheckCircle2, Eye } from 'lucide-react';
import { useApp } from '@/components/AppProvider';
import AnnouncementItem from '@/components/AnnouncementItem';
import { Badge, Empty } from '@/components/ui';
import { api, tanggalLengkap } from '@/lib/client';

function IsiPengumuman({ teks }) {
  const blok = (teks || '').split(/\n{2,}/);

  return (
    <div className="space-y-5">
      {blok.map((b, i) => {
        const baris = b.split('\n').filter((x) => x.trim() !== '');
        const poin = baris.filter((x) => x.trim().startsWith('- '));
        const paragraf = baris.filter((x) => !x.trim().startsWith('- '));
        return (
          <div key={i}>
            {paragraf.length > 0 && (
              <p className="mb-3 leading-relaxed text-slate-700">
                {paragraf.join(' ')}
              </p>
            )}
            {poin.length > 0 && (
              <ul className="space-y-2.5">
                {poin.map((p, j) => (
                  <li
                    key={j}
                    className="flex gap-3 rounded-xl bg-blue-50 p-3 text-slate-700"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-blue-700" />
                    {p.trim().slice(2)}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function DetailPengumumanPage() {
  const router = useRouter();
  const params = useParams();
  const { user, say } = useApp();
  const [pengumuman, setPengumuman] = useState(null);
  const [lainnya, setLainnya] = useState([]);

  useEffect(() => {
    const id = params?.id;
    if (!id) return;

    api('announcements/' + id)
      .then(setPengumuman)
      .catch(() => setPengumuman(false));

    api('announcements').then((daftar) => {
      const lain = Array.isArray(daftar)
        ? daftar.filter((x) => String(x.id) !== String(id))
        : [];
      setLainnya(lain.slice(0, 3));
    });
  }, [params?.id]);

  if (pengumuman === false) {
    return <Empty text="Pengumuman tidak ditemukan." />;
  }
  if (!pengumuman) {
    return <Empty text="Memuat…" />;
  }

  const a = pengumuman;
  const jumlahKata = (a.content || '').trim() ? a.content.trim().split(/\s+/).length : 0;
  const menitBaca = Math.max(1, Math.ceil(jumlahKata / 200));
  const penerbit = a.author || 'Tim Perpustakaan';
  const isStaff = user && user.role !== 'Mahasiswa';

  const rincian = [
    { icon: Tag, label: 'Kategori', nilai: a.category },
    {
      icon: CalendarDays,
      label: 'Tanggal terbit',
      nilai: tanggalLengkap(a.release_date),
    },
  ];
  if (a.event_date) {
    rincian.push({
      icon: CalendarCheck,
      label: a.category === 'Acara' ? 'Tanggal pelaksanaan' : 'Berlaku mulai',
      nilai: tanggalLengkap(a.event_date),
    });
  }
  if (a.location) {
    rincian.push({ icon: MapPin, label: 'Lokasi', nilai: a.location });
  }
  rincian.push({ icon: UserRound, label: 'Diterbitkan oleh', nilai: penerbit });
  rincian.push({
    icon: Clock,
    label: 'Waktu baca',
    nilai: '± ' + menitBaca + ' menit',
  });
  if (isStaff) {
    rincian.push({ icon: Eye, label: 'Status publikasi', nilai: a.status });
  }

  function salinTautan() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
    say('Tautan disalin');
  }

  return (
    <div>
      <button
        type="button"
        className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition active:scale-[.98] disabled:opacity-50 disabled:cursor-not-allowed bg-white border border-slate-300 text-slate-700 hover:border-blue-600 hover:text-blue-700 mb-5"
        onClick={() => router.push('/pengumuman')}
      >
        <ArrowLeft className="h-4 w-4" />
        Semua pengumuman
      </button>

      <div className="relative mb-6 overflow-hidden rounded-3xl bg-[#0b1d5e] p-7 text-white md:p-10">
        <span className="absolute -right-12 -top-12 h-52 w-52 rounded-full bg-[#16358f]" />
        <span className="absolute bottom-6 right-8 h-3 w-3 rounded-full bg-sky-400" />
        <div className="relative max-w-3xl">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <Badge text={a.category} />
            <span className="flex items-center gap-1 text-sm text-blue-200">
              <CalendarDays className="h-4 w-4" />
              {tanggalLengkap(a.release_date)}
            </span>
          </div>
          <h2 className="text-2xl font-extrabold leading-tight md:text-4xl">
            {a.title}
          </h2>
          <p className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-blue-200">
            <span className="flex items-center gap-1.5">
              <UserRound className="h-4 w-4" />
              {penerbit}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />± {menitBaca} menit baca
            </span>
          </p>
        </div>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_320px]">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 md:p-9">
          <IsiPengumuman teks={a.content} />
        </article>

        <aside className="space-y-4 lg:sticky lg:top-24">
          <div className="rounded-3xl border border-slate-200 bg-white p-5">
            <h3 className="mb-3 font-extrabold text-slate-900">
              Rincian Pengumuman
            </h3>
            <dl className="divide-y divide-slate-100">
              {rincian.map((r) => {
                const Icon = r.icon;
                return (
                  <div key={r.label} className="flex gap-3 py-3">
                    <span className="grid h-9 w-9 flex-none place-items-center rounded-lg bg-blue-50 text-blue-700">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        {r.label}
                      </dt>
                      <dd className="text-sm font-bold text-slate-800">
                        {r.nilai}
                      </dd>
                    </div>
                  </div>
                );
              })}
            </dl>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition active:scale-[.98] disabled:opacity-50 disabled:cursor-not-allowed bg-white border border-slate-300 text-slate-700 hover:border-blue-600 hover:text-blue-700 mt-3 w-full"
              onClick={salinTautan}
            >
              <Link2 className="h-4 w-4" />
              Salin tautan
            </button>
          </div>
        </aside>
      </div>

      {lainnya.length > 0 && (
        <div className="mt-9">
          <h3 className="mb-3 flex items-center gap-3 text-lg font-extrabold text-slate-900">
            <span className="h-7 w-1.5 rounded-full bg-blue-700" />
            Pengumuman lainnya
          </h3>
          <div className="grid gap-3 lg:grid-cols-3">
            {lainnya.map((x) => (
              <AnnouncementItem key={x.id} announcement={x} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}