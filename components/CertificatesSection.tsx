'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Plus, Edit3, Trash2, Award, ExternalLink } from 'lucide-react'
import { useAdmin } from '@/contexts/AdminContext'
import { supabase } from '@/lib/supabase'
import type { Certificate } from '@/types'

interface Props {
  items: Certificate[]
  onRefresh: () => void
}

const BLANK: Partial<Certificate> = { name: '', issuer: '', year: '', credential_url: '' }

export default function CertificatesSection({ items, onRefresh }: Props) {
  const { isAdmin }               = useAdmin()
  const ref                       = useRef(null)
  const inView                    = useInView(ref, { once: true, margin: '-80px' })
  const [editing, setEditing]     = useState<Certificate | null>(null)
  const [isNew,   setIsNew]       = useState(false)
  const [form,    setForm]        = useState<Partial<Certificate>>(BLANK)
  const [saving,  setSaving]      = useState(false)

  const openEdit = (item: Certificate) => { setIsNew(false); setForm({ ...item }); setEditing(item) }
  const openAdd  = ()                  => { setIsNew(true);  setForm({ ...BLANK }); setEditing({} as Certificate) }
  const close    = ()                  => { setEditing(null); setIsNew(false) }

  const save = async () => {
    if (!supabase) return
    setSaving(true)
    if (isNew) await supabase.from('certificates').insert(form)
    else       await supabase.from('certificates').update(form).eq('id', editing!.id)
    setSaving(false); close(); onRefresh()
  }

  const del = async (id: string) => {
    if (!supabase || !confirm('Delete this certificate?')) return
    await supabase.from('certificates').delete().eq('id', id)
    onRefresh()
  }

  return (
    <section id="certificates" className="relative py-24 section-tint">
      <div className="max-w-6xl mx-auto px-6" ref={ref}>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="section-label">Credentials</span>
          <h2 className="font-playfair text-4xl font-bold text-[#0F172A] mt-1">
            Certifications &amp; Training
          </h2>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.09 }}
              className="glass-card rounded-2xl p-5 group flex flex-col"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-aqua flex items-center justify-center shrink-0">
                  <Award size={18} className="text-white" />
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

              <h3 className="font-jakarta font-semibold text-[#0F172A] text-sm leading-snug flex-1">
                {item.name}
              </h3>
              <p className="text-teal-600 text-xs font-medium mt-1 font-jakarta">{item.issuer}</p>
              {item.year && (
                <span className="badge-secondary mt-2 self-start">{item.year}</span>
              )}
              {item.credential_url && (
                <a
                  href={item.credential_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-1 text-xs text-sky-600 hover:text-sky-700 font-jakarta font-medium transition-colors"
                >
                  View Credential <ExternalLink size={12} />
                </a>
              )}
            </motion.div>
          ))}
        </div>

        {isAdmin && (
          <button onClick={openAdd} className="btn-outline mt-10 gap-2">
            <Plus size={16} /> Add Certificate
          </button>
        )}
      </div>

      {editing !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
          <div className="glass-card rounded-2xl p-8 max-w-lg w-full shadow-xl">
            <h3 className="font-playfair text-xl font-bold text-[#0F172A] mb-6">
              {isNew ? 'Add Certificate' : 'Edit Certificate'}
            </h3>
            <div className="space-y-4">
              {(
                [
                  ['Certificate Name', 'name'],
                  ['Issuing Body',     'issuer'],
                  ['Year',             'year'],
                  ['Credential URL',   'credential_url'],
                ] as [string, keyof Certificate][]
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
