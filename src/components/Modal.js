'use client';
import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ title, onClose, children }) {

  useEffect(() => {
    const lama = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = lama;
    };
  }, []);

  useEffect(() => {
    function tanganiTombol(e) {
      if (e.key === 'Escape') {
        onClose?.();
      }
    }
    window.addEventListener('keydown', tanganiTombol);
    return () => window.removeEventListener('keydown', tanganiTombol);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-900/60 p-0 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="animate-rise max-h-[92vh] w-full overflow-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:max-w-xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-slate-800">{title}</h3>
          <button
            type="button"
            aria-label="Tutup"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}