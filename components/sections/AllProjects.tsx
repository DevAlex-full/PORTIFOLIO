'use client'

import { useState, useMemo, useEffect } from 'react'
import { ProjectCard } from '@/components/ui/ProjectCard'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { projects, filterLabels } from '@/data/projects'
import { cn } from '@/lib/utils'
import { Search, ArrowLeft } from 'lucide-react'
import type { ProjectCategory } from '@/types'
import Link from 'next/link'

const filterKeys: (ProjectCategory | 'all')[] = [
  'all', 'web', 'landing', 'interactive', 'commercial', 'game', 'personal', 'course', 'client',
]

// Tecnologias únicas — automático via Set
const totalTecnologias = new Set(projects.flatMap((p) => p.tags)).size

// ⚙️ Visualizações — atualize manualmente conforme seu Google Analytics / Vercel Analytics
const VISUALIZACOES = '500+'

export function AllProjects() {
  const [activeFilter, setActiveFilter] = useState<ProjectCategory | 'all'>('all')
  const [search, setSearch] = useState('')
  const [githubStars, setGithubStars] = useState<string>('...')

  // Busca stars reais da API do GitHub
  useEffect(() => {
    fetch('https://api.github.com/users/DevAlex-full/repos?per_page=100')
      .then((r) => r.json())
      .then((repos) => {
        if (Array.isArray(repos)) {
          const total = repos.reduce((acc: number, r: { stargazers_count: number }) => acc + r.stargazers_count, 0)
          setGithubStars(`${total}+`)
        }
      })
      .catch(() => setGithubStars('—'))
  }, [])

  const filtered = useMemo(() => {
    let result = projects

    // Apply category filter
    if (activeFilter !== 'all') {
      result = result.filter((p) => p.categories.includes(activeFilter as ProjectCategory))
    }

    // Apply search
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      )
    }

    return result
  }, [activeFilter, search])

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
          title="Todos os Meus Projetos"
          description="Uma coleção completa dos projetos que desenvolvi"
        />

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
          {[
            { value: `${projects.length}+`, label: 'Projetos' },
            { value: `${totalTecnologias}+`, label: 'Tecnologias' },
            { value: VISUALIZACOES, label: 'Visualizações' },
            { value: githubStars, label: 'Stars GitHub' },
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

        {/* Search */}
        <div className="relative max-w-md mx-auto mb-8">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar por nome, tecnologia..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-violet-600/20 bg-bg-card text-slate-300 placeholder-slate-600 font-mono text-sm focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {filterKeys.map((key) => (
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
              {filterLabels[key]}
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
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Search size={40} className="text-violet-600/30 mx-auto mb-4" />
            <h3 className="font-display text-xl text-white mb-2">Nenhum projeto encontrado</h3>
            <p className="font-body text-slate-500 text-sm">
              Tente outro filtro ou limpe a busca.
            </p>
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