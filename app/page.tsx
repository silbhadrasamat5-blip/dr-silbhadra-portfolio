'use client'
import { useEffect, useState, useCallback } from 'react'
import { supabase, isConfigured } from '@/lib/supabase'
import type {
  ProfileSettings, Education, Experience,
  Certificate, PortfolioItem,
} from '@/types'

import Navbar             from '@/components/Navbar'
import HeroSection        from '@/components/HeroSection'
import AboutSection       from '@/components/AboutSection'
import SkillsSection      from '@/components/SkillsSection'
import EducationSection   from '@/components/EducationSection'
import ExperienceSection  from '@/components/ExperienceSection'
import CertificatesSection from '@/components/CertificatesSection'
import ProjectsSection    from '@/components/ProjectsSection'
import ContactSection     from '@/components/ContactSection'
import AdminLoginModal    from '@/components/AdminLoginModal'
import { useAdmin }       from '@/contexts/AdminContext'

// ─── Static fallback data (shown when Supabase is not yet configured) ──────
const DEFAULT_PROFILE: ProfileSettings = {
  full_name:    'Dr. Silbhadra Samat',
  headline:     'Doctor of Pharmacy | Clinical Pharmacology & Drug Safety',
  tagline:      'Pharmacovigilance Expert · ADR Specialist · Clinical Educator',
  about_bio:    'Pharm.D graduate with clinical pharmacology and drug-safety experience spanning pharmacokinetic/pharmacodynamic (PK/PD) assessment, adverse drug reaction (ADR) evaluation, and structured causality assessment (WHO-UMC, Naranjo Scale). Skilled in translating patient-level clinical data into evidence-based dosing, drug-interaction, and safety insights, with working knowledge of regulatory frameworks (ICH, FDA, GVP). Seeking a Clinical Pharmacologist role to apply rigorous case analysis, medication-therapy evaluation, and cross-functional collaboration with physicians toward safer, more effective patient care.',
  current_role: 'Assistant Professor — Netaji College of Pharmacy, Bankura',
  location:     'Kolkata, West Bengal, India',
  email:        'silbhadrasamat6@gmail.com',
  phone:        '+91 8145165459',
  linkedin_url: 'https://linkedin.com/in/drsilbhadra-samat-536066376',
  video_url:    '',
}

const DEFAULT_EDUCATION: Education[] = [
  { degree: 'Doctor of Pharmacy (Pharm.D)', institution: 'Jawaharlal Nehru Technological University, Hyderabad', year_range: '2019 – 2025', grade_or_details: 'Aggregate: 65%', sort_order: 1 },
  { degree: 'Secondary Education (Class XII)', institution: 'Ruinan High School', year_range: '2017', grade_or_details: 'Score: 76%', sort_order: 2 },
]

const DEFAULT_EXPERIENCE: Experience[] = [
  {
    job_title: 'Assistant Professor', organization: 'Netaji College of Pharmacy',
    location: 'Bankura, West Bengal, India', duration: 'February 2026 – Present',
    responsibilities: [
      'Teach clinical pharmacology and pharmacotherapeutics, covering drug mechanisms, PK/PD principles, and rational drug use',
      'Mentor students on ADR identification and causality-assessment methodology',
    ],
    sort_order: 1,
  },
  {
    job_title: 'Clinical Pharmacist Intern', organization: 'Vijay Krishna Multi-Specialty Hospital',
    location: 'Hyderabad, India', duration: 'March 2024 – June 2025',
    responsibilities: [
      'Applied WHO-UMC and Naranjo Scale causality-assessment tools to identify and report Adverse Drug Reactions (ADRs), supporting drug-safety evaluation',
      'Evaluated pharmacokinetic and pharmacodynamic factors influencing therapy outcomes across 100+ patient medication charts, flagging dosing and interaction risks',
      'Conducted medication reconciliation at admission and discharge to reduce prescribing errors and ensure therapeutic continuity',
      'Documented comprehensive case histories—diagnosis, labs, and treatment plans—to support clinical decision-making',
      'Counselled patients on medication adherence, dosing, and lifestyle modification',
      'Collaborated with physicians and multidisciplinary teams to enhance patient-safety outcomes',
    ],
    sort_order: 2,
  },
]

