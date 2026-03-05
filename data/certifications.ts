// 📁 CAMINHO: portfolio/data/certifications.ts

import type { Certification } from '@/types'

export const certifications: Certification[] = [
  {
    id: 'devquest-backend',
    title: 'DevQuest 2.0 — Back-End',
    institution: 'DevQuest',
    year: 2025,
    tags: ['SQL', 'HTTP', 'Node.js', 'Express', 'PostgreSQL', 'Docker', 'Prisma'],
    hours: 90,
    stars: 5,
  },
  {
    id: 'devquest-frontend',
    title: 'DevQuest 2.0 — Front-End',
    institution: 'DevQuest',
    year: 2025,
    tags: ['HTML5', 'CSS3', 'JavaScript', 'TailwindCSS', 'React', 'TypeScript', 'Node.js'],
    hours: 90,
    stars: 5,
  },
  {
    id: 'devquest-ia',
    title: 'DevQuest 2.0 — IA para Devs 2.0',
    institution: 'DevQuest',
    year: 2025,
    tags: ['Inteligência Artificial', 'IA', 'Machine Learning'],
    hours: 16,
    stars: 4,
  },
  {
    id: 'devquest-marketing',
    title: 'DevQuest 2.0 — Marketing Pessoal',
    institution: 'DevQuest',
    year: 2025,
    tags: ['Marketing', 'Personal Branding', 'LinkedIn'],
    hours: 40,
    stars: 4,
  },
  {
    id: 'gran-faculdade',
    title: 'Gran Faculdade',
    institution: 'Análise de Dados e Inteligência de Negócios',
    year: 2025,
    tags: ['Análise de Dados', 'Business Intelligence', 'Negócios'],
    hours: 30,
    stars: 4,
  },
  {
    id: 'dev-futuro',
    title: 'DEV DO FUTURO',
    institution: 'Imersão Dev do Futuro',
    year: 2025,
    tags: ['HTML5', 'CSS3', 'JavaScript', 'N8N', 'IA'],
    hours: 16,
    stars: 4,
  },
  {
    id: 'formacao-frontend',
    title: 'Formação Front-end Web Developer',
    institution: 'Digital Innovation One (DIO)',
    year: 2025,
    tags: ['HTML5', 'CSS3', 'JavaScript', 'Git', 'GitHub'],
    hours: 75,
    stars: 4,
  },
  {
    id: 'java-cloud',
    title: 'Java Cloud Native',
    institution: 'Digital Innovation One (DIO)',
    year: 2025,
    tags: ['Java', 'SQL', 'MongoDB', 'Azure', 'Azure OpenAI', 'IA'],
    hours: 90,
    stars: 4,
  },
  {
    id: 'tecnologico-sistemas',
    title: 'Tecnológico em Sistemas para Internet',
    institution: 'Universidade Unifatecie',
    year: 2025,
    tags: ['Full Stack', 'Cloud Developer', 'Software Architect', 'Back-End', 'Front-End'],
    hours: 17532,
    stars: 5,
    inProgress: true,
  },
]

// Stats calculados automaticamente a partir dos dados
const totalHoras = certifications.reduce((acc, c) => acc + (c.hours ?? 0), 0)
const totalPlataformas = new Set(certifications.map((c) => c.institution)).size

export const stats = [
  { value: `${certifications.length}+`, label: 'Certificações', icon: 'award' },
  { value: `${totalHoras >= 200 ? Math.floor(totalHoras / 100) * 100 : totalHoras}+`, label: 'Horas de Estudo', icon: 'clock' },
  { value: `${totalPlataformas}+`, label: 'Plataformas', icon: 'globe' },
]