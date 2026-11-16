'use client'
import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { GraduationCap, Pencil, Plus, Trash2 } from 'lucide-react'
import { useAdmin } from '@/contexts/AdminContext'
import { supabase } from '@/lib/supabase'
import type { Education } from '@/types'

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.6 } }),
}
const blank: Omit<Education,'id'> = { degree: '', institution: '', year_range: '', grade_or_details: '', sort_order: 99 }

export default function EducationSection({
  education, onRefresh,
}: { education: Education[]; onRefresh: () => void }) {
  const { isAdmin } = useAdmin()
  const ref         = useRef(null)
  const inView      = useInView(ref, { once: true, margin: '-60px' })

  const [editing, setEditing] = useState<Education | null>(null)
  const [form,    setForm]    = useState<Omit<Education,'id'>>(blank)
  const [saving,  setSaving]  = useState(false)

  const openEdit = (item: Education) => { setEditing(item); setForm({ ...item }) }
  const openAdd  = () => { setEditing({ id: undefined, ...blank }); setForm({ ...blank }) }

  const save = async () => {
    if (!supabase) return
    setSaving(true)
    if (editing?.id) {
      await supabase.from('education').update(form).eq('id', editing.id)
    } else {
      await supabase.from('education').insert(form)
    }
    setSaving(false); setEditing(null); onRefresh()
  }
  const del = async (id: string) => {
    if (!supabase || !confirm('Delete?')) return
    await supabase.from('education').delete().eq('id', id)
    onRefresh()
  }

  return (
    <section id="education" className="py-24 bg-[#0D0907]" ref={ref}>
      <div className="max-w-6xl mx-auto px-6 lg:px-16">

        <div className="flex items-start justify-between mb-12">
          <div>
            <span className="section-label">Academic Background</span>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold gold-text">Education</h2>
          </div>
          {isAdmin && (
            <button onClick={openAdd}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-sm font-jakarta hover:bg-amber-500/25 transition-all"
            >
              <Plus size={15} /> Add
            </button>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {education.map((item, i) => (
            <motion.div
              key={item.id ?? i}
              custom={i} variants={fadeUp}
              initial="hidden" animate={inView ? 'visible' : 'hidden'}
              className="glass-card glass-card-hover p-7 group relative"
            >
              <div className="flex items-start gap-4">
                <span className="text-amber-400 mt-1 shrink-0">
                  <GraduationCap size={24} />
                </span>
                <div className="flex-1">
                  <h3 className="font-playfair text-lg font-bold text-[#E7D7C1] mb-1">{item.degree}</h3>
                  <p className="text-sm font-jakarta text-[#C4A882] mb-2">{item.institution}</p>
                  <div className="flex flex-wrap gap-3">
                    <span className="px-3 py-1 rounded-full text-xs font-jakarta font-semibold bg-amber-500/12 text-amber-300 border border-amber-500/20">
                      {item.year_range}
                    </span>
                    {item.grade_or_details && (
                      <span className="px-3 py-1 rounded-full text-xs font-jakarta font-semibold bg-white/5 text-[#9A8878] border border-white/8">
                        {item.grade_or_details}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {isAdmin && (
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
            </motion.div>
          ))}
        </div>
      </div>

      {editing !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-card w-full max-w-lg p-8">
            <h3 className="font-playfair text-2xl font-bold gold-text mb-6">
              {editing.id ? 'Edit Education' : 'Add Education'}
            </h3>
            <div className="flex flex-col gap-4">
              {([
                ['degree',           'Degree / Qualification'],
                ['institution',      'Institution'],
                ['year_range',       'Year Range  (e.g. 2019 – 2025)'],
                ['grade_or_details', 'Grade / Details'],
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
