import type { Metadata } from 'next'
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { AdminProvider } from '@/contexts/AdminContext'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-playfair',
  display: 'swap',
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-jakarta',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Dr. Silbhadra Samat — Clinical Pharmacologist',
  description:
    'Portfolio of Dr. Silbhadra Samat — Pharm.D, Clinical Pharmacologist specializing in Pharmacovigilance, Drug Safety, and Clinical Research. Assistant Professor at Netaji College of Pharmacy, Bankura.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${jakarta.variable}`}>
      <body className="bg-[#FAF9F6] font-jakarta antialiased">
        <AdminProvider>{children}</AdminProvider>
      </body>
    </html>
  )
}
