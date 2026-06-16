'use client'

// 📁 CAMINHO: app/admin/(protected)/layout.tsx (CRIADO)
// Layout protegido: verifica autenticação e redireciona se não autenticado.

import { useEffect }     from 'react'
import { useRouter }     from 'next/navigation'
import { useAdminAuth }  from '@/contexts/AdminAuthContext'
import { Loader2 }       from 'lucide-react'

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAdminAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/admin/login')
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0812]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
            <Loader2 size={20} className="text-violet-400 animate-spin" />
          </div>
          <p className="font-mono text-xs text-slate-600">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) return null

  return <>{children}</>
}