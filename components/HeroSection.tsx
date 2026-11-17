'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { Download, Mail, Edit3, ChevronDown, X, Check } from 'lucide-react'
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
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState<ProfileSettings>({ ...profile })
  const [saving, setSaving] = useState(false)

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
  const bioSnippet = bio
  const rawName = profile.full_name ?? 'Silbhadra Samat'
  const cleanName = rawName.startsWith('Dr. ') ? rawName.slice(4) : rawName

  return (
    <section
      id="about"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* ── Mobile-Only Pearl-Aqua Backdrop Overlay (Keeps text crisp on mobile) ── */}
      <div
        className="md:hidden absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, rgba(250,249,246,0.92) 0%, rgba(242,250,250,0.88) 65%, rgba(250,249,246,0.95) 100%)',
        }}
      />

      {/* ── Desktop Solid-to-Fade Pearl-Aqua Overlay (100% unchanged for laptop) ── */}
      <div
        className="hidden md:block absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to right, #FAF9F6 0%, #F2FAFA 46%, rgba(242,250,250,0.92) 56%, rgba(250,249,246,0.2) 68%, transparent 80%)',
        }}
      />

      {/* ── 3D Targeted Drug Delivery Nanosphere (Desktop only) ───────────── */}
      <div className="hidden md:block absolute inset-0 z-10 pointer-events-none opacity-95">
        <ThreeMoleculeCanvas />
      </div>

      {/* ── Hero content ─────────────────────────────────────────────────── */}
      <div className="relative z-20 max-w-7xl mx-auto px-5 sm:px-6 lg:px-14 pt-24 pb-16 md:py-28 w-full">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="section-label text-[#0F766E] font-bold text-xs sm:text-sm">
              Clinical Pharmacologist &amp; Educator
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.72, delay: 0.1 }}
            className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#020617] leading-tight mt-2 mb-3 tracking-tight"
          >
            Dr. <span className="text-[#0F766E]">{cleanName}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl md:text-2xl font-bold text-[#0369A1] font-jakarta mb-4 md:mb-5"
          >
            {profile.title ??
              'Pharm.D · Pharmacovigilance · Drug Safety · Clinical Research'}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-[#0F172A] font-medium text-base md:text-lg leading-relaxed mb-7 md:mb-8 max-w-xl"
          >
            {bioSnippet ||
              'Dedicated Clinical Pharmacologist with expertise in pharmacovigilance, drug safety monitoring, and causality assessment. Faculty at Netaji College of Pharmacy, Bankura.'}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-3 sm:gap-4 mb-8 md:mb-10"
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
            {isAdmin && (
              <button
                onClick={() => {
                  setForm({ ...profile })
                  setEditing(true)
                }}
                className="btn-outline gap-2 border-teal-600 text-teal-700"
              >
                <Edit3 size={17} />
                Edit Hero
              </button>
            )}
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap gap-6 sm:gap-10 pt-4 border-t border-teal-900/10"
          >
            <div>
              <div className="font-playfair text-2xl sm:text-3xl font-extrabold text-[#020617]">
                {profile.cert_count ?? '6+'}
              </div>
              <div className="text-xs font-semibold text-[#475569] font-jakarta">
                Certifications
              </div>
            </div>
            <div>
              <div className="font-playfair text-2xl sm:text-3xl font-extrabold text-[#020617]">
                {profile.exp_years ?? '2+'}
              </div>
              <div className="text-xs font-semibold text-[#475569] font-jakarta">
                Years Experience
              </div>
            </div>
            <div>
              <div className="font-playfair text-2xl sm:text-3xl font-extrabold text-[#020617]">
                {profile.pub_count ?? '1'}
              </div>
              <div className="text-xs font-semibold text-[#475569] font-jakarta">
                Publication
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#experience"
        aria-label="Scroll down"
        className="hidden md:flex absolute bottom-7 left-1/2 -translate-x-1/2 z-20 flex-col items-center text-[#0F766E] hover:text-[#020617] transition-colors animate-bounce"
      >
        <ChevronDown size={24} />
      </a>

      {/* Edit Hero Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 py-6 overflow-y-auto">
          <div className="glass-card rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-xl my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-playfair text-xl font-bold text-[#0F172A]">
                Edit Hero Profile
              </h3>
              <button
                onClick={() => setEditing(false)}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-[#334155] block mb-1">
                  Full Name (without Dr.)
                </label>
                <input
                  className="input-field"
                  value={form.full_name ?? ''}
                  onChange={(e) =>
                    setForm({ ...form, full_name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium text-[#334155] block mb-1">
                  Professional Title
                </label>
                <input
                  className="input-field"
                  value={form.title ?? ''}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-[#334155] block mb-1">
                  Short Bio
                </label>
                <textarea
                  rows={4}
                  className="input-field"
                  value={form.about_bio ?? ''}
                  onChange={(e) =>
                    setForm({ ...form, about_bio: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium text-[#334155] block mb-1">
                  Background Video URL
                </label>
                <input
                  className="input-field"
                  value={form.hero_video_url ?? ''}
                  onChange={(e) =>
                    setForm({ ...form, hero_video_url: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditing(false)}
                className="btn-outline flex-1 justify-center"
              >
                Cancel
              </button>
              <button
                onClick={save}
                disabled={saving}
                className="btn-primary flex-1 justify-center gap-1.5"
              >
                <Check size={16} />
