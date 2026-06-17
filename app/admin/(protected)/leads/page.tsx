'use client'


import { useState, useEffect, useCallback } from 'react'
import { AdminShell }    from '@/components/admin/AdminShell'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { leadService }   from '@/services/admin.service'
import type { LeadData, LeadStatus } from '@/types/api'
import { toast } from 'sonner'
import { cn }   from '@/lib/utils'
import {
  Users, Loader2, Search, Trash2, Archive, Mail, Phone, Building2,
  Plus, X, Save, Pencil, Tag,
} from 'lucide-react'

const STATUS_OPTIONS: { value: LeadStatus | 'all'; label: string }[] = [
  { value: 'all',        label: 'Todos'      },
  { value: 'novo',       label: 'Novo'       },
  { value: 'em_contato', label: 'Em Contato' },
  { value: 'proposta',   label: 'Proposta'   },
  { value: 'convertido', label: 'Convertido' },
  { value: 'perdido',    label: 'Perdido'    },
]

const STATUS_COLORS: Record<string, string> = {
  novo:       'bg-violet-500/20 text-violet-300 border-violet-500/30',
  em_contato: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  proposta:   'bg-amber-500/20 text-amber-300 border-amber-500/30',
  convertido: 'bg-green-500/20 text-green-300 border-green-500/30',
  perdido:    'bg-red-500/20 text-red-300 border-red-500/30',
}

const EMPTY_LEAD: Partial<LeadData> = {
  name: '', email: '', phone: '', company: '', source: '', message: '', status: 'novo',
}

// Dispara o refresh global do contador (Sidebar/Header/Dashboard)
function notifyStatsChanged() {
  window.dispatchEvent(new Event('admin:stats-refresh'))
}

