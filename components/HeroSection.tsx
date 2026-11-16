'use client'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Linkedin, Mail, Phone, Pencil, MapPin, ChevronDown } from 'lucide-react'
import { useAdmin } from '@/contexts/AdminContext'
import { supabase } from '@/lib/supabase'
import type { ProfileSettings } from '@/types'

const ThreeDNACanvas = dynamic(() => import('./ThreeDNACanvas'), { ssr: false, loading: () => null })

export default function HeroSection({
  profile, onRefresh,
}: { profile: ProfileSettings; onRefresh: () => void }) {
  const { isAdmin } = useAdmin()
  const [editing, setEditing] = useState(false)
  const [form, setForm]       = useState<ProfileSettings>(profile)
  const [saving, setSaving]   = useState(false)

  const save = async () => {
    if (!supabase) return
    setSaving(true)
    if (profile.id) {
      await supabase.from('profile_settings').update(form).eq('id', profile.id)
    } else {
      await supabase.from('profile_settings').insert(form)
    }
    setSaving(false)
    setEditing(false)
    onRefresh()
  }

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">

      {/* Video / gradient background */}
      {profile.video_url ? (
        <video
          src={profile.video_url}
          autoPlay muted loop playsInline crossOrigin="anonymous"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: 0 }}
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            zIndex: 0,
            background:
              'radial-gradient(ellipse 80% 60% at 70% 50%, rgba(217,119,6,0.12) 0%, #0D0907 70%)',
          }}
        />
      )}

      {/* Dark overlay — left side */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: 1,
          background:
            'linear-gradient(to right, rgba(13,9,7,0.92) 0%, rgba(13,9,7,0.6) 50%, transparent 100%)',
        }}
      />

      {/* Three.js DNA canvas */}
      <ThreeDNACanvas />

      {/* Hero content — left side */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 pt-24 pb-20 lg:px-16">
        <div className="max-w-2xl">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/8 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-jakarta font-semibold tracking-widest uppercase text-amber-400">
              Clinical Pharmacologist
            </span>
          </motion.div>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-playfair font-bold leading-none tracking-tight mb-4"
            style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)' }}
          >
            <span className="gold-text">{profile.full_name}</span>
          </motion.h1>

          {/* Headline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="font-jakarta font-light text-lg md:text-xl text-[#C4A882] mb-3 tracking-wide"
          >
            {profile.headline}
          </motion.p>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="font-jakarta text-sm text-[#9A8878] mb-2 tracking-widest uppercase"
          >
            {profile.tagline}
          </motion.p>

          {/* Location */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="flex items-center gap-1.5 text-sm text-[#9A8878] mb-10"
          >
            <MapPin size={14} className="text-amber-500/60" />
            {profile.location}
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="flex flex-wrap gap-4 mb-8"
          >
            <a href="#contact" className="btn-gold font-jakarta text-sm">
              Get In Touch
            </a>
            <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer"
              className="btn-outline-gold font-jakarta text-sm flex items-center gap-2"
            >
              <Linkedin size={16} />
              LinkedIn
            </a>
            <a href={`mailto:${profile.email}`}
              className="btn-outline-gold font-jakarta text-sm flex items-center gap-2"
            >
              <Mail size={16} />
              Email
            </a>
          </motion.div>

          {/* Quick info row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75 }}
            className="flex flex-wrap gap-6 text-xs font-jakarta text-[#9A8878]"
          >
            <span className="flex items-center gap-1.5">
              <Phone size={12} className="text-amber-500/60" />
              {profile.phone}
            </span>
            <span className="flex items-center gap-1.5">
              <Mail size={12} className="text-amber-500/60" />
              {profile.email}
            </span>
          </motion.div>
        </div>
      </div>

      {/* Admin edit button */}
      {isAdmin && (
        <button
          onClick={() => { setForm(profile); setEditing(true) }}
          className="absolute top-28 right-6 z-20 p-2 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 hover:bg-amber-500/30 transition-all"
        >
          <Pencil size={16} />
        </button>
      )}

      {/* Scroll chevron */}
      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 text-amber-500/40 hover:text-amber-400 transition-colors"
        style={{ animation: 'bounce 2s infinite' }}
      >
        <ChevronDown size={28} />
      </motion.a>

      {/* ── Edit Modal ────────────────────────────────── */}
      {editing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8">
            <h3 className="font-playfair text-2xl font-bold gold-text mb-6">Edit Hero / Profile</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {([
                ['full_name',    'Full Name'],
                ['headline',     'Headline'],
                ['tagline',      'Tagline'],
                ['current_role', 'Current Role'],
                ['location',     'Location'],
                ['email',        'Email'],
                ['phone',        'Phone'],
                ['linkedin_url', 'LinkedIn URL'],
                ['video_url',    'Video URL (Supabase storage)'],
              ] as [keyof ProfileSettings, string][]).map(([key, label]) => (
                <div key={key} className={key === 'headline' || key === 'tagline' ? 'sm:col-span-2' : ''}>
                  <label className="block text-xs text-amber-400/70 mb-1 font-jakarta tracking-wider uppercase">{label}</label>
                  <input
                    value={(form[key] ?? '') as string}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full bg-white/5 border border-amber-500/20 rounded-lg px-3 py-2 text-sm text-[#E7D7C1] outline-none focus:border-amber-400/50 font-jakarta"
                  />
                </div>
              ))}
              <div className="sm:col-span-2">
                <label className="block text-xs text-amber-400/70 mb-1 font-jakarta tracking-wider uppercase">About Bio</label>
                <textarea
                  rows={4}
                  value={form.about_bio}
                  onChange={e => setForm(f => ({ ...f, about_bio: e.target.value }))}
                  className="w-full bg-white/5 border border-amber-500/20 rounded-lg px-3 py-2 text-sm text-[#E7D7C1] outline-none focus:border-amber-400/50 font-jakarta resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={save} disabled={saving} className="btn-gold font-jakarta text-sm">
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
              <button onClick={() => setEditing(false)} className="btn-outline-gold font-jakarta text-sm">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
