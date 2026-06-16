'use client'

// 📁 CAMINHO: app/admin/(protected)/hero/page.tsx (CRIADO)

import { useState, useEffect } from 'react'
import { AdminShell }   from '@/components/admin/AdminShell'
import { MediaPicker }  from '@/components/admin/MediaPicker'
import { heroService }  from '@/services/admin.service'
import type { HeroData } from '@/types/api'
import { toast }        from 'sonner'
import { Save, Loader2, User } from 'lucide-react'

export default function HeroPage() {
  const [form,    setForm]    = useState<Partial<HeroData>>({})
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)

  useEffect(() => {
    heroService.get()
      .then(r => setForm(r.data))
      .catch(() => toast.error('Erro ao carregar dados do hero.'))
      .finally(() => setLoading(false))
  }, [])

  function set(key: keyof HeroData, val: unknown) {
    setForm(f => ({ ...f, [key]: val }))
  }

  async function handleSave() {
    setSaving(true)
    try {
      const { data } = await heroService.update(form)
      setForm(data)
      toast.success('Hero atualizado!')
    } catch { toast.error('Erro ao salvar.') }
    finally { setSaving(false) }
  }

  if (loading) return <AdminShell title="Hero"><div className="flex justify-center py-32"><Loader2 size={24} className="text-violet-400 animate-spin" /></div></AdminShell>

  return (
    <AdminShell title="Hero">
      <div className="max-w-3xl space-y-6">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <Card title="Identidade">
              <F label="Nome"><I value={form.name ?? ''} onChange={v => set('name', v)} placeholder="Alexander Bueno Santiago" /></F>
              <F label="Cargo / Role"><I value={form.role ?? ''} onChange={v => set('role', v)} placeholder="Desenvolvedor Full Stack" /></F>
              <F label="Descrição (bio)">
                <textarea value={form.description ?? ''} onChange={e => set('description', e.target.value)} rows={4} placeholder="Construo soluções digitais completas..."
                  className="w-full px-4 py-3 rounded-xl border border-violet-600/20 bg-slate-900/60 text-slate-300 placeholder-slate-700 text-sm focus:outline-none focus:border-violet-500 transition-colors resize-none" />
              </F>
            </Card>

            <Card title="Links Sociais">
              <F label="GitHub URL"><I value={form.githubUrl ?? ''} onChange={v => set('githubUrl', v)} placeholder="https://github.com/..." /></F>
              <F label="LinkedIn URL"><I value={form.linkedinUrl ?? ''} onChange={v => set('linkedinUrl', v)} placeholder="https://linkedin.com/in/..." /></F>
              <F label="Email"><I value={form.emailAddress ?? ''} onChange={v => set('emailAddress', v)} placeholder="seu@email.com" /></F>
              <F label="WhatsApp (só números)"><I value={form.whatsapp ?? ''} onChange={v => set('whatsapp', v)} placeholder="5511983943905" mono /></F>
            </Card>

            <Card title="Arquivos">
              <F label="URL do Typing SVG"><I value={form.typingSvgUrl ?? ''} onChange={v => set('typingSvgUrl', v)} placeholder="https://readme-typing-svg.demolab.com?..." mono /></F>
              <F label="URL do Currículo (CV)"><I value={form.cvUrl ?? ''} onChange={v => set('cvUrl', v)} placeholder="/docs/curriculo.pdf ou URL externa" /></F>
            </Card>
          </div>

          <div className="space-y-5">
            <Card title="Foto de Perfil">
              <MediaPicker value={form.photoUrl ?? ''} onChange={url => set('photoUrl', url)} label="Foto" />
            </Card>

            <Card title="Status">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-slate-400">Disponível para projetos</span>
                <Tog checked={form.available ?? true} onChange={v => set('available', v)} />
              </div>
            </Card>

            <button onClick={handleSave} disabled={saving} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-violet-600 text-white font-display font-semibold text-sm hover:bg-violet-500 transition-colors disabled:opacity-50">
              {saving ? <><Loader2 size={15} className="animate-spin" />Salvando...</> : <><Save size={15} />Salvar Hero</>}
            </button>
          </div>
        </div>
      </div>
    </AdminShell>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#0d0b18] border border-violet-600/15 rounded-xl p-6 space-y-5">
      <h3 className="font-display font-semibold text-white text-sm">{title}</h3>
      {children}
    </div>
  )
}
function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="font-mono text-xs text-slate-500 block mb-2">{label}</label>{children}</div>
}
function I({ value, onChange, placeholder, mono }: { value: string; onChange: (v: string) => void; placeholder?: string; mono?: boolean }) {
  return <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
    className={`w-full px-4 py-2.5 rounded-xl border border-violet-600/20 bg-slate-900/60 text-slate-300 placeholder-slate-700 ${mono ? 'font-mono text-xs' : 'text-sm'} focus:outline-none focus:border-violet-500 transition-colors`} />
}
function Tog({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return <button type="button" onClick={() => onChange(!checked)} className={`relative w-10 h-5 rounded-full transition-colors ${checked ? 'bg-violet-600' : 'bg-slate-700'}`}><span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} /></button>
}