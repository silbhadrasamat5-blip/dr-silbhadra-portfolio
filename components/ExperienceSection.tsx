'use client'
import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Pencil, Plus, Trash2, Briefcase, MapPin, Clock } from 'lucide-react'
import { useAdmin } from '@/contexts/AdminContext'
import { supabase } from '@/lib/supabase'
import type { Experience } from '@/types'

const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.65, ease: 'easeOut' } }),
}

const blank: Omit<Experience, 'id'> = {
  job_title: '', organization: '', location: '', duration: '', responsibilities: [], sort_order: 99,
}

export default function ExperienceSection({
  experience, onRefresh,
}: { experience: Experience[]; onRefresh: () => void }) {
  const { isAdmin } = useAdmin()
  const ref         = useRef(null)
  const inView      = useInView(ref, { once: true, margin: '-60px' })

  const [editing, setEditing] = useState<Experience | null>(null)
  const [form,    setForm]    = useState<Omit<Experience,'id'>>(blank)
  const [saving,  setSaving]  = useState(false)

  const openEdit = (item: Experience) => {
    setEditing(item)
    setForm({ ...item })
  }
  const openAdd = () => {
    setEditing({ id: undefined, ...blank })
    setForm({ ...blank, sort_order: (experience.length + 1) })
  }

  const save = async () => {
    if (!supabase) return
    setSaving(true)
    const payload = { ...form, responsibilities: form.responsibilities }
    if (editing?.id) {
      await supabase.from('experience').update(payload).eq('id', editing.id)
    } else {
      await supabase.from('experience').insert(payload)
    }
    setSaving(false)
    setEditing(null)
    onRefresh()
  }

  const del = async (id: string) => {
    if (!supabase || !confirm('Delete this experience?')) return
    await supabase.from('experience').delete().eq('id', id)
    onRefresh()
  }

  return (
    <section id="experience" className="py-24 bg-[#130E0B]" ref={ref}>
      <div className="max-w-6xl mx-auto px-6 lg:px-16">

        <div className="flex items-start justify-between mb-12">
          <div>
            <span className="section-label">Career</span>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold gold-text">Professional Experience</h2>
          </div>
          {isAdmin && (
            <button onClick={openAdd}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-sm font-jakarta hover:bg-amber-500/25 transition-all"
            >
              <Plus size={15} /> Add
            </button>
          )}
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-amber-500/50 via-amber-500/20 to-transparent hidden md:block" />

          <div className="flex flex-col gap-10">
            {experience.map((item, i) => (
              <motion.div
                key={item.id ?? i}
                custom={i} variants={fadeUp}
                initial="hidden" animate={inView ? 'visible' : 'hidden'}
                className="md:pl-16 relative"
              >
                {/* Timeline dot */}
                <div className="hidden md:flex absolute left-4 top-6 w-4 h-4 rounded-full border-2 border-amber-500 bg-[#130E0B] items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                </div>

                <div className="glass-card glass-card-hover p-7 group">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="font-playfair text-xl font-bold text-amber-300 mb-1">{item.job_title}</h3>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-[#9A8878] font-jakarta">
                        <span className="flex items-center gap-1.5"><Briefcase size={13} />{item.organization}</span>
                        <span className="flex items-center gap-1.5"><MapPin size={13} />{item.location}</span>
                        <span className="flex items-center gap-1.5 text-amber-400/70"><Clock size={13} />{item.duration}</span>
                      </div>
                    </div>
                    {isAdmin && (
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(item)} className="p-1.5 rounded-full bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 transition-all">
                          <Pencil size={13} />
                        </button>
                        {item.id && (
                          <button onClick={() => del(item.id!)} className="p-1.5 rounded-full bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-all">
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  <ul className="space-y-2.5">
                    {item.responsibilities.map((r, j) => (
                      <li key={j} className="flex gap-3 text-sm font-jakarta text-[#C4A882] leading-relaxed">
                        <span className="text-amber-500/60 mt-1 shrink-0">▸</span>
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit / Add modal */}
      {editing !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8">
            <h3 className="font-playfair text-2xl font-bold gold-text mb-6">
              {editing.id ? 'Edit Experience' : 'Add Experience'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {([
                ['job_title',    'Job Title'],
                ['organization', 'Organization'],
                ['location',     'Location'],
                ['duration',     'Duration'],
              ] as [keyof typeof form, string][]).map(([key, label]) => (
                <div key={key}>
                  <label className="block text-xs text-amber-400/70 mb-1 font-jakarta tracking-wider uppercase">{label}</label>
                  <input
                    value={(form[key] ?? '') as string}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full bg-white/5 border border-amber-500/20 rounded-lg px-3 py-2 text-sm text-[#E7D7C1] outline-none focus:border-amber-400/50 font-jakarta"
                  />
                </div>
              ))}
              <div className="sm:col-span-2">
                <label className="block text-xs text-amber-400/70 mb-1 font-jakarta tracking-wider uppercase">
                  Responsibilities (one per line)
                </label>
                <textarea
                  rows={6}
                  value={form.responsibilities.join('\n')}
                  onChange={e => setForm(f => ({ ...f, responsibilities: e.target.value.split('\n').filter(Boolean) }))}
                  className="w-full bg-white/5 border border-amber-500/20 rounded-lg px-3 py-2 text-sm text-[#E7D7C1] outline-none focus:border-amber-400/50 font-jakarta resize-none"
                />
              </div>
              <div>
                <label className="block text-xs text-amber-400/70 mb-1 font-jakarta tracking-wider uppercase">Sort Order</label>
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={e => setForm(f => ({ ...f, sort_order: +e.target.value }))}
                  className="w-full bg-white/5 border border-amber-500/20 rounded-lg px-3 py-2 text-sm text-[#E7D7C1] outline-none focus:border-amber-400/50 font-jakarta"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={save} disabled={saving} className="btn-gold font-jakarta text-sm">
                {saving ? 'Saving…' : 'Save'}
              </button>
              <button onClick={() => setEditing(null)} className="btn-outline-gold font-jakarta text-sm">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