const DEFAULT_CERTS: Certificate[] = [
  { title: 'Advanced Diploma in Clinical Research and Allied Fields', issuer: 'Clini Launch Research Institute', issue_date: '2024', credential_url: '', sort_order: 1 },
  { title: 'Advanced Certification Course in Multi-Vigilance Program', issuer: 'Medxury Research', issue_date: '2024', credential_url: '', sort_order: 2 },
  { title: 'Good Regulatory Practices in the Regulation of Medical Products', issuer: 'CDSCO-WHO-THSTI', issue_date: '2024', credential_url: '', sort_order: 3 },
  { title: 'Clinical SAS with CDISC, SDTM and ADaM', issuer: 'Learntoupgrade', issue_date: '2024', credential_url: '', sort_order: 4 },
  { title: 'Clinical Research and Clinical Trial – Career and Scope', issuer: 'Learntoupgrade', issue_date: '2024', credential_url: '', sort_order: 5 },
  { title: 'GenAI Powered Data Analytics Job Simulation', issuer: 'Tata (via Forage)', issue_date: '2024', credential_url: '', sort_order: 6 },
]

const DEFAULT_PROJECTS: PortfolioItem[] = [
  {
    title: 'Evaluating Vitamin-Drug Interactions: The Crucial Role of Clinical Pharmacist',
    category: 'Research',
    summary: 'Studied the impact of vitamin-drug interactions on treatment safety and efficacy, identifying clinically significant interactions affecting therapeutic outcomes and pharmacist-led prevention strategies.',
    tags: ['Pharmacology','Drug Interactions','Vitamins','Clinical Research','Patient Safety'],
    link: '',
  },
]

// ───────────────────────────────────────────────────────────────────────────
export default function Page() {
  const { isAdmin, showLogin } = useAdmin()

  const [profile,    setProfile]    = useState<ProfileSettings>(DEFAULT_PROFILE)
  const [education,  setEducation]  = useState<Education[]>(DEFAULT_EDUCATION)
  const [experience, setExperience] = useState<Experience[]>(DEFAULT_EXPERIENCE)
  const [certs,      setCerts]      = useState<Certificate[]>(DEFAULT_CERTS)
  const [projects,   setProjects]   = useState<PortfolioItem[]>(DEFAULT_PROJECTS)

  const fetchAll = useCallback(async () => {
    if (!isConfigured || !supabase) return
    const [p, ed, ex, ce, pr] = await Promise.all([
      supabase.from('profile_settings').select('*').limit(1).single(),
      supabase.from('education').select('*').order('sort_order'),
      supabase.from('experience').select('*').order('sort_order'),
      supabase.from('certificates').select('*').order('sort_order'),
      supabase.from('portfolio_items').select('*').order('created_at'),
    ])
    if (p.data)   setProfile(p.data)
    if (ed.data)  setEducation(ed.data)
    if (ex.data)  setExperience(ex.data)
    if (ce.data)  setCerts(ce.data)
    if (pr.data)  setProjects(pr.data)
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  return (
    <>
      {isAdmin && (
        <div className="admin-banner">
          🔓 EDIT MODE ACTIVE — Click any ✏️ button to update content
        </div>
      )}

      <Navbar profile={profile} />

      {showLogin && <AdminLoginModal />}

      <main>
        <HeroSection       profile={profile}    onRefresh={fetchAll} />
        <AboutSection      profile={profile}    onRefresh={fetchAll} />
        <SkillsSection />
        <ExperienceSection experience={experience} onRefresh={fetchAll} />
        <EducationSection  education={education}   onRefresh={fetchAll} />
        <CertificatesSection certs={certs}          onRefresh={fetchAll} />
        <ProjectsSection   projects={projects}   onRefresh={fetchAll} />
        <ContactSection    profile={profile} />
      </main>

      <footer className="border-t border-amber-500/10 py-10 text-center text-sm text-[#9A8878]">
        <p className="font-jakarta">
          © {new Date().getFullYear()} Dr. Silbhadra Samat · Pharm.D · Clinical Pharmacologist
        </p>
        <p className="mt-1 text-xs opacity-60">
          Built with Next.js · Tailwind CSS · Three.js · Supabase
        </p>
      </footer>
    </>
  )
}
