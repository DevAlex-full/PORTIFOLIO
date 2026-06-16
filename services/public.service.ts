/**
 * services/public.service.ts
 * Funções de fetch para o site público.
 * Executadas no servidor (Server Components / generateMetadata).
 * Usam fetch nativo com cache do Next.js.
 */

import { publicFetch } from '@/lib/api'
import type {
  HeroData,
  AboutData,
  ProjectData,
  CertificationData,
  SkillData,
  ServicesData,
  ContactData,
  SiteSettingsData,
} from '@/types/api'

// ── Hero ──────────────────────────────────────────────────────
export async function getHero(): Promise<HeroData> {
  try {
    return await publicFetch<HeroData>('/api/hero')
  } catch {
    return {} as HeroData
  }
}

// ── About ─────────────────────────────────────────────────────
export async function getAbout(): Promise<AboutData> {
  try {
    return await publicFetch<AboutData>('/api/about')
  } catch {
    return {} as AboutData
  }
}

// ── Projects ──────────────────────────────────────────────────
export async function getProjects(): Promise<ProjectData[]> {
  try {
    return await publicFetch<ProjectData[]>('/api/projects')
  } catch {
    return []
  }
}

// ── Certifications ────────────────────────────────────────────
export async function getCertifications(): Promise<CertificationData[]> {
  try {
    return await publicFetch<CertificationData[]>('/api/certifications')
  } catch {
    return []
  }
}

// ── Skills ────────────────────────────────────────────────────
export async function getSkills(): Promise<SkillData[]> {
  try {
    return await publicFetch<SkillData[]>('/api/skills')
  } catch {
    return []
  }
}

// ── Services ──────────────────────────────────────────────────
export async function getServices(): Promise<ServicesData> {
  try {
    return await publicFetch<ServicesData>('/api/services')
  } catch {
    return { plans: [], extras: [] }
  }
}

// ── Contact ───────────────────────────────────────────────────
export async function getContact(): Promise<ContactData> {
  try {
    return await publicFetch<ContactData>('/api/contact')
  } catch {
    return {} as ContactData
  }
}

// ── Site Settings ─────────────────────────────────────────────
export async function getSiteSettings(): Promise<SiteSettingsData> {
  try {
    return await publicFetch<SiteSettingsData>('/api/settings')
  } catch {
    return {
      id: 'fallback-site-settings',
      siteTitle: 'Alexander Bueno Santiago — Desenvolvedor Full Stack',
      description: 'Desenvolvedor Full Stack especializado em React, Next.js e Node.js.',
      keywords: [],
      ogTitle: null,
      ogDescription: null,
      faviconUrl: null,
      logoUrl: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  }
}

// ── Tudo de uma vez (homepage) ────────────────────────────────
export async function getHomeData() {
  const [hero, about, projects, certifications, skills, services, contact] =
    await Promise.all([
      getHero(),
      getAbout(),
      getProjects(),
      getCertifications(),
      getSkills(),
      getServices(),
      getContact(),
    ])

  return { hero, about, projects, certifications, skills, services, contact }
}