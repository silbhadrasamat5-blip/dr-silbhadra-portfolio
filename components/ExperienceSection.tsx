'use client'

import { useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Plus, Edit3, Trash2, Briefcase } from 'lucide-react'
import { useAdmin } from '@/contexts/AdminContext'
import { supabase } from '@/lib/supabase'
import type { Experience } from '@/types'

interface Props {
  items: Experience[]
  onRefresh: () => void
}

const BLANK: Partial<Experience> = {
  role: '', company: '', location: '',
  start_date: '', end_date: '', responsibilities: [],
}

export default function ExperienceSection({ items, onRefresh }: Props) {
  const { isAdmin }                   = useAdmin()
  const ref                           = useRef(null)
  const inView                        = useInView(ref, { once: true, margin: '-80px' })
  const [editing, setEditing]         = useState<Experience | null>(null)
  const [isNew,   setIsNew]           = useState(false)
  const [form,    setForm]            = useState<Partial<Experience>>(BLANK)
  const [saving,  setSaving]          = useState(false)

  const openEdit = (item: Experience) => {
    setIsNew(false)
    setForm({ ...item, responsibilities: item.responsibilities ?? [] })
    setEditing(item)
  }
  const openAdd = () => {
    setIsNew(true)
    setForm({ ...BLANK })
    setEditing({} as Experience)
  }
  const close = () => { setEditing(null); setIsNew(false) }

  const save = async () => {
    if (!supabase) return
    setSaving(true)
    const payload = {
      ...form,
      responsibilities: Array.isArray(form.responsibilities)
        ? form.responsibilities
        : String(form.responsibilities || '')
            .split('\n')
            .map(s => s.trim())
            .filter(Boolean),
    }
    if (isNew) {
      await supabase.from('experience').insert(payload)
    } else {
      await supabase.from('experience').update(payload).eq('id', editing!.id)
    }
    setSaving(false)
    close()
    onRefresh()
  }

  const del = async (id: string) => {
    if (!supabase || !confirm('Delete this experience?')) return
    await supabase.from('experience').delete().eq('id', id)
    onRefresh()
  }

  const setResp = (val: string) =>
    setForm({ ...form, responsibilities: val.split('\n').map(s => s.trim()).filter(Boolean) })

  return (
    <section id="experience" className="relative py-24 section-tint">
      <div className="max-w-5xl mx-auto px-6" ref={ref}>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="section-label">Career Timeline</span>
          <h2 className="font-playfair text-4xl font-bold text-[#0F172A] mt-1">
            Professional Experience
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 timeline-line rounded-full hidden md:block" />

          <div className="space-y-8">
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -24 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.55, delay: i * 0.12 }}
                className="relative md:pl-16"
              >
                {/* Timeline dot */}
                <div className="absolute left-4 top-6 w-4 h-4 rounded-full bg-teal-500 border-2 border-white shadow-md hidden md:block" />

                <div className="glass-card rounded-2xl p-6 group">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-3 items-start">
                      <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center shrink-0 mt-0.5">
                        <Briefcase size={18} className="text-teal-600" />
                      </div>
                      <div>
                        <h3 className="font-playfair text-xl font-bold text-[#0F172A]">
                          {item.role}
                        </h3>
                        <p className="text-teal-600 font-medium font-jakarta text-sm mt-0.5">
                          {item.company}
                          {item.location ? ` · ${item.location}` : ''}
                        </p>
                        <p className="text-xs text-[#64748B] font-jakarta mt-1">
                          {item.start_date}
                          {item.end_date ? ` – ${item.end_date}` : ' – Present'}
                        </p>
                      </div>
                    </div>
                    {isAdmin && (
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-600 transition-colors">
                          <Edit3 size={15} />
                        </button>
                        <button onClick={() => del(item.id)} className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    )}
                  </div>

                  {item.responsibilities?.length > 0 && (
                    <ul className="mt-4 space-y-1.5 pl-2">
                      {item.responsibilities.map((r, ri) => (
                        <li key={ri} className="flex gap-2 text-sm text-[#334155] font-jakarta">
                          <span className="text-teal-500 mt-1 shrink-0">▸</span>
                          {r}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {isAdmin && (
          <button onClick={openAdd} className="btn-outline mt-10 gap-2">
            <Plus size={16} /> Add Experience
          </button>
        )}
      </div>

      {/* Edit / Add modal */}
      {editing !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
          <div className="glass-card rounded-2xl p-8 max-w-lg w-full max-h-[82vh] overflow-y-auto shadow-xl">
            <h3 className="font-playfair text-xl font-bold text-[#0F172A] mb-6">
              {isNew ? 'Add Experience' : 'Edit Experience'}
            </h3>
            <div className="space-y-4">
              {(
                [
                  ['Role / Title',  'role'],
                  ['Company',       'company'],
                  ['Location',      'location'],
                  ['Start Date',    'start_date'],
                  ['End Date',      'end_date'],
                ] as [string, keyof Experience][]
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
                <label className="text-sm font-medium text-[#334155] block mb-1">
                  Responsibilities (one per line)
                </label>
                <textarea
                  className="input-field min-h-[120px]"
                  value={(form.responsibilities ?? []).join('\n')}
                  onChange={e => setResp(e.target.value)}
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
