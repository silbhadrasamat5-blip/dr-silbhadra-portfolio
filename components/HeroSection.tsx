'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { Download, Mail, Edit3, ChevronDown } from 'lucide-react'
import { useAdmin } from '@/contexts/AdminContext'
import { supabase } from '@/lib/supabase'
import type { ProfileSettings } from '@/types'

const ThreeMoleculeCanvas = dynamic(() => import('./ThreeMoleculeCanvas'), {
  ssr: false,
})

interface Props {
  profile: ProfileSettings
  onRefresh: () => void
}

export default function HeroSection({ profile, onRefresh }: Props) {
  const { isAdmin } = useAdmin()
  const [editing, setEditing]   = useState(false)
  const [form,    setForm]       = useState({ ...profile })
  const [saving,  setSaving]     = useState(false)

  const save = async () => {
    if (!supabase) return
    setSaving(true)
    await supabase
      .from('profile_settings')
      .upsert({ id: profile.id ?? 1, ...form })
    setSaving(false)
    setEditing(false)
    onRefresh()
  }

  const bio = profile.about_bio ?? ''
  const bioSnippet = bio.length > 200 ? bio.slice(0, 200) + '…' : bio
 const cleanName = (profile.full_name ?? 'Silbhadra Samat').replace('Dr. ', '').replace('Dr.', '')

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">

      {/* ── Solid-to-Fade Pearl-Aqua Overlay (পেছনের সাদা লেখা ১০০% ঢেকে রাখার জন্য) ── */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            'linear-gradient(to right, #FAF9F6 0%, #F2FAFA 46%, rgba(242,250,250,0.92) 56%, rgba(250,249,246,0.2) 68%, transparent 80%)',
        }}
      />

      {/* ── 3D Molecule — left background, behind text ──────────────────── */}
      <div className="absolute inset-0 z-[2] pointer-events-none">
        <ThreeMoleculeCanvas />
      </div>

      {/* ── Hero content ─────────────────────────────────────────────────── */}
      <div className="relative z-[10] max-w-7xl mx-auto px-6 lg:px-14 py-28 w-full">
        <div className="max-w-2xl">

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="section-label text-[#0F766E] font-bold">
              Clinical Pharmacologist &amp; Educator
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.72, delay: 0.1 }}
            className="font-playfair text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#020617] leading-tight mt-2 mb-3 tracking-tight"
          >
            Dr.{' '}
            <span className="text-[#0F766E]">
              {cleanName}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl font-bold text-[#0369A1] font-jakarta mb-5"
          >
            {profile.title ??
              'Pharm.D · Pharmacovigilance · Drug Safety · Clinical Research'}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-[#0F172A] font-medium text-lg leading-relaxed mb-8 max-w-xl"
          >
            {bioSnippet ||
              'Dedicated Clinical Pharmacologist with expertise in pharmacovigilance, drug safety monitoring, and causality assessment. Faculty at Netaji College of Pharmacy, Bankura.'}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-4 mb-10"
          >
            <a href="#contact" className="btn-primary gap-2">
              <Mail size={17} />
              Get in Touch
            </a>
            {profile.cv_url && (
              <a
                href={profile.cv_url}
                target="_blank"
                rel="noreferrer"
                className="btn-outline gap-2"
              >
                <Download size={17} />
                Download CV
              </a>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex gap-10"
          >
            {[
              { n: '6+',  label: 'Certifications' },
              { n: '2+',  label: 'Years Experience' },
              { n: '1',   label: 'Publication' },
            ].map(({ n, label }) => (
              <div key={label}>
                <div className="text-3xl font-extrabold font-playfair text-[#0F766E]">{n}</div>
                <div className="text-sm text-[#0F172A] font-semibold font-jakarta">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
