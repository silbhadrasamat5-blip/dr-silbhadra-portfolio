'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Plus, Edit3, Trash2, Briefcase, X, Check } from 'lucide-react'
import { useAdmin } from '@/contexts/AdminContext'
import { supabase } from '@/lib/supabase'
import type { Experience } from '@/types'

interface Props {
  items: Experience[]
  onRefresh: () => void
}

const BLANK: Partial<Experience> = {
  role: '',
  company: '',
  location: '',
  start_date: '',
  end_date: '',
  responsibilities: [],
}

export default function ExperienceSection({ items, onRefresh }: Props) {
  const { isAdmin } = useAdmin()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [editing, setEditing] = useState<Experience | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [form, setForm] = useState<Partial<Experience>>(BLANK)
  const [respText, setRespText] = useState('')
  const [saving, setSaving] = useState(false)

  const openEdit = (item: Experience) => {
    setIsNew(false)
    const list = item.responsibilities ?? []
    setForm({ ...item, responsibilities: list })
    setRespText(list.join('\n'))
    setEditing(item)
  }

  const openAdd = () => {
    setIsNew(true)
    setForm({ ...BLANK })
    setRespText('')
    setEditing({} as Experience)
  }

  const close = () => {
    setEditing(null)
    setIsNew(false)
  }

  const save = async () => {
    if (!supabase) {
      alert('Supabase is not connected!')
      return
    }
    setSaving(true)

    const { id: _ignoreId, created_at: _ignoreCreated, ...cleanFields } =
      form as Record<string, unknown>

    const payload = {
      ...cleanFields,
      responsibilities: respText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
    }

    const { error } = isNew
      ? await supabase.from('experience').insert(payload)
      : await supabase.from('experience').update(payload).eq('id', editing!.id)

    setSaving(false)

    if (error) {
      alert('Save failed: ' + error.message)
      return
    }

    close()
    await onRefresh()
  }

  const del = async (id: string) => {
    if (!supabase || !confirm('Delete this experience?')) return
    const { error } = await supabase.from('experience').delete().eq('id', id)
    if (error) {
      alert('Delete failed: ' + error.message)
      return
    }
    await onRefresh()
  }

  return (
    <section
      id="experience"
      className="relative py-24 bg-[#FAF9F6]/88 backdrop-blur-sm"
    >
      <div className="max-w-5xl mx-auto px-6" ref={ref}>
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="section-label text-[#0F766E] font-bold">
            Career Timeline
          </span>
          <h2 className="font-playfair text-4xl font-extrabold text-[#020617] mt-1">
            Professional Experience
          </h2>

          {isAdmin && (
            <button
              onClick={openAdd}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#0D9488] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#0F766E] transition-colors"
            >
              <Plus size={16} />
              Add Experience
            </button>
          )}
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
                <div className="absolute left-4 top-6 w-4 h-4 rounded-full bg-teal-600 border-2 border-white shadow-md hidden md:block" />

                <div className="bg-white/95 backdrop-blur-md border border-teal-100/80 shadow-md rounded-2xl p-6 group">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-3 items-start">
                      <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center shrink-0 mt-0.5">
                        <Briefcase size={18} className="text-teal-700" />
                      </div>
                      <div>
                        <h3 className="font-playfair text-xl font-bold text-[#020617]">
                          {item.role}
                        </h3>
                        <p className="text-[#0F766E] font-semibold font-jakarta text-sm mt-0.5">
                          {item.company}
                          {item.location ? ` · ${item.location}` : ''}
                        </p>
                        <p className="text-xs font-medium text-[#475569] font-jakarta mt-1">
                          {item.start_date}
                          {item.end_date ? ` – ${item.end_date}` : ' – Present'}
                        </p>
                      </div>
                    </div>

                    {isAdmin && (
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => openEdit(item)}
                          className="p-2 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 transition-colors"
                          title="Edit"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => del(item.id)}
                          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>

                  {item.responsibilities && item.responsibilities.length > 0 && (
                    <ul className="mt-4 space-y-2 pl-2">
                      {item.responsibilities.map((r, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2.5 text-sm text-[#1E293B] font-medium leading-relaxed"
                        >
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-teal-600 shrink-0" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit / Add Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-playfair text-xl font-bold text-slate-900">
                {isNew ? 'Add Experience' : 'Edit Experience'}
              </h3>
              <button
                onClick={close}
                className="text-slate-500 hover:text-slate-800"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Role / Designation
                </label>
                <input
                  type="text"
                  value={form.role ?? ''}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Institution / Hospital / Company
                </label>
                <input
                  type="text"
                  value={form.company ?? ''}
                  onChange={(e) =>
                    setForm({ ...form, company: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={form.location ?? ''}
                    onChange={(e) =>
                      setForm({ ...form, location: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Start Year/Date
                  </label>
                  <input
                    type="text"
                    value={form.start_date ?? ''}
                    onChange={(e) =>
                      setForm({ ...form, start_date: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
