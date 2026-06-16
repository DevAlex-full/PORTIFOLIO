// 📁 CAMINHO: app/admin/page.tsx (CRIADO)
// Redireciona /admin → /admin/dashboard

import { redirect } from 'next/navigation'

export default function AdminPage() {
  redirect('/admin/dashboard')
}