'use client'

// 📁 CAMINHO: app/admin/(protected)/habilidades/page.tsx (CRIADO)

import { useState, useEffect, useCallback } from 'react'
import { AdminShell }   from '@/components/admin/AdminShell'
import { ConfirmDialog }from '@/components/admin/ConfirmDialog'
import { skillService } from '@/services/admin.service'
import type { SkillData, SkillCategory, SkillLevel } from '@/types/api'
import { toast } from 'sonner'
import { cn }   from '@/lib/utils'
import { Plus, Pencil, Trash2, X, Save, Zap, Loader2 } from 'lucide-react'

const CATEGORIES: { value: SkillCategory; label: string }[] = [
  { value: 'frontend', label: 'Front-End'      },
  { value: 'backend',  label: 'Back-End'       },
  { value: 'database', label: 'Banco de Dados' },
  { value: 'devops',   label: 'DevOps'         },
  { value: 'tools',    label: 'Ferramentas'    },
  { value: 'design',   label: 'Design'         },
]

const LEVELS: { value: SkillLevel; label: string; color: string }[] = [
  { value: 'expert',       label: 'Expert',        color: 'text-violet-300 bg-violet-600/15 border-violet-500/30' },
  { value: 'advanced',     label: 'Avançado',      color: 'text-cyan-300 bg-cyan-500/10 border-cyan-500/25'       },
  { value: 'intermediate', label: 'Intermediário', color: 'text-slate-300 bg-slate-700/40 border-slate-600/40'    },
]

const EMPTY: Partial<SkillData> = {
  name: '', category: 'frontend', icon: '', level: 'advanced', order: 0, active: true,
}

