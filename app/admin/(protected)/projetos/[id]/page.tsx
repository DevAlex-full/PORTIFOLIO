'use client'



import { useParams }   from 'next/navigation'
import { AdminShell }  from '@/components/admin/AdminShell'
import { ProjectForm } from '@/components/admin/forms/ProjectForm'

export default function EditarProjetoPage() {
  const { id } = useParams<{ id: string }>()

  return (
    <AdminShell title="Editar Projeto">
      <ProjectForm projectId={id} />
    </AdminShell>
  )
}