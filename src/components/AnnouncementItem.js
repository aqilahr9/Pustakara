'use client';
import { useRouter } from 'next/navigation';
import { ChevronRight, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui';
import { ringkasan } from '@/lib/client';

export default function AnnouncementItem({ announcement }) {
  const router = useRouter();
  const bagianTanggal = announcement?.release_date
    ? String(announcement.release_date).slice(0, 10)
    : '';
  const tgl = bagianTanggal ? new Date(bagianTanggal + 'T00:00') : null;
  const tanggalValid = tgl && !Number.isNaN(tgl.getTime());

  function bukaDetail() {
    if (announcement?.id != null) {
      router.push('/pengumuman/' + announcement.id);
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={bukaDetail}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          bukaDetail();
        }
      }}
      className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-blue-600"
    >
      <div className="grid h-[68px] w-[68px] flex-none place-content-center rounded-xl bg-[#0b1d5e] text-center text-white">
        <span className="text-2xl font-extrabold leading-none">
          {tanggalValid ? tgl.getDate() : '—'}
        </span>
        <span className="mt-1 text-[10px] font-bold uppercase tracking-widest text-sky-300">
          {tanggalValid
            ? `${tgl.toLocaleDateString('id-ID', { month: 'short' })} ${tgl.getFullYear()}`
            : ''}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <Badge text={announcement.category} />
          {announcement.status === 'Draft' && <Badge text="Draft" />}
          {announcement.location && (
            <span className="inline-flex items-center gap-1 text-xs text-slate-400">
              <MapPin className="h-3.5 w-3.5" />
              {announcement.location}
            </span>
          )}
        </div>
        <h3 className="font-extrabold text-slate-900 group-hover:text-blue-700">
          {announcement.title}
        </h3>
        <p className="mt-0.5 line-clamp-2 text-sm text-slate-500">
          {ringkasan(announcement.content)}
        </p>
      </div>

      <ChevronRight className="h-5 w-5 flex-none text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-700" />
    </div>
  );
}