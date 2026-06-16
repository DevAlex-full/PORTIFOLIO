'use client'

// 📁 CAMINHO: app/admin/(protected)/certificados/page.tsx (CRIADO)

import { useState, useEffect, useCallback } from 'react'
import { AdminShell }          from '@/components/admin/AdminShell'
import { ConfirmDialog }       from '@/components/admin/ConfirmDialog'
import { MediaPicker }         from '@/components/admin/MediaPicker'
import { certificationService }from '@/services/admin.service'
import type { CertificationData } from '@/types/api'
import { toast } from 'sonner'
import { cn }   from '@/lib/utils'
import { Plus, Pencil, Trash2, X, Save, Award, Star, Loader2 } from 'lucide-react'

const EMPTY: Partial<CertificationData> = {
  title: '', institution: '', year: new Date().getFullYear(),
  hours: 0, tags: [], stars: 5, link: '', imageUrl: '',
  pdfUrl: '', inProgress: false, order: 0, active: true,
}

export default function CertificadosPage() {
  const [items,    setItems]    = useState<CertificationData[]>([])
  const [loading,  setLoading]  = useState(true)
  const [editing,  setEditing]  = useState<Partial<CertificationData> | null>(null)
  const [saving,   setSaving]   = useState(false)
  const [confirmId,setConfirmId]= useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [tagInput, setTagInput] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await certificationService.getAll()
      setItems(data)
    } catch { toast.error('Erro ao carregar certificados.') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  function openNew()             { setEditing({ ...EMPTY }); setTagInput('') }
  function openEdit(c: CertificationData) { setEditing({ ...c }); setTagInput('') }
  function close()               { setEditing(null); setTagInput('') }

  function set(key: keyof CertificationData, val: unknown) {
    setEditing(e => e ? { ...e, [key]: val } : null)
  }

  function addTag() {
    const v = tagInput.trim()
    if (!v || editing?.tags?.includes(v)) return
    set('tags', [...(editing?.tags ?? []), v])
    setTagInput('')
  }

  async function handleSave() {
    if (!editing?.title || !editing.institution || !editing.year) {
      toast.error('Título, instituição e ano são obrigatórios.')
      return
    }
    setSaving(true)
    try {
      if (editing.id) {
        const { data } = await certificationService.update(editing.id, editing)
        setItems(prev => prev.map(x => x.id === editing.id ? data : x))
        toast.success('Certificado atualizado!')
      } else {
        const { data } = await certificationService.create(editing)
        setItems(prev => [...prev, data])
        toast.success('Certificado criado!')
      }
      close()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
      toast.error(msg ?? 'Erro ao salvar.')
    } finally { setSaving(false) }
  }

  async function handleDelete() {
    if (!confirmId) return
    setDeleting(true)
    try {
      await certificationService.delete(confirmId)
      setItems(prev => prev.filter(x => x.id !== confirmId))
      toast.success('Certificado deletado.')
    } catch { toast.error('Erro ao deletar.') }
    finally { setDeleting(false); setConfirmId(null) }
  }

  return (
    <AdminShell title="Certificados">
      <div className="max-w-5xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="font-mono text-xs text-slate-600">{items.length} certificado{items.length !== 1 ? 's' : ''}</p>
          <button
            onClick={openNew}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition-colors"
          >
            <Plus size={15} /> Novo Certificado
          </button>
        </div>

        {/* List */}
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 size={24} className="text-violet-400 animate-spin" /></div>
        ) : (
          <div className="space-y-2">
            {items.map(cert => (
              <div key={cert.id} className={cn(
                'group flex items-center gap-4 p-4 rounded-xl border bg-[#0d0b18] transition-all',
                cert.active ? 'border-violet-600/15 hover:border-violet-500/25' : 'border-slate-800/60 opacity-60'
              )}>
                <div className="w-11 h-11 rounded-xl bg-violet-600/15 border border-violet-600/20 flex items-center justify-center flex-shrink-0">
                  <Award size={18} className="text-violet-400" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-display font-semibold text-white text-sm truncate">{cert.title}</p>
                    {cert.inProgress && (
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/25 whitespace-nowrap">
                        Em andamento
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-mono text-xs text-violet-400">{cert.institution}</span>
                    <span className="text-slate-700">•</span>
                    <span className="font-mono text-xs text-slate-600">{cert.year}</span>
                    {cert.hours > 0 && (
                      <><span className="text-slate-700">•</span>
                      <span className="font-mono text-xs text-slate-600">{cert.hours >= 1000 ? cert.hours.toLocaleString('pt-BR') : cert.hours}h</span></>
                    )}
                  </div>
                </div>

                {/* Stars */}
                <div className="hidden sm:flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={11} className={i < cert.stars ? 'text-violet-400 fill-violet-400' : 'text-slate-700'} />
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(cert)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-violet-400 hover:bg-violet-600/10 transition-colors">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => setConfirmId(cert.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={close} />
          <div className="relative w-full max-w-xl bg-[#0d0b18] border border-violet-600/20 rounded-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-5 border-b border-violet-600/10">
              <h3 className="font-display font-bold text-white">{editing.id ? 'Editar' : 'Novo'} Certificado</h3>
              <button onClick={close} className="text-slate-500 hover:text-white transition-colors"><X size={18} /></button>
            </div>

            <div className="p-6 space-y-5">
              <F label="Título *"><I value={editing.title ?? ''} onChange={v => set('title', v)} placeholder="Nome do curso/certificação" /></F>
              <div className="grid grid-cols-2 gap-4">
                <F label="Instituição *"><I value={editing.institution ?? ''} onChange={v => set('institution', v)} placeholder="DevQuest, DIO..." /></F>
                <F label="Ano *">
                  <input type="number" value={editing.year ?? ''} onChange={e => set('year', Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-violet-600/20 bg-slate-900/60 text-slate-300 font-mono text-sm focus:outline-none focus:border-violet-500 transition-colors" />
                </F>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <F label="Horas">
                  <input type="number" value={editing.hours ?? 0} onChange={e => set('hours', Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-violet-600/20 bg-slate-900/60 text-slate-300 font-mono text-sm focus:outline-none focus:border-violet-500 transition-colors" />
                </F>
                <F label="Estrelas">
                  <div className="flex items-center gap-1 mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <button key={i} type="button" onClick={() => set('stars', i + 1)}>
                        <Star size={20} className={(editing.stars ?? 5) > i ? 'text-violet-400 fill-violet-400' : 'text-slate-700'} />
                      </button>
                    ))}
                  </div>
                </F>
              </div>

              <F label="Tags">
                <div className="flex gap-2 mb-2">
                  <input value={tagInput} onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Node.js, TypeScript..."
                    className="flex-1 px-4 py-2.5 rounded-xl border border-violet-600/20 bg-slate-900/60 text-slate-300 placeholder-slate-700 font-mono text-xs focus:outline-none focus:border-violet-500 transition-colors" />
                  <button type="button" onClick={addTag} className="px-3 py-2.5 rounded-xl bg-violet-600/20 border border-violet-600/30 text-violet-300 hover:bg-violet-600/30 transition-colors"><Plus size={14} /></button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(editing.tags ?? []).map(t => (
                    <span key={t} className="flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-violet-600/15 border border-violet-600/20 text-violet-300 font-mono text-[11px]">
                      {t}<button type="button" onClick={() => set('tags', editing.tags!.filter(x => x !== t))}><X size={10} /></button>
                    </span>
                  ))}
                </div>
              </F>

              <F label="Link do Certificado"><I value={editing.link ?? ''} onChange={v => set('link', v)} placeholder="https://..." /></F>

              <MediaPicker value={editing.imageUrl ?? ''} onChange={url => set('imageUrl', url)} label="Imagem do Certificado" />

              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-slate-500">Em andamento</span>
                <Tog checked={editing.inProgress ?? false} onChange={v => set('inProgress', v)} />
              </div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-slate-500">Ativo</span>
                <Tog checked={editing.active ?? true} onChange={v => set('active', v)} />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-violet-600/10 flex justify-end gap-3">
              <button onClick={close} className="px-4 py-2 rounded-lg border border-slate-700 text-slate-400 text-sm hover:text-white transition-colors">Cancelar</button>
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 text-white text-sm hover:bg-violet-500 transition-colors disabled:opacity-50">
                {saving ? <><Loader2 size={14} className="animate-spin" />Salvando...</> : <><Save size={14} />Salvar</>}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog open={!!confirmId} title="Deletar Certificado" description="Esta ação não pode ser desfeita." confirmText="Deletar" loading={deleting} onConfirm={handleDelete} onCancel={() => setConfirmId(null)} />
    </AdminShell>
  )
}

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="font-mono text-xs text-slate-500 block mb-2">{label}</label>{children}</div>
}
function I({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full px-4 py-2.5 rounded-xl border border-violet-600/20 bg-slate-900/60 text-slate-300 placeholder-slate-700 text-sm focus:outline-none focus:border-violet-500 transition-colors" />
}
function Tog({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return <button type="button" onClick={() => onChange(!checked)} className={`relative w-10 h-5 rounded-full transition-colors ${checked ? 'bg-violet-600' : 'bg-slate-700'}`}><span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} /></button>
}