'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Plus, Edit3, Trash2, GraduationCap } from 'lucide-react'
import { useAdmin } from '@/contexts/AdminContext'
import { supabase } from '@/lib/supabase'
import type { Education } from '@/types'

interface Props {
  items: Education[]
  onRefresh: () => void
}

const BLANK: Partial<Education> = {
  degree: '', institution: '', location: '',
  start_year: '', end_year: '', description: '',
}

export default function EducationSection({ items, onRefresh }: Props) {
  const { isAdmin }                 = useAdmin()
  const ref                         = useRef(null)
  const inView                      = useInView(ref, { once: true, margin: '-80px' })
  const [editing, setEditing]       = useState<Education | null>(null)
  const [isNew,   setIsNew]         = useState(false)
  const [form,    setForm]          = useState<Partial<Education>>(BLANK)
  const [saving,  setSaving]        = useState(false)

  const openEdit = (item: Education) => { setIsNew(false); setForm({ ...item }); setEditing(item) }
  const openAdd  = ()               => { setIsNew(true);  setForm({ ...BLANK }); setEditing({} as Education) }
  const close    = ()               => { setEditing(null); setIsNew(false) }

  const save = async () => {
    if (!supabase) return
    setSaving(true)
    if (isNew) await supabase.from('education').insert(form)
    else       await supabase.from('education').update(form).eq('id', editing!.id)
    setSaving(false); close(); onRefresh()
  }

  const del = async (id: string) => {
    if (!supabase || !confirm('Delete this education entry?')) return
    await supabase.from('education').delete().eq('id', id)
    onRefresh()
  }

  return (
    <section id="education" className="relative py-24">
      <div className="max-w-5xl mx-auto px-6" ref={ref}>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="section-label">Academic Background</span>
          <h2 className="font-playfair text-4xl font-bold text-[#0F172A] mt-1">Education</h2>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.12 }}
              className="glass-card rounded-2xl p-6 group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="w-11 h-11 rounded-xl bg-sky-50 flex items-center justify-center shrink-0">
                  <GraduationCap size={20} className="text-sky-600" />
                </div>
                {isAdmin && (
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-600">
                      <Edit3 size={14} />
                    </button>
                    <button onClick={() => del(item.id)} className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-500">
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
              <h3 className="font-playfair text-lg font-bold text-[#0F172A] mt-3">{item.degree}</h3>
              <p className="text-teal-600 font-medium text-sm font-jakarta mt-0.5">{item.institution}</p>
              {item.location && (
                <p className="text-xs text-[#64748B] font-jakarta mt-0.5">{item.location}</p>
              )}
              <div className="mt-2">
                <span className="badge-primary">
                  {item.start_year}{item.end_year ? ` – ${item.end_year}` : ''}
                </span>
              </div>
              {item.description && (
                <p className="text-sm text-[#334155] font-jakarta mt-3 leading-relaxed">
                  {item.description}
                </p>
              )}
            </motion.div>
          ))}
        </div>

        {isAdmin && (
          <button onClick={openAdd} className="btn-outline mt-10 gap-2">
            <Plus size={16} /> Add Education
          </button>
        )}
      </div>

      {editing !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
          <div className="glass-card rounded-2xl p-8 max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-xl">
            <h3 className="font-playfair text-xl font-bold text-[#0F172A] mb-6">
              {isNew ? 'Add Education' : 'Edit Education'}
            </h3>
            <div className="space-y-4">
              {(
                [
                  ['Degree / Programme', 'degree'],
                  ['Institution',        'institution'],
                  ['Location',           'location'],
                  ['Start Year',         'start_year'],
                  ['End Year',           'end_year'],
                ] as [string, keyof Education][]
              ).map(([label, key]) => (
                <div key={key}>
                  <label className="text-sm font-medium text-[#334155] block mb-1">{label}</label>
                  <input
                    className="input-field"
                    value={String(form[key] ?? '')}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                  />
                </div>
              ))}
              <div>
                <label className="text-sm font-medium text-[#334155] block mb-1">Description</label>
                <textarea
                  className="input-field"
                  value={form.description ?? ''}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={save} disabled={saving} className="btn-primary flex-1 justify-center">
                {saving ? 'Saving…' : 'Save'}
              </button>
              <button onClick={close} className="btn-outline flex-1 justify-center">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
