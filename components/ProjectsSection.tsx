'use client'
import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { FlaskConical, ExternalLink, Pencil, Plus, Trash2 } from 'lucide-react'
import { useAdmin } from '@/contexts/AdminContext'
import { supabase } from '@/lib/supabase'
import type { PortfolioItem } from '@/types'

const blank: Omit<PortfolioItem,'id'|'created_at'> = { title: '', category: '', summary: '', tags: [], link: '' }

export default function ProjectsSection({
  projects, onRefresh,
}: { projects: PortfolioItem[]; onRefresh: () => void }) {
  const { isAdmin } = useAdmin()
  const ref         = useRef(null)
  const inView      = useInView(ref, { once: true, margin: '-60px' })

  const [editing, setEditing] = useState<PortfolioItem | null>(null)
  const [form,    setForm]    = useState<Omit<PortfolioItem,'id'|'created_at'>>(blank)
  const [saving,  setSaving]  = useState(false)

  const openEdit = (item: PortfolioItem) => { setEditing(item); setForm({ ...item }) }
  const openAdd  = () => { setEditing({ ...blank }); setForm({ ...blank }) }

  const save = async () => {
    if (!supabase) return
    setSaving(true)
    if (editing?.id) {
      await supabase.from('portfolio_items').update(form).eq('id', editing.id)
    } else {
      await supabase.from('portfolio_items').insert(form)
    }
    setSaving(false); setEditing(null); onRefresh()
  }
  const del = async (id: string) => {
    if (!supabase || !confirm('Delete?')) return
    await supabase.from('portfolio_items').delete().eq('id', id)
    onRefresh()
  }

  return (
    <section id="projects" className="py-24 bg-[#0D0907]" ref={ref}>
      <div className="max-w-6xl mx-auto px-6 lg:px-16">

        <div className="flex items-start justify-between mb-12">
          <div>
            <span className="section-label">Research & Projects</span>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold gold-text">Portfolio</h2>
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
          {projects.map((item, i) => (
            <motion.div
              key={item.id ?? i}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              className="glass-card glass-card-hover p-7 group relative flex flex-col"
            >
              <div className="flex items-start gap-4 mb-4">
                <span className="text-amber-400 mt-1 shrink-0"><FlaskConical size={22} /></span>
                <div>
                  <span className="text-xs font-jakarta font-semibold text-amber-400/70 tracking-widest uppercase">
                    {item.category}
                  </span>
                  <h3 className="font-playfair font-bold text-[#E7D7C1] text-lg leading-snug mt-0.5">
                    {item.title}
                  </h3>
                </div>
              </div>

              <p className="text-sm font-jakarta text-[#C4A882] leading-relaxed mb-5 flex-1">
                {item.summary}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {item.tags?.map(tag => (
                  <span key={tag}
                    className="px-2.5 py-1 rounded-full text-[11px] font-jakarta font-medium
                      bg-amber-500/8 text-amber-400/80 border border-amber-500/15"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {item.link && (
                <a href={item.link} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-amber-400 hover:text-amber-300 transition-colors"
                >
                  View Project <ExternalLink size={13} />
                </a>
              )}

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
          <div className="glass-card w-full max-w-xl p-8">
            <h3 className="font-playfair text-2xl font-bold gold-text mb-6">
              {editing.id ? 'Edit Project' : 'Add Project'}
            </h3>
            <div className="flex flex-col gap-4">
              {([
                ['title',    'Project Title'],
                ['category', 'Category'],
                ['link',     'Link (optional)'],
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
              <div>
                <label className="block text-xs text-amber-400/70 mb-1 font-jakarta tracking-wider uppercase">Summary</label>
                <textarea
                  rows={4}
                  value={form.summary}
                  onChange={e => setForm(f => ({ ...f, summary: e.target.value }))}
                  className="w-full bg-white/5 border border-amber-500/20 rounded-lg px-3 py-2 text-sm text-[#E7D7C1] outline-none focus:border-amber-400/50 font-jakarta resize-none"
                />
              </div>
              <div>
                <label className="block text-xs text-amber-400/70 mb-1 font-jakarta tracking-wider uppercase">
                  Tags (comma-separated)
                </label>
                <input
                  value={form.tags?.join(', ') ?? ''}
                  onChange={e => setForm(f => ({
                    ...f, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean),
                  }))}
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
