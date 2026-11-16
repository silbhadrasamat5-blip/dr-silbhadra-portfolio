import type { Metadata } from 'next';
import './globals.css';
import { AdminProvider } from '@/contexts/AdminContext';

export const metadata: Metadata = {
  title: 'Dr. Silbhadra Samat | Clinical Pharmacology & Drug Safety',
  description:
    'Portfolio of Dr. Silbhadra Samat — Pharm.D, Clinical Pharmacologist, Pharmacovigilance & Drug Safety Specialist.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://googleapis.com" />
        <link rel="preconnect" href="https://gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        className="bg-[#FAF9F6] text-[#0F172A] antialiased selection:bg-teal-600 selection:text-white"
      >
        <AdminProvider>{children}</AdminProvider>
      </body>
    </html>
  );
}
