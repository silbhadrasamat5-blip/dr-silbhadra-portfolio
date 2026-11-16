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
  const bioSnippet = bio.length > 200 ? bio.slice(0, 200) + '…' : bio
  const rawName = profile.full_name ?? 'Silbhadra Samat'
  const cleanName = rawName.startsWith('Dr. ') ? rawName.slice(4) : rawName

  return (
    <section
      id="about"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* ── Solid-to-Fade Pearl-Aqua Overlay ─────────────────────────────── */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to right, #FAF9F6 0%, #F2FAFA 46%, rgba(242,250,250,0.92) 56%, rgba(250,249,246,0.2) 68%, transparent 80%)',
        }}
      />

      {/* ── 3D Targeted Drug Delivery Nanosphere ─────────────────────────── */}
      <div className="hidden md:block absolute inset-0 z-10 pointer-events-none opacity-95">
        <ThreeMoleculeCanvas />
      </div>

      {/* ── Hero content ─────────────────────────────────────────────────── */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-14 py-28 w-full">
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
            Dr. <span className="text-[#0F766E]">{cleanName}</span>
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex gap-10"
          >
            {[
              { n: '6+', label: 'Certifications' },
              { n: '2+', label: 'Years Experience' },
              { n: '1', label: 'Publication' },
            ].map(({ n, label }) => (
              <div key={label}>
                <div className="text-3xl font-extrabold font-playfair text-[#0F766E]">
                  {n}
                </div>
                <div className="text-sm text-[#0F172A] font-semibold font-jakarta">
                  {label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Scroll Cue ───────────────────────────────────────────────────── */}
      <a
        href="#education"
        aria-label="Scroll down"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-teal-700 animate-bounce"
      >
        <ChevronDown size={28} />
      </a>

      {/* ── Admin Edit Modal ─────────────────────────────────────────────── */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-playfair text-xl font-bold text-slate-900">
                Edit Hero Profile
              </h3>
              <button
                onClick={() => setEditing(false)}
                className="text-slate-500 hover:text-slate-800"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Full Name (without Dr.)
                </label>
                <input
                  type="text"
                  value={form.full_name ?? ''}
                  onChange={(e) =>
                    setForm({ ...form, full_name: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Professional Title
                </label>
                <input
                  type="text"
                  value={form.title ?? ''}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Short Bio
                </label>
                <textarea
                  rows={3}
                  value={form.about_bio ?? ''}
                  onChange={(e) =>
                    setForm({ ...form, about_bio: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Background Video URL
                </label>
                <input
                  type="text"
                  value={form.video_url ?? ''}
                  onChange={(e) =>
                    setForm({ ...form, video_url: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setEditing(false)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={save}
                disabled={saving}
                className="btn-primary gap-2 text-sm"
              >
                <Check size={16} />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
