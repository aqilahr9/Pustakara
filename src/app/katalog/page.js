'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import BookCard from '@/components/BookCard';
import { Empty } from '@/components/ui';
import { api } from '@/lib/client';

function TombolKategori({ nilai, label, aktif, onPilih }) {
  return (
    <button
      type="button"
      onClick={() => onPilih(nilai)}
      className={`rounded-full border px-4 py-1.5 text-sm font-bold transition ${
        aktif
          ? 'border-[#0b1d5e] bg-[#0b1d5e] text-white'
          : 'border-slate-300 bg-white text-slate-600 hover:border-blue-600 hover:text-blue-700'
      }`}
    >
      {label}
    </button>
  );
}

export default function KatalogPage() {
  const searchParams = useSearchParams();
  const [kataCari, setKataCari] = useState(searchParams.get('q') || '');
  const [kategori, setKategori] = useState('');
  const [urutan, setUrutan] = useState('');
  const [daftarBuku, setDaftarBuku] = useState(null);
  const [daftarKategori, setDaftarKategori] = useState([]);

  useEffect(() => {
    setKataCari(searchParams.get('q') || '');
  }, [searchParams]);

  useEffect(() => {
    api('categories').then(setDaftarKategori);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams({
        search: kataCari,
        cat: kategori,
        sort: urutan,
      });
      api('books?' + params.toString()).then(setDaftarBuku);
    }, 250);
    return () => clearTimeout(timer);
  }, [kataCari, kategori, urutan]);

  return (
    <div>
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="grid gap-3 sm:grid-cols-[1.6fr_1fr]">
          <div className="relative">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100 !pl-10"
              placeholder="Cari judul atau pengarang…"
              value={kataCari}
              onChange={(e) => setKataCari(e.target.value)}
            />
          </div>
          <select
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            value={urutan}
            onChange={(e) => setUrutan(e.target.value)}
          >
            <option value="">Urutkan: Judul A–Z</option>
            <option value="year">Tahun terbit terbaru</option>
            <option value="rating">Rating tertinggi</option>
          </select>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <TombolKategori
            nilai=""
            label="Semua"
            aktif={kategori === ''}
            onPilih={setKategori}
          />
          {daftarKategori.map((k) => (
            <TombolKategori
              key={k.id}
              nilai={String(k.id)}
              label={k.name}
              aktif={kategori === String(k.id)}
              onPilih={setKategori}
            />
          ))}
        </div>
      </div>

      {daftarBuku && (
        <p className="mb-3 text-sm font-semibold text-slate-500">
          {daftarBuku.length} buku ditemukan
        </p>
      )}

      {daftarBuku && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {daftarBuku.map((buku) => (
            <BookCard key={buku.id} book={buku} />
          ))}
        </div>
      )}

      {!daftarBuku && <Empty text="Memuat katalog…" />}
      {daftarBuku && daftarBuku.length === 0 && (
        <Empty text="Buku tidak ditemukan." />
      )}
    </div>
  );
}