'use client'

import { useState, useEffect } from 'react'
import { Lock, Unlock, Menu, X, FlaskConical } from 'lucide-react'
import { useAdmin } from '@/contexts/AdminContext'

const NAV_LINKS = [
  { label: 'About',        href: '#about' },
  { label: 'Experience',   href: '#experience' },
  { label: 'Education',    href: '#education' },
  { label: 'Certificates', href: '#certificates' },
  { label: 'Projects',     href: '#projects' },
  { label: 'Contact',      href: '#contact' },
]

interface Props {
  adminBannerVisible?: boolean
}

export default function Navbar({ adminBannerVisible = false }: Props) {
  const { isAdmin, setShowLogin, logout } = useAdmin()
  const [scrolled,     setScrolled]     = useState(false)
  const [mobileOpen,   setMobileOpen]   = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const topOffset = adminBannerVisible ? 'top-8' : 'top-0'

  return (
    <nav
      className={`fixed ${topOffset} left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/82 backdrop-blur-md border-b border-teal-100 shadow-sm'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-aqua flex items-center justify-center shadow-sm">
            <FlaskConical size={16} className="text-white" />
          </div>
          <span className="font-playfair font-bold text-[#0F172A] text-lg group-hover:text-teal-600 transition-colors">
            Dr. Samat
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="text-sm font-medium text-[#334155] hover:text-teal-600 transition-colors font-jakarta"
            >
              {label}
            </a>
          ))}
        </div>

        {/* Lock / Unlock admin */}
        <div className="flex items-center gap-3">
          <button
            onClick={isAdmin ? logout : () => setShowLogin(true)}
            className={`p-2 rounded-lg transition-colors ${
              isAdmin
                ? 'bg-teal-50 text-teal-600 hover:bg-teal-100'
                : 'text-[#334155] hover:text-teal-600 hover:bg-teal-50'
            }`}
            title={isAdmin ? 'Exit Admin Mode' : 'Admin Login'}
          >
            {isAdmin ? <Unlock size={18} /> : <Lock size={18} />}
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-[#334155] hover:bg-teal-50 hover:text-teal-600 transition-colors"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-teal-100 shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-3">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="text-[#334155] hover:text-teal-600 font-jakarta text-sm font-medium py-2 border-b border-teal-50 transition-colors"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
