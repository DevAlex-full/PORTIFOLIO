'use client'

// 📁 CAMINHO: components/sections/About.tsx (ALTERADO)
// Removidas importações de data/*.
// Recebe AboutData como prop + projectsCount para stats.
// Animações e layout preservados.

import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { SectionHeader }      from '@/components/ui/SectionHeader'
import { cn }                 from '@/lib/utils'
import { Code2, Layers, Rocket, TrendingUp, LucideIcon } from 'lucide-react'
import type { AboutData }     from '@/types/api'

// Mapeia ícone por nome (vem do banco como string)
const ICON_MAP: Record<string, LucideIcon> = {
  Layers, Code2, Rocket, TrendingUp,
}

interface AboutProps {
  data:          AboutData
  projectsCount: number
}

export function About({ data, projectsCount }: AboutProps) {
  const { ref, isVisible } = useScrollAnimation()

  const highlights = Array.isArray(data.highlights) ? data.highlights : []

  return (
    <section id="about" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          title="Sobre Mim"
          description="Conheça um pouco da minha trajetória"
        />

        <div
          ref={ref}
          className={cn(
            'grid lg:grid-cols-2 gap-16 items-start transition-all duration-700',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
        >
          {/* Left: Text */}
          <div className="space-y-5">
            {data.paragraph1 && (
              <p className="text-slate-300 text-lg leading-relaxed">{data.paragraph1}</p>
            )}
            {data.paragraph2 && (
              <p className="text-slate-400 leading-relaxed">{data.paragraph2}</p>
            )}
            {data.paragraph3 && (
              <p className="text-slate-400 leading-relaxed">{data.paragraph3}</p>
            )}

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              {[
                { value: `${projectsCount}+`, label: 'Projetos'      },
                { value: '8+',                label: 'Certificações' },
                { value: '25+',               label: 'Tecnologias'   },
              ].map(({ value, label }) => (
                <div
                  key={label}
                  className="text-center p-4 rounded-xl border border-violet-600/20 bg-bg-card"
                >
                  <p className="font-display font-bold text-2xl text-violet-400">{value}</p>
                  <p className="font-mono text-xs text-slate-500 mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {highlights.map(({ icon, title, description }, i) => {
              const Icon = ICON_MAP[icon] ?? Layers
              return (
                <div
                  key={title}
                  className="group p-5 rounded-xl border border-violet-600/20 bg-bg-card hover:border-violet-500/40 hover:bg-bg-hover transition-all duration-300"
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className="w-10 h-10 rounded-lg bg-violet-600/20 border border-violet-600/20 flex items-center justify-center mb-3 group-hover:bg-violet-600/30 transition-colors">
                    <Icon size={18} className="text-violet-400" />
                  </div>
                  <h3 className="font-display font-semibold text-white text-sm mb-1.5">{title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}