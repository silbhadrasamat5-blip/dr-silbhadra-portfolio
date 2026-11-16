'use client'
import { useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Pencil, User, GraduationCap, Languages } from 'lucide-react'
import { useAdmin } from '@/contexts/AdminContext'
import { supabase } from '@/lib/supabase'
import type { ProfileSettings } from '@/types'

const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.65, ease: 'easeOut' } }),
}

export default function AboutSection({
  profile, onRefresh,
}: { profile: ProfileSettings; onRefresh: () => void }) {
  const { isAdmin } = useAdmin()
  const ref         = useRef(null)
  const inView      = useInView(ref, { once: true, margin: '-80px' })

  const [editing, setEditing] = useState(false)
  const [bio,     setBio]     = useState(profile.about_bio)
  const [saving,  setSaving]  = useState(false)

  const save = async () => {
    if (!supabase || !profile.id) return
    setSaving(true)
    await supabase.from('profile_settings').update({ about_bio: bio }).eq('id', profile.id)
    setSaving(false)
    setEditing(false)
    onRefresh()
  }

  const highlights = [
    { icon: <GraduationCap size={20} />, label: 'Degree',   value: 'Pharm.D — JNTUH Hyderabad (2019–2025)' },
    { icon: <User size={20} />,          label: 'Role',     value: profile.current_role },
    { icon: <Languages size={20} />,     label: 'Languages',value: 'Bengali, Hindi, English' },
  ]

  return (
    <section id="about" className="py-24 bg-[#130E0B]" ref={ref}>
      <div className="max-w-6xl mx-auto px-6 lg:px-16">

        <div className="flex items-start justify-between mb-12">
          <div>
            <span className="section-label">Who I Am</span>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold gold-text">About Me</h2>
          </div>
          {isAdmin && (
            <button onClick={() => { setBio(profile.about_bio); setEditing(true) }}
              className="p-2 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 hover:bg-amber-500/25 transition-all"
            >
              <Pencil size={15} />
            </button>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* Bio text */}
          <motion.div
            custom={0} variants={fadeUp}
            initial="hidden" animate={inView ? 'visible' : 'hidden'}
          >
            <p className="font-jakarta text-[#C4A882] leading-relaxed text-base md:text-lg">
              {profile.about_bio}
            </p>
          </motion.div>

          {/* Highlight cards */}
          <div className="flex flex-col gap-4">
            {highlights.map((h, i) => (
              <motion.div
                key={h.label}
                custom={i + 1} variants={fadeUp}
                initial="hidden" animate={inView ? 'visible' : 'hidden'}
                className="glass-card glass-card-hover p-5 flex items-center gap-4"
              >
                <span className="text-amber-400 shrink-0">{h.icon}</span>
                <div>
                  <p className="text-xs text-[#9A8878] font-jakarta tracking-widest uppercase mb-0.5">{h.label}</p>
                  <p className="text-sm font-jakarta text-[#E7D7C1] font-medium">{h.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-card w-full max-w-xl p-8">
            <h3 className="font-playfair text-2xl font-bold gold-text mb-5">Edit About Bio</h3>
            <textarea
              rows={8}
              value={bio}
              onChange={e => setBio(e.target.value)}
              className="w-full bg-white/5 border border-amber-500/20 rounded-lg px-4 py-3 text-sm text-[#E7D7C1] outline-none focus:border-amber-400/50 font-jakarta resize-none"
            />
            <div className="flex gap-3 mt-5">
              <button onClick={save} disabled={saving} className="btn-gold font-jakarta text-sm">
                {saving ? 'Saving…' : 'Save'}
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
