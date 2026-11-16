'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Mail, Phone, MapPin, Linkedin, Send, Inbox, X } from 'lucide-react'
import { useAdmin } from '@/contexts/AdminContext'
import { supabase } from '@/lib/supabase'
import type { ProfileSettings, Inquiry } from '@/types'

interface Props {
  profile: ProfileSettings
}

export default function ContactSection({ profile }: Props) {
  const { isAdmin }                   = useAdmin()
  const ref                           = useRef(null)
  const inView                        = useInView(ref, { once: true, margin: '-80px' })
  const [form,     setForm]           = useState({ name: '', email: '', organization: '', message: '' })
  const [sending,  setSending]        = useState(false)
  const [sent,     setSent]           = useState(false)
  const [inbox,    setInbox]          = useState(false)
  const [messages, setMessages]       = useState<Inquiry[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase) { setSent(true); return }
    setSending(true)
    await supabase.from('inquiries').insert({
      name: form.name,
      email: form.email,
      organization: form.organization,
      message: form.message,
    })
    setSending(false)
    setSent(true)
    setForm({ name: '', email: '', organization: '', message: '' })
  }

  const openInbox = async () => {
    if (!supabase) return
    const { data } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false })
    setMessages(data ?? [])
    setInbox(true)
  }

  const contactItems = [
    profile.email    && { icon: <Mail     size={18} />, label: 'Email',    value: profile.email,    href: `mailto:${profile.email}` },
    profile.phone    && { icon: <Phone    size={18} />, label: 'Phone',    value: profile.phone,    href: `tel:${profile.phone}` },
    profile.location && { icon: <MapPin   size={18} />, label: 'Location', value: profile.location, href: null },
    profile.linkedin_url && { icon: <Linkedin size={18} />, label: 'LinkedIn', value: 'Connect on LinkedIn', href: profile.linkedin_url },
  ].filter(Boolean) as { icon: React.ReactNode; label: string; value: string; href: string | null }[]

  return (
    <section id="contact" className="relative py-24 section-tint">
      <div className="max-w-5xl mx-auto px-6" ref={ref}>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="section-label">Get in Touch</span>
          <h2 className="font-playfair text-4xl font-bold text-[#0F172A] mt-1">Contact</h2>
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-2">

          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="font-playfair text-2xl font-bold text-[#0F172A] mb-6">
              Let&apos;s Connect
            </h3>
            <p className="text-[#334155] font-jakarta leading-relaxed mb-8">
              Whether you&apos;re looking for a collaborator in pharmacovigilance research,
              a faculty member, or simply wish to connect — feel free to reach out.
            </p>
            <div className="space-y-4">
              {contactItems.map(({ icon, label, value, href }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
                    {icon}
                  </div>
                  <div>
                    <p className="text-xs text-[#64748B] font-jakarta font-medium uppercase tracking-wide">
                      {label}
                    </p>
                    {href ? (
                      <a
                        href={href}
                        target={href.startsWith('http') ? '_blank' : undefined}
                        rel="noreferrer"
                        className="text-sm text-[#0F172A] hover:text-teal-600 transition-colors font-jakarta"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="text-sm text-[#334155] font-jakarta">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {isAdmin && (
              <button onClick={openInbox} className="btn-outline mt-8 gap-2">
                <Inbox size={16} /> View Messages
              </button>
            )}
          </motion.div>

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {sent ? (
              <div className="glass-card rounded-2xl p-8 text-center">
                <div className="w-14 h-14 rounded-full bg-teal-50 flex items-center justify-center mx-auto mb-4">
                  <Send size={24} className="text-teal-600" />
                </div>
                <h3 className="font-playfair text-xl font-bold text-[#0F172A] mb-2">
                  Message Sent!
                </h3>
                <p className="text-[#334155] font-jakarta text-sm">
                  Thank you for reaching out. I&apos;ll get back to you soon.
                </p>
                <button onClick={() => setSent(false)} className="btn-outline mt-6 text-sm">
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-7 space-y-4">
                {[
                  { label: 'Your Name',         id: 'name',         type: 'text' },
                  { label: 'Email Address',     id: 'email',        type: 'email' },
                  { label: 'Organisation',       id: 'organization', type: 'text' },
                ].map(({ label, id, type }) => (
                  <div key={id}>
                    <label htmlFor={id} className="text-sm font-medium text-[#334155] block mb-1 font-jakarta">
                      {label}
                    </label>
                    <input
                      id={id}
                      type={type}
                      required={id !== 'organization'}
                      className="input-field"
                      value={(form as any)[id]}
                      onChange={e => setForm({ ...form, [id]: e.target.value })}
                    />
                  </div>
                ))}
                <div>
                  <label htmlFor="message" className="text-sm font-medium text-[#334155] block mb-1 font-jakarta">
                    Message
                  </label>
                  <textarea
                    id="message"
                    required
                    className="input-field min-h-[110px]"
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                  />
                </div>
                <button type="submit" disabled={sending} className="btn-primary w-full justify-center gap-2">
                  <Send size={16} />
                  {sending ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>

      {/* Admin inbox drawer */}
      {inbox && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setInbox(false)} />
          <div className="relative w-full max-w-md bg-white/95 backdrop-blur-md h-full overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-teal-100 px-6 py-4 flex items-center justify-between">
              <h3 className="font-playfair text-lg font-bold text-[#0F172A]">
                Messages ({messages.length})
              </h3>
              <button onClick={() => setInbox(false)} className="p-2 rounded-lg hover:bg-teal-50 text-[#334155] transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="p-4 space-y-4">
              {messages.length === 0 ? (
                <p className="text-sm text-[#64748B] font-jakarta text-center py-8">No messages yet.</p>
              ) : (
                messages.map(msg => (
                  <div key={msg.id} className="glass-card rounded-xl p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="font-semibold text-[#0F172A] font-jakarta text-sm">
                        {msg.name}
                      </span>
                      <span className="text-xs text-[#64748B] font-jakarta shrink-0">
                        {new Date(msg.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-teal-600 font-jakarta mb-1">{msg.email}</p>
                    {msg.organization && (
                      <p className="text-xs text-[#64748B] font-jakarta mb-2">{msg.organization}</p>
                    )}
                    <p className="text-sm text-[#334155] font-jakarta leading-relaxed">{msg.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
