'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { ArrowLeft, Star } from 'lucide-react'
import { projects } from '@/data/projects'
import { ProjectCard } from '@/components/ui/ProjectCard'
import { SectionHeader } from '@/components/ui/SectionHeader'

export function ClientsShowcase() {
  const clientProjects = useMemo(
    () => projects.filter((p) => p.categories.includes('client')),
    []
  )

  return (
    <section className="min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-sm text-slate-500 hover:text-violet-400 transition-colors mb-10 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Voltar ao Portfólio
        </Link>

        <SectionHeader
          title="Vitrine de Clientes"
          description="Projetos reais desenvolvidos para clientes — cases de sucesso autorizados para exibição"
        />

        {clientProjects.length === 0 ? (
          /* Estado vazio — aparece enquanto não há projetos de clientes */
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-16 h-16 rounded-2xl bg-violet-600/10 border border-violet-600/20 flex items-center justify-center mb-6">
              <Star size={28} className="text-violet-400" />
            </div>
            <h3 className="font-display font-bold text-white text-xl mb-3">
              Em breve por aqui!
            </h3>
            <p className="text-slate-500 text-sm max-w-sm leading-relaxed">
              Estou aguardando autorização dos clientes para exibir os projetos desenvolvidos.
              Volte em breve para conferir os cases!
            </p>
            <Link
              href="/#projects"
              className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 text-white font-display font-semibold text-sm hover:bg-violet-500 transition-all"
            >
              Ver Projetos em Destaque
            </Link>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12 max-w-lg">
              {[
                { value: `${clientProjects.length}`, label: 'Cases' },
                { value: `${new Set(clientProjects.flatMap((p) => p.tags)).size}+`, label: 'Tecnologias' },
                { value: '100%', label: 'Autorizados' },
              ].map(({ value, label }) => (
                <div
                  key={label}
                  className="text-center p-4 rounded-xl border border-violet-600/20 bg-bg-card"
                >
                  <p className="font-display font-bold text-xl text-violet-400">{value}</p>
                  <p className="font-mono text-xs text-slate-500 mt-1">{label}</p>
                </div>
              ))}
            </div>

            {/* Grid de projetos */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clientProjects.map((project, i) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  style={{ transitionDelay: `${i * 80}ms` }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}