'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight, BookOpen, Clock3, CheckCircle2, Wallet, ShieldAlert, AlertTriangle, RefreshCw, PenLine, Plus, Star, 
  Boxes, GraduationCap, Library, Check, X, Undo2, HandCoins, Inbox, MapPin, Clock, Phone, ScrollText, BookCheck, CalendarDays, User } from 'lucide-react';
import { useApp } from '@/components/AppProvider';
import { Logo, Badge, Cover, SectionTitle, Tabs, StatCard, Empty } from '@/components/ui';
import Modal from '@/components/Modal';
import BookCard from '@/components/BookCard';
import AnnouncementItem from '@/components/AnnouncementItem';
import { api, rupiah, tanggal } from '@/lib/client';

function HalamanAwal() {
  const fitur = [
    {
      icon: Library,
      judul: 'Telusuri koleksi buku',
      isi: 'Cari judul dari berbagai kategori lengkap dengan rating dan ulasan mahasiswa.',
    },
    {
      icon: BookCheck,
      judul: 'Ajukan pinjam, ambil di meja',
      isi: 'Ajukan dari mana saja, lalu temui pegawai di meja sirkulasi untuk persetujuan.',
    },
    {
      icon: Wallet,
      judul: 'Pantau jatuh tempo dan denda',
      isi: 'Perpanjang masa pinjam dan cek tagihan denda secara transparan.',
    },
  ];

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#0b1d5e] text-white">
      <span className="pointer-events-none absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-[#10277a]" />
      <span className="pointer-events-none absolute -bottom-32 right-1/4 h-80 w-80 rounded-full bg-[#10277a]" />

      <header className="relative mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5 md:px-12">
        <Logo />
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-xl border border-white/30 px-5 py-2.5 text-sm font-bold transition hover:bg-white/10"
          >
            Masuk
          </Link>
          <Link
            href="/register"
            className="rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-blue-900 transition hover:bg-sky-100"
          >
            Daftar
          </Link>
        </div>
      </header>

      <main className="relative mx-auto grid w-full max-w-7xl flex-1 items-center gap-10 px-6 py-8 md:px-12 lg:grid-cols-[1.1fr_auto_1fr]">
        <div className="animate-rise">
          <p className="mb-4 inline-block rounded-full border border-sky-300/60 px-4 py-1.5 text-xs font-bold uppercase tracking-[.2em] text-sky-300">
            Perpustakaan Kampus Digital
          </p>
          <h1 className="text-5xl font-extrabold leading-[1.04] md:text-6xl xl:text-7xl">
            Pinjam Buku,
            <br />
            <span className="text-sky-300">Raih Ilmu.</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-blue-100">
            Telusuri koleksi perpustakaan kampus, ajukan peminjaman, dan pantau
            jatuh tempo serta denda dalam satu tempat.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-xl font-bold transition active:scale-[.98] disabled:opacity-50 disabled:cursor-not-allowed bg-white text-blue-900 hover:bg-sky-100 px-9 py-3.5 text-base"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-xl font-bold transition active:scale-[.98] disabled:opacity-50 disabled:cursor-not-allowed border border-white/40 px-9 py-3.5 text-base text-white hover:bg-white/10"
            >
              Daftar
            </Link>
          </div>
        </div>

        <div className="hidden h-[380px] w-px bg-white/20 lg:block" />

        <div className="grid gap-3.5">
          {fitur.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={f.judul}
                className={`animate-rise rounded-2xl p-5 ${
                  i === 0
                    ? 'border-2 border-sky-300 bg-[#16298a]'
                    : 'border border-white/10 bg-[#10277a]'
                }`}
                style={{ animationDelay: i * 0.12 + 's' }}
              >
                <div className="mb-3 flex items-center justify-between">
                  <span
                    className={`grid h-11 w-11 place-items-center rounded-xl ${
                      i === 0
                        ? 'bg-sky-300 text-blue-950'
                        : 'bg-[#1d3190] text-sky-300'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-extrabold tracking-widest text-sky-300/70">
                    0{i + 1}
                  </span>
                </div>
                <h3
                  className={`text-lg font-extrabold ${
                    i === 0 ? 'text-sky-300' : ''
                  }`}
                >
                  {f.judul}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-blue-100">
                  {f.isi}
                </p>
              </div>
            );
          })}
        </div>
      </main>

      <footer className="relative border-t border-white/10 py-5 text-center text-sm text-blue-200">
        {new Date().getFullYear()} | Pustakara. All rights reserved.
      </footer>
    </div>
  );
}

function IlustrasiBuku() {
  return (
    <svg viewBox="0 0 320 250" className="h-full w-full" fill="none">
      <circle
        cx="160"
        cy="125"
        r="112"
        stroke="#fff"
        strokeOpacity=".18"
        strokeDasharray="4 8"
      />
      <circle cx="160" cy="125" r="78" stroke="#fff" strokeOpacity=".22" />
      <g className="animate-floaty">
        <rect x="70" y="150" width="190" height="40" rx="10" fill="#fff" />
        <rect x="70" y="150" width="22" height="40" rx="8" fill="#93c5fd" />
        <path
          d="M108 170H236"
          stroke="#bfdbfe"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <rect x="86" y="104" width="170" height="40" rx="10" fill="#7dd3fc" />
        <rect x="86" y="104" width="22" height="40" rx="8" fill="#0ea5e9" />
        <path
          d="M124 124H226"
          stroke="#e0f2fe"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <g transform="rotate(-9 175 70)">
          <rect x="96" y="52" width="150" height="46" rx="10" fill="#c7d2fe" />
          <rect x="96" y="52" width="22" height="46" rx="8" fill="#6366f1" />
          <path
            d="M134 75H220"
            stroke="#fff"
            strokeWidth="7"
            strokeLinecap="round"
          />
        </g>
      </g>
      <path d="M250 38l7 17 17 7-17 7-7 17-7-17-17-7 17-7z" fill="#bae6fd" />
      <circle cx="62" cy="70" r="6" fill="#fff" opacity=".7" />
      <circle cx="268" cy="168" r="5" fill="#bae6fd" />
    </svg>
  );
}

function BarisPeminjaman({ loan, tampilkanUser, children }) {
  return (
    <div className="flex flex-wrap items-center gap-4 border-b border-slate-100 p-4 last:border-0">
      <Cover
        src={loan.cover_url}
        title=""
        className="h-20 w-14 flex-none rounded-xl shadow-md"
      />
      <div className="min-w-[180px] flex-1">
        <p className="font-extrabold text-slate-800">{loan.title}</p>
        {tampilkanUser && (
          <p className="flex items-center gap-1 text-xs text-slate-500">
            <User className="h-3.5 w-3.5" />
            {loan.uname} · {loan.nim}
          </p>
        )}
        <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
          <CalendarDays className="h-3.5 w-3.5" />
          {loan.due_date
            ? 'Jatuh tempo ' + tanggal(loan.due_date)
            : 'Diajukan ' + tanggal(loan.request_date)}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <Badge text={loan.status} />
          <Badge text={loan.ext_status} />
          <Badge text={loan.fine_status} />
          {loan.fine_status === 'Tertunggak' && (
            <span className="text-xs font-bold text-rose-600">
              {rupiah(loan.fine_amount)}
            </span>
          )}
          {loan.run_fine > 0 && (
            <span className="text-xs font-bold text-rose-600">
              Terlambat · denda {rupiah(loan.run_fine)}
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function BagianMahasiswa() {
  const router = useRouter();
  const { say } = useApp();
  const [loans, setLoans] = useState([]);
  const [tab, setTab] = useState('aktif');
  const [ulasan, setUlasan] = useState(null);

  const ambilData = useCallback(() => {
    api('loans')
      .then((res) => setLoans(Array.isArray(res) ? res : []))
      .catch(() => setLoans([]));
  }, []);

  useEffect(() => {
    ambilData();
  }, [ambilData]);

  const aktif = loans.filter(
    (l) => l.status === 'Menunggu Konfirmasi' || l.status === 'Sedang Dipinjam'
  );
  const riwayat = loans.filter(
    (l) => l.status !== 'Menunggu Konfirmasi' && l.status !== 'Sedang Dipinjam'
  );

  let dendaTertunggak = 0;
  let dendaBerjalan = 0;
  for (const l of loans) {
    if (l.fine_status === 'Tertunggak') {
      dendaTertunggak += Number(l.fine_amount || 0);
    }
    dendaBerjalan += Number(l.run_fine || 0);
  }

  const jumlahDipinjam = loans.filter((l) => l.status === 'Sedang Dipinjam');
  const jumlahMenunggu = loans.filter(
    (l) => l.status === 'Menunggu Konfirmasi'
  );
  const jumlahSelesai = loans.filter((l) => l.status === 'Selesai');

  async function ajukanPerpanjangan(id) {
    try {
      await api('loans/' + id + '/extend', 'PUT');
      say('Perpanjangan berhasil diajukan');
      ambilData();
    } catch (error) {
      say(error.message, true);
    }
  }

  async function kirimUlasan() {
    try {
      await api('reviews', 'POST', {
        loan_id: ulasan.loan.id,
        rating: ulasan.rating,
        comment: ulasan.komentar,
      });
      say('Terima kasih atas ulasan Anda');
      setUlasan(null);
      ambilData();
    } catch (error) {
      say(error.message, true);
    }
  }

  return (
    <div className="mb-2">
      <div className="mb-5 grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          icon={BookOpen}
          label="Sedang dipinjam"
          value={jumlahDipinjam.length}
          color="blue"
        />
        <StatCard
          icon={Clock3}
          label="Menunggu konfirmasi"
          value={jumlahMenunggu.length}
          color="amber"
        />
        <StatCard
          icon={CheckCircle2}
          label="Selesai dipinjam"
          value={jumlahSelesai.length}
          color="emerald"
        />
        <StatCard
          icon={Wallet}
          label="Total denda"
          value={rupiah(dendaTertunggak + dendaBerjalan)}
          color={dendaTertunggak + dendaBerjalan > 0 ? 'rose' : 'sky'}
        />
      </div>

      {dendaTertunggak > 0 && (
        <div className="mb-3 flex items-start gap-4 rounded-3xl border border-rose-200 bg-rose-50 p-5">
          <span className="grid h-12 w-12 flex-none place-items-center rounded-2xl bg-rose-500 text-white">
            <ShieldAlert className="h-6 w-6" />
          </span>
          <div>
            <p className="font-extrabold text-rose-700">
              Denda tertunggak {rupiah(dendaTertunggak)}
            </p>
            <p className="text-sm text-rose-600/80">
              Status: peminjaman baru <b>diblokir</b> sampai denda dilunasi di
              meja sirkulasi.
            </p>
          </div>
        </div>
      )}

      {dendaBerjalan > 0 && (
        <div className="mb-3 flex items-start gap-4 rounded-3xl border border-amber-200 bg-amber-50 p-5">
          <span className="grid h-12 w-12 flex-none place-items-center rounded-2xl bg-amber-500 text-white">
            <AlertTriangle className="h-6 w-6" />
          </span>
          <div>
            <p className="font-extrabold text-amber-700">
              Denda berjalan {rupiah(dendaBerjalan)}
            </p>
            <p className="text-sm text-amber-600/80">
              Segera kembalikan buku yang sudah melewati jatuh tempo.
            </p>
          </div>
        </div>
      )}

      <SectionTitle
        title="Peminjaman Saya"
        subtitle="Pantau transaksi aktif dan riwayat Anda"
        action={
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition active:scale-[.98] disabled:opacity-50 disabled:cursor-not-allowed bg-blue-700 text-white hover:bg-blue-800"
            onClick={() => router.push('/katalog')}
          >
            <Plus className="h-4 w-4" />
            Pinjam Buku
          </button>
        }
      >
        <Tabs
          tabs={[
            { key: 'aktif', label: 'Aktif', count: aktif.length },
            { key: 'riwayat', label: 'Riwayat', count: riwayat.length },
          ]}
          active={tab}
          onChange={setTab}
        />

        <div className="rounded-[1.25rem] border border-slate-200 bg-white overflow-hidden">
          {tab === 'aktif' && aktif.length === 0 && (
            <Empty text="Tidak ada peminjaman aktif." />
          )}
          {tab === 'aktif' &&
            aktif.map((loan) => (
              <BarisPeminjaman key={loan.id} loan={loan}>
                {loan.status === 'Sedang Dipinjam' && !loan.ext_status && (
                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition active:scale-[.98] disabled:opacity-50 disabled:cursor-not-allowed bg-white border border-slate-300 text-slate-700 hover:border-blue-600 hover:text-blue-700"
                    onClick={() => ajukanPerpanjangan(loan.id)}
                  >
                    <RefreshCw className="h-4 w-4" />
                    Ajukan Perpanjangan
                  </button>
                )}
              </BarisPeminjaman>
            ))}

          {tab === 'riwayat' && riwayat.length === 0 && (
            <Empty text="Belum ada riwayat." />
          )}
          {tab === 'riwayat' &&
            riwayat.map((loan) => (
              <BarisPeminjaman key={loan.id} loan={loan}>
                {loan.status === 'Selesai' && !loan.reviewed && (
                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition active:scale-[.98] disabled:opacity-50 disabled:cursor-not-allowed bg-blue-700 text-white hover:bg-blue-800"
                    onClick={() =>
                      setUlasan({ loan: loan, rating: 5, komentar: '' })
                    }
                  >
                    <PenLine className="h-4 w-4" />
                    Tulis Ulasan
                  </button>
                )}
                {loan.reviewed && (
                  <span className="text-xs font-bold text-emerald-600">
                    Sudah diulas
                  </span>
                )}
                {loan.reject_reason && (
                  <span className="text-xs text-rose-500">
                    Alasan: {loan.reject_reason}
                  </span>
                )}
              </BarisPeminjaman>
            ))}
        </div>
      </SectionTitle>

      {ulasan && (
        <Modal
          title={'Ulasan: ' + ulasan.loan.title}
          onClose={() => setUlasan(null)}
        >
          <div className="mb-4 flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setUlasan({ ...ulasan, rating: n })}
              >
                <Star
                  className={`h-9 w-9 ${
                    n <= ulasan.rating
                      ? 'fill-blue-600 text-blue-600'
                      : 'text-slate-300'
                  }`}
                />
              </button>
            ))}
          </div>
          <textarea
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            rows={4}
            placeholder="Tulis komentar Anda…"
            value={ulasan.komentar}
            onChange={(e) => setUlasan({ ...ulasan, komentar: e.target.value })}
          />
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition active:scale-[.98] disabled:opacity-50 disabled:cursor-not-allowed bg-blue-700 text-white hover:bg-blue-800 mt-4 w-full"
            onClick={kirimUlasan}
          >
            Kirim Ulasan
          </button>
        </Modal>
      )}
    </div>
  );
}

function BagianPegawai() {
  const { say } = useApp();
  const [loans, setLoans] = useState([]);
  const [kataCari, setKataCari] = useState('');
  const [tab, setTab] = useState('antrean');
  const [penolakan, setPenolakan] = useState(null);

  const ambilData = useCallback(() => {
    api('loans')
      .then((res) => setLoans(Array.isArray(res) ? res : []))
      .catch(() => setLoans([]));
  }, []);

  useEffect(() => {
    ambilData();
  }, [ambilData]);

  async function jalankanAksi(id, aksi, data) {
    try {
      await api('loans/' + id + '/' + aksi, 'PUT', data);
      say('Aksi berhasil diproses');
      ambilData();
    } catch (error) {
      say(error.message, true);
    }
  }

  const antrean = loans.filter((l) => l.status === 'Menunggu Konfirmasi');
  const perpanjangan = loans.filter(
    (l) =>
      l.ext_status === 'Perpanjangan Diajukan' && l.status === 'Sedang Dipinjam'
  );
  const sedangDipinjam = loans.filter((l) => l.status === 'Sedang Dipinjam');
  const dendaTertunggak = loans.filter((l) => l.fine_status === 'Tertunggak');

  const pengembalian = sedangDipinjam.filter((l) => {
    const teks = (
      (l.title || '') +
      (l.uname || '') +
      (l.nim || '')
    ).toLowerCase();
    return teks.includes(kataCari.toLowerCase());
  });

  return (
    <div className="mb-2">
      <div className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          icon={Inbox}
          label="Antrean verifikasi"
          value={antrean.length}
          color="amber"
        />
        <StatCard
          icon={BookOpen}
          label="Sedang dipinjam"
          value={sedangDipinjam.length}
          color="blue"
        />
        <StatCard
          icon={RefreshCw}
          label="Minta perpanjangan"
          value={perpanjangan.length}
          color="violet"
        />
        <StatCard
          icon={Wallet}
          label="Denda tertunggak"
          value={dendaTertunggak.length}
          color="rose"
        />
      </div>

      <SectionTitle
        title="Meja Sirkulasi"
        subtitle="Verifikasi peminjaman, pengembalian, dan denda"
      >
        <Tabs
          tabs={[
            { key: 'antrean', label: 'Antrean', count: antrean.length },
            {
              key: 'perpanjangan',
              label: 'Perpanjangan',
              count: perpanjangan.length,
            },
            {
              key: 'pengembalian',
              label: 'Pengembalian',
              count: sedangDipinjam.length,
            },
            { key: 'denda', label: 'Denda', count: dendaTertunggak.length },
          ]}
          active={tab}
          onChange={setTab}
        />

        {tab === 'pengembalian' && (
          <div className="relative mb-3 max-w-md">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100 !pl-10"
              placeholder="Cari judul, nama, atau NIM…"
              value={kataCari}
              onChange={(e) => setKataCari(e.target.value)}
            />
          </div>
        )}

        <div className="rounded-[1.25rem] border border-slate-200 bg-white overflow-hidden">
          {tab === 'antrean' && antrean.length === 0 && (
            <Empty text="Tidak ada antrean verifikasi." />
          )}
          {tab === 'antrean' &&
            antrean.map((loan) => (
              <BarisPeminjaman key={loan.id} loan={loan} tampilkanUser>
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition active:scale-[.98] disabled:opacity-50 disabled:cursor-not-allowed bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                  onClick={() => jalankanAksi(loan.id, 'approve')}
                >
                  <Check className="h-4 w-4" />
                  Approve
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition active:scale-[.98] disabled:opacity-50 disabled:cursor-not-allowed bg-rose-50 text-rose-600 hover:bg-rose-100"
                  onClick={() => setPenolakan({ loan: loan, alasan: '' })}
                >
                  <X className="h-4 w-4" />
                  Reject
                </button>
              </BarisPeminjaman>
            ))}

          {tab === 'perpanjangan' && perpanjangan.length === 0 && (
            <Empty text="Tidak ada permintaan perpanjangan." />
          )}
          {tab === 'perpanjangan' &&
            perpanjangan.map((loan) => (
              <BarisPeminjaman key={loan.id} loan={loan} tampilkanUser>
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition active:scale-[.98] disabled:opacity-50 disabled:cursor-not-allowed bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                  onClick={() => jalankanAksi(loan.id, 'ext-approve')}
                >
                  <Check className="h-4 w-4" />
                  Setujui
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition active:scale-[.98] disabled:opacity-50 disabled:cursor-not-allowed bg-rose-50 text-rose-600 hover:bg-rose-100"
                  onClick={() => jalankanAksi(loan.id, 'ext-reject')}
                >
                  <X className="h-4 w-4" />
                  Tolak
                </button>
              </BarisPeminjaman>
            ))}

          {tab === 'pengembalian' && pengembalian.length === 0 && (
            <Empty text="Tidak ada transaksi aktif." />
          )}
          {tab === 'pengembalian' &&
            pengembalian.map((loan) => (
              <BarisPeminjaman key={loan.id} loan={loan} tampilkanUser>
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition active:scale-[.98] disabled:opacity-50 disabled:cursor-not-allowed bg-blue-700 text-white hover:bg-blue-800"
                  onClick={() => jalankanAksi(loan.id, 'return')}
                >
                  <Undo2 className="h-4 w-4" />
                  Terima Pengembalian
                </button>
              </BarisPeminjaman>
            ))}

          {tab === 'denda' && dendaTertunggak.length === 0 && (
            <Empty text="Tidak ada denda tertunggak." />
          )}
          {tab === 'denda' &&
            dendaTertunggak.map((loan) => (
              <BarisPeminjaman key={loan.id} loan={loan} tampilkanUser>
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition active:scale-[.98] disabled:opacity-50 disabled:cursor-not-allowed bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                  onClick={() => jalankanAksi(loan.id, 'paid')}
                >
                  <HandCoins className="h-4 w-4" />
                  Tandai Lunas
                </button>
              </BarisPeminjaman>
            ))}
        </div>
      </SectionTitle>

      {penolakan && (
        <Modal title="Tolak Pengajuan" onClose={() => setPenolakan(null)}>
          <p className="mb-3 text-sm text-slate-500">
            Berikan alasan penolakan untuk <b>{penolakan.loan.title}</b>.
          </p>
          <textarea
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            rows={3}
            placeholder="Alasan penolakan…"
            value={penolakan.alasan}
            onChange={(e) =>
              setPenolakan({ ...penolakan, alasan: e.target.value })
            }
          />
          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition active:scale-[.98] disabled:opacity-50 disabled:cursor-not-allowed bg-white border border-slate-300 text-slate-700 hover:border-blue-600 hover:text-blue-700"
              onClick={() => setPenolakan(null)}
            >
              Batal
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition active:scale-[.98] disabled:opacity-50 disabled:cursor-not-allowed bg-rose-600 text-white hover:bg-rose-700"
              disabled={!penolakan.alasan}
              onClick={() => {
                jalankanAksi(penolakan.loan.id, 'reject', {
                  reason: penolakan.alasan,
                });
                setPenolakan(null);
              }}
            >
              Tolak
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function BagianAdmin() {
  const [loans, setLoans] = useState([]);
  const [stat, setStat] = useState(null);

  useEffect(() => {
    api('loans')
      .then((res) => setLoans(Array.isArray(res) ? res : []))
      .catch(() => setLoans([]));
    api('stats')
      .then(setStat)
      .catch(() => setStat(null));
  }, []);

  return (
    <div className="mb-2">
      {stat && (
        <div className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-5">
          <StatCard
            icon={Library}
            label="Total judul buku"
            value={stat.titles}
            color="blue"
          />
          <StatCard
            icon={Boxes}
            label="Total eksemplar"
            value={stat.copies}
            color="violet"
          />
          <StatCard
            icon={GraduationCap}
            label="Mahasiswa terdaftar"
            value={stat.students}
            color="sky"
          />
          <StatCard
            icon={BookOpen}
            label="Transaksi aktif"
            value={stat.active}
            color="amber"
          />
          <StatCard
            icon={Wallet}
            label="Denda lunas"
            value={rupiah(stat.paid)}
            color="emerald"
          />
        </div>
      )}

      <SectionTitle
        title="Monitoring Transaksi"
        subtitle="Seluruh log transaksi perpustakaan"
      >
        <div className="rounded-[1.25rem] border border-slate-200 bg-white overflow-hidden">
          {loans.length === 0 && <Empty text="Belum ada transaksi." />}
          {loans.map((loan) => (
            <BarisPeminjaman key={loan.id} loan={loan} tampilkanUser />
          ))}
        </div>
      </SectionTitle>
    </div>
  );
}

function TentangPerpustakaan() {
  const info = [
    {
      icon: MapPin,
      judul: 'Lokasi',
      isi: 'Gedung Perpustakaan Pusat, Lt. 1–3\nKampus Utama, Makassar',
      warna: 'bg-rose-100 text-rose-600',
    },
    {
      icon: Clock,
      judul: 'Jam Operasional',
      isi: 'Senin–Jumat: 08.00–20.00\nSabtu: 09.00–15.00\nMinggu: tutup',
      warna: 'bg-blue-100 text-blue-700',
    },
    {
      icon: Phone,
      judul: 'Kontak',
      isi: '(0411) 123-456\nperpustakaan@kampus.ac.id',
      warna: 'bg-emerald-100 text-emerald-700',
    },
    {
      icon: ScrollText,
      judul: 'Aturan Pinjam',
      isi: 'Durasi sesuai ketentuan tiap buku, perpanjangan 1x. Denda berlaku per hari keterlambatan.',
      warna: 'bg-violet-100 text-violet-700',
    },
  ];

  return (
    <SectionTitle
      title="Tentang Perpustakaan"
      subtitle="Informasi layanan Pustakara"
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {info.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.judul}
              className="rounded-2xl border border-slate-200 bg-white p-5"
            >
              <span
                className={`mb-3 grid h-11 w-11 place-items-center rounded-xl ${item.warna}`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <h4 className="font-extrabold text-slate-900">{item.judul}</h4>
              <p className="mt-1 whitespace-pre-line text-sm text-slate-500">
                {item.isi}
              </p>
            </div>
          );
        })}
      </div>
    </SectionTitle>
  );
}

export default function BerandaPage() {
  const router = useRouter();
  const { user, guest, ready } = useApp();
  const [data, setData] = useState(null);
  const [kataCari, setKataCari] = useState('');

  useEffect(() => {
    api('home')
      .then(setData)
      .catch(() => setData({ top: [], anns: [] }));
  }, []);

  if (!ready) {
    return null;
  }
  if (!user && !guest) {
    return <HalamanAwal />;
  }

  let sapaan = 'Halo, Tamu';
  let deskripsi =
    'Anda masuk sebagai tamu. Jelajahi katalog dan pengumuman, masuk untuk meminjam.';
  let label = 'Guest';
  if (user) {
    sapaan = 'Halo, ' + user.name.split(' ')[0];
    label = user.role;
    if (user.role === 'Mahasiswa') {
      deskripsi =
        'Pantau peminjaman dan denda Anda, lalu temukan bacaan berikutnya.';
    } else if (user.role === 'Pegawai') {
      deskripsi = 'Kelola antrean peminjaman dan sirkulasi buku hari ini.';
    } else {
      deskripsi = 'Ringkasan sistem dan seluruh aktivitas perpustakaan kampus.';
    }
  }

  function cariBuku(e) {
    e.preventDefault();
    router.push('/katalog?q=' + encodeURIComponent(kataCari));
  }

  return (
    <div>
      <div className="relative mb-8 overflow-hidden rounded-3xl bg-[#0b1d5e] p-6 text-white md:p-10">
        <span className="pointer-events-none absolute -right-14 -top-14 h-60 w-60 rounded-full bg-[#16358f]" />
        <span className="pointer-events-none absolute -bottom-16 right-40 h-44 w-44 rounded-full bg-[#16358f]" />
        <span className="pointer-events-none absolute right-10 top-10 h-4 w-4 rounded-full bg-sky-400" />
        <div className="relative grid items-center gap-6 md:grid-cols-[1.3fr_1fr]">
          <div>
            <span className="inline-block rounded-full border border-sky-300/70 px-3 py-1 text-xs font-bold uppercase tracking-widest text-sky-300">
              {label}
            </span>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight md:text-5xl">
              {sapaan}
            </h2>
            <p className="mt-3 max-w-md text-blue-100">{deskripsi}</p>
            <form
              onSubmit={cariBuku}
              className="mt-6 flex max-w-lg items-center rounded-2xl bg-white p-1.5"
            >
              <Search className="ml-3 h-5 w-5 flex-none text-slate-400" />
              <input
                value={kataCari}
                onChange={(e) => setKataCari(e.target.value)}
                placeholder="Cari judul atau pengarang…"
                className="min-w-0 flex-1 bg-transparent px-3 text-sm text-slate-800 outline-none"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition active:scale-[.98] disabled:opacity-50 disabled:cursor-not-allowed bg-blue-700 text-white hover:bg-blue-800"
              >
                Cari
              </button>
            </form>
          </div>
          <div className="hidden h-56 md:block">
            <IlustrasiBuku />
          </div>
        </div>
      </div>

      {user && user.role === 'Mahasiswa' && <BagianMahasiswa />}
      {user && user.role === 'Pegawai' && <BagianPegawai />}
      {user && user.role === 'Admin' && <BagianAdmin />}

      {data ? (
        <>
          <SectionTitle
            title="5 Buku Terpopuler"
            subtitle="Berdasarkan frekuensi peminjaman terbanyak"
            action={
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition active:scale-[.98] disabled:opacity-50 disabled:cursor-not-allowed bg-white border border-slate-300 text-slate-700 hover:border-blue-600 hover:text-blue-700"
                onClick={() => router.push('/katalog')}
              >
                Semua buku
                <ArrowRight className="h-4 w-4" />
              </button>
            }
          >
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 min-[1600px]:grid-cols-5">
              {(data.top || []).map((buku, i) => (
                <BookCard key={buku.id} book={buku} rank={i + 1} />
              ))}
            </div>
          </SectionTitle>

          <SectionTitle
            title="Pengumuman Terbaru"
            subtitle="Informasi operasional, layanan, dan acara"
            action={
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition active:scale-[.98] disabled:opacity-50 disabled:cursor-not-allowed bg-white border border-slate-300 text-slate-700 hover:border-blue-600 hover:text-blue-700"
                onClick={() => router.push('/pengumuman')}
              >
                Semua
                <ArrowRight className="h-4 w-4" />
              </button>
            }
          >
            <div className="grid gap-3 lg:grid-cols-2">
              {(data.anns || []).map((a) => (
                <AnnouncementItem key={a.id} announcement={a} />
              ))}
              {(data.anns || []).length === 0 && (
                <p className="text-slate-400">Belum ada pengumuman.</p>
              )}
            </div>
          </SectionTitle>
        </>
      ) : (
        <p className="py-10 text-center text-slate-400">Memuat…</p>
      )}

      <TentangPerpustakaan />
    </div>
  );
}