'use client'

import { useState } from 'react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { skills, skillCategories } from '@/data/skills'
import { cn } from '@/lib/utils'
import type { SkillCategory } from '@/types'

const levelColors = {
  expert: 'text-violet-300 border-violet-500/40 bg-violet-600/15',
  advanced: 'text-cyan-300 border-cyan-500/30 bg-cyan-500/10',
  intermediate: 'text-slate-300 border-slate-600/40 bg-slate-700/20',
}

const levelLabels = {
  expert: 'Expert',
  advanced: 'Avançado',
  intermediate: 'Intermediário',
}

export function Skills() {
  const [activeCategory, setActiveCategory] = useState<SkillCategory | 'all'>('all')
  const { ref, isVisible } = useScrollAnimation()

  const filtered = activeCategory === 'all'
    ? skills
    : skills.filter((s) => s.category === activeCategory)

  return (
    <section id="skills" className="py-32 relative">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-bg-secondary/30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative">
        <SectionHeader
          title="Principais Habilidades"
          description="Tecnologias que uso no dia a dia para construir produtos incríveis"
        />

        {/* Category filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          <button
            onClick={() => setActiveCategory('all')}
            className={cn(
              'font-mono text-xs px-4 py-2 rounded-lg border transition-all duration-200',
              activeCategory === 'all'
                ? 'bg-violet-600 border-violet-500 text-white'
                : 'border-slate-700 text-slate-400 hover:border-violet-600/40 hover:text-slate-300'
            )}
          >
            Todos
          </button>
          {skillCategories.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key as SkillCategory)}
              className={cn(
                'font-mono text-xs px-4 py-2 rounded-lg border transition-all duration-200',
                activeCategory === key
                  ? 'bg-violet-600 border-violet-500 text-white'
                  : 'border-slate-700 text-slate-400 hover:border-violet-600/40 hover:text-slate-300'
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Skills grid */}
        <div
          ref={ref}
          className={cn(
            'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 transition-all duration-700',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
        >
          {filtered.map((skill, i) => (
            <div
              key={skill.name}
              className={cn(
                'group relative p-4 rounded-xl border bg-bg-card',
                'hover:border-violet-500/40 hover:bg-bg-hover hover:-translate-y-1',
                'transition-all duration-300 text-center cursor-default',
                levelColors[skill.level]
              )}
              style={{ transitionDelay: `${i * 30}ms` }}
            >
              <p className="font-display font-semibold text-sm mb-2">{skill.name}</p>
              <span
                className={cn(
                  'font-mono text-[10px] px-2 py-0.5 rounded-full border',
                  levelColors[skill.level]
                )}
              >
                {levelLabels[skill.level]}
              </span>

              {/* Hover glow */}
              <div className="absolute inset-0 rounded-xl bg-violet-600/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}