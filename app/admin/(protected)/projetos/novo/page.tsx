import { AdminShell }   from '@/components/admin/AdminShell'
import { ProjectForm }  from '@/components/admin/forms/ProjectForm'

export default function NovoProjetoPage() {
  return (
    <AdminShell title="Novo Projeto">
      <ProjectForm />
    </AdminShell>
  )
}