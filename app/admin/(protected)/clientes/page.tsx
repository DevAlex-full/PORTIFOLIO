'use client'

// 📁 CAMINHO: app/admin/(protected)/clientes/page.tsx (CRIADO)
// CORREÇÃO 1: módulo Clientes completo no Admin — CRUD, destaque, ordem,
// ativo/inativo, upload de imagens (reaproveitando MultiImageUpload),
// tecnologias, segmento, descrição e links. Segue o mesmo padrão visual
// e de interação já usado em Certificados/Serviços.

import { useState, useEffect, useCallback } from 'react'
import { AdminShell }        from '@/components/admin/AdminShell'
import { ConfirmDialog }     from '@/components/admin/ConfirmDialog'
import { MultiImageUpload }  from '@/components/admin/MultiImageUpload'
import { clientService }     from '@/services/admin.service'
import type { ClientData }   from '@/types/api'
import { toast } from 'sonner'
import { cn }   from '@/lib/utils'
import {
  Plus, Pencil, Trash2, X, Save, Building2, Star, Loader2, ExternalLink, Github,
} from 'lucide-react'

const EMPTY: Partial<ClientData> = {
  name: '', subtitle: '', segment: '', description: '',
  images: [], technologies: [], metrics: [],
  linkDemo: '', linkGithub: '', featured: false, order: 0, active: true,
}

function notifyStatsChanged() {
  window.dispatchEvent(new Event('admin:stats-refresh'))
}

