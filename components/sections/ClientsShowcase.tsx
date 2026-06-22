'use client'


import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, ArrowRight, ExternalLink, Github,
  Scissors, Scale, UtensilsCrossed, ShoppingCart, Building2, Stethoscope,
  Lock, Loader2,
} from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { getClients } from '@/services/public.service'
import type { ClientData } from '@/types/api'

// ─── Segmentos (estático, visual) ────────────────────────────────────────────
const segments = [
  { icon: Scissors,        label: 'Barbearias & Salões',    description: 'Agendamento, gestão e app mobile'      },
  { icon: Scale,           label: 'Advocacia & Consultoria', description: 'Landing pages e portais de clientes' },
  { icon: UtensilsCrossed, label: 'Restaurantes & Food',    description: 'Cardápio digital e pedidos online'     },
  { icon: ShoppingCart,    label: 'E-commerce',             description: 'Lojas completas com gestão de estoque' },
  { icon: Building2,       label: 'Empresas & Negócios',    description: 'ERPs, CRMs e sistemas internos'        },
  { icon: Stethoscope,     label: 'Saúde & Clínicas',       description: 'Agendamento e prontuário digital'      },
]

// ─── Status badge helper ──────────────────────────────────────────────────────
const STATUS_LABELS: Record<string, string> = {
  em_producao:    'Em Produção',
  em_andamento:   'Em Andamento',
  em_autorizacao: 'Em Autorização',
}

