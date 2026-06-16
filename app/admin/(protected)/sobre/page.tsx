'use client'

// 📁 CAMINHO: app/admin/(protected)/sobre/page.tsx (CRIADO)

import { useState, useEffect } from 'react'
import { AdminShell }   from '@/components/admin/AdminShell'
import { aboutService } from '@/services/admin.service'
import type { AboutData, AboutHighlight } from '@/types/api'
import { toast } from 'sonner'
import { Save, Loader2, Plus, Trash2 } from 'lucide-react'

export default function SobrePage() {
  const [form,    setForm]    = useState<Partial<AboutData>>({ paragraph1: '', paragraph2: '', paragraph3: '', highlights: [] })
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)

  useEffect(() => {
    aboutService.get()
      .then(r => setForm(r.data))
      .catch(() => toast.error('Erro ao carregar dados.'))
      .finally(() => setLoading(false))
  }, [])

  function set(key: keyof AboutData, val: unknown) {
    setForm(f => ({ ...f, [key]: val }))
  }

  function setHighlight(idx: number, key: keyof AboutHighlight, val: string) {
    const h = [...(form.highlights ?? [])]
    h[idx] = { ...h[idx], [key]: val }
    set('highlights', h)
  }

  function addHighlight() {
    set('highlights', [...(form.highlights ?? []), { icon: 'Layers', title: '', description: '' }])
  }

  function removeHighlight(idx: number) {
    set('highlights', (form.highlights ?? []).filter((_, i) => i !== idx))
  }

  async function handleSave() {
    setSaving(true)
    try { const { data } = await aboutService.update(form); setForm(data); toast.success('Sobre atualizado!') }
    catch { toast.error('Erro ao salvar.') }
    finally { setSaving(false) }
  }

  const TA = ({ value, onChange, rows = 4, placeholder }: { value: string; onChange: (v: string) => void; rows?: number; placeholder?: string }) => (
    <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows} placeholder={placeholder}
      className="w-full px-4 py-3 rounded-xl border border-violet-600/20 bg-slate-900/60 text-slate-300 placeholder-slate-700 text-sm focus:outline-none focus:border-violet-500 transition-colors resize-none" />
  )

  if (loading) return <AdminShell title="Sobre"><div className="flex justify-center py-32"><Loader2 size={24} className="text-violet-400 animate-spin" /></div></AdminShell>

  return (
    <AdminShell title="Sobre">
      <div className="max-w-3xl space-y-6">
        <div className="bg-[#0d0b18] border border-violet-600/15 rounded-xl p-6 space-y-5">
          <h3 className="font-display font-semibold text-white text-sm">Parágrafos</h3>
          {[1, 2, 3].map(n => (
            <div key={n}>
              <label className="font-mono text-xs text-slate-500 block mb-2">Parágrafo {n}</label>
              <TA value={(form as Record<string, string>)[`paragraph${n}`] ?? ''} onChange={v => set(`paragraph${n}` as keyof AboutData, v)} placeholder={`Texto do parágrafo ${n}...`} />
            </div>
          ))}
        </div>

        <div className="bg-[#0d0b18] border border-violet-600/15 rounded-xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold text-white text-sm">Cards de Destaque</h3>
            <button onClick={addHighlight} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600/20 border border-violet-600/30 text-violet-300 text-xs hover:bg-violet-600/30 transition-colors">
              <Plus size={13} /> Adicionar
            </button>
          </div>

          {(form.highlights ?? []).map((h, i) => (
            <div key={i} className="p-4 rounded-xl border border-slate-700/50 bg-slate-900/30 space-y-3">
              <div className="flex items-center justify-between">
                <p className="font-mono text-xs text-slate-600">Card {i + 1}</p>
                <button onClick={() => removeHighlight(i)} className="text-slate-600 hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-mono text-[10px] text-slate-600 block mb-1">Ícone (Lucide)</label>
                  <input value={h.icon} onChange={e => setHighlight(i, 'icon', e.target.value)} placeholder="Layers, Code2, Rocket..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900/60 text-slate-300 font-mono text-xs focus:outline-none focus:border-violet-500 transition-colors" />
                </div>
                <div>
                  <label className="font-mono text-[10px] text-slate-600 block mb-1">Título</label>
                  <input value={h.title} onChange={e => setHighlight(i, 'title', e.target.value)} placeholder="Full Stack Completo"
                    className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900/60 text-slate-300 text-sm focus:outline-none focus:border-violet-500 transition-colors" />
                </div>
              </div>
              <div>
                <label className="font-mono text-[10px] text-slate-600 block mb-1">Descrição</label>
                <TA value={h.description} onChange={v => setHighlight(i, 'description', v)} rows={2} placeholder="Descrição do destaque..." />
              </div>
            </div>
          ))}
        </div>

        <button onClick={handleSave} disabled={saving} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-violet-600 text-white font-display font-semibold text-sm hover:bg-violet-500 transition-colors disabled:opacity-50">
          {saving ? <><Loader2 size={15} className="animate-spin" />Salvando...</> : <><Save size={15} />Salvar Sobre</>}
        </button>
      </div>
    </AdminShell>
  )
}