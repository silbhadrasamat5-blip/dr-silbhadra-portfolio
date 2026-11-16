export interface ProfileSettings {
  id: string;
  full_name: string;
  title?: string;
  headline?: string;
  tagline?: string;
  about_bio: string;
  current_role?: string;
  location: string;
  email: string;
  phone: string;
  linkedin_url?: string;
  github_url?: string;
  cv_url?: string;
  video_url: string;
  [key: string]: any;
}

export interface Education {
  id?: string;
  degree: string;
  institution: string;
  location?: string;
  year_range?: string;
  start_year?: string;
  end_year?: string;
  grade_or_details?: string;
  description?: string;
  sort_order?: number;
  [key: string]: any;
}

export interface Experience {
  id?: string;
  job_title?: string;
  role?: string;
  title?: string;
  organization?: string;
  company?: string;
  location?: string;
  duration?: string;
  start_date?: string;
  end_date?: string;
 responsibilities?: string | string[];
  description?: string;
  sort_order?: number;
  [key: string]: any;
}

export interface Certificate {
  id?: string;
  title: string;
  issuer: string;
  issue_date?: string;
  date?: string;
  credential_url?: string;
  credential_id?: string;
  sort_order?: number;
  [key: string]: any;
}

export interface PortfolioItem {
  id?: string;
  title: string;
  category: string;
  summary?: string;
  description?: string;
  tags?: string[] | string;
  link?: string;
  created_at?: string;
  [key: string]: any;
}

export interface Inquiry {
  id?: string;
  name: string;
  email: string;
  organization?: string;
  message: string;
  created_at?: string;
  [key: string]: any;
}