export default function HabilidadesPage() {
  const [items,    setItems]    = useState<SkillData[]>([])
  const [loading,  setLoading]  = useState(true)
  const [editing,  setEditing]  = useState<Partial<SkillData> | null>(null)
  const [saving,   setSaving]   = useState(false)
  const [confirmId,setConfirmId]= useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [filter,   setFilter]   = useState<SkillCategory | 'all'>('all')

  const load = useCallback(async () => {
    setLoading(true)
    try { const { data } = await skillService.getAll(); setItems(data) }
    catch { toast.error('Erro ao carregar habilidades.') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  function set(key: keyof SkillData, val: unknown) {
    setEditing(e => e ? { ...e, [key]: val } : null)
  }

  async function handleSave() {
    if (!editing?.name || !editing.category || !editing.icon) {
      toast.error('Nome, categoria e ícone são obrigatórios.')
      return
    }
    setSaving(true)
    try {
      if (editing.id) {
        const { data } = await skillService.update(editing.id, editing)
        setItems(prev => prev.map(x => x.id === editing.id ? data : x))
        toast.success('Habilidade atualizada!')
      } else {
        const { data } = await skillService.create(editing)
        setItems(prev => [...prev, data])
        toast.success('Habilidade criada!')
      }
      setEditing(null)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
      toast.error(msg ?? 'Erro ao salvar.')
    } finally { setSaving(false) }
  }

  async function handleDelete() {
    if (!confirmId) return
    setDeleting(true)
    try {
      await skillService.delete(confirmId)
      setItems(prev => prev.filter(x => x.id !== confirmId))
      toast.success('Habilidade deletada.')
    } catch { toast.error('Erro ao deletar.') }
    finally { setDeleting(false); setConfirmId(null) }
  }

  const filtered = filter === 'all' ? items : items.filter(s => s.category === filter)

  // Group by category for display
  const grouped = CATEGORIES.reduce((acc, cat) => {
    const inCat = filtered.filter(s => s.category === cat.value)
    if (inCat.length) acc[cat.value] = inCat
    return acc
  }, {} as Record<string, SkillData[]>)

  return (
    <AdminShell title="Habilidades">
      <div className="max-w-5xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex flex-wrap gap-2">
            {[{ value: 'all', label: 'Todas' }, ...CATEGORIES].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setFilter(value as SkillCategory | 'all')}
                className={cn(
                  'font-mono text-xs px-3 py-1.5 rounded-lg border transition-all',
                  filter === value ? 'bg-violet-600 border-violet-500 text-white' : 'border-slate-700 text-slate-500 hover:text-slate-300'
                )}
              >
                {label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setEditing({ ...EMPTY })}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition-colors"
          >
            <Plus size={15} /> Nova Habilidade
          </button>
        </div>

        <p className="font-mono text-xs text-slate-600">{filtered.length} habilidade{filtered.length !== 1 ? 's' : ''}</p>

        {/* Grouped display */}
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 size={24} className="text-violet-400 animate-spin" /></div>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([catKey, skills]) => {
              const catLabel = CATEGORIES.find(c => c.value === catKey)?.label ?? catKey
              return (
                <div key={catKey}>
                  <p className="font-mono text-xs text-violet-400 uppercase tracking-widest mb-3">{catLabel}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {skills.map(skill => {
                      const lvl = LEVELS.find(l => l.value === skill.level)
                      return (
                        <div key={skill.id} className={cn(
                          'group relative flex items-center justify-between gap-2 p-3 rounded-xl border bg-[#0d0b18] transition-all',
                          skill.active ? 'border-violet-600/15 hover:border-violet-500/30' : 'border-slate-800/60 opacity-50'
                        )}>
                          <div className="min-w-0">
                            <p className="font-body text-sm text-white truncate">{skill.name}</p>
                            <span className={cn('font-mono text-[9px] px-1.5 py-0.5 rounded border', lvl?.color ?? '')}>
                              {lvl?.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                            <button onClick={() => setEditing({ ...skill })} className="w-6 h-6 rounded flex items-center justify-center text-slate-600 hover:text-violet-400 transition-colors">
                              <Pencil size={11} />
                            </button>
                            <button onClick={() => setConfirmId(skill.id)} className="w-6 h-6 rounded flex items-center justify-center text-slate-600 hover:text-red-400 transition-colors">
                              <Trash2 size={11} />
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setEditing(null)} />
          <div className="relative w-full max-w-md bg-[#0d0b18] border border-violet-600/20 rounded-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-violet-600/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-violet-600/20 flex items-center justify-center">
                  <Zap size={15} className="text-violet-400" />
                </div>
                <h3 className="font-display font-bold text-white">{editing.id ? 'Editar' : 'Nova'} Habilidade</h3>
              </div>
              <button onClick={() => setEditing(null)} className="text-slate-500 hover:text-white transition-colors"><X size={18} /></button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="font-mono text-xs text-slate-500 block mb-2">Nome *</label>
                <input type="text" value={editing.name ?? ''} onChange={e => set('name', e.target.value)} placeholder="React, Node.js, Docker..."
                  className="w-full px-4 py-2.5 rounded-xl border border-violet-600/20 bg-slate-900/60 text-slate-300 placeholder-slate-700 text-sm focus:outline-none focus:border-violet-500 transition-colors" />
              </div>

              <div>
                <label className="font-mono text-xs text-slate-500 block mb-2">Ícone (slug) *</label>
                <input type="text" value={editing.icon ?? ''} onChange={e => set('icon', e.target.value)} placeholder="react, nodejs, docker..."
                  className="w-full px-4 py-2.5 rounded-xl border border-violet-600/20 bg-slate-900/60 text-slate-300 placeholder-slate-700 font-mono text-xs focus:outline-none focus:border-violet-500 transition-colors" />
                <p className="font-mono text-[10px] text-slate-700 mt-1">Slug para identificação do ícone</p>
              </div>

              <div>
                <label className="font-mono text-xs text-slate-500 block mb-2">Categoria *</label>
                <select value={editing.category ?? 'frontend'} onChange={e => set('category', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-violet-600/20 bg-slate-900/60 text-slate-300 text-sm focus:outline-none focus:border-violet-500 transition-colors">
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>

              <div>
                <label className="font-mono text-xs text-slate-500 block mb-2">Nível</label>
                <div className="flex gap-2">
                  {LEVELS.map(l => (
                    <button key={l.value} type="button" onClick={() => set('level', l.value)}
                      className={cn('flex-1 py-2 rounded-xl border font-mono text-xs transition-all',
                        editing.level === l.value ? l.color : 'border-slate-700 text-slate-500 hover:text-slate-300')}>
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-mono text-xs text-slate-500 block mb-2">Ordem</label>
                <input type="number" value={editing.order ?? 0} onChange={e => set('order', Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-violet-600/20 bg-slate-900/60 text-slate-300 font-mono text-sm focus:outline-none focus:border-violet-500 transition-colors" />
              </div>

              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-slate-500">Ativo</span>
                <button type="button" onClick={() => set('active', !editing.active)} className={`relative w-10 h-5 rounded-full transition-colors ${editing.active ? 'bg-violet-600' : 'bg-slate-700'}`}>
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${editing.active ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-violet-600/10 flex justify-end gap-3">
              <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-lg border border-slate-700 text-slate-400 text-sm hover:text-white transition-colors">Cancelar</button>
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 text-white text-sm hover:bg-violet-500 transition-colors disabled:opacity-50">
                {saving ? <><Loader2 size={14} className="animate-spin" />Salvando...</> : <><Save size={14} />Salvar</>}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog open={!!confirmId} title="Deletar Habilidade" description="Esta ação não pode ser desfeita." confirmText="Deletar" loading={deleting} onConfirm={handleDelete} onCancel={() => setConfirmId(null)} />
    </AdminShell>
  )
}