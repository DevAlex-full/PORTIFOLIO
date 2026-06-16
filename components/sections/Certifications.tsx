'use client'

// 📁 CAMINHO: components/sections/Certifications.tsx (ALTERADO)
// Removida importação de data/certifications.
// Stats calculados dinamicamente a partir dos dados recebidos.

import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { SectionHeader }      from '@/components/ui/SectionHeader'
import { cn }                 from '@/lib/utils'
import { Award, Clock, Globe, Star } from 'lucide-react'
import type { CertificationData }    from '@/types/api'

interface CertificationsProps {
  data: CertificationData[]
}

export function Certifications({ data }: CertificationsProps) {
  const { ref, isVisible } = useScrollAnimation()

  // Stats calculados dinamicamente
  const completed       = data.filter(c => !c.inProgress)
  const totalHoras      = completed.reduce((acc, c) => acc + (c.hours ?? 0), 0)
  const totalPlataformas= new Set(completed.map(c => c.institution)).size

  const stats = [
    { value: `${data.length}+`,         label: 'Certificações',  Icon: Award },
    { value: `${totalHoras}+`,          label: 'Horas de Estudo',Icon: Clock },
    { value: `${totalPlataformas}+`,    label: 'Plataformas',    Icon: Globe },
  ]

  return (
    <section id="certifications" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          title="Certificações & Cursos"
          description="Minha jornada de aprendizado contínuo"
        />

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-16 max-w-lg mx-auto">
          {stats.map(({ value, label, Icon }) => (
            <div key={label} className="text-center p-5 rounded-xl border border-violet-600/20 bg-bg-card">
              <Icon size={20} className="text-violet-400 mx-auto mb-2" />
              <p className="font-display font-bold text-2xl text-white">{value}</p>
              <p className="font-mono text-xs text-slate-500 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Certifications grid */}
        <div
          ref={ref}
          className={cn(
            'grid md:grid-cols-2 lg:grid-cols-3 gap-4 transition-all duration-700',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
        >
          {data.map((cert, i) => (
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
                    {cert.hours > 0 && (
                      <>
                        <span className="text-slate-700">•</span>
                        <span className="font-mono text-xs text-slate-600 flex items-center gap-1">
                          <Clock size={9} />
                          {cert.hours >= 1000
                            ? `${cert.hours.toLocaleString('pt-BR')}h`
                            : `${cert.hours}h`}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Stars */}
                {cert.stars > 0 && (
                  <div className="flex items-center gap-0.5 ml-3 flex-shrink-0">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        size={10}
                        className={idx < cert.stars ? 'text-violet-400 fill-violet-400' : 'text-slate-700'}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Tags */}
              {cert.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {cert.tags.slice(0, 4).map(tag => (
                    <span
                      key={tag}
                      className="font-mono text-[10px] px-2 py-0.5 rounded-full border border-slate-700 text-slate-500 bg-slate-800/50"
                    >
                      {tag}
                    </span>
                  ))}
                  {cert.tags.length > 4 && (
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded-full border border-slate-700 text-slate-600">
                      +{cert.tags.length - 4}
                    </span>
                  )}
                </div>
              )}

              {cert.link && (
                <a
                  href={cert.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1 font-mono text-[10px] text-violet-400 hover:text-violet-300 transition-colors"
                >
                  Ver certificado →
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}