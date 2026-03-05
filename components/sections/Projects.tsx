'use client'

import React from 'react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { ProjectCard } from '@/components/ui/ProjectCard'
import { featuredProjects } from '@/data/projects'
import { cn } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'

export function Projects() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section id="projects" className="py-32 relative">
      <div className="absolute inset-0 bg-bg-secondary/20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative">
        <SectionHeader
          title="Projetos em Destaque"
          description="Alguns dos trabalhos que mais me orgulho"
        />

        <div
          ref={ref}
          className={cn(
            'grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 transition-all duration-700',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
        >
          {featuredProjects.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              className="transition-all duration-300"
              style={{ transitionDelay: `${i * 100}ms` } as React.CSSProperties}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <a
            href="/projects"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-violet-600/30 text-violet-300 font-display font-semibold hover:bg-violet-600/10 hover:border-violet-500 transition-all duration-300 group"
          >
            Ver Todos os Projetos
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  )
}