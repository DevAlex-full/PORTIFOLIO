// 📁 CAMINHO: app/projects/page.tsx (ALTERADO)
// Agora é Server Component.
// Busca projetos no servidor e passa para AllProjects.

import type { Metadata }   from 'next'
import { AllProjects }     from '@/components/sections/AllProjects'
import { getProjects }     from '@/services/public.service'

export const revalidate = 60

export const metadata: Metadata = {
  title:       'Todos os Projetos — Alexander Bueno Santiago',
  description: 'Uma coleção completa dos projetos que desenvolvi, desde aplicações web interativas até soluções comerciais.',
}

export default async function ProjectsPage() {
  const projects = await getProjects()
  return <AllProjects data={projects} />
}