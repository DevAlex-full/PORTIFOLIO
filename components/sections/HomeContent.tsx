'use client'


import { useEffect }           from 'react'
import { useSearchParams }     from 'next/navigation'
import { Hero }                from '@/components/sections/Hero'
import { About }               from '@/components/sections/About'
import { Skills }              from '@/components/sections/Skills'
import { Certifications }      from '@/components/sections/Certifications'
import { Projects }            from '@/components/sections/Projects'
import { Services }            from '@/components/sections/Services'
import { Testimonials }        from '@/components/sections/Testimonials'
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
      <Testimonials    />
      <Contact         data={contact} />
    </>
  )
}