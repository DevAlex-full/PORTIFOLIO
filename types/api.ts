// ── Shared ────────────────────────────────────────────────────
export interface BaseRecord {
  id:        string
  createdAt: string
  updatedAt: string
}

// ── Hero ──────────────────────────────────────────────────────
export interface HeroData extends BaseRecord {
  name:         string
  role:         string
  description:  string
  photoUrl:     string | null
  cvUrl:        string | null
  githubUrl:    string | null
  linkedinUrl:  string | null
  emailAddress: string | null
  whatsapp:     string
  typingSvgUrl: string | null
  available:    boolean
}

// ── About ─────────────────────────────────────────────────────
export interface AboutHighlight {
  icon:        string
  title:       string
  description: string
}

export interface AboutData extends BaseRecord {
  paragraph1: string
  paragraph2: string
  paragraph3: string
  highlights: AboutHighlight[]
}

// ── Project ───────────────────────────────────────────────────
export interface ProjectImage {
  src: string
  alt: string
}

export interface ProjectData extends BaseRecord {
  title:            string
  slug:             string
  shortDescription: string
  fullDescription:  string
  image:            string | null
  images:           ProjectImage[]
  tags:             string[]
  categories:       string[]
  featured:         boolean
  highlight:        string | null
  linkDemo:         string | null
  linkGithub:       string | null
  linkGithubFront:  string | null
  linkGithubBack:   string | null
  status:           string
  order:            number
  active:           boolean
}

// ── Certification ─────────────────────────────────────────────
export interface CertificationData extends BaseRecord {
  title:       string
  institution: string
  year:        number
  hours:       number
  tags:        string[]
  stars:       number
  link:        string | null
  imageUrl:    string | null
  pdfUrl:      string | null
  inProgress:  boolean
  order:       number
  active:      boolean
}

// ── Skill ─────────────────────────────────────────────────────
export type SkillLevel    = 'expert' | 'advanced' | 'intermediate'
export type SkillCategory = 'frontend' | 'backend' | 'database' | 'devops' | 'tools' | 'design'

export interface SkillData extends BaseRecord {
  name:     string
  category: SkillCategory
  icon:     string
  level:    SkillLevel
  order:    number
  active:   boolean
}

// ── Services ──────────────────────────────────────────────────
export interface ServicePlanData extends BaseRecord {
  name:        string
  price:       string
  period:      string
  description: string
  features:    string[]
  highlighted: boolean
  badge:       string | null
  ctaText:     string
  ctaMessage:  string
  order:       number
  active:      boolean
}

export interface ServiceExtraData extends BaseRecord {
  label:       string
  description: string
  icon:        string
  order:       number
  active:      boolean
}

export interface ServicesData {
  plans:  ServicePlanData[]
  extras: ServiceExtraData[]
}

// ── Contact ───────────────────────────────────────────────────
export interface ContactData extends BaseRecord {
  whatsapp:       string
  email:          string
  location:       string
  github:         string | null
  githubUrl:      string | null
  linkedin:       string | null
  linkedinUrl:    string | null
  instagram:      string | null
  instagramUrl:   string | null
  defaultMessage: string | null
}

// ── Site Settings ─────────────────────────────────────────────
export interface SiteSettingsData extends BaseRecord {
  siteTitle:     string
  description:   string
  keywords:      string[]
  ogTitle:       string | null
  ogDescription: string | null
  faviconUrl:    string | null
  logoUrl:       string | null
}

// ── Client ────────────────────────────────────────────────────
export interface ClientMetric {
  value: string
  label: string
}

export interface ClientData extends BaseRecord {
  name:         string
  subtitle:     string | null
  segment:      string | null
  description:  string
  image:        string | null
  images:       ProjectImage[]
  technologies: string[]
  metrics:      ClientMetric[]
  linkDemo:     string | null
  linkGithub:   string | null
  featured:     boolean
  // em_producao | em_andamento | em_autorizacao
  status:       string
  order:        number
  active:       boolean
}

// ── Lead ─────────────────────────────────────────────────────
export type LeadStatus = 'novo' | 'em_contato' | 'proposta' | 'convertido' | 'perdido'

export interface LeadData extends BaseRecord {
  name:     string
  email:    string
  phone:    string | null
  company:  string | null
  source:   string | null
  message:  string | null
  status:   LeadStatus
  archived: boolean
}

// ── Media ─────────────────────────────────────────────────────
export interface MediaData extends BaseRecord {
  fileName:     string
  originalName: string
  url:          string
  mimeType:     string
  size:         number
  bucket:       string
  path:         string
}

// ── Feedback ──────────────────────────────────────────────────
export interface FeedbackData extends BaseRecord {
  clientName:  string
  clientRole:  string | null
  company:     string | null
  projectName: string | null
  content:     string
  rating:      number
  imageUrl:    string | null
  featured:    boolean
  active:      boolean
  order:       number
}

// ── Dashboard ─────────────────────────────────────────────────
export interface DashboardStats {
  totals: {
    projects:        number
    featuredProjects: number
    certifications:  number
    skills:          number
    services:        number
    clients:         number
    featuredClients: number
    feedbacks:       number
    media:           number
    leads:           number
    newLeads:        number
  }
  recentProjects: Pick<ProjectData, 'id' | 'title' | 'slug' | 'featured' | 'updatedAt'>[]
  recentLeads:    Pick<LeadData, 'id' | 'name' | 'email' | 'status' | 'createdAt'>[]
  recentMedia:    Pick<MediaData, 'id' | 'originalName' | 'url' | 'mimeType' | 'size' | 'createdAt'>[]
}

// ── Admin ─────────────────────────────────────────────────────
export interface AdminUser {
  id:        string
  email:     string
  name:      string
}