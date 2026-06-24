'use client'



import { useState, useEffect, useCallback } from 'react'
import { AdminShell }      from '@/components/admin/AdminShell'
import { ConfirmDialog }   from '@/components/admin/ConfirmDialog'
import { feedbackService } from '@/services/admin.service'
import type { FeedbackData } from '@/types/api'
import { toast } from 'sonner'
import { cn }   from '@/lib/utils'
import {
  Plus, Pencil, Trash2, X, Save, Star, MessageSquare, Loader2,
} from 'lucide-react'

const EMPTY: Partial<FeedbackData> = {
  clientName: '', clientRole: '', company: '', projectName: '',
  content: '', rating: 5, imageUrl: '', featured: false, active: true, order: 0,
}

function notifyStatsChanged() {
  window.dispatchEvent(new Event('admin:stats-refresh'))
}

export default function FeedbacksPage() {
  const [items,    setItems]    = useState<FeedbackData[]>([])
  const [loading,  setLoading]  = useState(true)
  const [editing,  setEditing]  = useState<Partial<FeedbackData> | null>(null)
  const [saving,   setSaving]   = useState(false)
  const [confirmId,setConfirmId]= useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await feedbackService.getAll()
      setItems(data)
    } catch { toast.error('Erro ao carregar feedbacks.') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  function openNew()              { setEditing({ ...EMPTY }) }
  function openEdit(f: FeedbackData) { setEditing({ ...f }) }
  function close()                { setEditing(null) }
  function set(key: keyof FeedbackData, val: unknown) {
    setEditing(e => e ? { ...e, [key]: val } : null)
  }

  async function handleSave() {
    if (!editing?.clientName || !editing.content) {
      toast.error('Nome do cliente e conteúdo são obrigatórios.')
      return
    }

    const payload = {
      clientName:  editing.clientName,
      clientRole:  editing.clientRole  || undefined,
      company:     editing.company     || undefined,
      projectName: editing.projectName || undefined,
      content:     editing.content,
      rating:      editing.rating      ?? 5,
      imageUrl:    editing.imageUrl    || undefined,
      featured:    editing.featured    ?? false,
      active:      editing.active      ?? true,
      order:       editing.order       ?? 0,
    }

    setSaving(true)
    try {
      if (editing.id) {
        const { data } = await feedbackService.update(editing.id, payload)
        setItems(prev => prev.map(x => x.id === editing.id ? data : x))
        toast.success('Feedback atualizado!')
      } else {
        const { data } = await feedbackService.create(payload)
        setItems(prev => [...prev, data])
        toast.success('Feedback criado!')
      }
      notifyStatsChanged()
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
      await feedbackService.delete(confirmId)
      setItems(prev => prev.filter(x => x.id !== confirmId))
      notifyStatsChanged()
      toast.success('Feedback deletado.')
    } catch { toast.error('Erro ao deletar.') }
    finally { setDeleting(false); setConfirmId(null) }
  }

  return (
    <AdminShell title="Feedbacks">
      <div className="max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="font-mono text-xs text-slate-600">{items.length} feedback{items.length !== 1 ? 's' : ''}</p>
          <button
            onClick={openNew}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition-colors"
          >
            <Plus size={15} /> Novo Feedback
          </button>
        </div>

        {/* List */}
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 size={24} className="text-violet-400 animate-spin" /></div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-violet-600/20 rounded-xl">
            <MessageSquare size={32} className="text-slate-700 mx-auto mb-3" />
            <p className="font-mono text-sm text-slate-600">Nenhum feedback cadastrado</p>
            <button onClick={openNew} className="mt-3 inline-block font-mono text-xs text-violet-400 hover:text-violet-300">
              Adicionar primeiro feedback →
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map(fb => (
              <div
                key={fb.id}
                className={cn(
                  'group p-5 rounded-xl border bg-[#0d0b18] transition-all',
                  fb.active
                    ? 'border-violet-600/15 hover:border-violet-500/25'
                    : 'border-slate-800/60 opacity-60'
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {fb.featured && <Star size={12} className="text-violet-400 fill-violet-400 flex-shrink-0" />}
                      <p className="font-display font-semibold text-white text-sm">{fb.clientName}</p>
                      {fb.clientRole && <span className="font-mono text-[10px] text-slate-600">• {fb.clientRole}</span>}
                      {fb.company    && <span className="font-mono text-[10px] text-slate-600">• {fb.company}</span>}
                    </div>

                    {/* Stars */}
                    <div className="flex gap-0.5 mb-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={11} className={i < fb.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'} />
                      ))}
                    </div>

                    {/* Content preview */}
                    <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">{fb.content}</p>

                    {fb.projectName && (
                      <p className="font-mono text-[10px] text-violet-400 mt-2">Projeto: {fb.projectName}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <button onClick={() => openEdit(fb)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-violet-400 hover:bg-violet-600/10 transition-colors">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => setConfirmId(fb.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={close} />
          <div className="relative w-full max-w-xl bg-[#0d0b18] border border-violet-600/20 rounded-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-violet-600/10">
              <h3 className="font-display font-bold text-white">{editing.id ? 'Editar' : 'Novo'} Feedback</h3>
              <button onClick={close} className="text-slate-500 hover:text-white transition-colors"><X size={18} /></button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <F label="Nome do Cliente *">
                  <I value={editing.clientName ?? ''} onChange={v => set('clientName', v)} placeholder="Débora Santiago" />
                </F>
                <F label="Cargo / Papel">
                  <I value={editing.clientRole ?? ''} onChange={v => set('clientRole', v)} placeholder="Fisioterapeuta" />
                </F>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <F label="Empresa / Segmento">
                  <I value={editing.company ?? ''} onChange={v => set('company', v)} placeholder="Saúde & Clínicas" />
                </F>
                <F label="Projeto">
                  <I value={editing.projectName ?? ''} onChange={v => set('projectName', v)} placeholder="Nome do projeto" />
                </F>
              </div>

              <F label="Depoimento *">
                <textarea
                  value={editing.content ?? ''}
                  onChange={e => set('content', e.target.value)}
                  rows={6}
                  placeholder="Texto do depoimento..."
                  className="w-full px-4 py-3 rounded-xl border border-violet-600/20 bg-slate-900/60 text-slate-300 placeholder-slate-700 text-sm focus:outline-none focus:border-violet-500 transition-colors resize-none"
                />
              </F>

              <F label="URL da Foto (opcional)">
                <I value={editing.imageUrl ?? ''} onChange={v => set('imageUrl', v)} placeholder="https://..." />
              </F>

              <div className="grid grid-cols-2 gap-4">
                <F label="Avaliação (1–5)">
                  <div className="flex gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map(n => (
                      <button key={n} type="button" onClick={() => set('rating', n)}>
                        <Star size={22} className={(editing.rating ?? 5) >= n ? 'text-amber-400 fill-amber-400' : 'text-slate-700'} />
                      </button>
                    ))}
                  </div>
                </F>
                <F label="Ordem">
                  <input type="number" value={editing.order ?? 0} onChange={e => set('order', Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-violet-600/20 bg-slate-900/60 text-slate-300 font-mono text-sm focus:outline-none focus:border-violet-500 transition-colors" />
                </F>
              </div>

              <div className="flex gap-6">
                <Tog label="Em Destaque" checked={editing.featured ?? false} onChange={v => set('featured', v)} />
                <Tog label="Ativo"       checked={editing.active   ?? true}  onChange={v => set('active',   v)} />
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

      <ConfirmDialog
        open={!!confirmId}
        title="Deletar Feedback"
        description="Esta ação não pode ser desfeita."
        confirmText="Deletar"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmId(null)}
      />
    </AdminShell>
  )
}

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="font-mono text-xs text-slate-500 block mb-2">{label}</label>{children}</div>
}
function I({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
    className="w-full px-4 py-2.5 rounded-xl border border-violet-600/20 bg-slate-900/60 text-slate-300 placeholder-slate-700 text-sm focus:outline-none focus:border-violet-500 transition-colors" />
}
function Tog({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center gap-3">
      <button type="button" onClick={() => onChange(!checked)} className={`relative w-10 h-5 rounded-full transition-colors ${checked ? 'bg-violet-600' : 'bg-slate-700'}`}>
        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
      <span className="font-mono text-xs text-slate-400">{label}</span>
    </div>
  )
}