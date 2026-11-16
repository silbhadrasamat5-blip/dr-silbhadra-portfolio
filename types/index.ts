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
  id?:              string
  degree:           string
  institution:      string
  year_range:       string
  grade_or_details: string
  sort_order:       number
}

export interface Experience {
  id?:              string
  job_title:        string
  organization:     string
  location:         string
  duration:         string
  responsibilities: string[]
  sort_order:       number
}

export interface Certificate {
  id?:            string
  title:          string
  issuer:         string
  issue_date:     string
  credential_url: string
  sort_order:     number
}

export interface PortfolioItem {
  id?:        string
  title:      string
  category:   string
  summary:    string
  tags:       string[]
  link:       string
  created_at?: string
}

export interface Inquiry {
  id?:          string
  name:         string
  email:        string
  organization: string
  message:      string
  created_at?:  string
}
