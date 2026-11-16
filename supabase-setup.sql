-- ============================================================
--  Dr. Silbhadra Samat — Portfolio Database Setup
--  Run this in: Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────────
-- TABLE: profile_settings
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profile_settings (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name    TEXT NOT NULL,
  headline     TEXT,
  tagline      TEXT,
  about_bio    TEXT,
  current_role TEXT,
  location     TEXT,
  email        TEXT,
  phone        TEXT,
  linkedin_url TEXT,
  video_url    TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- TABLE: education
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS education (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  degree           TEXT NOT NULL,
  institution      TEXT NOT NULL,
  year_range       TEXT,
  grade_or_details TEXT,
  sort_order       INT DEFAULT 0,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- TABLE: experience
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS experience (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_title        TEXT NOT NULL,
  organization     TEXT NOT NULL,
  location         TEXT,
  duration         TEXT,
  responsibilities TEXT[],
  sort_order       INT DEFAULT 0,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- TABLE: certificates
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS certificates (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title          TEXT NOT NULL,
  issuer         TEXT NOT NULL,
  issue_date     TEXT,
  credential_url TEXT,
  sort_order     INT DEFAULT 0,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- TABLE: portfolio_items
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS portfolio_items (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title      TEXT NOT NULL,
  category   TEXT,
  summary    TEXT,
  tags       TEXT[],
  link       TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- TABLE: inquiries  (contact form submissions)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS inquiries (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name         TEXT NOT NULL,
  email        TEXT NOT NULL,
  organization TEXT,
  message      TEXT NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- ROW LEVEL SECURITY — public read / write
-- ─────────────────────────────────────────────
ALTER TABLE profile_settings  ENABLE ROW LEVEL SECURITY;
ALTER TABLE education         ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience        ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates      ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_items   ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries         ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_all" ON profile_settings  FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON education         FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON experience        FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON certificates      FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON portfolio_items   FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON inquiries         FOR ALL TO public USING (true) WITH CHECK (true);

-- ─────────────────────────────────────────────
-- SEED DATA — pre-filled with real CV content
-- ─────────────────────────────────────────────

INSERT INTO profile_settings (
  full_name, headline, tagline, about_bio,
  current_role, location, email, phone, linkedin_url, video_url
) VALUES (
  'Dr. Silbhadra Samat',
  'Doctor of Pharmacy | Clinical Pharmacology & Drug Safety',
  'Pharmacovigilance Expert · ADR Specialist · Clinical Educator',
  'Pharm.D graduate with clinical pharmacology and drug-safety experience spanning pharmacokinetic/pharmacodynamic (PK/PD) assessment, adverse drug reaction (ADR) evaluation, and structured causality assessment (WHO-UMC, Naranjo Scale). Skilled in translating patient-level clinical data into evidence-based dosing, drug-interaction, and safety insights, with working knowledge of regulatory frameworks (ICH, FDA, GVP). Seeking a Clinical Pharmacologist role to apply rigorous case analysis, medication-therapy evaluation, and cross-functional collaboration with physicians toward safer, more effective patient care.',
  'Assistant Professor — Netaji College of Pharmacy, Bankura',
  'Kolkata, West Bengal, India',
  'silbhadrasamat6@gmail.com',
  '+91 8145165459',
  'https://linkedin.com/in/drsilbhadra-samat-536066376',
  ''
);

INSERT INTO education (degree, institution, year_range, grade_or_details, sort_order) VALUES
  ('Doctor of Pharmacy (Pharm.D)',
   'Jawaharlal Nehru Technological University, Hyderabad',
   '2019 – 2025',
   'Aggregate: 65%',
   1),
  ('Secondary Education (Class XII)',
   'Ruinan High School',
   '2017',
   'Score: 76%',
   2);

INSERT INTO experience (job_title, organization, location, duration, responsibilities, sort_order) VALUES
  (
    'Assistant Professor',
    'Netaji College of Pharmacy',
    'Bankura, West Bengal, India',
    'February 2026 – Present',
    ARRAY[
      'Teach clinical pharmacology and pharmacotherapeutics, covering drug mechanisms, PK/PD principles, and rational drug use',
      'Mentor students on ADR identification and causality-assessment methodology'
    ],
    1
  ),
  (
    'Clinical Pharmacist Intern',
    'Vijay Krishna Multi-Specialty Hospital',
    'Hyderabad, India',
    'March 2024 – June 2025',
    ARRAY[
      'Applied WHO-UMC and Naranjo Scale causality-assessment tools to identify and report Adverse Drug Reactions (ADRs), supporting drug-safety evaluation',
      'Evaluated pharmacokinetic and pharmacodynamic factors influencing therapy outcomes across 100+ patient medication charts, flagging dosing and interaction risks',
      'Conducted medication reconciliation at admission and discharge to reduce prescribing errors and ensure therapeutic continuity',
      'Documented comprehensive case histories—diagnosis, labs, and treatment plans—to support clinical decision-making',
      'Counselled patients on medication adherence, dosing, and lifestyle modification',
      'Collaborated with physicians and multidisciplinary teams to enhance patient-safety outcomes'
    ],
    2
  );

INSERT INTO certificates (title, issuer, issue_date, credential_url, sort_order) VALUES
  ('Advanced Diploma in Clinical Research and Allied Fields',
   'Clini Launch Research Institute', '2024', '', 1),
  ('Advanced Certification Course in Multi-Vigilance Program',
   'Medxury Research', '2024', '', 2),
  ('Good Regulatory Practices in the Regulation of Medical Products',
   'CDSCO-WHO-THSTI', '2024', '', 3),
  ('Clinical SAS with CDISC, SDTM and ADaM',
   'Learntoupgrade', '2024', '', 4),
  ('Clinical Research and Clinical Trial – Career and Scope',
   'Learntoupgrade', '2024', '', 5),
  ('GenAI Powered Data Analytics Job Simulation',
   'Tata (via Forage)', '2024', '', 6);

INSERT INTO portfolio_items (title, category, summary, tags) VALUES
  (
    'Evaluating Vitamin-Drug Interactions: The Crucial Role of Clinical Pharmacist',
    'Research',
    'Studied the impact of vitamin-drug interactions on treatment safety and efficacy, identifying clinically significant interactions affecting therapeutic outcomes and pharmacist-led prevention strategies. Demonstrated how pharmacist-led counselling can mitigate interaction risks in polypharmacy patients.',
    ARRAY['Pharmacology', 'Drug Interactions', 'Vitamins', 'Clinical Research', 'Patient Safety', 'Pharmacovigilance']
  );

-- ─────────────────────────────────────────────
-- DONE ✅
-- ─────────────────────────────────────────────
-- Your database is now ready.
-- Connect via: Settings > API in your Supabase project.
-- Copy NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
-- into your .env.local file.
