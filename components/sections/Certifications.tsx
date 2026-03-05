// 📁 CAMINHO: portfolio/components/sections/Certifications.tsx
'use client'

import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { certifications, stats } from '@/data/certifications'
import { cn } from '@/lib/utils'
import { Award, Clock, Globe, Star } from 'lucide-react'

const statIcons = { award: Award, clock: Clock, globe: Globe }

export function Certifications() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section id="certifications" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          title="Certificações & Cursos"
          description="Minha jornada de aprendizado contínuo"
        />

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-16 max-w-lg mx-auto">
          {stats.map(({ value, label, icon }) => {
            const Icon = statIcons[icon as keyof typeof statIcons]
            return (
              <div key={label} className="text-center p-5 rounded-xl border border-violet-600/20 bg-bg-card">
                <Icon size={20} className="text-violet-400 mx-auto mb-2" />
                <p className="font-display font-bold text-2xl text-white">{value}</p>
                <p className="font-mono text-xs text-slate-500 mt-1">{label}</p>
              </div>
            )
          })}
        </div>

        {/* Certifications grid */}
        <div
          ref={ref}
          className={cn(
            'grid md:grid-cols-2 lg:grid-cols-3 gap-4 transition-all duration-700',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
        >
          {certifications.map((cert, i) => (
            <div
              key={cert.id}
              className="group relative p-5 rounded-xl border border-violet-600/20 bg-bg-card hover:border-violet-500/40 hover:bg-bg-hover transition-all duration-300 hover:-translate-y-0.5"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              {/* Top gradient line */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/0 to-transparent group-hover:via-violet-500/40 transition-all duration-500 rounded-t-xl" />

              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-display font-semibold text-white text-sm leading-tight">
                      {cert.title}
                    </h3>
                    {cert.inProgress && (
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 whitespace-nowrap">
                        Em andamento
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs text-violet-400">{cert.institution}</span>
                    <span className="text-slate-700">•</span>
                    <span className="font-mono text-xs text-slate-600">{cert.year}</span>
                    {cert.hours && (
                      <>
                        <span className="text-slate-700">•</span>
                        <span className="font-mono text-xs text-slate-600 flex items-center gap-1">
                          <Clock size={9} />
                          {cert.hours >= 1000 ? `${cert.hours.toLocaleString('pt-BR')}h` : `${cert.hours}h`}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Stars */}
                {cert.stars && (
                  <div className="flex gap-0.5 ml-2 flex-shrink-0">
                    {Array.from({ length: cert.stars as number }).map((_, si) => (
                      <Star key={si} size={10} className="text-violet-400 fill-violet-400" />
                    ))}
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {cert.tags.map((tag) => (
                  <span key={tag} className="tech-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}