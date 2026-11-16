'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Plus, Edit3, Trash2, FlaskConical, ExternalLink } from 'lucide-react'
import { useAdmin } from '@/contexts/AdminContext'
import { supabase } from '@/lib/supabase'
import type { PortfolioItem } from '@/types'

interface Props {
  items: PortfolioItem[]
  onRefresh: () => void
}

const BLANK: Partial<PortfolioItem> = {
  title: '', description: '', tech_stack: [], url: '', image_url: '',
}

export default function ProjectsSection({ items, onRefresh }: Props) {
  const { isAdmin }               = useAdmin()
  const ref                       = useRef(null)
  const inView                    = useInView(ref, { once: true, margin: '-80px' })
  const [editing, setEditing]     = useState<PortfolioItem | null>(null)
  const [isNew,   setIsNew]       = useState(false)
  const [form,    setForm]        = useState<Partial<PortfolioItem>>(BLANK)
  const [saving,  setSaving]      = useState(false)

  const openEdit = (item: PortfolioItem) => { setIsNew(false); setForm({ ...item }); setEditing(item) }
  const openAdd  = ()                    => { setIsNew(true);  setForm({ ...BLANK }); setEditing({} as PortfolioItem) }
  const close    = ()                    => { setEditing(null); setIsNew(false) }

  const save = async () => {
    if (!supabase) return
    setSaving(true)
    const payload = {
      ...form,
      tech_stack: Array.isArray(form.tech_stack)
        ? form.tech_stack
        : String(form.tech_stack ?? '').split(',').map(s => s.trim()).filter(Boolean),
    }
    if (isNew) await supabase.from('portfolio_items').insert(payload)
    else       await supabase.from('portfolio_items').update(payload).eq('id', editing!.id)
    setSaving(false); close(); onRefresh()
  }

  const del = async (id: string) => {
    if (!supabase || !confirm('Delete this project?')) return
    await supabase.from('portfolio_items').delete().eq('id', id)
    onRefresh()
  }

  return (
    <section id="projects" className="relative py-24">
      <div className="max-w-6xl mx-auto px-6" ref={ref}>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="section-label">Research &amp; Work</span>
          <h2 className="font-playfair text-4xl font-bold text-[#0F172A] mt-1">
            Projects &amp; Publications
          </h2>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              className="glass-card rounded-2xl p-6 group flex flex-col"
            >
              <div className="flex items-start justify-between gap-2 mb-4">
                <div className="w-11 h-11 rounded-xl bg-teal-50 flex items-center justify-center">
                  <FlaskConical size={20} className="text-teal-600" />
                </div>
                {isAdmin && (
                  <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-600">
                      <Edit3 size={13} />
                    </button>
                    <button onClick={() => del(item.id)} className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-500">
                      <Trash2 size={13} />
                    </button>
                  </div>
                )}
              </div>

              <h3 className="font-playfair font-bold text-[#0F172A] text-lg leading-snug flex-1">
                {item.title}
              </h3>
              {item.description && (
                <p className="text-sm text-[#334155] font-jakarta mt-2 leading-relaxed line-clamp-3">
                  {item.description}
                </p>
              )}

              {item.tech_stack?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {item.tech_stack.map(t => (
                    <span key={t} className="badge-primary">{t}</span>
                  ))}
                </div>
              )}

              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-1 text-xs text-sky-600 hover:text-sky-700 font-jakarta font-medium transition-colors"
                >
                  View Project <ExternalLink size={12} />
                </a>
              )}
            </motion.div>
          ))}
        </div>

        {isAdmin && (
          <button onClick={openAdd} className="btn-outline mt-10 gap-2">
            <Plus size={16} /> Add Project
          </button>
        )}
      </div>

      {editing !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
          <div className="glass-card rounded-2xl p-8 max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-xl">
            <h3 className="font-playfair text-xl font-bold text-[#0F172A] mb-6">
              {isNew ? 'Add Project' : 'Edit Project'}
            </h3>
            <div className="space-y-4">
              {(
                [
                  ['Title',           'title'],
                  ['Project URL',     'url'],
                  ['Image URL',       'image_url'],
                ] as [string, keyof PortfolioItem][]
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
                  Tech Stack (comma-separated)
                </label>
                <input
                  className="input-field"
                  value={(form.tech_stack ?? []).join(', ')}
                  onChange={e =>
                    setForm({
                      ...form,
                      tech_stack: e.target.value.split(',').map(s => s.trim()).filter(Boolean),
                    })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#334155] block mb-1">Description</label>
                <textarea
                  className="input-field min-h-[90px]"
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
