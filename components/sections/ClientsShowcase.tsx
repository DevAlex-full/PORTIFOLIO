'use client'

import Link from 'next/link'
import { ArrowLeft, ArrowRight, ExternalLink, Github, Scissors, Scale, UtensilsCrossed, ShoppingCart, Building2, Stethoscope, Lock } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'

// ─── Case próprio ─────────────────────────────────────────────────────────────
const ownCase = {
  label: 'Case Próprio',
  title: 'BarberFlow',
  subtitle: 'SaaS Multi-tenant para Barbearias',
  description:
    'Plataforma completa construída do zero: agendamento online, gestão financeira, controle de estoque, comissões por barbeiro e app mobile. Sistema em produção com arquitetura real de SaaS multi-tenant.',
  metrics: [
    { value: 'Multi-tenant', label: 'Arquitetura' },
    { value: 'Web + Mobile', label: 'Plataformas' },
    { value: '6 módulos', label: 'Funcionalidades' },
    { value: 'Em produção', label: 'Status' },
  ],
  tags: ['Next.js', 'Node.js', 'PostgreSQL', 'React Native', 'Prisma ORM', 'Supabase'],
  demo: 'https://barberflowoficial.vercel.app/',
  github: 'https://github.com/DevAlex-full/barbeflow-frontend',
  image: '/imagens/barberflow1.png',
}

// ─── Segmentos atendidos ──────────────────────────────────────────────────────
const segments = [
  { icon: Scissors,        label: 'Barbearias & Salões',   description: 'Agendamento, gestão e app mobile'      },
  { icon: Scale,           label: 'Advocacia & Consultoria', description: 'Landing pages e portais de clientes' },
  { icon: UtensilsCrossed, label: 'Restaurantes & Food',   description: 'Cardápio digital e pedidos online'     },
  { icon: ShoppingCart,    label: 'E-commerce',            description: 'Lojas completas com gestão de estoque' },
  { icon: Building2,       label: 'Empresas & Negócios',   description: 'ERPs, CRMs e sistemas internos'        },
  { icon: Stethoscope,     label: 'Saúde & Clínicas',      description: 'Agendamento e prontuário digital'      },
]

// ─── Slots "em breve" ─────────────────────────────────────────────────────────
const comingSoon = [
  { label: 'Em autorização', text: 'Projeto de sistema web para empresa local — aguardando aprovação do cliente.' },
  { label: 'Em andamento',   text: 'Sistema desktop para automação de processos — entrega prevista em breve.'    },
]

export function ClientsShowcase() {
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

        {/* ── Case próprio ──────────────────────────────────────────────────── */}
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
                {ownCase.label}
              </span>

              <h3 className="font-display font-bold text-white text-3xl mb-1">{ownCase.title}</h3>
              <p className="font-mono text-sm text-violet-400 mb-5">{ownCase.subtitle}</p>

              <p className="text-slate-400 text-sm leading-relaxed mb-6">{ownCase.description}</p>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {ownCase.metrics.map(({ value, label }) => (
                  <div key={label} className="p-3 rounded-xl border border-violet-600/20 bg-bg-primary">
                    <p className="font-display font-bold text-violet-300 text-sm">{value}</p>
                    <p className="font-mono text-[11px] text-slate-600 mt-0.5">{label}</p>
                  </div>
                ))}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {ownCase.tags.map((t) => (
                  <span key={t} className="font-mono text-[11px] px-2.5 py-1 rounded-lg border border-slate-700 text-slate-400">
                    {t}
                  </span>
                ))}
              </div>

              {/* Links */}
              <div className="flex gap-3">
                <a
                  href={ownCase.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 text-white font-display font-semibold text-sm hover:bg-violet-500 transition-all"
                >
                  <ExternalLink size={14} />
                  Ver Demo
                </a>
                <a
                  href={ownCase.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 font-display font-semibold text-sm hover:border-violet-500/50 hover:text-white transition-all"
                >
                  <Github size={14} />
                  Código
                </a>
              </div>
            </div>

            {/* Right: Image */}
            <div className="relative z-10 flex items-center justify-center">
              <div className="w-full rounded-xl overflow-hidden border border-violet-600/20 shadow-2xl">
                <img
                  src={ownCase.image}
                  alt="BarberFlow Dashboard"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Em breve ──────────────────────────────────────────────────────── */}
        <div className="mb-20">
          <p className="font-mono text-xs text-slate-500 uppercase tracking-widest mb-6">
            Próximos Cases
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {comingSoon.map(({ label, text }) => (
              <div
                key={label}
                className="p-6 rounded-xl border border-dashed border-slate-700/60 bg-bg-card/50 flex items-start gap-4"
              >
                <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Lock size={15} className="text-slate-500" />
                </div>
                <div>
                  <span className="font-mono text-[11px] text-amber-400/80 border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 rounded-full">
                    {label}
                  </span>
                  <p className="text-slate-500 text-sm leading-relaxed mt-2">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Segmentos ─────────────────────────────────────────────────────── */}
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

        {/* ── CTA ───────────────────────────────────────────────────────────── */}
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