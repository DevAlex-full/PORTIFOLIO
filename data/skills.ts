import type { Skill } from '@/types'

export const skills: Skill[] = [
  // Frontend
  { name: 'HTML5', icon: 'html5', level: 'expert', category: 'frontend' },
  { name: 'CSS3', icon: 'css3', level: 'expert', category: 'frontend' },
  { name: 'JavaScript', icon: 'javascript', level: 'expert', category: 'frontend' },
  { name: 'TypeScript', icon: 'typescript', level: 'advanced', category: 'frontend' },
  { name: 'React', icon: 'react', level: 'advanced', category: 'frontend' },
  { name: 'Next.js', icon: 'nextjs', level: 'advanced', category: 'frontend' },
  { name: 'Tailwind CSS', icon: 'tailwind', level: 'advanced', category: 'frontend' },
  // Backend
  { name: 'Node.js', icon: 'nodejs', level: 'advanced', category: 'backend' },
  { name: 'Express', icon: 'express', level: 'advanced', category: 'backend' },
  { name: 'Java', icon: 'java', level: 'intermediate', category: 'backend' },
  { name: 'PHP', icon: 'php', level: 'intermediate', category: 'backend' },
  // Database
  { name: 'PostgreSQL', icon: 'postgresql', level: 'advanced', category: 'database' },
  { name: 'MySQL', icon: 'mysql', level: 'advanced', category: 'database' },
  { name: 'Prisma ORM', icon: 'prisma', level: 'advanced', category: 'database' },
  // DevOps / Tools
  { name: 'Git', icon: 'git', level: 'expert', category: 'tools' },
  { name: 'GitHub', icon: 'github', level: 'expert', category: 'tools' },
  { name: 'Docker', icon: 'docker', level: 'intermediate', category: 'devops' },
  { name: 'Vercel', icon: 'vercel', level: 'advanced', category: 'devops' },
  // Design
  { name: 'Figma', icon: 'figma', level: 'intermediate', category: 'design' },
  { name: 'WordPress', icon: 'wordpress', level: 'advanced', category: 'tools' },
]

export const skillCategories = [
  { key: 'frontend', label: 'Front-End' },
  { key: 'backend', label: 'Back-End' },
  { key: 'database', label: 'Database' },
  { key: 'devops', label: 'DevOps' },
  { key: 'tools', label: 'Ferramentas' },
  { key: 'design', label: 'Design' },
]