'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAdmin } from '@/contexts/AdminContext'
import { supabase, isConfigured } from '@/lib/supabase'
import type {
  ProfileSettings,
  Education,
  Experience,
  Certificate,
  PortfolioItem,
} from '@/types'

import VideoBackground       from '@/components/VideoBackground'
import Navbar                from '@/components/Navbar'
import HeroSection           from '@/components/HeroSection'
import EducationSection      from '@/components/EducationSection'
import ExperienceSection     from '@/components/ExperienceSection'
import CertificatesSection   from '@/components/CertificatesSection'
import ProjectsSection       from '@/components/ProjectsSection'
import ContactSection        from '@/components/ContactSection'
import AdminLoginModal       from '@/components/AdminLoginModal'

// ── Static fallback data (shown when Supabase is not yet configured) ───────
const DEFAULT_PROFILE: ProfileSettings = {
  id: 1,
  full_name:  'Silbhadra Samat',
  title:      'Pharm.D · Pharmacovigilance · Drug Safety · Clinical Research',
  about_bio:  'Dedicated Clinical Pharmacologist with expertise in pharmacovigilance, drug safety monitoring, causality assessment (WHO-UMC & Naranjo Scale), and clinical pharmacy. Currently serving as Assistant Professor at Netaji College of Pharmacy, Bankura, West Bengal, with prior clinical experience at Vijay Krishna Multi-Specialty Hospital, Hyderabad.',
  video_url:  '',
  cv_url:     '',
  email:      '',
  phone:      '',
  location:   'Kolkata, West Bengal, India',
  linkedin_url: '',
  github_url:  '',
}

const DEFAULT_EDUCATION: Education[] = [
  {
    id: '1',
    degree:      'Doctor of Pharmacy (Pharm.D)',
    institution: 'JNTUH (Jawaharlal Nehru Technological University Hyderabad)',
    location:    'Hyderabad, Telangana',
    start_year:  '2017',
    end_year:    '2023',
    description: '6-year integrated professional doctorate programme covering clinical pharmacy, pharmacology, pharmacovigilance, and hospital internship.',
  },
]

const DEFAULT_EXPERIENCE: Experience[] = [
  {
    id: '1',
    role:      'Assistant Professor',
    company:   'Netaji College of Pharmacy',
    location:  'Bankura, West Bengal',
    start_date: '2023',
    end_date:   '',
    responsibilities: [
      'Teaching Pharmacology, Clinical Pharmacy, and Pharmacovigilance to B.Pharm students',
      'Conducting seminars on adverse drug reaction monitoring and reporting',
      'Mentoring students in clinical research and drug safety assessments',
    ],
  },
  {
    id: '2',
    role:      'Clinical Pharmacist Intern',
    company:   'Vijay Krishna Multi-Specialty Hospital',
    location:  'Hyderabad, Telangana',
    start_date: '2022',
    end_date:   '2023',
    responsibilities: [
      'Participated in pharmacovigilance activities and ADR reporting',
      'Performed causality assessments using WHO-UMC and Naranjo Scale',
      'Collaborated with clinical teams on medication reviews and drug counselling',
    ],
  },
]

const DEFAULT_CERTIFICATES: Certificate[] = [
  { id: '1', name: 'Advanced Diploma in Clinical Research',      issuer: 'CDSCO / WHO-THSTI', year: '2023', credential_url: '' },
  { id: '2', name: 'Multi-Vigilance Program',                   issuer: 'PvPI',               year: '2023', credential_url: '' },
  { id: '3', name: 'Good Regulatory Practices (GRP)',           issuer: 'CDSCO-WHO-THSTI',    year: '2023', credential_url: '' },
  { id: '4', name: 'Pharmacovigilance Tools — Clinirex',        issuer: 'Clinirex Academy',   year: '2022', credential_url: '' },
  { id: '5', name: 'Clinical Pharmacology Essentials',          issuer: 'NPTEL / IIT',        year: '2022', credential_url: '' },
  { id: '6', name: 'Good Clinical Practice (ICH-GCP)',          issuer: 'CDSCO',              year: '2022', credential_url: '' },
]

const DEFAULT_PROJECTS: PortfolioItem[] = [
  {
    id: '1',
    title: 'Risk Factors of Myocardial Infarction — A Retrospective Study',
    description:
      'Published retrospective study analysing modifiable and non-modifiable risk factors for myocardial infarction in a tertiary-care hospital cohort, with emphasis on pharmacological management outcomes.',
    tech_stack: ['Clinical Research', 'Pharmacoepidemiology', 'Data Analysis'],
    url:        '',
    image_url:  '',
  },
]

// ── Main page ──────────────────────────────────────────────────────────────
export default function HomePage() {
  const { isAdmin, showLogin } = useAdmin()

  const [profile,      setProfile]      = useState<ProfileSettings>(DEFAULT_PROFILE)
  const [education,    setEducation]    = useState<Education[]>(DEFAULT_EDUCATION)
  const [experience,   setExperience]   = useState<Experience[]>(DEFAULT_EXPERIENCE)
  const [certificates, setCertificates] = useState<Certificate[]>(DEFAULT_CERTIFICATES)
  const [projects,     setProjects]     = useState<PortfolioItem[]>(DEFAULT_PROJECTS)

  const fetchAll = useCallback(async () => {
    if (!isConfigured || !supabase) return
    const [p, edu, exp, cert, proj] = await Promise.all([
      supabase.from('profile_settings').select('*').single(),
      supabase.from('education').select('*').order('end_year', { ascending: false }),
      supabase.from('experience').select('*').order('start_date', { ascending: false }),
      supabase.from('certificates').select('*').order('year', { ascending: false }),
      supabase.from('portfolio_items').select('*').order('created_at', { ascending: false }),
    ])
    if (p.data)    setProfile(p.data)
    if (edu.data)  setEducation(edu.data)
    if (exp.data)  setExperience(exp.data)
    if (cert.data) setCertificates(cert.data)
    if (proj.data) setProjects(proj.data)
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  return (
    <>
      {/* ── Fixed full-page scroll-scrubbed video ───────────────────────── */}
      <VideoBackground videoUrl={profile.video_url ?? ''} />

      {/* ── Admin banner ─────────────────────────────────────────────────── */}
      {isAdmin && (
        <div className="admin-banner">
          🛡 Admin Mode Active — click ✏️ buttons to edit any section
        </div>
      )}

      {/* ── Navbar ───────────────────────────────────────────────────────── */}
      <Navbar adminBannerVisible={isAdmin} />

      {/* ── Page sections ────────────────────────────────────────────────── */}
      <main className="relative z-10">
        <HeroSection      profile={profile}            onRefresh={fetchAll} />
        <ExperienceSection items={experience}          onRefresh={fetchAll} />
        <EducationSection  items={education}           onRefresh={fetchAll} />
        <CertificatesSection items={certificates}      onRefresh={fetchAll} />
        <ProjectsSection   items={projects}            onRefresh={fetchAll} />
        <ContactSection    profile={profile} />
      </main>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="relative z-10 py-8 text-center section-tint border-t border-teal-100">
        <p className="text-sm text-[#64748B] font-jakarta">
          © {new Date().getFullYear()} Dr. Silbhadra Samat · Built with Next.js &amp; ♥
        </p>
      </footer>

      {/* ── Admin login modal ─────────────────────────────────────────────── */}
      {showLogin && <AdminLoginModal />}
    </>
  )
}
