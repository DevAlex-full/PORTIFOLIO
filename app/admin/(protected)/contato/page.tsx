'use client'

// 📁 CAMINHO: app/admin/(protected)/contato/page.tsx (CRIADO)

import { useState, useEffect } from 'react'
import { AdminShell }      from '@/components/admin/AdminShell'
import { contactService }  from '@/services/admin.service'
import type { ContactData } from '@/types/api'
import { toast } from 'sonner'
import { Save, Loader2 } from 'lucide-react'

export default function ContatoPage() {
  const [form,    setForm]    = useState<Partial<ContactData>>({})
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)

  useEffect(() => {
    contactService.get()
      .then(r => setForm(r.data))
      .catch(() => toast.error('Erro ao carregar dados.'))
      .finally(() => setLoading(false))
  }, [])

  function set(key: keyof ContactData, val: string) {
    setForm(f => ({ ...f, [key]: val }))
  }

  async function handleSave() {
    setSaving(true)
    try { const { data } = await contactService.update(form); setForm(data); toast.success('Contato atualizado!') }
    catch { toast.error('Erro ao salvar.') }
    finally { setSaving(false) }
  }

  const Field = ({ label, k, placeholder, mono }: { label: string; k: keyof ContactData; placeholder?: string; mono?: boolean }) => (
    <div>
      <label className="font-mono text-xs text-slate-500 block mb-2">{label}</label>
      <input type="text" value={(form[k] as string) ?? ''} onChange={e => set(k, e.target.value)} placeholder={placeholder}
        className={`w-full px-4 py-2.5 rounded-xl border border-violet-600/20 bg-slate-900/60 text-slate-300 placeholder-slate-700 ${mono ? 'font-mono text-xs' : 'text-sm'} focus:outline-none focus:border-violet-500 transition-colors`} />
    </div>
  )

  if (loading) return <AdminShell title="Contato"><div className="flex justify-center py-32"><Loader2 size={24} className="text-violet-400 animate-spin" /></div></AdminShell>

  return (
    <AdminShell title="Contato">
      <div className="max-w-2xl space-y-6">
        <div className="bg-[#0d0b18] border border-violet-600/15 rounded-xl p-6 space-y-5">
          <h3 className="font-display font-semibold text-white text-sm">Dados Principais</h3>
          <Field label="WhatsApp (só números)" k="whatsapp" placeholder="5511983943905" mono />
          <Field label="Email" k="email" placeholder="seu@email.com" />
          <Field label="Localização" k="location" placeholder="São Paulo, SP" />
        </div>

        <div className="bg-[#0d0b18] border border-violet-600/15 rounded-xl p-6 space-y-5">
          <h3 className="font-display font-semibold text-white text-sm">Redes Sociais</h3>
          <div className="grid grid-cols-2 gap-4">
            <Field label="GitHub (username)" k="github" placeholder="DevAlex-full" />
            <Field label="GitHub URL" k="githubUrl" placeholder="https://github.com/..." />
            <Field label="LinkedIn (ID)" k="linkedin" placeholder="alexander-bueno-..." />
            <Field label="LinkedIn URL" k="linkedinUrl" placeholder="https://linkedin.com/in/..." />
            <Field label="Instagram (@)" k="instagram" placeholder="@devalex_fullstack" />
            <Field label="Instagram URL" k="instagramUrl" placeholder="https://instagram.com/..." />
          </div>
        </div>

        <div className="bg-[#0d0b18] border border-violet-600/15 rounded-xl p-6 space-y-5">
          <h3 className="font-display font-semibold text-white text-sm">Mensagem Padrão WhatsApp</h3>
          <textarea value={form.defaultMessage ?? ''} onChange={e => set('defaultMessage', e.target.value)} rows={3}
            placeholder="Olá, vim pelo seu portfólio..."
            className="w-full px-4 py-3 rounded-xl border border-violet-600/20 bg-slate-900/60 text-slate-300 placeholder-slate-700 text-sm focus:outline-none focus:border-violet-500 transition-colors resize-none" />
        </div>

        <button onClick={handleSave} disabled={saving} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-violet-600 text-white font-display font-semibold text-sm hover:bg-violet-500 transition-colors disabled:opacity-50">
          {saving ? <><Loader2 size={15} className="animate-spin" />Salvando...</> : <><Save size={15} />Salvar Contato</>}
        </button>
      </div>
    </AdminShell>
  )
}