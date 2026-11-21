'use client';
import { useState, useEffect } from 'react';
import { BookOpen, Star, Inbox, Eye, EyeOff, Library, RefreshCw, Wallet } from 'lucide-react';
import { NAMA_APLIKASI } from '@/lib/client';

const warnaBadge = {
  'Menunggu Konfirmasi': 'bg-amber-100 text-amber-700',
  'Sedang Dipinjam': 'bg-blue-100 text-blue-700',
  Selesai: 'bg-emerald-100 text-emerald-700',
  Ditolak: 'bg-rose-100 text-rose-700',
  Tertunggak: 'bg-rose-100 text-rose-700',
  Lunas: 'bg-emerald-100 text-emerald-700',
  'Perpanjangan Diajukan': 'bg-violet-100 text-violet-700',
  'Perpanjangan Disetujui': 'bg-emerald-100 text-emerald-700',
  'Perpanjangan Ditolak': 'bg-rose-100 text-rose-700',
  Published: 'bg-emerald-100 text-emerald-700',
  Draft: 'bg-slate-200 text-slate-600',
  Operasional: 'bg-sky-100 text-sky-700',
  Layanan: 'bg-indigo-100 text-indigo-700',
  Acara: 'bg-fuchsia-100 text-fuchsia-700',
  Admin: 'bg-rose-100 text-rose-700',
  Pegawai: 'bg-amber-100 text-amber-700',
  Mahasiswa: 'bg-blue-100 text-blue-700',
};

export function Badge({ text }) {
  if (!text || text === 'Tidak Ada') {
    return null;
  }
  const warna = warnaBadge[text] || 'bg-sky-100 text-sky-700';
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold ${warna}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {text}
    </span>
  );
}

export function Logo({ showText = true, textColor = 'text-white' }) {
  return (
    <span className="flex items-center gap-3">
      <img
        src="/logo.png"
        alt="Logo"
        className="h-11 w-11 rounded-2xl object-contain"
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />
      {showText && (
        <span className={`text-xl font-extrabold tracking-tight ${textColor}`}>
          {NAMA_APLIKASI}
        </span>
      )}
    </span>
  );
}

