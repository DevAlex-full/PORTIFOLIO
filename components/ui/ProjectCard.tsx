// 📁 CAMINHO: portfolio/components/ui/ProjectCard.tsx

import type { Project } from '@/types'
import { ExternalLink, Github } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Carousel } from './Carousel'

interface ProjectCardProps {
  project: Project
  className?: string
  style?: React.CSSProperties
}

export function ProjectCard({ project, className, style }: ProjectCardProps) {
  const carouselImages = project.images ?? [{ src: project.image, alt: project.title }]

  return (
    <article
      style={style}
      className={cn(
        'group relative rounded-xl border border-violet-600/20 bg-bg-card overflow-hidden',
        'hover:border-violet-500/40 transition-all duration-500',
        'hover:shadow-card-hover hover:-translate-y-1 flex flex-col',
        className
      )}
    >
      {/* Top gradient line on hover */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

      {/* === IMAGEM / CARROSSEL === */}
      <div className="relative">
        <Carousel images={carouselImages} />

        {/* Badges */}
        {project.featured && (
          <div className="absolute top-3 left-3 z-10 pointer-events-none">
            <span className="font-mono text-[10px] px-2 py-1 rounded bg-violet-600/80 backdrop-blur-sm text-white border border-violet-500/30">
              ★ Destaque
            </span>
          </div>
        )}
        {project.highlight && (
          <div className="absolute top-3 right-3 z-10 pointer-events-none">
            <span className="font-mono text-[10px] px-2 py-1 rounded bg-cyan-500/20 backdrop-blur-sm text-cyan-400 border border-cyan-500/30">
              {project.highlight}
            </span>
          </div>
        )}
      </div>

      {/* === CONTEÚDO === */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display font-semibold text-white text-lg mb-2 group-hover:text-violet-300 transition-colors">
          {project.title}
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-4">
          {project.description}
        </p>

        {/* Tags - todas visíveis */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tags.map((tag) => (
            <span key={tag} className="tech-tag">
              {tag}
            </span>
          ))}
        </div>

        {/* === LINKS (sempre visíveis, sem overlay) === */}
        <div className="flex items-center gap-2 pt-3 border-t border-violet-600/10">
          {project.links.demo && (
            <a
              href={project.links.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600/20 border border-violet-600/30 text-violet-300 text-xs font-medium hover:bg-violet-600 hover:text-white transition-all duration-200"
            >
              <ExternalLink size={12} />
              Demo
            </a>
          )}
          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-400 text-xs font-medium hover:border-violet-500 hover:text-white transition-all duration-200"
            >
              <Github size={12} />
              Código
            </a>
          )}
          {project.links.githubFrontend && (
            <a
              href={project.links.githubFrontend}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-400 text-xs font-medium hover:border-violet-500 hover:text-white transition-all duration-200"
            >
              <Github size={12} />
              Front-End
            </a>
          )}
          {project.links.githubBackend && (
            <a
              href={project.links.githubBackend}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-400 text-xs font-medium hover:border-violet-500 hover:text-white transition-all duration-200"
            >
              <Github size={12} />
              Back-End
            </a>
          )}
        </div>
      </div>

      {/* Bottom glow on hover */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </article>
  )
}