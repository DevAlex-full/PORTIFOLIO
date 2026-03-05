import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  label?: string
  title: string
  description?: string
  className?: string
}

export function SectionHeader({ label, title, description, className }: SectionHeaderProps) {
  return (
    <div className={cn('text-center mb-16', className)}>
      {label && (
        <span className="font-mono text-xs text-violet-400 tracking-[0.3em] uppercase mb-4 block">
          {label}
        </span>
      )}
      <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
        {title}
      </h2>
      {description && (
        <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
      )}
      {/* Decorative line */}
      <div className="flex items-center justify-center gap-3 mt-6">
        <div className="h-px w-12 bg-gradient-to-r from-transparent to-violet-500" />
        <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
        <div className="h-px w-24 bg-gradient-to-r from-violet-500 to-cyan-500" />
        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
        <div className="h-px w-12 bg-gradient-to-l from-transparent to-cyan-500" />
      </div>
    </div>
  )
}