export function Cover({ src, title, className = '' }) {
  const [gagal, setGagal] = useState(!src);

  useEffect(() => {
    setGagal(!src);
  }, [src]);

  if (gagal) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-2 bg-blue-700 p-3 text-center text-white ${className}`}
      >
        <BookOpen className="h-7 w-7 opacity-90" />
        <span className="line-clamp-3 text-[11px] font-bold leading-tight">
          {title}
        </span>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={title}
      loading="lazy"
      onError={() => setGagal(true)}
      className={`object-cover ${className}`}
    />
  );
}

export function Stars({ value = 0, size = 14 }) {
  const bulat = Math.round(value);
  const bintang = [1, 2, 3, 4, 5];
  return (
    <span className="inline-flex items-center gap-0.5">
      {bintang.map((n) => (
        <Star
          key={n}
          style={{ width: size, height: size }}
          className={
            n <= bulat ? 'fill-blue-600 text-blue-600' : 'text-slate-300'
          }
        />
      ))}
      <span className="ml-1 text-xs font-bold text-slate-500">
        {value > 0 ? Number(value).toFixed(1) : '-'}
      </span>
    </span>
  );
}

export function SectionTitle({ title, subtitle, action, children }) {
  return (
    <section className="mb-10">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="h-9 w-1.5 flex-none rounded-full bg-blue-700" />
          <div>
            <h2 className="text-xl font-extrabold leading-tight text-slate-900">
              {title}
            </h2>
            {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
          </div>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="mb-4 flex w-fit max-w-full gap-1 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-1.5">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2 text-sm font-bold transition ${
            active === tab.key
              ? 'bg-[#0b1d5e] text-white'
              : 'text-slate-500 hover:bg-slate-100'
          }`}
        >
          {tab.label}
          {tab.count > 0 && (
            <span
              className={`rounded-full px-1.5 text-[11px] ${
                active === tab.key
                  ? 'bg-sky-300 text-blue-950'
                  : 'bg-blue-100 text-blue-700'
              }`}
            >
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

const warnaStat = {
  blue: 'bg-blue-100 text-blue-700',
  emerald: 'bg-emerald-100 text-emerald-700',
  amber: 'bg-amber-100 text-amber-700',
  rose: 'bg-rose-100 text-rose-600',
  violet: 'bg-violet-100 text-violet-700',
  sky: 'bg-sky-100 text-sky-700',
};

export function StatCard({ icon: Ikon, label, value, color = 'blue' }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-blue-600">
      <span
        className={`grid h-12 w-12 flex-none place-items-center rounded-xl ${
          warnaStat[color] || warnaStat.blue
        }`}
      >
        <Ikon className="h-6 w-6" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-xl font-extrabold text-slate-900">
          {value}
        </p>
        <p className="text-xs font-semibold text-slate-500">{label}</p>
      </div>
    </div>
  );
}

export function Empty({ text, icon: Ikon = Inbox }) {
  return (
    <div className="py-12 text-center text-slate-400">
      <Ikon className="mx-auto mb-2 h-10 w-10 opacity-60" />
      <p className="text-sm">{text}</p>
    </div>
  );
}

export function InputField({
  icon: Ikon,
  type,
  placeholder,
  value,
  onChange,
  ...props
}) {
  const [lihat, setLihat] = useState(false);
  const tipe = type === 'password' && lihat ? 'text' : type;

  return (
    <div className="relative">
      <Ikon className="absolute left-4 top-3 h-4 w-4 text-slate-400" />
      <input
        {...props}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100 !pl-11"
        type={tipe}
        placeholder={placeholder}
        required
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
      />
      {type === 'password' && (
        <button
          type="button"
          aria-label={lihat ? 'Sembunyikan password' : 'Tampilkan password'}
          onClick={() => setLihat(!lihat)}
          className="absolute right-4 top-3 text-slate-400"
        >
          {lihat ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      )}
    </div>
  );
}

export function PanelAuth() {
  const fitur = [
    { icon: Library, teks: 'Katalog lengkap dan terkini' },
    { icon: RefreshCw, teks: 'Pinjam dan perpanjang tanpa antre' },
    { icon: Wallet, teks: 'Denda transparan, mudah dipantau' },
  ];
  return (
    <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-[#0a1650] via-[#0f2a7a] to-[#1d4ed8] p-12 text-white lg:flex">
      <div className="absolute -left-20 top-10 h-80 w-80 rounded-full bg-sky-400/25" />
      <div className="absolute -bottom-20 right-0 h-96 w-96 rounded-full bg-indigo-400/30" />
      <div
        className="absolute inset-0 opacity-[.06]"
        style={{
          backgroundImage: 'radial-gradient(#fff 1.5px,transparent 1.5px)',
          backgroundSize: '24px 24px',
        }}
      />
      <div className="relative">
        <Logo />
      </div>
      <div className="relative">
        <h2 className="text-5xl font-extrabold leading-[1.1]">
          Jelajahi dunia
          <br />
          lewat{' '}
          <span className="bg-gradient-to-r from-sky-300 to-indigo-200 bg-clip-text text-transparent">
            setiap halaman.
          </span>
        </h2>
        <div className="mt-8 grid max-w-sm gap-3">
          {fitur.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={f.teks}
                className="animate-floaty flex items-center gap-3 rounded-2xl bg-white/10 p-3.5 ring-1 ring-white/15"
                style={{ animationDelay: i * 0.8 + 's' }}
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/15">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-sm font-semibold">{f.teks}</span>
              </div>
            );
          })}
        </div>
      </div>
      <p className="relative text-sm text-blue-200">
        © {new Date().getFullYear()} {NAMA_APLIKASI} — Perpustakaan Kampus
      </p>
    </div>
  );
}