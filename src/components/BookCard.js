'use client';
import { useRouter } from 'next/navigation';
import { ArrowRight, Flame } from 'lucide-react';
import { Cover, Stars } from '@/components/ui';

export default function BookCard({ book, rank }) {
  const router = useRouter();
  const tersedia = book.stock_avail > 0;

  return (
    <div
      onClick={() => router.push('/katalog/' + book.id)}
      className={
        'group flex cursor-pointer flex-col overflow-hidden ' +
        'rounded-2xl border border-slate-200 bg-white transition ' +
        'hover:-translate-y-1 hover:border-blue-600 ' +
        'hover:shadow-[0_8px_0_-3px_rgba(29,78,216,.2)]'
      }
    >
      <div className="relative bg-blue-50 p-3">
        <Cover
          src={book.cover_url}
          title={book.title}
          className={
            'aspect-[3/4] w-full rounded-xl shadow-md transition ' +
            'duration-500 group-hover:scale-[1.02]'
          }
        />
        {rank && (
          <span
            className={
              'absolute left-0 top-0 grid h-9 w-9 place-items-center ' +
              'rounded-br-2xl rounded-tl-2xl bg-blue-700 text-base ' +
              'font-extrabold text-white'
            }
          >
            {rank}
          </span>
        )}
        <span
          className={
            'absolute bottom-5 left-5 rounded-full bg-white px-2.5 py-1 ' +
            'text-[11px] font-bold shadow  ' +
            (tersedia ? 'text-emerald-700' : 'text-rose-600')
          }
        >
          {tersedia ? 'Tersedia ' + book.stock_avail : 'Stok habis'}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-700">
          {book.cat}
        </span>
        <h3
          className={
            'mt-1 line-clamp-2 min-h-[2.6rem] text-[15px] font-extrabold ' +
            'leading-snug text-slate-900'
          }
        >
          {book.title}
        </h3>
        <p className="truncate text-xs text-slate-500">
          {book.author} · {book.year}
        </p>
        <div className="mt-auto flex items-center justify-between pt-3">
          {book.rating !== undefined ? (
            <Stars value={book.rating} />
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-orange-600">
              <Flame className="h-3.5 w-3.5" />
              {book.loans}x dipinjam
            </span>
          )}
          <span
            className={
              'grid h-8 w-8 place-items-center rounded-lg bg-slate-100 ' +
              'text-slate-500 transition group-hover:bg-blue-700 ' +
              'group-hover:text-white'
            }
          >
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </div>
  );
}