export function ClientsShowcase() {
  const [clients, setClients] = useState<ClientData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getClients()
      .then(setClients)
      .catch(() => setClients([]))
      .finally(() => setLoading(false))
  }, [])

  // Derivados
  const featured     = clients.filter(c => c.featured && c.status === 'em_producao')
  const mainCase     = featured[0] ?? null
  const otherCases   = featured.slice(1)
  const comingSoon   = clients.filter(c => c.status === 'em_andamento' || c.status === 'em_autorizacao')

  return (
    <section className="min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-sm text-slate-500 hover:text-violet-400 transition-colors mb-10 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Voltar ao Portfólio
        </Link>

        <SectionHeader
          title="Vitrine de Clientes"
          description="Cases reais, soluções entregues e segmentos que atendo"
        />

        {/* ── Loading ────────────────────────────────────────────────────────── */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 size={28} className="text-violet-400 animate-spin" />
          </div>
        )}

        {/* ── Case em destaque (primeiro featured em produção) ─────────────── */}
        {!loading && mainCase && (
          <div className="mb-20">
            <p className="font-mono text-xs text-violet-400 uppercase tracking-widest mb-6">
              ★ Case em Destaque
            </p>

            <div className="grid lg:grid-cols-2 gap-8 p-8 rounded-2xl border border-violet-600/30 bg-bg-card relative overflow-hidden">
              {/* Glow */}
              <div className="absolute top-0 right-0 w-72 h-72 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />

              {/* Left */}
              <div className="relative z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-violet-600/40 bg-violet-600/10 font-mono text-[11px] text-violet-300 mb-5">
                  Case Próprio
                </span>

                <h3 className="font-display font-bold text-white text-3xl mb-1">{mainCase.name}</h3>
                {mainCase.subtitle && (
                  <p className="font-mono text-sm text-violet-400 mb-5">{mainCase.subtitle}</p>
                )}

                <p className="text-slate-400 text-sm leading-relaxed mb-6">{mainCase.description}</p>

                {/* Metrics */}
                {mainCase.metrics.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {mainCase.metrics.map(({ value, label }) => (
                      <div key={label} className="p-3 rounded-xl border border-violet-600/20 bg-bg-primary">
                        <p className="font-display font-bold text-violet-300 text-sm">{value}</p>
                        <p className="font-mono text-[11px] text-slate-600 mt-0.5">{label}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tags */}
                {mainCase.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {mainCase.technologies.map((t) => (
                      <span key={t} className="font-mono text-[11px] px-2.5 py-1 rounded-lg border border-slate-700 text-slate-400">
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                {/* Links */}
                <div className="flex gap-3 flex-wrap">
                  {mainCase.linkDemo && (
                    <a
                      href={mainCase.linkDemo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 text-white font-display font-semibold text-sm hover:bg-violet-500 transition-all"
                    >
                      <ExternalLink size={14} />
                      Ver Demo
                    </a>
                  )}
                  {mainCase.linkGithub && (
                    <a
                      href={mainCase.linkGithub}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 font-display font-semibold text-sm hover:border-violet-500/50 hover:text-white transition-all"
                    >
                      <Github size={14} />
                      Código
                    </a>
                  )}
                </div>
              </div>

              {/* Right: Image */}
              {mainCase.image && (
                <div className="relative z-10 flex items-center justify-center">
                  <div className="w-full rounded-xl overflow-hidden border border-violet-600/20 shadow-2xl">
                    <img
                      src={mainCase.image}
                      alt={mainCase.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Outros cases em destaque ──────────────────────────────────────── */}
        {!loading && otherCases.length > 0 && (
          <div className="mb-20">
            <p className="font-mono text-xs text-slate-500 uppercase tracking-widest mb-6">
              Outros Cases
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {otherCases.map(client => (
                <div
                  key={client.id}
                  className="group p-6 rounded-xl border border-violet-600/15 bg-bg-card hover:border-violet-500/35 transition-all duration-300"
                >
                  <h4 className="font-display font-bold text-white mb-1">{client.name}</h4>
                  {client.subtitle && (
                    <p className="font-mono text-xs text-violet-400 mb-3">{client.subtitle}</p>
                  )}
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">{client.description}</p>
                  {client.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {client.technologies.map(t => (
                        <span key={t} className="font-mono text-[10px] px-2 py-0.5 rounded border border-slate-700 text-slate-500">{t}</span>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    {client.linkDemo && (
                      <a href={client.linkDemo} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 text-white font-mono text-xs hover:bg-violet-500 transition-all">
                        <ExternalLink size={12} /> Demo
                      </a>
                    )}
                    {client.linkGithub && (
                      <a href={client.linkGithub} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-700 text-slate-300 font-mono text-xs hover:border-violet-500/50 transition-all">
                        <Github size={12} /> Código
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Em breve (status em_andamento / em_autorizacao) ───────────────── */}
        {!loading && comingSoon.length > 0 && (
          <div className="mb-20">
            <p className="font-mono text-xs text-slate-500 uppercase tracking-widest mb-6">
              Próximos Cases
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {comingSoon.map(client => (
                <div
                  key={client.id}
                  className="p-6 rounded-xl border border-dashed border-slate-700/60 bg-bg-card/50 flex items-start gap-4"
                >
                  <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Lock size={15} className="text-slate-500" />
                  </div>
                  <div>
                    <span className="font-mono text-[11px] text-amber-400/80 border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 rounded-full">
                      {STATUS_LABELS[client.status] ?? client.status}
                    </span>
                    {client.description && (
                      <p className="text-slate-500 text-sm leading-relaxed mt-2">{client.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Segmentos (estático) ──────────────────────────────────────────── */}
        <div className="mb-20">
          <p className="font-mono text-xs text-slate-500 uppercase tracking-widest mb-2">
            Segmentos que Atendo
          </p>
          <p className="text-slate-400 text-sm mb-8 max-w-xl">
            Desenvolvo soluções digitais para múltiplos segmentos — sites, sistemas e aplicações
            adaptados à realidade de cada negócio.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {segments.map(({ icon: Icon, label, description }) => (
              <div
                key={label}
                className="group p-5 rounded-xl border border-violet-600/15 bg-bg-card hover:border-violet-500/35 hover:bg-bg-hover transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-violet-600/15 border border-violet-600/20 flex items-center justify-center mb-3 group-hover:bg-violet-600/25 transition-colors">
                  <Icon size={18} className="text-violet-400" />
                </div>
                <p className="font-display font-semibold text-white text-sm mb-1">{label}</p>
                <p className="font-body text-xs text-slate-500 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA (estático) ────────────────────────────────────────────────── */}
        <div className="text-center p-10 rounded-2xl border border-violet-600/20 bg-bg-card">
          <h3 className="font-display font-bold text-white text-2xl mb-3">
            Vamos construir o seu case?
          </h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto mb-8">
            Conte o seu desafio. Seja um sistema web, aplicação desktop ou automação — entrego
            do planejamento ao deploy.
          </p>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-violet-600 text-white font-display font-semibold text-sm hover:bg-violet-500 transition-all hover:shadow-lg hover:-translate-y-0.5"
          >
            Iniciar Projeto
            <ArrowRight size={15} />
          </Link>
        </div>

      </div>
    </section>
  )
}