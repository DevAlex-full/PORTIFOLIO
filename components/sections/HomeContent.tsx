'use client'

// 📁 CAMINHO: components/sections/HomeContent.tsx (ALTERADO)
// Recebe todos os dados como props vindos do Server Component (page.tsx).
// Mantém a navegação por hash e o comportamento original intactos.

import { useEffect }           from 'react'
import { useSearchParams }     from 'next/navigation'
import { Hero }                from '@/components/sections/Hero'
import { About }               from '@/components/sections/About'
import { Skills }              from '@/components/sections/Skills'
import { Certifications }      from '@/components/sections/Certifications'
import { Projects }            from '@/components/sections/Projects'
import { Services }            from '@/components/sections/Services'
import { Contact }             from '@/components/sections/Contact'
import type {
  HeroData, AboutData, ProjectData, CertificationData,
  SkillData, ServicesData, ContactData,
} from '@/types/api'

interface HomeContentProps {
  hero:           HeroData
  about:          AboutData
  projects:       ProjectData[]
  certifications: CertificationData[]
  skills:         SkillData[]
  services:       ServicesData
  contact:        ContactData
}

export function HomeContent({
  hero, about, projects, certifications, skills, services, contact,
}: HomeContentProps) {
  useSearchParams()

  // Scroll to hash on mount (comportamento original mantido)
  useEffect(() => {
    const hash = window.location.hash
    if (hash) {
      const id = hash.replace('#', '')
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      }, 300)
    }
  }, [])

  return (
    <>
      <Hero            data={hero} />
      <About           data={about} projectsCount={projects.length} />
      <Skills          data={skills} />
      <Certifications  data={certifications} />
      <Projects        data={projects} />
      <Services        data={services} />
      <Contact         data={contact} />
    </>
  )
}