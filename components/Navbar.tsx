'use client'
import { useState, useEffect } from 'react'
import { Lock, Unlock, Menu, X } from 'lucide-react'
import { useAdmin } from '@/contexts/AdminContext'
import type { ProfileSettings } from '@/types'

const NAV = [
  { label: 'About',       href: '#about'       },
  { label: 'Skills',      href: '#skills'      },
  { label: 'Experience',  href: '#experience'  },
  { label: 'Education',   href: '#education'   },
  { label: 'Certificates',href: '#certificates'},
  { label: 'Projects',    href: '#projects'    },
  { label: 'Contact',     href: '#contact'     },
]

export default function Navbar({ profile }: { profile: ProfileSettings }) {
  const { isAdmin, setShowLogin, logout } = useAdmin()
  const [scrolled,   setScrolled]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
      ${isAdmin ? 'mt-8' : ''}
      ${scrolled
        ? 'bg-[#0D0907]/90 backdrop-blur-xl border-b border-amber-500/15 shadow-lg shadow-black/30'
        : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <a href="#hero" className="flex flex-col leading-none group">
          <span className="font-playfair font-bold text-lg text-amber-400 tracking-wide group-hover:text-amber-300 transition-colors">
            {profile.full_name.replace('Dr. ', 'Dr. ')}
          </span>
          <span className="text-[10px] font-jakarta text-[#9A8878] tracking-widest uppercase mt-0.5">
            Clinical Pharmacologist
          </span>
        </a>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-7">
          {NAV.map(n => (
            <li key={n.href}>
              <a href={n.href}
                className="text-sm font-jakarta font-medium text-[#C4A882] hover:text-amber-400 transition-colors tracking-wide"
              >
                {n.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Admin + mobile toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => isAdmin ? logout() : setShowLogin(true)}
            title={isAdmin ? 'Exit Admin' : 'Admin Login'}
            className={`p-2 rounded-full border transition-all duration-200
              ${isAdmin
                ? 'border-amber-400/50 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20'
                : 'border-amber-500/20 text-[#9A8878] hover:border-amber-400/40 hover:text-amber-400'
              }`}
          >
            {isAdmin ? <Unlock size={16} /> : <Lock size={16} />}
          </button>

          <button
            className="lg:hidden p-2 text-[#C4A882] hover:text-amber-400 transition-colors"
            onClick={() => setMobileOpen(v => !v)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-amber-500/10 bg-[#0D0907]/95 backdrop-blur-xl px-6 py-4">
          {NAV.map(n => (
            <a key={n.href} href={n.href}
              onClick={() => setMobileOpen(false)}
              className="block py-3 text-sm font-jakarta text-[#C4A882] hover:text-amber-400 transition-colors border-b border-white/5 last:border-0"
            >
              {n.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  )
}
