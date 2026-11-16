'use client'
import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Award, ExternalLink, Pencil, Plus, Trash2 } from 'lucide-react'
import { useAdmin } from '@/contexts/AdminContext'
import { supabase } from '@/lib/supabase'
import type { Certificate } from '@/types'

const blank: Omit<Certificate,'id'> = { title: '', issuer: '', issue_date: '', credential_url: '', sort_order: 99 }

export default function CertificatesSection({
  certs, onRefresh,
}: { certs: Certificate[]; onRefresh: () => void }) {
  const { isAdmin } = useAdmin()
  const ref         = useRef(null)
  const inView      = useInView(ref, { once: true, margin: '-60px' })

  const [editing, setEditing] = useState<Certificate | null>(null)
  const [form,    setForm]    = useState<Omit<Certificate,'id'>>(blank)
  const [saving,  setSaving]  = useState(false)

  const openEdit = (item: Certificate) => { setEditing(item); setForm({ ...item }) }
  const openAdd  = () => { setEditing({ id: undefined, ...blank }); setForm({ ...blank }) }

  const save = async () => {
    if (!supabase) return
    setSaving(true)
    if (editing?.id) {
      await supabase.from('certificates').update(form).eq('id', editing.id)
    } else {
      await supabase.from('certificates').insert(form)
    }
    setSaving(false); setEditing(null); onRefresh()
  }
  const del = async (id: string) => {
    if (!supabase || !confirm('Delete?')) return
    await supabase.from('certificates').delete().eq('id', id)
    onRefresh()
  }

  return (
    <section id="certificates" className="py-24 bg-[#130E0B]" ref={ref}>
      <div className="max-w-6xl mx-auto px-6 lg:px-16">

        <div className="flex items-start justify-between mb-12">
          <div>
            <span className="section-label">Credentials</span>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold gold-text">Certifications</h2>
          </div>
          {isAdmin && (
            <button onClick={openAdd}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-sm font-jakarta hover:bg-amber-500/25 transition-all"
            >
              <Plus size={15} /> Add
            </button>
          )}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {certs.map((cert, i) => (
            <motion.div
              key={cert.id ?? i}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08, duration: 0.55 }}
              className="glass-card glass-card-hover p-6 group relative flex flex-col"
            >
              <Award size={22} className="text-amber-400 mb-4" />
              <h3 className="font-jakarta font-semibold text-[#E7D7C1] text-sm leading-snug mb-2 flex-1">
                {cert.title}
              </h3>
              <p className="text-xs text-[#9A8878] font-jakarta mb-1">{cert.issuer}</p>
              {cert.issue_date && (
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-jakarta font-semibold
                  bg-amber-500/10 text-amber-400/80 border border-amber-500/15 mt-1 w-fit">
                  {cert.issue_date}
                </span>
              )}
              {cert.credential_url && (
                <a href={cert.credential_url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 mt-3 transition-colors"
                >
                  View Credential <ExternalLink size={11} />
                </a>
              )}

              {isAdmin && (
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(cert)} className="p-1.5 rounded-full bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 transition-all">
                    <Pencil size={12} />
                  </button>
                  {cert.id && (
                    <button onClick={() => del(cert.id!)} className="p-1.5 rounded-full bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-all">
                      <Trash2 size={12} />
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
              {editing.id ? 'Edit Certificate' : 'Add Certificate'}
            </h3>
            <div className="flex flex-col gap-4">
              {([
                ['title',          'Certificate Title'],
                ['issuer',         'Issuing Organisation'],
                ['issue_date',     'Issue Date / Year'],
                ['credential_url', 'Credential URL (optional)'],
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
