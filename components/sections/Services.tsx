'use client'

// 📁 CAMINHO: components/sections/Services.tsx (ALTERADO)
// Removidos arrays hardcoded e WHATSAPP_NUMBER.
// Recebe ServicesData como prop. Layout e animações preservados.
// Icons mapeados por nome (armazenados como string no banco).

import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { SectionHeader }      from '@/components/ui/SectionHeader'
import { cn }                 from '@/lib/utils'
import { Check, Zap, Globe, Server, Monitor, Bot, Smartphone, LucideIcon } from 'lucide-react'
import type { ServicesData }  from '@/types/api'

const ICON_MAP: Record<string, LucideIcon> = {
  Globe, Server, Zap, Monitor, Bot, Smartphone, Check,
}

interface ServicesProps {
  data: ServicesData
}

export function Services({ data }: ServicesProps) {
  const { ref, isVisible } = useScrollAnimation()

  const { plans = [], extras = [] } = data

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
            const waLink = `https://wa.me/${encodeURIComponent(plan.ctaMessage ?? '')}`
            const Icon   = ICON_MAP['Globe'] // ícone genérico; banco pode evoluir para armazenar icon

            return (
              <div
                key={plan.id}
                className={cn(
                  'relative flex flex-col p-7 rounded-2xl border transition-all duration-300',
                  plan.highlighted
                    ? 'border-violet-500/60 bg-violet-600/10 shadow-[0_0_40px_rgba(124,58,237,0.12)]'
                    : 'border-violet-600/20 bg-bg-card hover:border-violet-500/35 hover:bg-bg-hover'
                )}
              >
                {/* Badge */}
                {plan.badge && (
                  <span className={cn(
                    'absolute -top-3 left-1/2 -translate-x-1/2 font-mono text-[11px] px-3 py-1 rounded-full border whitespace-nowrap',
                    plan.highlighted
                      ? 'bg-violet-600 border-violet-500 text-white'
                      : 'bg-bg-card border-amber-500/40 text-amber-400'
                  )}>
                    {plan.badge}
                  </span>
                )}

                {/* Icon */}
                <div className={cn(
                  'w-11 h-11 rounded-xl flex items-center justify-center mb-4 border',
                  plan.highlighted
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
                    plan.highlighted ? 'text-violet-300' : 'text-white'
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
                  href={`https://wa.me/?text=${encodeURIComponent(plan.ctaMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'w-full py-3.5 rounded-xl font-display font-semibold text-sm text-center transition-all duration-300 hover:-translate-y-0.5 block',
                    plan.highlighted
                      ? 'bg-violet-600 text-white hover:bg-violet-500 shadow-lg hover:shadow-glow-violet'
                      : 'border border-violet-600/30 text-violet-300 hover:bg-violet-600/10 hover:border-violet-500'
                  )}
                >
                  {plan.ctaText}
                </a>
              </div>
            )
          })}
        </div>

        {/* Extras */}
        {extras.length > 0 && (
          <div>
            <h3 className="font-display font-bold text-white text-center text-lg mb-8">
              Outros Serviços
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {extras.map((extra) => {
                const Icon = ICON_MAP[extra.icon] ?? Monitor
                return (
                  <div
                    key={extra.id}
                    className="p-5 rounded-xl border border-violet-600/20 bg-bg-card hover:border-violet-500/35 hover:bg-bg-hover transition-all duration-300 group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-violet-600/15 border border-violet-600/20 flex items-center justify-center mb-3 group-hover:bg-violet-600/25 transition-colors">
                      <Icon size={18} className="text-violet-400" />
                    </div>
                    <p className="font-display font-semibold text-white text-sm mb-1.5">{extra.label}</p>
                    <p className="text-slate-500 text-xs leading-relaxed">{extra.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}