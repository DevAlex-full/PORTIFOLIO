'use client'

import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { cn } from '@/lib/utils'
import { Code2, Layers, Zap, Users } from 'lucide-react'
import { projects } from '@/data/projects'
import { certifications } from '@/data/certifications'
import { skills } from '@/data/skills'

const highlights = [
  {
    icon: Code2,
    title: 'Código Limpo',
    description: 'Aplico princípios SOLID, Clean Code e arquitetura em camadas em todos os projetos.',
  },
  {
    icon: Layers,
    title: 'Full Stack',
    description: 'Do banco de dados ao UI — domínio completo do ciclo de desenvolvimento.',
  },
  {
    icon: Zap,
    title: 'Performance First',
    description: 'Foco em performance, SEO e Core Web Vitals desde a concepção.',
  },
  {
    icon: Users,
    title: 'Visão de Negócio',
    description: 'Entendo que software resolve problemas reais — desenvolvimento orientado ao impacto.',
  },
]

export function About() {
  const { ref, isVisible } = useScrollAnimation()

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
            <p className="text-slate-300 text-lg leading-relaxed">
              Sou Desenvolvedor Web Full Stack que transforma ideias complexas em experiências
              digitais elegantes e funcionais. Minha especialidade está em soluções que vão além
              do{' '}
              <span className="text-violet-300 font-medium">"fazer funcionar"</span> — desenvolvo
              produtos que as pessoas adoram usar, que resolvem problemas reais do mercado.
            </p>
            <p className="text-slate-400 leading-relaxed">
              Trabalho com <span className="text-violet-300">React</span>,{' '}
              <span className="text-violet-300">Next.js</span> e{' '}
              <span className="text-violet-300">TypeScript</span> no front, integrando APIs com
              Node.js e Express no back. Cada projeto é uma oportunidade de aplicar arquitetura
              limpa, código testável e UI que encanta.
            </p>
            <p className="text-slate-400 leading-relaxed">
              Atualmente cursando <span className="text-cyan-400 font-medium">Tecnologia em
              Sistemas para Internet</span> na UNIFATEC, com formação contínua em certificações
              especializadas. Acredito que o desenvolvimento de software é uma arte que exige
              criatividade e raciocínio lógico em igual medida.
            </p>

            {/* Stats row — automático, atualiza sozinho */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              {[
                { value: `${projects.length}+`, label: 'Projetos' },
                { value: `${certifications.length}+`, label: 'Certificações' },
                { value: `${skills.length}+`, label: 'Habilidades' },
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
            {highlights.map(({ icon: Icon, title, description }, i) => (
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
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}