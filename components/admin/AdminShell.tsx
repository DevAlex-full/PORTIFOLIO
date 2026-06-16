'use client'

// 📁 CAMINHO: components/admin/AdminShell.tsx (CRIADO)
// Layout completo do painel: Sidebar + Header + Content.
// Gerencia estado do menu mobile.

import { useState, useEffect } from 'react'
import { AdminSidebar }  from './AdminSidebar'
import { AdminHeader }   from './AdminHeader'
import { dashboardService } from '@/services/admin.service'

interface AdminShellProps {
  title:    string
  children: React.ReactNode
}

export function AdminShell({ title, children }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [newLeads,    setNewLeads]    = useState(0)

  useEffect(() => {
    dashboardService.getStats()
      .then(r => setNewLeads(r.data.totals.newLeads))
      .catch(() => {})
  }, [])

  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0812]">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        newLeads={newLeads}
      />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <AdminHeader
          title={title}
          onMenuClick={() => setSidebarOpen(true)}
          newLeads={newLeads}
        />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}