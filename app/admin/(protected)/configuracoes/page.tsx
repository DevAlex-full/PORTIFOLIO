'use client'

// 📁 CAMINHO: app/admin/(protected)/configuracoes/page.tsx (CRIADO)

import { useState } from 'react'
import { AdminShell }   from '@/components/admin/AdminShell'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { authService }  from '@/services/admin.service'
import { toast }        from 'sonner'
import { Save, Loader2, Shield, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default function ConfiguracoesPage() {
  const { admin } = useAdminAuth()
  const [currentPass, setCurrentPass] = useState('')
  const [newPass,     setNewPass]     = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [saving,      setSaving]      = useState(false)

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    if (newPass !== confirmPass) { toast.error('As senhas não coincidem.'); return }
    if (newPass.length < 8)     { toast.error('Mínimo de 8 caracteres.'); return }

    setSaving(true)
    try {
      await authService.changePassword(currentPass, newPass)
      toast.success('Senha alterada com sucesso!')
      setCurrentPass(''); setNewPass(''); setConfirmPass('')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
      toast.error(msg ?? 'Erro ao alterar senha.')
    } finally { setSaving(false) }
  }

  return (
    <AdminShell title="Configurações">
      <div className="max-w-2xl space-y-6">
        {/* Admin info */}
        <div className="bg-[#0d0b18] border border-violet-600/15 rounded-xl p-6 space-y-4">
          <h3 className="font-display font-semibold text-white text-sm">Conta</h3>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
              <span className="font-display font-bold text-violet-300 text-2xl">{admin?.name?.[0] ?? 'A'}</span>
            </div>
            <div>
              <p className="font-display font-bold text-white">{admin?.name}</p>
              <p className="font-mono text-sm text-slate-500">{admin?.email}</p>
            </div>
          </div>
        </div>

        {/* Change password */}
        <div className="bg-[#0d0b18] border border-violet-600/15 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-violet-600/20 border border-violet-600/20 flex items-center justify-center">
              <Shield size={15} className="text-violet-400" />
            </div>
            <h3 className="font-display font-semibold text-white text-sm">Alterar Senha</h3>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4">
            {[
              { label: 'Senha Atual', value: currentPass, onChange: setCurrentPass, placeholder: '••••••••' },
              { label: 'Nova Senha',  value: newPass,     onChange: setNewPass,     placeholder: 'Mínimo 8 caracteres' },
              { label: 'Confirmar Nova Senha', value: confirmPass, onChange: setConfirmPass, placeholder: 'Repita a nova senha' },
            ].map(({ label, value, onChange, placeholder }) => (
              <div key={label}>
                <label className="font-mono text-xs text-slate-500 block mb-2">{label}</label>
                <input type="password" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} required
                  className="w-full px-4 py-2.5 rounded-xl border border-violet-600/20 bg-slate-900/60 text-slate-300 placeholder-slate-700 text-sm focus:outline-none focus:border-violet-500 transition-colors" />
              </div>
            ))}
            <button type="submit" disabled={saving} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition-colors disabled:opacity-50">
              {saving ? <><Loader2 size={14} className="animate-spin" />Salvando...</> : <><Save size={14} />Alterar Senha</>}
            </button>
          </form>
        </div>

        {/* Links úteis */}
        <div className="bg-[#0d0b18] border border-violet-600/15 rounded-xl p-6 space-y-3">
          <h3 className="font-display font-semibold text-white text-sm">Links Úteis</h3>
          {[
            { label: 'Ver Site Público', href: '/', external: true },
            { label: 'Supabase Dashboard', href: 'https://supabase.com/dashboard', external: true },
            { label: 'Render Dashboard', href: 'https://render.com/dashboard', external: true },
          ].map(({ label, href, external }) => (
            <Link key={href} href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}
              className="flex items-center justify-between p-3 rounded-lg border border-slate-700/40 hover:border-violet-500/30 hover:bg-violet-600/5 transition-all group">
              <span className="font-body text-sm text-slate-400 group-hover:text-white transition-colors">{label}</span>
              <ExternalLink size={13} className="text-slate-600 group-hover:text-violet-400 transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </AdminShell>
  )
}