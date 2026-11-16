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

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">

      {/* ── Gradient overlay: opaque left → transparent right ──────────── */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            'linear-gradient(to right, rgba(250,249,246,0.95) 0%, rgba(250,249,246,0.82) 42%, rgba(250,249,246,0.18) 68%, transparent 100%)',
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
            <span className="section-label">Clinical Pharmacologist &amp; Educator</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.72, delay: 0.1 }}
            className="font-playfair text-5xl md:text-6xl lg:text-7xl font-bold text-[#0F172A] leading-tight mt-2 mb-3"
          >
            Dr.{' '}
            <span className="accent-text">
              {profile.full_name ?? 'Silbhadra Samat'}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl font-medium text-teal-600 font-jakarta mb-5"
          >
            {profile.title ??
              'Pharm.D · Pharmacovigilance · Drug Safety · Clinical Research'}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-[#334155] text-lg leading-relaxed mb-8 max-w-xl"
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
                <div className="text-3xl font-bold font-playfair text-teal-600">{n}</div>
                <div className="text-sm text-[#334155] font-jakarta">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Admin edit button ─────────────────────────────────────────────── */}
      {isAdmin && (
        <button
          onClick={() => { setForm({ ...profile }); setEditing(true) }}
          className="absolute top-24 right-6 z-20 p-2 rounded-full bg-teal-100 hover:bg-teal-200 text-teal-700 shadow transition-colors"
          title="Edit Profile"
        >
          <Edit3 size={18} />
        </button>
      )}

      {/* ── Scroll cue ───────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-teal-500"
      >
        <span className="text-[0.68rem] font-jakarta tracking-[0.18em] uppercase">
          Scroll
        </span>
        <ChevronDown size={19} className="animate-bounce" />
      </motion.div>

      {/* ── Admin edit modal ─────────────────────────────────────────────── */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
          <div className="glass-card rounded-2xl p-8 max-w-lg w-full max-h-[82vh] overflow-y-auto shadow-xl">
            <h3 className="font-playfair text-xl font-bold text-[#0F172A] mb-6">
              Edit Profile
            </h3>
            <div className="space-y-4">
              {(
                [
                  ['Full Name',               'full_name'],
                  ['Title / Tagline',          'title'],
                  ['Video URL (Supabase)',      'video_url'],
                  ['CV Download URL',          'cv_url'],
                  ['Email',                    'email'],
                  ['Phone',                    'phone'],
                  ['Location',                 'location'],
                  ['LinkedIn URL',             'linkedin_url'],
                ] as [string, keyof ProfileSettings][]
              ).map(([label, key]) => (
                <div key={key}>
                  <label className="text-sm font-medium text-[#334155] block mb-1">
                    {label}
                  </label>
                  <input
                    className="input-field"
                    value={String(form[key] ?? '')}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                  />
                </div>
              ))}
              <div>
                <label className="text-sm font-medium text-[#334155] block mb-1">
                  About Bio
                </label>
                <textarea
                  className="input-field min-h-[110px]"
                  value={form.about_bio ?? ''}
                  onChange={e => setForm({ ...form, about_bio: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={save} disabled={saving} className="btn-primary flex-1 justify-center">
                {saving ? 'Saving…' : 'Save'}
              </button>
              <button onClick={() => setEditing(false)} className="btn-outline flex-1 justify-center">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
