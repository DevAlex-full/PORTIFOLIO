// 📁 CAMINHO: data/certifications.ts

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
    title: 'DevQuest 2.0 — IA para Devs',
    institution: 'DevQuest',
    year: 2025,
    tags: ['Inteligência Artificial', 'IA', 'Machine Learning'],
    hours: 16,
    stars: 4,
  },
  {
    id: 'gran-faculdade',
    title: 'Análise de Dados e Inteligência de Negócios',
    institution: 'Gran Faculdade',
    year: 2025,
    tags: ['Análise de Dados', 'Business Intelligence', 'Negócios'],
    hours: 30,
    stars: 4,
  },
  {
    id: 'dev-futuro',
    title: 'Imersão Dev do Futuro',
    institution: 'Dev do Futuro',
    year: 2025,
    tags: ['HTML5', 'CSS3', 'JavaScript', 'N8N', 'IA'],
    hours: 16,
    stars: 4,
  },
  {
    id: 'formacao-frontend',
    title: 'Formação Front-End Web Developer',
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

// ─── Stats: exclui "inProgress" do total de horas para não distorcer o número ──
const completedCerts = certifications.filter((c) => !c.inProgress)
const totalHoras = completedCerts.reduce((acc, c) => acc + (c.hours ?? 0), 0)
const totalPlataformas = new Set(completedCerts.map((c) => c.institution)).size

export const stats = [
  { value: `${certifications.length}+`, label: 'Certificações',   icon: 'award' },
  { value: `${totalHoras}+`,            label: 'Horas de Estudo', icon: 'clock' },
  { value: `${totalPlataformas}+`,      label: 'Plataformas',     icon: 'globe' },
]