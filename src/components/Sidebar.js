'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Library, Megaphone, BookCopy, FilePen, Users, Tags, LogOut, Menu, X, LogIn, UserPlus, CalendarDays, UserRound } from 'lucide-react';
import { useApp } from '@/components/AppProvider';
import { Logo } from '@/components/ui';
import { inisial } from '@/lib/client';

const judulHalaman = [
  ['/katalog/', 'Detail Buku'],
  ['/katalog', 'Katalog Buku'],
  ['/pengumuman/', 'Detail Pengumuman'],
  ['/pengumuman', 'Pengumuman'],
  ['/kelola/buku', 'Data Buku'],
  ['/kelola/pengumuman', 'Kelola Pengumuman'],
  ['/admin/pengguna', 'Manajemen Pengguna'],
  ['/admin/kategori', 'Manajemen Kategori'],
];

export default function Sidebar({ children }) {
  const { user, guest, ready, askKeluar } = useApp();
  const alamat = usePathname();
  const [terbuka, setTerbuka] = useState(false);

  useEffect(() => {
    setTerbuka(false);
  }, [alamat]);

  if (alamat === '/login' || alamat === '/register') {
    return children;
  }
  if (!ready) {
    return <div className="min-h-screen bg-[#0a1650]" />;
  }

  if (alamat === '/' && !user && !guest) {
    return children;
  }

  const isStaff = user && user.role !== 'Mahasiswa';
  const isAdmin = user && user.role === 'Admin';

  const grupMenu = [
    {
      judul: 'Menu',
      item: [
        { href: '/', label: 'Beranda', icon: Home },
        { href: '/katalog', label: 'Katalog Buku', icon: Library },
        { href: '/pengumuman', label: 'Pengumuman', icon: Megaphone },
      ],
    },
  ];
  if (isStaff) {
    grupMenu.push({
      judul: 'Pengelolaan',
      item: [
        { href: '/kelola/buku', label: 'Data Buku', icon: BookCopy },
        {
          href: '/kelola/pengumuman',
          label: 'Kelola Pengumuman',
          icon: FilePen,
        },
      ],
    });
  }
  if (isAdmin) {
    grupMenu.push({
      judul: 'Administrasi',
      item: [
        { href: '/admin/pengguna', label: 'Pengguna', icon: Users },
        { href: '/admin/kategori', label: 'Kategori', icon: Tags },
      ],
    });
  }

  function menuAktif(href) {
    if (href === '/') {
      return alamat === '/';
    }
    return alamat === href || alamat.startsWith(href + '/');
  }

  let judul = 'Beranda';
  for (const j of judulHalaman) {
    if (alamat.startsWith(j[0])) {
      judul = j[1];
      break;
    }
  }

  return (
    <div className="min-h-screen">
      {terbuka && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 lg:hidden"
          onClick={() => setTerbuka(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col overflow-hidden bg-gradient-to-b from-[#0a1650] via-[#0f2a7a] to-[#1745b8] text-white transition-transform duration-300 lg:translate-x-0 ${
          terbuka ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="relative flex items-center justify-between px-6 pb-4 pt-6">
          <Logo />
          <button
            type="button"
            aria-label="Tutup menu"
            className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 lg:hidden"
            onClick={() => setTerbuka(false)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="[scrollbar-width:none] [&::-webkit-scrollbar]:hidden relative flex-1 overflow-y-auto px-4 pb-2">
          {grupMenu.map((grup) => (
            <div key={grup.judul} className="mb-3">
              <p className="mb-1.5 px-3 text-[11px] font-bold uppercase tracking-[.18em] text-sky-300/70">
                {grup.judul}
              </p>
              {grup.item.map((menu) => {
                const Icon = menu.icon;
                const aktif = menuAktif(menu.href);
                return (
                  <Link
                    key={menu.href}
                    href={menu.href}
                    className={`group relative mb-0.5 flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                      aktif
                        ? 'bg-white text-blue-800 shadow-lg shadow-black/20'
                        : 'text-blue-100/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span
                      className={`grid h-7 w-7 place-items-center rounded-lg transition ${
                        aktif
                          ? 'bg-blue-700 text-white'
                          : 'bg-white/10 group-hover:bg-white/15'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    {menu.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="relative p-3">
          {user ? (
            <div className="rounded-2xl bg-[#17368f] p-3">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 flex-none place-items-center rounded-2xl bg-gradient-to-br from-sky-300 to-indigo-400 font-extrabold text-blue-950">
                  {inisial(user.name)}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">{user.name}</p>
                  <p className="text-xs text-sky-200">{user.role}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={askKeluar}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 py-2 text-sm font-semibold transition hover:bg-white/20"
              >
                <LogOut className="h-4 w-4" />
                Keluar
              </button>
            </div>
          ) : (
            <div className="rounded-2xl bg-[#17368f] p-3">
              {guest && (
                <div className="mb-3 flex items-center gap-2 rounded-2xl bg-sky-400/20 px-3 py-2 text-xs font-semibold text-sky-100">
                  <UserRound className="h-4 w-4" />
                  Mode Tamu (Guest)
                </div>
              )}
              <p className="mb-3 text-xs text-blue-100/80">
                Masuk sebagai Mahasiswa untuk meminjam dan mengulas buku.
              </p>
              <Link
                href="/login"
                className="mb-2 flex items-center justify-center gap-2 rounded-2xl bg-white py-2.5 text-sm font-bold text-blue-800"
              >
                <LogIn className="h-4 w-4" />
                Masuk
              </Link>
              <Link
                href="/register"
                className="flex items-center justify-center gap-2 rounded-xl bg-white/10 py-2 text-sm font-semibold hover:bg-white/20"
              >
                <UserPlus className="h-4 w-4" />
                Daftar
              </Link>
              {guest && (
                <button
                  type="button"
                  onClick={askKeluar}
                  className="mt-2 w-full text-center text-xs text-sky-200 underline"
                >
                  Keluar dari mode tamu
                </button>
              )}
            </div>
          )}
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 md:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Buka menu"
              className="grid h-10 w-10 place-items-center rounded-2xl border border-slate-200 bg-white shadow lg:hidden"
              onClick={() => setTerbuka(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-extrabold text-slate-800">{judul}</h1>
          </div>
          <div className="flex items-center gap-3">
            <span
              suppressHydrationWarning
              className="hidden items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-500 sm:flex"
            >
              <CalendarDays className="h-4 w-4 text-blue-600" />
              {new Date().toLocaleDateString('id-ID', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
            {user && (
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-extrabold text-white shadow-lg shadow-blue-600/30">
                {inisial(user.name)}
              </div>
            )}
          </div>
        </header>
        <main className="animate-fade mx-auto max-w-7xl p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}