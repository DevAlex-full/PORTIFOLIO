'use client'

// 📁 CAMINHO: app/admin/(protected)/leads/page.tsx (CRIADO)

import { useState, useEffect, useCallback } from 'react'
import { AdminShell }    from '@/components/admin/AdminShell'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { leadService }   from '@/services/admin.service'
import type { LeadData, LeadStatus } from '@/types/api'
import { toast } from 'sonner'
import { cn }   from '@/lib/utils'
import { Users, Loader2, Search, Trash2, Archive, Mail, Phone, Building2 } from 'lucide-react'

const STATUS_OPTIONS: { value: LeadStatus | 'all'; label: string }[] = [
  { value: 'all',        label: 'Todos'           },
  { value: 'novo',       label: 'Novo'            },
  { value: 'em_contato', label: 'Em Contato'      },
  { value: 'proposta',   label: 'Proposta'        },
  { value: 'convertido', label: 'Convertido'      },
  { value: 'perdido',    label: 'Perdido'         },
]

const STATUS_COLORS: Record<string, string> = {
  novo:       'bg-violet-500/20 text-violet-300 border-violet-500/30',
  em_contato: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  proposta:   'bg-amber-500/20 text-amber-300 border-amber-500/30',
  convertido: 'bg-green-500/20 text-green-300 border-green-500/30',
  perdido:    'bg-red-500/20 text-red-300 border-red-500/30',
}

export default function LeadsPage() {
  const [leads,       setLeads]       = useState<LeadData[]>([])
  const [loading,     setLoading]     = useState(true)
  const [search,      setSearch]      = useState('')
  const [statusFilter,setStatusFilter]= useState<LeadStatus | 'all'>('all')
  const [archived,    setArchived]    = useState(false)
  const [total,       setTotal]       = useState(0)
  const [confirmId,   setConfirmId]   = useState<string | null>(null)
  const [deleting,    setDeleting]    = useState(false)
  const [expanded,    setExpanded]    = useState<string | null>(null)

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
      toast.success('Status atualizado.')
    } catch { toast.error('Erro ao atualizar status.') }
  }

  async function archiveLead(id: string) {
    try {
      await leadService.archive(id, true)
      setLeads(prev => prev.filter(l => l.id !== id))
      toast.success('Lead arquivado.')
    } catch { toast.error('Erro ao arquivar.') }
  }

  async function handleDelete() {
    if (!confirmId) return
    setDeleting(true)
    try {
      await leadService.delete(confirmId)
      setLeads(prev => prev.filter(l => l.id !== confirmId))
      toast.success('Lead deletado.')
    } catch { toast.error('Erro ao deletar.') }
    finally { setDeleting(false); setConfirmId(null) }
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
                    <div className="grid sm:grid-cols-3 gap-3">
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
                    </div>

                    {lead.message && (
                      <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/40">
                        <p className="font-mono text-xs text-slate-500 mb-1">Mensagem</p>
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