'use client';
import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';
import { api } from '@/lib/client';

const AppContext = createContext(null);

export function useApp() {
  return useContext(AppContext);
}

function KotakKonfirmasi({ dialog, tutup }) {
  if (!dialog) {
    return null;
  }
  const Ikon = dialog.icon || HelpCircle;

  async function klikYa() {
    tutup();
    if (dialog.onYes) {
      await dialog.onYes();
    }
  }

  return (
    <div
      className="fixed inset-0 z-[80] grid place-items-center bg-slate-900/60 p-4"
      onClick={tutup}
    >
      <div
        className="animate-rise w-full max-w-sm rounded-3xl bg-white p-7 text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-full bg-blue-100">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-blue-700 text-white">
            <Ikon className="h-7 w-7" />
          </span>
        </div>
        <h3 className="text-xl font-extrabold text-slate-900">
          {dialog.title}
        </h3>
        {dialog.text && (
          <p className="mt-2 text-sm text-slate-500">{dialog.text}</p>
        )}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition active:scale-[.98] disabled:opacity-50 disabled:cursor-not-allowed bg-white border border-slate-300 text-slate-700 hover:border-blue-600 hover:text-blue-700"
            onClick={tutup}
          >
            {dialog.no || 'Tidak'}
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition active:scale-[.98] disabled:opacity-50 disabled:cursor-not-allowed bg-blue-700 text-white hover:bg-blue-800"
            onClick={klikYa}
          >
            {dialog.yes || 'Ya'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function AppProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [guest, setGuest] = useState(false);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState(null);
  const [dialog, setDialog] = useState(null);
  const toastTimer = useRef(null);

  useEffect(() => {
    api('me')
      .then((data) => {
        if (data?.user && data.user.role === 'Guest') {
          setGuest(true);
          setUser(null);
        } else {
          setUser(data?.user || null);
          setGuest(false);
        }
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimer.current) {
        clearTimeout(toastTimer.current);
      }
    };
  }, []);

  function say(pesan, isError = false) {
    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }
    setToast({ pesan, isError: Boolean(isError) });
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  }

  function simpanUser(dataUser) {
    setUser(dataUser);
    setGuest(false);
  }

  async function masukSebagaiTamu() {
    try {
      await api('guest', 'POST');
      setUser(null);
      setGuest(true);
      router.push('/');
    } catch (error) {
      say(error.message, true);
    }
  }

  async function keluar() {
    try {
      await api('logout', 'POST');
    } catch (error) {
      say(error.message, true);
    } finally {
      setUser(null);
      setGuest(false);
      router.push('/');
      router.refresh();
    }
  }

  function ask(isiDialog) {
    setDialog(isiDialog);
  }

  function askKeluar() {
    const teks = guest
      ? 'Sesi tamu Anda akan diakhiri.'
      : 'Anda akan keluar dari akun ini.';
    ask({
      title: 'Yakin ingin keluar?',
      text: teks,
      yes: 'Ya',
      no: 'Tidak',
      icon: LogOut,
      onYes: keluar,
    });
  }

  const nilai = {
    user,
    guest,
    ready,
    simpanUser,
    masukSebagaiTamu,
    say,
    ask,
    askKeluar,
  };

  return (
    <AppContext.Provider value={nilai}>
      {toast && (
        <div
          className={`animate-rise fixed top-5 left-1/2 z-[90] flex -translate-x-1/2 items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold text-white shadow-2xl ${
            toast.isError ? 'bg-rose-500' : 'bg-emerald-500'
          }`}
        >
          {toast.isError ? (
            <AlertCircle className="h-4 w-4" />
          ) : (
            <CheckCircle2 className="h-4 w-4" />
          )}
          {toast.pesan}
        </div>
      )}
      <KotakKonfirmasi dialog={dialog} tutup={() => setDialog(null)} />
      {children}
    </AppContext.Provider>
  );
}