export default function LeadsPage() {
  const [leads,        setLeads]        = useState<LeadData[]>([])
  const [loading,       setLoading]      = useState(true)
  const [search,        setSearch]       = useState('')
  const [statusFilter,  setStatusFilter] = useState<LeadStatus | 'all'>('all')
  const [archived,      setArchived]     = useState(false)
  const [total,         setTotal]        = useState(0)
  const [confirmId,     setConfirmId]    = useState<string | null>(null)
  const [deleting,      setDeleting]     = useState(false)
  const [expanded,      setExpanded]     = useState<string | null>(null)

  // Estado do modal de criação/edição
  const [editing, setEditing] = useState<Partial<LeadData> | null>(null)
  const [saving,  setSaving]  = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await leadService.getAll({
        status:   statusFilter !== 'all' ? statusFilter : undefined,
        archived,
        search:   search || undefined,
        limit:    50,
      })
      setLeads(data.leads)
      setTotal(data.total)
    } catch { toast.error('Erro ao carregar leads.') }
    finally { setLoading(false) }
  }, [statusFilter, archived, search])

  useEffect(() => { load() }, [load])

  async function changeStatus(id: string, status: LeadStatus) {
    try {
      await leadService.updateStatus(id, status)
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l))
      notifyStatsChanged()
      toast.success('Status atualizado.')
    } catch { toast.error('Erro ao atualizar status.') }
  }

  async function archiveLead(id: string) {
    try {
      await leadService.archive(id, true)
      setLeads(prev => prev.filter(l => l.id !== id))
      setTotal(t => Math.max(0, t - 1))
      notifyStatsChanged()
      toast.success('Lead arquivado.')
    } catch { toast.error('Erro ao arquivar.') }
  }

  async function handleDelete() {
    if (!confirmId) return
    setDeleting(true)
    try {
      await leadService.delete(confirmId)
      setLeads(prev => prev.filter(l => l.id !== confirmId))
      setTotal(t => Math.max(0, t - 1))
      notifyStatsChanged()
      toast.success('Lead deletado.')
    } catch { toast.error('Erro ao deletar.') }
    finally { setDeleting(false); setConfirmId(null) }
  }

  // ── Modal: abrir para criar / editar ─────────────────────────
  function openNew()              { setEditing({ ...EMPTY_LEAD }) }
  function openEdit(lead: LeadData) { setEditing({ ...lead }) }
  function closeModal()           { setEditing(null) }

  function setField(key: keyof LeadData, value: unknown) {
    setEditing(e => e ? { ...e, [key]: value } : null)
  }

  async function handleSave() {
    if (!editing?.name || !editing.email) {
      toast.error('Nome e email são obrigatórios.')
      return
    }

    // Envia apenas os campos editáveis — nunca id/createdAt/updatedAt/archived,
    // que vêm junto quando "editing" é populado a partir de um lead existente
    // (openEdit faz {...lead}) e quebrariam o Prisma.lead.update em runtime.
    const payload = {
      name:    editing.name,
      email:   editing.email,
      phone:   editing.phone    || undefined,
      company: editing.company  || undefined,
      source:  editing.source   || undefined,
      message: editing.message  || undefined,
      status:  editing.status,
    }

    setSaving(true)
    try {
      if (editing.id) {
        const { data } = await leadService.update(editing.id, payload)
        setLeads(prev => prev.map(l => l.id === editing.id ? data : l))
        toast.success('Lead atualizado!')
      } else {
        const { data } = await leadService.create(payload)
        setLeads(prev => [data.lead, ...prev])
        setTotal(t => t + 1)
        toast.success('Lead criado!')
      }
      notifyStatsChanged()
      closeModal()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
      toast.error(msg ?? 'Erro ao salvar lead.')
    } finally { setSaving(false) }
  }

  return (
    <AdminShell title="Leads">
      <div className="max-w-5xl space-y-6">
        {/* Toolbar */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar por nome, email ou empresa..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-violet-600/20 bg-[#0d0b18] text-slate-300 placeholder-slate-600 font-mono text-xs focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>
          <button
            onClick={() => setArchived(!archived)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-mono transition-colors',
              archived
                ? 'bg-amber-500/20 border-amber-500/30 text-amber-300'
                : 'border-slate-700 text-slate-500 hover:text-slate-200'
            )}
          >
            <Archive size={14} />
            {archived ? 'Arquivados' : 'Ativos'}
          </button>
          <button
            onClick={openNew}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition-colors"
          >
            <Plus size={15} /> Novo Lead
          </button>
        </div>

        {/* Status filters */}
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setStatusFilter(opt.value)}
              className={cn(
                'font-mono text-xs px-3 py-1.5 rounded-lg border transition-all',
                statusFilter === opt.value
                  ? 'bg-violet-600 border-violet-500 text-white'
                  : 'border-slate-700/60 text-slate-500 hover:text-slate-300'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <p className="font-mono text-xs text-slate-600">{total} lead{total !== 1 ? 's' : ''}</p>

        {/* List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={24} className="text-violet-400 animate-spin" />
          </div>
        ) : leads.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-violet-600/20 rounded-xl">
            <Users size={32} className="text-slate-700 mx-auto mb-3" />
            <p className="font-mono text-sm text-slate-600">Nenhum lead encontrado</p>
            <button onClick={openNew} className="mt-3 inline-block font-mono text-xs text-violet-400 hover:text-violet-300">
              Cadastrar primeiro lead →
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {leads.map(lead => (
              <div key={lead.id} className="bg-[#0d0b18] border border-violet-600/10 rounded-xl overflow-hidden">
                {/* Row */}
                <div
                  className="flex items-center gap-4 p-4 cursor-pointer hover:bg-violet-600/5 transition-colors"
                  onClick={() => setExpanded(expanded === lead.id ? null : lead.id)}
                >
                  <div className="w-9 h-9 rounded-full bg-violet-600/20 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="font-display font-bold text-violet-300 text-sm">
                      {lead.name[0].toUpperCase()}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-display font-semibold text-white text-sm">{lead.name}</p>
                      {lead.company && (
                        <span className="font-mono text-[10px] text-slate-600">• {lead.company}</span>
                      )}
                    </div>
                    <p className="font-mono text-[10px] text-slate-500">{lead.email}</p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={cn(
                      'font-mono text-[10px] px-2 py-1 rounded-full border',
                      STATUS_COLORS[lead.status] ?? 'bg-slate-700 text-slate-400 border-slate-600'
                    )}>
                      {STATUS_OPTIONS.find(s => s.value === lead.status)?.label ?? lead.status}
                    </span>
                    <p className="font-mono text-[10px] text-slate-700 hidden sm:block">
                      {new Date(lead.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>

                {/* Expanded */}
                {expanded === lead.id && (
                  <div className="border-t border-violet-600/10 p-4 space-y-4 bg-slate-900/20">
                    {/* Contact info */}
                    <div className="grid sm:grid-cols-4 gap-3">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Mail size={13} className="text-slate-600" />
                        <a href={`mailto:${lead.email}`} className="font-mono text-xs hover:text-violet-300 transition-colors">
                          {lead.email}
                        </a>
                      </div>
                      {lead.phone && (
                        <div className="flex items-center gap-2 text-slate-400">
                          <Phone size={13} className="text-slate-600" />
                          <a href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="font-mono text-xs hover:text-violet-300 transition-colors">
                            {lead.phone}
                          </a>
                        </div>
                      )}
                      {lead.company && (
                        <div className="flex items-center gap-2 text-slate-400">
                          <Building2 size={13} className="text-slate-600" />
                          <span className="font-mono text-xs">{lead.company}</span>
                        </div>
                      )}
                      {lead.source && (
                        <div className="flex items-center gap-2 text-slate-400">
                          <Tag size={13} className="text-slate-600" />
                          <span className="font-mono text-xs">{lead.source}</span>
                        </div>
                      )}
                    </div>

                    {lead.message && (
                      <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/40">
                        <p className="font-mono text-xs text-slate-500 mb-1">Observações</p>
                        <p className="text-slate-300 text-sm leading-relaxed">{lead.message}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <p className="font-mono text-xs text-slate-600">Alterar status:</p>
                      {(['novo','em_contato','proposta','convertido','perdido'] as LeadStatus[]).map(s => (
                        <button
                          key={s}
                          onClick={() => changeStatus(lead.id, s)}
                          disabled={lead.status === s}
                          className={cn(
                            'font-mono text-[10px] px-2.5 py-1 rounded-full border transition-all',
                            lead.status === s
                              ? (STATUS_COLORS[s] ?? 'bg-slate-700 border-slate-600 text-slate-300')
                              : 'border-slate-700 text-slate-500 hover:text-slate-300 hover:border-slate-600'
                          )}
                        >
                          {STATUS_OPTIONS.find(o => o.value === s)?.label}
                        </button>
                      ))}

                      <div className="ml-auto flex items-center gap-2">
                        <button
                          onClick={() => openEdit(lead)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-500 hover:text-violet-400 hover:border-violet-500/30 text-xs transition-colors"
                        >
                          <Pencil size={12} /> Editar
                        </button>
                        {!archived && (
                          <button
                            onClick={() => archiveLead(lead.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-500 hover:text-amber-400 hover:border-amber-500/30 text-xs transition-colors"
                          >
                            <Archive size={12} /> Arquivar
                          </button>
                        )}
                        <button
                          onClick={() => setConfirmId(lead.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-500 hover:text-red-400 hover:border-red-500/30 text-xs transition-colors"
                        >
                          <Trash2 size={12} /> Deletar
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal: criar / editar lead */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative w-full max-w-lg bg-[#0d0b18] border border-violet-600/20 rounded-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-violet-600/10">
              <h3 className="font-display font-bold text-white">
                {editing.id ? 'Editar Lead' : 'Novo Lead'}
              </h3>
              <button onClick={closeModal} className="text-slate-500 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-xs text-slate-500 block mb-2">Nome *</label>
                  <input
                    type="text"
                    value={editing.name ?? ''}
                    onChange={e => setField('name', e.target.value)}
                    placeholder="Nome completo"
                    className="w-full px-4 py-2.5 rounded-xl border border-violet-600/20 bg-slate-900/60 text-slate-300 placeholder-slate-700 text-sm focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="font-mono text-xs text-slate-500 block mb-2">Empresa</label>
                  <input
                    type="text"
                    value={editing.company ?? ''}
                    onChange={e => setField('company', e.target.value)}
                    placeholder="Nome da empresa"
                    className="w-full px-4 py-2.5 rounded-xl border border-violet-600/20 bg-slate-900/60 text-slate-300 placeholder-slate-700 text-sm focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-xs text-slate-500 block mb-2">Email *</label>
                  <input
                    type="email"
                    value={editing.email ?? ''}
                    onChange={e => setField('email', e.target.value)}
                    placeholder="email@exemplo.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-violet-600/20 bg-slate-900/60 text-slate-300 placeholder-slate-700 text-sm focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="font-mono text-xs text-slate-500 block mb-2">WhatsApp</label>
                  <input
                    type="text"
                    value={editing.phone ?? ''}
                    onChange={e => setField('phone', e.target.value)}
                    placeholder="5511999999999"
                    className="w-full px-4 py-2.5 rounded-xl border border-violet-600/20 bg-slate-900/60 text-slate-300 placeholder-slate-700 font-mono text-xs focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-xs text-slate-500 block mb-2">Origem</label>
                  <input
                    type="text"
                    value={editing.source ?? ''}
                    onChange={e => setField('source', e.target.value)}
                    placeholder="WhatsApp, Indicação, LinkedIn..."
                    className="w-full px-4 py-2.5 rounded-xl border border-violet-600/20 bg-slate-900/60 text-slate-300 placeholder-slate-700 text-sm focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="font-mono text-xs text-slate-500 block mb-2">Status</label>
                  <select
                    value={editing.status ?? 'novo'}
                    onChange={e => setField('status', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-violet-600/20 bg-slate-900/60 text-slate-300 text-sm focus:outline-none focus:border-violet-500 transition-colors"
                  >
                    {STATUS_OPTIONS.filter(s => s.value !== 'all').map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-mono text-xs text-slate-500 block mb-2">Observações</label>
                <textarea
                  value={editing.message ?? ''}
                  onChange={e => setField('message', e.target.value)}
                  rows={3}
                  placeholder="Notas sobre o lead, contexto da conversa..."
                  className="w-full px-4 py-3 rounded-xl border border-violet-600/20 bg-slate-900/60 text-slate-300 placeholder-slate-700 text-sm focus:outline-none focus:border-violet-500 transition-colors resize-none"
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-violet-600/10 flex justify-end gap-3">
              <button onClick={closeModal} className="px-4 py-2 rounded-lg border border-slate-700 text-slate-400 text-sm hover:text-white transition-colors">
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 text-white text-sm hover:bg-violet-500 transition-colors disabled:opacity-50"
              >
                {saving ? <><Loader2 size={14} className="animate-spin" />Salvando...</> : <><Save size={14} />Salvar</>}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!confirmId}
        title="Deletar Lead"
        description="Esta ação não pode ser desfeita."
        confirmText="Deletar"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmId(null)}
      />
    </AdminShell>
  )
}