export default function ClientesPage() {
  const [items,    setItems]    = useState<ClientData[]>([])
  const [loading,  setLoading]  = useState(true)
  const [editing,  setEditing]  = useState<Partial<ClientData> | null>(null)
  const [saving,   setSaving]   = useState(false)
  const [confirmId,setConfirmId]= useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [techInput,setTechInput]= useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await clientService.getAll()
      setItems(data)
    } catch { toast.error('Erro ao carregar clientes.') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  function openNew()  { setEditing({ ...EMPTY }); setTechInput('') }
  function openEdit(c: ClientData) { setEditing({ ...c }); setTechInput('') }
  function close()    { setEditing(null); setTechInput('') }

  function set(key: keyof ClientData, val: unknown) {
    setEditing(e => e ? { ...e, [key]: val } : null)
  }

  function addTech() {
    const v = techInput.trim()
    if (!v || editing?.technologies?.includes(v)) return
    set('technologies', [...(editing?.technologies ?? []), v])
    setTechInput('')
  }

  async function toggleActive(c: ClientData) {
    try {
      await clientService.update(c.id, { active: !c.active })
      setItems(prev => prev.map(x => x.id === c.id ? { ...x, active: !x.active } : x))
      notifyStatsChanged()
      toast.success(`Cliente ${!c.active ? 'ativado' : 'desativado'}.`)
    } catch { toast.error('Erro ao atualizar status.') }
  }

  async function handleSave() {
    if (!editing?.name) {
      toast.error('Nome é obrigatório.')
      return
    }
    setSaving(true)
    try {
      const payload = {
        name:         editing.name,
        subtitle:     editing.subtitle     || undefined,
        segment:      editing.segment      || undefined,
        description:  editing.description  || '',
        image:        editing.images?.[0]?.src ?? null,
        images:       editing.images       ?? [],
        technologies: editing.technologies ?? [],
        metrics:      editing.metrics      ?? [],
        linkDemo:     editing.linkDemo     || undefined,
        linkGithub:   editing.linkGithub   || undefined,
        featured:     editing.featured     ?? false,
        order:        editing.order        ?? 0,
        active:       editing.active       ?? true,
      }

      if (editing.id) {
        const { data } = await clientService.update(editing.id, payload)
        setItems(prev => prev.map(x => x.id === editing.id ? data : x))
        toast.success('Cliente atualizado!')
      } else {
        const { data } = await clientService.create(payload)
        setItems(prev => [...prev, data])
        toast.success('Cliente criado!')
      }
      notifyStatsChanged()
      close()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
      toast.error(msg ?? 'Erro ao salvar cliente.')
    } finally { setSaving(false) }
  }

  async function handleDelete() {
    if (!confirmId) return
    setDeleting(true)
    try {
      await clientService.delete(confirmId)
      setItems(prev => prev.filter(x => x.id !== confirmId))
      notifyStatsChanged()
      toast.success('Cliente deletado.')
    } catch { toast.error('Erro ao deletar.') }
    finally { setDeleting(false); setConfirmId(null) }
  }

  return (
    <AdminShell title="Clientes">
      <div className="max-w-5xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="font-mono text-xs text-slate-600">{items.length} cliente{items.length !== 1 ? 's' : ''}</p>
          <button
            onClick={openNew}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition-colors"
          >
            <Plus size={15} /> Novo Cliente
          </button>
        </div>

        {/* List */}
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 size={24} className="text-violet-400 animate-spin" /></div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-violet-600/20 rounded-xl">
            <Building2 size={32} className="text-slate-700 mx-auto mb-3" />
            <p className="font-mono text-sm text-slate-600">Nenhum cliente cadastrado ainda</p>
            <button onClick={openNew} className="mt-3 inline-block font-mono text-xs text-violet-400 hover:text-violet-300">
              Cadastrar primeiro cliente →
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map(client => (
              <div
                key={client.id}
                className={cn(
                  'group flex items-center gap-4 p-4 rounded-xl border bg-[#0d0b18] transition-all duration-200',
                  client.active
                    ? 'border-violet-600/15 hover:border-violet-500/30'
                    : 'border-slate-800/60 opacity-60 hover:opacity-80'
                )}
              >
                {/* Thumb */}
                <div className="w-14 h-14 rounded-lg bg-slate-800 border border-slate-700 overflow-hidden flex-shrink-0">
                  {client.image ? (
                    <img src={client.image} alt={client.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building2 size={20} className="text-slate-600" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {client.featured && <Star size={11} className="text-violet-400 fill-violet-400 flex-shrink-0" />}
                    <p className="font-display font-semibold text-white text-sm truncate">{client.name}</p>
                    {client.segment && (
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-400 border border-cyan-500/20 whitespace-nowrap">
                        {client.segment}
                      </span>
                    )}
                  </div>
                  {client.subtitle && (
                    <p className="font-mono text-[10px] text-slate-600 truncate max-w-sm">{client.subtitle}</p>
                  )}
                  {client.technologies.length > 0 && (
                    <div className="flex gap-1 mt-1.5 flex-wrap">
                      {client.technologies.slice(0, 4).map(t => (
                        <span key={t} className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-500">
                          {t}
                        </span>
                      ))}
                      {client.technologies.length > 4 && (
                        <span className="font-mono text-[9px] text-slate-600">+{client.technologies.length - 4}</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  {client.linkDemo && (
                    <a href={client.linkDemo} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition-colors">
                      <ExternalLink size={14} />
                    </a>
                  )}
                  {client.linkGithub && (
                    <a href={client.linkGithub} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition-colors">
                      <Github size={14} />
                    </a>
                  )}
                  <button
                    onClick={() => toggleActive(client)}
                    className="px-2.5 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition-colors font-mono text-[10px]"
                    title={client.active ? 'Desativar' : 'Ativar'}
                  >
                    {client.active ? 'Ativo' : 'Inativo'}
                  </button>
                  <button onClick={() => openEdit(client)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-violet-400 hover:bg-violet-600/10 transition-colors">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => setConfirmId(client.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                    <Trash2 size={14} />
                  </button>
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
          <div className="relative w-full max-w-xl bg-[#0d0b18] border border-violet-600/20 rounded-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-5 border-b border-violet-600/10">
              <h3 className="font-display font-bold text-white">{editing.id ? 'Editar' : 'Novo'} Cliente</h3>
              <button onClick={close} className="text-slate-500 hover:text-white transition-colors"><X size={18} /></button>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <F label="Nome *"><I value={editing.name ?? ''} onChange={v => set('name', v)} placeholder="BarberFlow" /></F>
                <F label="Segmento"><I value={editing.segment ?? ''} onChange={v => set('segment', v)} placeholder="Barbearias & Salões" /></F>
              </div>

              <F label="Subtítulo"><I value={editing.subtitle ?? ''} onChange={v => set('subtitle', v)} placeholder="SaaS Multi-tenant para Barbearias" /></F>

              <F label="Descrição">
                <textarea
                  value={editing.description ?? ''}
                  onChange={e => set('description', e.target.value)}
                  rows={3}
                  placeholder="Descreva o case..."
                  className="w-full px-4 py-3 rounded-xl border border-violet-600/20 bg-slate-900/60 text-slate-300 placeholder-slate-700 text-sm focus:outline-none focus:border-violet-500 transition-colors resize-none"
                />
              </F>

              <F label="Tecnologias">
                <div className="flex gap-2 mb-2">
                  <input value={techInput} onChange={e => setTechInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTech())}
                    placeholder="Next.js, Node.js..."
                    className="flex-1 px-4 py-2.5 rounded-xl border border-violet-600/20 bg-slate-900/60 text-slate-300 placeholder-slate-700 font-mono text-xs focus:outline-none focus:border-violet-500 transition-colors" />
                  <button type="button" onClick={addTech} className="px-3 py-2.5 rounded-xl bg-violet-600/20 border border-violet-600/30 text-violet-300 hover:bg-violet-600/30 transition-colors"><Plus size={14} /></button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(editing.technologies ?? []).map(t => (
                    <span key={t} className="flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-violet-600/15 border border-violet-600/20 text-violet-300 font-mono text-[11px]">
                      {t}<button type="button" onClick={() => set('technologies', editing.technologies!.filter(x => x !== t))}><X size={10} /></button>
                    </span>
                  ))}
                </div>
              </F>

              <div className="grid grid-cols-2 gap-4">
                <F label="Link Demo"><I value={editing.linkDemo ?? ''} onChange={v => set('linkDemo', v)} placeholder="https://..." /></F>
                <F label="Link GitHub"><I value={editing.linkGithub ?? ''} onChange={v => set('linkGithub', v)} placeholder="https://github.com/..." /></F>
              </div>

              <MultiImageUpload
                images={editing.images ?? []}
                onChange={images => set('images', images)}
                maxImages={3}
                label="Imagens"
              />

              <div className="grid grid-cols-2 gap-4">
                <F label="Ordem">
                  <input type="number" value={editing.order ?? 0} onChange={e => set('order', Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-violet-600/20 bg-slate-900/60 text-slate-300 font-mono text-sm focus:outline-none focus:border-violet-500 transition-colors" />
                </F>
                <div className="flex flex-col gap-3 justify-center">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-slate-500">Em destaque</span>
                    <Tog checked={editing.featured ?? false} onChange={v => set('featured', v)} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-slate-500">Ativo</span>
                    <Tog checked={editing.active ?? true} onChange={v => set('active', v)} />
                  </div>
                </div>
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
        title="Deletar Cliente"
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
  return <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full px-4 py-2.5 rounded-xl border border-violet-600/20 bg-slate-900/60 text-slate-300 placeholder-slate-700 text-sm focus:outline-none focus:border-violet-500 transition-colors" />
}
function Tog({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return <button type="button" onClick={() => onChange(!checked)} className={`relative w-10 h-5 rounded-full transition-colors ${checked ? 'bg-violet-600' : 'bg-slate-700'}`}><span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} /></button>
}