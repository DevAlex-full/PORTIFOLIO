// 📁 CAMINHO: portfolio/app/projects/page.tsx

import { AllProjects } from '@/components/sections/AllProjects'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Todos os Projetos — Alexander Bueno Santiago',
  description: 'Uma coleção completa dos projetos que desenvolvi, desde aplicações web interativas até soluções comerciais.',
}

export default function ProjectsPage() {
  return <AllProjects />
}