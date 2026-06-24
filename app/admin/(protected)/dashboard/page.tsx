'use client'


import { useState, useEffect } from 'react'
import { AdminShell }          from '@/components/admin/AdminShell'
import { dashboardService }    from '@/services/admin.service'
import type { DashboardStats } from '@/types/api'
import {
  FolderKanban, Award, Zap, Briefcase, Image, Users, Building2, MessageSquare,
  Star, ArrowUpRight, Loader2, Clock,
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const LEAD_STATUS_LABELS: Record<string, string> = {
  novo:        'Novo',
  em_contato:  'Em Contato',
  proposta:    'Proposta',
  convertido:  'Convertido',
  perdido:     'Perdido',
}

const LEAD_STATUS_COLORS: Record<string, string> = {
  novo:       'bg-violet-500/20 text-violet-300 border-violet-500/30',
  em_contato: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  proposta:   'bg-amber-500/20 text-amber-300 border-amber-500/30',
  convertido: 'bg-green-500/20 text-green-300 border-green-500/30',
  perdido:    'bg-red-500/20 text-red-300 border-red-500/30',
}

export default function DashboardPage() {
  const [stats,   setStats]   = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dashboardService.getStats()
      .then(r => setStats(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const statCards = stats ? [
    { label: 'Projetos',       value: stats.totals.projects,       icon: FolderKanban, href: '/admin/projetos',     color: 'violet' },
    { label: 'Clientes',       value: stats.totals.clients,        icon: Building2,    href: '/admin/clientes',     color: 'cyan'   },
    { label: 'Feedbacks',      value: stats.totals.feedbacks,      icon: MessageSquare,href: '/admin/feedbacks',    color: 'violet' },
    { label: 'Certificações',  value: stats.totals.certifications, icon: Award,        href: '/admin/certificados', color: 'cyan'   },
    { label: 'Habilidades',    value: stats.totals.skills,         icon: Zap,          href: '/admin/habilidades',  color: 'violet' },
    { label: 'Serviços',       value: stats.totals.services,       icon: Briefcase,    href: '/admin/servicos',     color: 'cyan'   },
    { label: 'Mídias',         value: stats.totals.media,          icon: Image,        href: '/admin/midias',       color: 'violet' },
    { label: 'Leads',          value: stats.totals.leads,          icon: Users,        href: '/admin/leads',        color: 'cyan'   },
  ] : []

  return (
    <AdminShell title="Dashboard">
      {loading ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 size={28} className="text-violet-400 animate-spin" />
        </div>
      ) : (
        <div className="space-y-8 max-w-7xl">

          {/* Stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {statCards.map(({ label, value, icon: Icon, href, color }) => (
              <Link
                key={label}
                href={href}
                className={cn(
                  'group p-5 rounded-xl border bg-[#0d0b18] hover:border-violet-500/40 transition-all duration-300 hover:-translate-y-0.5',
                  color === 'violet' ? 'border-violet-600/20' : 'border-slate-700/40'
                )}
              >
                <div className={cn(
                  'w-9 h-9 rounded-lg flex items-center justify-center mb-3',
                  color === 'violet'
                    ? 'bg-violet-600/20 border border-violet-600/20'
                    : 'bg-slate-800 border border-slate-700'
                )}>
                  <Icon size={16} className={color === 'violet' ? 'text-violet-400' : 'text-slate-400'} />
                </div>
                <p className="font-display font-bold text-white text-2xl">{value}</p>
                <p className="font-mono text-[10px] text-slate-500 mt-0.5">{label}</p>
              </Link>
            ))}
          </div>

          {/* Leads novos badge */}
          {stats && stats.totals.newLeads > 0 && (
            <Link
              href="/admin/leads"
              className="flex items-center gap-4 p-4 rounded-xl border border-violet-500/30 bg-violet-600/10 hover:bg-violet-600/15 transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-violet-600/30 border border-violet-500/40 flex items-center justify-center flex-shrink-0">
                <Users size={16} className="text-violet-300" />
              </div>
              <div className="flex-1">
                <p className="font-display font-semibold text-white text-sm">
                  {stats.totals.newLeads} lead{stats.totals.newLeads > 1 ? 's' : ''} novo{stats.totals.newLeads > 1 ? 's' : ''}
                </p>
                <p className="font-mono text-xs text-slate-500">Aguardando atendimento</p>
              </div>
              <ArrowUpRight size={16} className="text-violet-400" />
            </Link>
          )}

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Projetos recentes */}
            <div className="bg-[#0d0b18] border border-violet-600/15 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-violet-600/10">
                <div className="flex items-center gap-2">
                  <FolderKanban size={15} className="text-violet-400" />
                  <h3 className="font-display font-semibold text-white text-sm">Projetos Recentes</h3>
                </div>
                <Link href="/admin/projetos" className="font-mono text-xs text-violet-400 hover:text-violet-300 transition-colors">
                  Ver todos →
                </Link>
              </div>
              <div className="divide-y divide-violet-600/5">
                {stats?.recentProjects.map(p => (
                  <Link
                    key={p.id}
                    href={`/admin/projetos/${p.id}`}
                    className="flex items-center justify-between px-5 py-3.5 hover:bg-violet-600/5 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      {p.featured && <Star size={12} className="text-violet-400 fill-violet-400 flex-shrink-0" />}
                      <p className="font-body text-sm text-slate-300 group-hover:text-white transition-colors truncate max-w-[180px]">
                        {p.title}
                      </p>
                    </div>
                    <p className="font-mono text-[10px] text-slate-600 flex-shrink-0">
                      {new Date(p.updatedAt).toLocaleDateString('pt-BR')}
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Leads recentes */}
            <div className="bg-[#0d0b18] border border-violet-600/15 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-violet-600/10">
                <div className="flex items-center gap-2">
                  <MessageSquare size={15} className="text-violet-400" />
                  <h3 className="font-display font-semibold text-white text-sm">Leads Recentes</h3>
                </div>
                <Link href="/admin/leads" className="font-mono text-xs text-violet-400 hover:text-violet-300 transition-colors">
                  Ver todos →
                </Link>
              </div>
              <div className="divide-y divide-violet-600/5">
                {stats?.recentLeads.length === 0 && (
                  <div className="px-5 py-8 text-center">
                    <Users size={24} className="text-slate-700 mx-auto mb-2" />
                    <p className="font-mono text-xs text-slate-600">Nenhum lead ainda</p>
                  </div>
                )}
                {stats?.recentLeads.map(lead => (
                  <Link
                    key={lead.id}
                    href="/admin/leads"
                    className="flex items-center justify-between px-5 py-3.5 hover:bg-violet-600/5 transition-colors group"
                  >
                    <div>
                      <p className="font-body text-sm text-slate-300 group-hover:text-white transition-colors">{lead.name}</p>
                      <p className="font-mono text-[10px] text-slate-600">{lead.email}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={cn(
                        'font-mono text-[10px] px-2 py-0.5 rounded-full border',
                        LEAD_STATUS_COLORS[lead.status] ?? 'bg-slate-700 text-slate-400 border-slate-600'
                      )}>
                        {LEAD_STATUS_LABELS[lead.status] ?? lead.status}
                      </span>
                      <Clock size={10} className="text-slate-700" />
                      <p className="font-mono text-[10px] text-slate-600">
                        {new Date(lead.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Atalhos rápidos */}
          <div>
            <h3 className="font-display font-semibold text-white text-sm mb-4">Atalhos Rápidos</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Novo Projeto',     href: '/admin/projetos/novo',  icon: FolderKanban },
                { label: 'Novo Cliente',     href: '/admin/clientes',       icon: Building2    },
                { label: 'Upload de Mídia',  href: '/admin/midias',         icon: Image        },
                { label: 'Ver Leads',        href: '/admin/leads',          icon: MessageSquare},
              ].map(({ label, href, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-700/40 bg-[#0d0b18] hover:border-violet-500/40 hover:bg-violet-600/5 transition-all group"
                >
                  <Icon size={14} className="text-slate-500 group-hover:text-violet-400 transition-colors" />
                  <span className="font-body text-sm text-slate-400 group-hover:text-white transition-colors">{label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  )
}