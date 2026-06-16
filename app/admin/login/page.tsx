'use client'

// 📁 CAMINHO: app/admin/login/page.tsx (CRIADO)

import { useState, useEffect }  from 'react'
import { useRouter }            from 'next/navigation'
import { useAdminAuth }         from '@/contexts/AdminAuthContext'
import { toast }                from 'sonner'
import { Eye, EyeOff, Lock, Mail, Loader2 } from 'lucide-react'

export default function AdminLoginPage() {
  const { login, isAuthenticated, isLoading } = useAdminAuth()
  const router = useRouter()

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading,  setLoading]  = useState(false)

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/admin/dashboard')
    }
  }, [isLoading, isAuthenticated, router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) return

    setLoading(true)
    try {
      await login(email, password)
      toast.success('Login realizado com sucesso!')
      router.replace('/admin/dashboard')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
      toast.error(msg ?? 'Credenciais inválidas. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={24} className="text-violet-400 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* BG */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-violet-600/5 blur-3xl" />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-cyan-500/3 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center mx-auto mb-4">
            <span className="font-display font-bold text-violet-300 text-2xl">A</span>
          </div>
          <h1 className="font-display font-bold text-white text-2xl">Portfolio CMS</h1>
          <p className="font-mono text-sm text-slate-500 mt-1">Painel Administrativo</p>
        </div>

        {/* Card */}
        <div className="bg-[#0d0b18] border border-violet-600/20 rounded-2xl p-8">
          <h2 className="font-display font-semibold text-white mb-6">Entrar</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="font-mono text-xs text-slate-500 block mb-2">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-violet-600/20 bg-slate-900/60 text-slate-200 placeholder-slate-700 font-body text-sm focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="font-mono text-xs text-slate-500 block mb-2">Senha</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-violet-600/20 bg-slate-900/60 text-slate-200 placeholder-slate-700 font-body text-sm focus:outline-none focus:border-violet-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-violet-600 text-white font-display font-semibold text-sm hover:bg-violet-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar no Painel'
              )}
            </button>
          </form>
        </div>

        <p className="text-center font-mono text-xs text-slate-700 mt-6">
          Alexander Bueno Santiago © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  )
}