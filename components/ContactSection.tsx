'use client'
import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Mail, Phone, Linkedin, MapPin, Send, CheckCircle, Inbox } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAdmin } from '@/contexts/AdminContext'
import type { ProfileSettings, Inquiry } from '@/types'

export default function ContactSection({ profile }: { profile: ProfileSettings }) {
  const { isAdmin }  = useAdmin()
  const ref          = useRef(null)
  const inView       = useInView(ref, { once: true, margin: '-60px' })

  const [form,       setForm]       = useState({ name: '', email: '', organization: '', message: '' })
  const [sending,    setSending]    = useState(false)
  const [sent,       setSent]       = useState(false)
  const [error,      setError]      = useState('')

  // Admin messages panel
  const [showInbox,  setShowInbox]  = useState(false)
  const [messages,   setMessages]   = useState<Inquiry[]>([])
  const [loadingMsg, setLoadingMsg] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) { setError('Please fill all required fields.'); return }
    setSending(true); setError('')
    if (supabase) {
      const { error: err } = await supabase.from('inquiries').insert(form)
      if (err) { setError('Could not send message. Please try emailing directly.') }
      else      setSent(true)
    } else {
      // No Supabase — just show success (can wire a mailto fallback)
      setSent(true)
    }
    setSending(false)
  }

  const fetchMessages = async () => {
    if (!supabase) return
    setLoadingMsg(true)
    const { data } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false })
    setMessages(data ?? [])
    setLoadingMsg(false)
    setShowInbox(true)
  }

  const contacts = [
    { icon: <Mail   size={18} />, label: 'Email',    value: profile.email,        href: `mailto:${profile.email}`        },
    { icon: <Phone  size={18} />, label: 'Phone',    value: profile.phone,        href: `tel:${profile.phone}`            },
    { icon: <Linkedin size={18}/>, label: 'LinkedIn', value: 'View Profile',       href: profile.linkedin_url              },
    { icon: <MapPin size={18} />, label: 'Location', value: profile.location,     href: '#'                               },
  ]

  return (
    <section id="contact" className="py-24 bg-[#130E0B]" ref={ref}>
      <div className="max-w-6xl mx-auto px-6 lg:px-16">

        <div className="flex items-start justify-between mb-12">
          <div>
            <span className="section-label">Get In Touch</span>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold gold-text">Contact</h2>
          </div>
          {isAdmin && (
            <button onClick={fetchMessages}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-sm font-jakarta hover:bg-amber-500/25 transition-all"
            >
              <Inbox size={15} /> View Messages
            </button>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-12">

          {/* Info + links */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65 }}
          >
            <p className="font-jakarta text-[#C4A882] leading-relaxed mb-8 text-base">
              I&apos;m open to opportunities in Clinical Pharmacology, Pharmacovigilance, Drug Safety, and
              Academic research. Feel free to reach out for collaborations, roles, or consultations.
            </p>
            <div className="flex flex-col gap-4">
              {contacts.map(c => (
                <a key={c.label} href={c.href}
                  target={c.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="glass-card glass-card-hover flex items-center gap-4 p-4"
                >
                  <span className="text-amber-400 shrink-0">{c.icon}</span>
                  <div>
                    <p className="text-xs text-[#9A8878] font-jakarta tracking-wider uppercase">{c.label}</p>
                    <p className="text-sm font-jakarta text-[#E7D7C1] font-medium">{c.value}</p>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.1 }}
          >
            {sent ? (
              <div className="glass-card p-8 flex flex-col items-center justify-center text-center min-h-[320px]">
                <CheckCircle size={48} className="text-amber-400 mb-4" />
                <h3 className="font-playfair text-2xl font-bold gold-text mb-2">Message Sent!</h3>
                <p className="font-jakarta text-[#C4A882] text-sm">
                  Thank you for reaching out. I&apos;ll get back to you soon.
                </p>
              </div>
            ) : (
              <form onSubmit={submit} className="glass-card p-8 flex flex-col gap-5">
                {[
                  { key: 'name',         label: 'Full Name *',              type: 'text'  },
                  { key: 'email',        label: 'Email Address *',          type: 'email' },
                  { key: 'organization', label: 'Organisation (optional)',   type: 'text'  },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-xs text-amber-400/70 mb-1.5 font-jakarta tracking-wider uppercase">{f.label}</label>
                    <input
                      type={f.type}
                      value={(form as any)[f.key]}
                      onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                      className="w-full bg-white/5 border border-amber-500/20 rounded-lg px-4 py-2.5 text-sm text-[#E7D7C1] outline-none focus:border-amber-400/50 font-jakarta transition-colors"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-xs text-amber-400/70 mb-1.5 font-jakarta tracking-wider uppercase">Message *</label>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    className="w-full bg-white/5 border border-amber-500/20 rounded-lg px-4 py-2.5 text-sm text-[#E7D7C1] outline-none focus:border-amber-400/50 font-jakarta transition-colors resize-none"
                  />
                </div>
                {error && <p className="text-red-400 text-xs font-jakarta">{error}</p>}
                <button type="submit" disabled={sending}
                  className="btn-gold font-jakarta text-sm flex items-center justify-center gap-2"
                >
                  {sending ? 'Sending…' : <><Send size={15} /> Send Message</>}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>

      {/* Admin inbox drawer */}
      {showInbox && (
        <div className="fixed inset-0 z-[100] flex justify-end bg-black/60 backdrop-blur-sm">
          <div className="bg-[#130E0B] border-l border-amber-500/20 w-full max-w-lg h-full overflow-y-auto p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-playfair text-2xl font-bold gold-text">Contact Messages</h3>
              <button onClick={() => setShowInbox(false)} className="text-[#9A8878] hover:text-amber-400 transition-colors text-xl">✕</button>
            </div>
            {loadingMsg ? (
              <p className="text-[#9A8878] font-jakarta text-sm">Loading…</p>
            ) : messages.length === 0 ? (
              <p className="text-[#9A8878] font-jakarta text-sm">No messages yet.</p>
            ) : messages.map(m => (
              <div key={m.id} className="glass-card p-5 mb-4">
                <div className="flex justify-between mb-1">
                  <span className="font-jakarta font-semibold text-amber-300 text-sm">{m.name}</span>
                  <span className="text-xs text-[#9A8878] font-jakarta">
                    {m.created_at ? new Date(m.created_at).toLocaleDateString() : ''}
                  </span>
                </div>
                <p className="text-xs text-[#9A8878] mb-1">{m.email}{m.organization ? ` · ${m.organization}` : ''}</p>
                <p className="text-sm font-jakarta text-[#C4A882] leading-relaxed">{m.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
