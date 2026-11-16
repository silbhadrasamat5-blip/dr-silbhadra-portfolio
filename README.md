# Dr. Silbhadra Samat — Clinical Pharmacologist Portfolio

A high-end, fully live-editable portfolio website built with **Next.js 14**, **Tailwind CSS**, **Three.js** (interactive DNA helix), and **Supabase** (live database).

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Configure Supabase
1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and paste the full contents of `supabase-setup.sql` → **Run**
3. Go to **Settings → API** and copy your URL and anon key

### 3. Set environment variables
```bash
cp .env.local.example .env.local
```
Edit `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_ADMIN_PIN=2024        # change this to your preferred PIN
```

### 4. Run locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

---

## 🌐 Deploy to Vercel
1. Push to GitHub
2. Import repo in [vercel.com](https://vercel.com)
3. Add all three environment variables in Vercel project settings
4. Deploy — your site is live!

---

## 🔐 Admin Edit Mode

Click the **lock icon** (🔒) in the top-right of the navbar.  
Enter your PIN (default: `2024`) to unlock **Edit Mode**.

In edit mode you can:
- ✏️ **Edit Hero / Profile** — name, headline, tagline, bio, video URL, contact details
- ✏️ **Edit About** — bio text
- ✏️ **Edit / Add / Delete Experience** entries
- ✏️ **Edit / Add / Delete Education** entries
- ✏️ **Edit / Add / Delete Certificates** entries
- ✏️ **Edit / Add / Delete Projects** entries
- 📬 **View contact form messages** (in the Contact section)

All changes save instantly to Supabase.

---

## 🎥 Adding Your Video Background

1. Upload your profile video to **Supabase Storage** (or any public URL)
2. Enter Admin Mode → click the ✏️ in the Hero section
3. Paste the video URL into the **"Video URL"** field → Save

---

## 🗂 Project Structure

```
portfolio/
├── app/
│   ├── globals.css         # Tailwind + custom CSS
│   ├── layout.tsx          # Root layout (fonts, metadata)
│   └── page.tsx            # Main page (data fetching hub)
├── components/
│   ├── Navbar.tsx
│   ├── HeroSection.tsx     # Video + Three.js + left-side text
│   ├── ThreeDNACanvas.tsx  # Three.js DNA double helix
│   ├── AboutSection.tsx
│   ├── SkillsSection.tsx
│   ├── ExperienceSection.tsx
│   ├── EducationSection.tsx
│   ├── CertificatesSection.tsx
│   ├── ProjectsSection.tsx
│   ├── ContactSection.tsx  # Form + admin inbox
│   └── AdminLoginModal.tsx
├── contexts/
│   └── AdminContext.tsx    # Admin PIN state
├── lib/
│   ├── supabase.ts         # Supabase client
│   └── config.ts           # App config + ADMIN_PIN
├── types/
│   └── index.ts            # TypeScript interfaces
├── supabase-setup.sql      # ← Run this in Supabase SQL Editor
└── .env.local.example      # Environment variable template
```

---

## 🎨 Design System

| Token | Value |
|---|---|
| Background | `#0D0907` (espresso/obsidian) |
| Gold accent | `#D97706` → `#F59E0B` (gradient) |
| Soft text | `#C4A882` |
| Muted text | `#9A8878` |
| Heading font | Playfair Display (serif) |
| Body font | Plus Jakarta Sans |
| Cards | Glassmorphism — `bg-white/4 backdrop-blur` |

---

Built with ❤️ for Dr. Silbhadra Samat · Pharm.D · Clinical Pharmacologist
