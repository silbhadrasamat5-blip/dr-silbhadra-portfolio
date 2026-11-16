import type { Metadata } from 'next'
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { AdminProvider } from '@/contexts/AdminContext'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400','500','600','700','800','900'],
})
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
  weight: ['300','400','500','600','700','800'],
})

export const metadata: Metadata = {
  title: 'Dr. Silbhadra Samat | Clinical Pharmacologist',
  description:
    'Portfolio of Dr. Silbhadra Samat — Pharm.D, Clinical Pharmacology & Drug Safety, Pharmacovigilance Specialist, Educator.',
  keywords: [
    'Clinical Pharmacologist','Pharmacovigilance','ADR','Drug Safety',
    'Pharm.D','Silbhadra Samat','Clinical Pharmacy',
  ].join(', '),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${jakarta.variable}`}>
      <body>
        <AdminProvider>{children}</AdminProvider>
      </body>
    </html>
  )
}
