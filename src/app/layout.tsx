import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import Header from '@/components/layout/Header';
import './globals.css';

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'OrdLinken',
  description: 'Norsk daglig ordspill — finn det sammensatte ordet',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nb" className={`${geist.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-slate-50 dark:bg-slate-950 antialiased">
        <Header />
        <div className="flex-1">{children}</div>
      </body>
    </html>
  );
}
