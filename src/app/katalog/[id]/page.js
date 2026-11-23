'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Hash, Building2, CalendarDays, Boxes, Clock, Wallet, Download, LogIn, ShieldAlert } from 'lucide-react';
import { useApp } from '@/components/AppProvider';
import { Cover, Stars, SectionTitle, Badge, Empty } from '@/components/ui';
import { api, rupiah } from '@/lib/client';

export default function DetailBukuPage() {
  const router = useRouter();
  const params = useParams();
  const { user, guest, say } = useApp();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!params?.id) return;
    api('books/' + params.id)
      .then(setData)
      .catch(() => setData(false));
  }, [params?.id]);

  if (data === false) {
    return <Empty text="Buku tidak ditemukan." />;
  }
  if (!data) {
    return <Empty text="Memuat…" />;
  }

  const buku = data.book;

  async function ajukanPinjam() {
    try {
      await api('loans', 'POST', { book_id: buku.id });
      say('Pengajuan terkirim. Temui pegawai di meja sirkulasi.');
      router.push('/');
    } catch (error) {
      say(error.message, true);
    }
  }

  const rincian = [
    { icon: Hash, label: 'ISBN', nilai: buku.isbn },
    { icon: Building2, label: 'Penerbit', nilai: buku.publisher },
    { icon: CalendarDays, label: 'Tahun terbit', nilai: buku.year },
    {
      icon: Boxes,
      label: 'Sisa stok',
      nilai: buku.stock_avail + ' dari ' + buku.stock_total,
    },
    { icon: Clock, label: 'Maks. pinjam', nilai: buku.max_days + ' hari' },
    { icon: Wallet, label: 'Denda per hari', nilai: rupiah(buku.fine_per_day) },
  ];

  return (
    <div>
      <button
        className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition active:scale-[.98] disabled:opacity-50 disabled:cursor-not-allowed bg-white border border-slate-300 text-slate-700 hover:border-blue-600 hover:text-blue-700 mb-5"
        onClick={() => router.push('/katalog')}
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke katalog
      </button>

      <div className="rounded-[1.25rem] border border-slate-200 bg-white grid gap-6 p-5 md:p-7 lg:grid-cols-[240px_1fr]">
        <Cover
          src={buku.cover_url}
          title={buku.title}
          className="mx-auto aspect-[2/3] w-52 rounded-3xl lg:w-full"
        />
        <div>
          <Badge text={buku.cat} />
          <h2 className="mt-2 text-2xl font-extrabold leading-tight text-slate-800 md:text-3xl">
            {buku.title}
          </h2>
          <p className="text-slate-500">oleh {buku.author}</p>
          <div className="mt-2 flex items-center gap-2">
            <Stars value={buku.rating} size={18} />
            <span className="text-xs text-slate-400">({buku.nrev} ulasan)</span>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 xl:grid-cols-3">
            {rincian.map((r) => {
              const Icon = r.icon;
              return (
                <div key={r.label} className="rounded-2xl bg-blue-50 p-3.5">
                  <Icon className="mb-1 h-4 w-4 text-blue-600" />
                  <p className="text-[11px] font-semibold text-slate-500">
                    {r.label}
                  </p>
                  <p className="truncate text-sm font-extrabold text-slate-800">
                    {r.nilai}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-6">
            {(guest || !user) && (
              <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-sky-50 p-4">
                <p className="flex-1 text-sm text-sky-800">
                  Masuk atau daftar sebagai Mahasiswa untuk meminjam buku ini.
                </p>
                <button
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition active:scale-[.98] disabled:opacity-50 disabled:cursor-not-allowed bg-blue-700 text-white hover:bg-blue-800"
                  onClick={() => router.push('/login')}
                >
                  <LogIn className="h-4 w-4" />
                  Masuk
                </button>
              </div>
            )}

            {user && user.role === 'Mahasiswa' && (
              <>
                <button
                  className="inline-flex items-center justify-center gap-2 rounded-xl text-sm font-bold transition active:scale-[.98] disabled:opacity-50 disabled:cursor-not-allowed bg-blue-700 text-white hover:bg-blue-800 px-6 py-3"
                  disabled={data.blocked || buku.stock_avail < 1}
                  onClick={ajukanPinjam}
                >
                  <Download className="h-4 w-4" />
                  Ajukan Pinjam
                </button>
                {data.blocked && (
                  <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-rose-600">
                    <ShieldAlert className="h-4 w-4" />
                    Diblokir: masih ada denda tertunggak.
                  </p>
                )}
                {buku.stock_avail < 1 && (
                  <p className="mt-3 text-sm font-semibold text-rose-600">
                    Stok sedang habis.
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <SectionTitle title="Ulasan Mahasiswa">
          {data.reviews.length === 0 && (
            <p className="text-slate-400">Belum ada ulasan.</p>
          )}
          <div className="grid gap-4 md:grid-cols-2">
            {data.reviews.map((ulasan) => (
              <div
                key={ulasan.id}
                className="rounded-[1.25rem] border border-slate-200 bg-white p-5"
              >
                <div className="flex items-center justify-between gap-2">
                  <b className="text-slate-800">{ulasan.name}</b>
                  <Stars value={ulasan.rating} />
                </div>
                <p className="mt-2 text-sm text-slate-500">
                  {ulasan.comment || '—'}
                </p>
              </div>
            ))}
          </div>
        </SectionTitle>
      </div>
    </div>
  );
}