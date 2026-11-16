'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const SKILLS = [
  'Clinical Pharmacology & PK/PD Assessment',
  'Pharmacovigilance & ADR Reporting',
  'Causality Assessment (WHO-UMC, Naranjo Scale)',
  'Drug–Drug & Drug–Vitamin Interaction Analysis',
  'Case Narrative Writing & Documentation',
  'Medication Therapy Review & Reconciliation',
  'Good Vigilance Practices (GVP)',
  'Regulatory Guidelines (ICH, FDA — Basics)',
  'Safety Data Entry & Verification (Clinirex)',
  'SOP Compliance & Audit Readiness',
  'Clinical SAS / CDISC / SDTM / ADaM',
  'GenAI-Powered Data Analytics',
  'Bengali · Hindi · English',
]

export default function SkillsSection() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section id="skills" className="py-20 bg-[#0D0907]" ref={ref}>
      <div className="max-w-6xl mx-auto px-6 lg:px-16">
        <span className="section-label">What I Do</span>
        <h2 className="font-playfair text-4xl md:text-5xl font-bold gold-text mb-10">Core Skills</h2>

        <div className="flex flex-wrap gap-3">
          {SKILLS.map((s, i) => (
            <motion.span
              key={s}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="glass-card px-4 py-2 text-sm font-jakarta font-medium text-amber-300
                border border-amber-500/20 rounded-full hover:border-amber-400/50
                hover:bg-amber-500/8 hover:shadow-[0_0_16px_rgba(217,119,6,.2)]
                transition-all duration-300 cursor-default"
            >
              {s}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  )
}
