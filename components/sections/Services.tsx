'use client'

import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { cn } from '@/lib/utils'
import { Check, Zap, Globe, Server, Monitor, Bot, Smartphone } from 'lucide-react'

const WHATSAPP_NUMBER = '5511983943905'

const plans = [
  {
    id: 'landing',
    icon: Globe,
    name: 'Site & Landing Page',
    price: 'A partir de R$ 800',
    period: 'entrega única',
    description: 'Presença digital profissional e otimizada para converter visitantes em clientes.',
    highlight: false,
    badge: null,
    features: [
      'Site institucional ou landing page',
      'Design responsivo (mobile + desktop)',
      'Formulário de contato via WhatsApp',
      'SEO básico configurado',
      'Deploy em produção incluso',
      'Suporte por 30 dias',
    ],
    cta: 'Solicitar Orçamento',
    message: 'Olá, Alexander! Tenho interesse no pacote Site & Landing Page. Pode me passar mais detalhes?',
  },
  {
    id: 'sistema',
    icon: Server,
    name: 'Sistema Web',
    price: 'A partir de R$ 2.500',
    period: 'entrega única',
    description: 'Aplicação web completa com back-end, banco de dados, autenticação e painel administrativo.',
    highlight: true,
    badge: 'Mais Solicitado',
    features: [
      'Front-end React / Next.js',
      'Back-end Node.js + API REST',
      'Banco de dados PostgreSQL',
      'Autenticação e controle de acesso',
      'Painel administrativo',
      'Deploy em produção incluso',
      'Documentação técnica',
      'Suporte por 60 dias',
    ],
    cta: 'Solicitar Orçamento',
    message: 'Olá, Alexander! Tenho interesse no pacote Sistema Web. Pode me passar mais detalhes?',
  },
  {
    id: 'saas',
    icon: Zap,
    name: 'SaaS / Plataforma',
    price: 'A partir de R$ 6.000',
    period: 'sob consulta',
    description: 'Plataforma multi-tenant, marketplace ou sistema complexo com escalabilidade desde a arquitetura.',
    highlight: false,
    badge: 'Premium',
    features: [
      'Arquitetura multi-tenant',
      'App mobile (React Native)',
      'Módulos customizados',
      'Integrações e webhooks',
      'Gestão financeira / relatórios',
      'Infraestrutura escalável',
      'CI/CD configurado',
      'Suporte contínuo (plano mensal)',
    ],
    cta: 'Agendar Conversa',
    message: 'Olá, Alexander! Tenho interesse no pacote SaaS / Plataforma. Pode me passar mais detalhes?',
  },
]

const extras = [
  { icon: Monitor,    label: 'Aplicação Desktop (.exe)', description: 'Programas Windows standalone em Python ou Electron' },
  { icon: Bot,        label: 'Automações & N8N',         description: 'Fluxos automáticos, integrações entre sistemas e chatbots' },
  { icon: Smartphone, label: 'App Mobile',               description: 'Aplicativo iOS + Android com React Native / Expo' },
  { icon: Server,     label: 'API & Microserviços',      description: 'Back-end isolado, integrações e endpoints para terceiros' },
]

export function Services() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section id="services" className="py-32 relative">
      <div className="absolute inset-0 bg-bg-secondary/20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative">
        <SectionHeader
          title="Serviços & Pacotes"
          description="Soluções para cada etapa do seu negócio digital"
        />

        {/* Plans grid */}
        <div
          ref={ref}
          className={cn(
            'grid md:grid-cols-3 gap-6 mb-20 transition-all duration-700',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
        >
          {plans.map((plan) => {
            const Icon = plan.icon
            const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(plan.message)}`

            return (
              <div
                key={plan.id}
                className={cn(
                  'relative flex flex-col p-7 rounded-2xl border transition-all duration-300',
                  plan.highlight
                    ? 'border-violet-500/60 bg-violet-600/10 shadow-[0_0_40px_rgba(124,58,237,0.12)]'
                    : 'border-violet-600/20 bg-bg-card hover:border-violet-500/35 hover:bg-bg-hover'
                )}
              >
                {/* Badge */}
                {plan.badge && (
                  <span className={cn(
                    'absolute -top-3 left-1/2 -translate-x-1/2 font-mono text-[11px] px-3 py-1 rounded-full border whitespace-nowrap',
                    plan.highlight
                      ? 'bg-violet-600 border-violet-500 text-white'
                      : 'bg-bg-card border-amber-500/40 text-amber-400'
                  )}>
                    {plan.badge}
                  </span>
                )}

                {/* Icon + name */}
                <div className={cn(
                  'w-11 h-11 rounded-xl flex items-center justify-center mb-4 border',
                  plan.highlight
                    ? 'bg-violet-600/30 border-violet-500/40'
                    : 'bg-violet-600/15 border-violet-600/20'
                )}>
                  <Icon size={20} className="text-violet-400" />
                </div>

                <h3 className="font-display font-bold text-white text-lg mb-1">{plan.name}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-5">{plan.description}</p>

                {/* Price */}
                <div className="mb-6">
                  <p className={cn(
                    'font-display font-bold text-2xl',
                    plan.highlight ? 'text-violet-300' : 'text-white'
                  )}>
                    {plan.price}
                  </p>
                  <p className="font-mono text-xs text-slate-600 mt-0.5">{plan.period}</p>
                </div>

                {/* Features */}
                <ul className="space-y-2.5 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check size={14} className="text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-400 text-sm">{f}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'w-full flex items-center justify-center py-3 rounded-xl font-display font-semibold text-sm transition-all hover:-translate-y-0.5',
                    plan.highlight
                      ? 'bg-violet-600 text-white hover:bg-violet-500 shadow-lg'
                      : 'border border-violet-600/30 text-violet-300 hover:border-violet-500 hover:bg-violet-600/10'
                  )}
                >
                  {plan.cta}
                </a>
              </div>
            )
          })}
        </div>

        {/* Extras */}
        <div>
          <p className="font-mono text-xs text-slate-500 uppercase tracking-widest text-center mb-2">
            Também desenvolvo
          </p>
          <p className="text-slate-500 text-sm text-center mb-8">
            Serviços avulsos ou complementares ao seu projeto principal
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {extras.map(({ icon: Icon, label, description }) => (
              <div
                key={label}
                className="group p-5 rounded-xl border border-violet-600/15 bg-bg-card hover:border-violet-500/30 hover:bg-bg-hover transition-all duration-300 text-center"
              >
                <div className="w-10 h-10 rounded-lg bg-violet-600/15 border border-violet-600/20 flex items-center justify-center mx-auto mb-3 group-hover:bg-violet-600/25 transition-colors">
                  <Icon size={18} className="text-violet-400" />
                </div>
                <p className="font-display font-semibold text-white text-sm mb-1.5">{label}</p>
                <p className="text-slate-500 text-xs leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Fine print */}
        <p className="text-center font-mono text-xs text-slate-600 mt-10">
          Valores variam conforme escopo, prazo e complexidade. Pagamento em até 2× (50/50) ou à vista com desconto.
        </p>
      </div>
    </section>
  )
}