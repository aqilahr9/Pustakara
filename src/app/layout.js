import './globals.css';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { AppProvider } from '@/components/AppProvider';
import Sidebar from '@/components/Sidebar';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta-sans',
});

export const metadata = {
  title: 'Pustakara — Perpustakaan Kampus',
  description: 'Sistem manajemen perpustakaan kampus',
  icons: { icon: '/logo.png' },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      className={`${plusJakartaSans.variable} scroll-smooth`}
    >
      <body className="bg-[#f3f6fb] font-sans text-slate-800 antialiased">
        <AppProvider>
          <Sidebar>{children}</Sidebar>
        </AppProvider>
      </body>
    </html>
  );
}