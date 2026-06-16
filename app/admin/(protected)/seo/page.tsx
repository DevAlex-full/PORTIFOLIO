'use client'

// 📁 CAMINHO: app/admin/(protected)/seo/page.tsx (CRIADO)

import { useState, useEffect } from 'react'
import { AdminShell }       from '@/components/admin/AdminShell'
import { MediaPicker }      from '@/components/admin/MediaPicker'
import { settingsService }  from '@/services/admin.service'
import type { SiteSettingsData } from '@/types/api'
import { toast } from 'sonner'
import { Save, Loader2, Plus, X } from 'lucide-react'

export default function SEOPage() {
  const [form,     setForm]     = useState<Partial<SiteSettingsData>>({ keywords: [] })
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [kwInput,  setKwInput]  = useState('')

  useEffect(() => {
    settingsService.get()
      .then(r => setForm(r.data))
      .catch(() => toast.error('Erro ao carregar configurações.'))
      .finally(() => setLoading(false))
  }, [])

  function set(key: keyof SiteSettingsData, val: unknown) {
    setForm(f => ({ ...f, [key]: val }))
  }

  function addKeyword() {
    const v = kwInput.trim().toLowerCase()
    if (!v || form.keywords?.includes(v)) return
    set('keywords', [...(form.keywords ?? []), v])
    setKwInput('')
  }

  async function handleSave() {
    setSaving(true)
    try { const { data } = await settingsService.update(form); setForm(data); toast.success('SEO atualizado!') }
    catch { toast.error('Erro ao salvar.') }
    finally { setSaving(false) }
  }

  const I = ({ label, k, placeholder, mono }: { label: string; k: keyof SiteSettingsData; placeholder?: string; mono?: boolean }) => (
    <div>
      <label className="font-mono text-xs text-slate-500 block mb-2">{label}</label>
      <input type="text" value={(form[k] as string) ?? ''} onChange={e => set(k, e.target.value)} placeholder={placeholder}
        className={`w-full px-4 py-2.5 rounded-xl border border-violet-600/20 bg-slate-900/60 text-slate-300 placeholder-slate-700 ${mono ? 'font-mono text-xs' : 'text-sm'} focus:outline-none focus:border-violet-500 transition-colors`} />
    </div>
  )

  if (loading) return <AdminShell title="SEO"><div className="flex justify-center py-32"><Loader2 size={24} className="text-violet-400 animate-spin" /></div></AdminShell>

  return (
    <AdminShell title="SEO & Configurações">
      <div className="max-w-2xl space-y-6">
        <div className="bg-[#0d0b18] border border-violet-600/15 rounded-xl p-6 space-y-5">
          <h3 className="font-display font-semibold text-white text-sm">Meta Tags Principais</h3>
          <I label="Title do Site" k="siteTitle" placeholder="Alexander Bueno Santiago — Desenvolvedor Full Stack" />
          <div>
            <label className="font-mono text-xs text-slate-500 block mb-2">Meta Description</label>
            <textarea value={form.description ?? ''} onChange={e => set('description', e.target.value)} rows={3}
              placeholder="Desenvolvedor Full Stack especializado em..."
              className="w-full px-4 py-3 rounded-xl border border-violet-600/20 bg-slate-900/60 text-slate-300 placeholder-slate-700 text-sm focus:outline-none focus:border-violet-500 transition-colors resize-none" />
          </div>

          <div>
            <label className="font-mono text-xs text-slate-500 block mb-2">Keywords</label>
            <div className="flex gap-2 mb-2">
              <input value={kwInput} onChange={e => setKwInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                placeholder="react, next.js, freelancer..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-violet-600/20 bg-slate-900/60 text-slate-300 placeholder-slate-700 font-mono text-xs focus:outline-none focus:border-violet-500 transition-colors" />
              <button type="button" onClick={addKeyword} className="px-3 py-2.5 rounded-xl bg-violet-600/20 border border-violet-600/30 text-violet-300 hover:bg-violet-600/30 transition-colors"><Plus size={14} /></button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(form.keywords ?? []).map(kw => (
                <span key={kw} className="flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 font-mono text-[11px]">
                  {kw}<button type="button" onClick={() => set('keywords', form.keywords!.filter(x => x !== kw))} className="text-slate-600 hover:text-red-400 transition-colors"><X size={9} /></button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-[#0d0b18] border border-violet-600/15 rounded-xl p-6 space-y-5">
          <h3 className="font-display font-semibold text-white text-sm">Open Graph</h3>
          <I label="OG Title" k="ogTitle" placeholder="Deixe vazio para usar o title principal" />
          <div>
            <label className="font-mono text-xs text-slate-500 block mb-2">OG Description</label>
            <textarea value={form.ogDescription ?? ''} onChange={e => set('ogDescription', e.target.value)} rows={2}
              placeholder="Sistemas web, SaaS, APIs e automações..."
              className="w-full px-4 py-3 rounded-xl border border-violet-600/20 bg-slate-900/60 text-slate-300 placeholder-slate-700 text-sm focus:outline-none focus:border-violet-500 transition-colors resize-none" />
          </div>
        </div>

        <div className="bg-[#0d0b18] border border-violet-600/15 rounded-xl p-6 space-y-5">
          <h3 className="font-display font-semibold text-white text-sm">Ícones & Logo</h3>
          <MediaPicker value={form.faviconUrl ?? ''} onChange={url => set('faviconUrl', url)} label="Favicon" />
          <MediaPicker value={form.logoUrl ?? ''} onChange={url => set('logoUrl', url)} label="Logo" />
        </div>

        <button onClick={handleSave} disabled={saving} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-violet-600 text-white font-display font-semibold text-sm hover:bg-violet-500 transition-colors disabled:opacity-50">
          {saving ? <><Loader2 size={15} className="animate-spin" />Salvando...</> : <><Save size={15} />Salvar SEO</>}
        </button>
      </div>
    </AdminShell>
  )
}