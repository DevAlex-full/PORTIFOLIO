export interface Project {
  id: string
  title: string
  description: string
  image: string
  images?: { src: string; alt: string }[]
  tags: string[]
  categories: ProjectCategory[]
  links: {
    demo?: string
    github?: string
    githubFrontend?: string
    githubBackend?: string
  }
  featured?: boolean
  highlight?: string
}

export type ProjectCategory =
  | 'web'
  | 'landing'
  | 'interactive'
  | 'commercial'
  | 'game'
  | 'personal'
  | 'course'
  | 'client'

export interface Skill {
  name: string
  icon: string
  level: 'expert' | 'advanced' | 'intermediate'
  category: SkillCategory
}

export type SkillCategory =
  | 'frontend'
  | 'backend'
  | 'database'
  | 'devops'
  | 'tools'
  | 'design'

export interface Certification {
  id: string
  title: string
  institution: string
  year: number
  tags: string[]
  hours?: number
  stars?: number
  link?: string
  inProgress?: boolean
}

export interface NavItem {
  label: string
  href: string
}

export interface SocialLink {
  label: string
  href: string
  icon: string
}