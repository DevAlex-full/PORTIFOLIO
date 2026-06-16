'use client'

// 📁 CAMINHO: components/sections/AllProjects.tsx (ALTERADO)
// Removida importação de data/projects.
// Recebe ProjectData[] como prop. GitHub stars fetch mantido.

import { useState, useMemo, useEffect } from 'react'
import { ProjectCard }   from '@/components/ui/ProjectCard'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { cn }            from '@/lib/utils'
import { Search, ArrowLeft } from 'lucide-react'
import Link              from 'next/link'
import type { ProjectData } from '@/types/api'

const FILTER_LABELS: Record<string, string> = {
  all:         'Todos',
  web:         'Web Apps',
  landing:     'Landing Pages',
  interactive: 'Interativos',
  commercial:  'Comerciais',
  client:      'Vitrine de Clientes',
}

const FILTER_KEYS = ['all', 'web', 'landing', 'interactive', 'commercial', 'client'] as const

interface AllProjectsProps {
  data: ProjectData[]
}

export function AllProjects({ data }: AllProjectsProps) {
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [search,       setSearch]       = useState('')
  const [githubStars,  setGithubStars]  = useState<string>('...')

  const totalTecnologias = new Set(data.flatMap(p => p.tags)).size

  // GitHub stars reais
  useEffect(() => {
    fetch('https://api.github.com/users/DevAlex-full/repos?per_page=100')
      .then(r => r.json())
      .then(repos => {
        if (Array.isArray(repos)) {
          const total = repos.reduce(
            (acc: number, r: { stargazers_count: number }) => acc + r.stargazers_count, 0
          )
          setGithubStars(`${total}+`)
        }
      })
      .catch(() => setGithubStars('—'))
  }, [])

  const filtered = useMemo(() => {
    let result = data

    if (activeFilter !== 'all') {
      result = result.filter(p => p.categories.includes(activeFilter))
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      )
    }

    return result
  }, [data, activeFilter, search])

  return (
    <section className="py-20 min-h-screen relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full bg-violet-600/5 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-xs text-slate-500 hover:text-violet-400 transition-colors mb-10 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Voltar ao Portfólio
        </Link>

        <SectionHeader
          title="Todos os Meus Projetos"
          description="Uma coleção completa dos projetos que desenvolvi"
        />

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
          {[
            { value: `${data.length}+`,         label: 'Projetos'       },
            { value: `${totalTecnologias}+`,     label: 'Tecnologias'    },
            { value: '500+',                     label: 'Visualizações'  },
            { value: githubStars,                label: 'Stars GitHub'   },
          ].map(({ value, label }) => (
            <div key={label} className="text-center p-4 rounded-xl border border-violet-600/20 bg-bg-card">
              <p className="font-display font-bold text-xl text-violet-400">{value}</p>
              <p className="font-mono text-xs text-slate-500 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-md mx-auto mb-8">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar por nome, tecnologia..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-violet-600/20 bg-bg-card text-slate-300 placeholder-slate-600 font-mono text-sm focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {FILTER_KEYS.map(key => (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              className={cn(
                'font-mono text-xs px-4 py-2 rounded-lg border transition-all duration-200',
                activeFilter === key
                  ? 'bg-violet-600 border-violet-500 text-white shadow-lg'
                  : 'border-violet-600/20 text-slate-400 hover:border-violet-600/40 hover:text-slate-300 bg-bg-card'
              )}
            >
              {FILTER_LABELS[key]}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="font-mono text-xs text-slate-600 text-center mb-8">
          {filtered.length} projeto{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
        </p>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Search size={40} className="text-violet-600/30 mx-auto mb-4" />
            <h3 className="font-display text-xl text-white mb-2">Nenhum projeto encontrado</h3>
            <p className="font-body text-slate-500 text-sm">Tente outro filtro ou limpe a busca.</p>
            <button
              onClick={() => { setActiveFilter('all'); setSearch('') }}
              className="mt-4 font-mono text-xs text-violet-400 hover:text-violet-300 underline"
            >
              Limpar filtros
            </button>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="text-center mt-16 pt-16 border-t border-violet-600/10">
          <p className="font-mono text-sm text-slate-500 mb-4">Mais projetos em desenvolvimento...</p>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-violet-600 text-white font-display font-semibold text-sm hover:bg-violet-500 transition-all hover:shadow-glow-violet"
          >
            Entre em Contato
          </Link>
        </div>
      </div>
    </section>
  )
}