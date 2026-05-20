'use client'

import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { cn } from '@/lib/utils'
import { Code2, Layers, Rocket, TrendingUp } from 'lucide-react'
import { projects } from '@/data/projects'
import { certifications } from '@/data/certifications'
import { skills } from '@/data/skills'

const highlights = [
  {
    icon: Layers,
    title: 'Full Stack Completo',
    description: 'Do banco de dados à interface — sistemas web, mobile e aplicações desktop em um único profissional.',
  },
  {
    icon: Code2,
    title: 'Código que Escala',
    description: 'Aplico SOLID, Clean Code e arquitetura em camadas para entregar software que cresce com o seu negócio.',
  },
  {
    icon: Rocket,
    title: 'Entrega Real',
    description: 'MVP funcional em dias, não meses. Foco em resultado desde o primeiro commit até o deploy em produção.',
  },
  {
    icon: TrendingUp,
    title: 'Visão de Negócio',
    description: 'Entendo que software resolve dores reais. Desenvolvimento orientado a impacto e retorno financeiro.',
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
              Sou Desenvolvedor Full Stack e entrego{' '}
              <span className="text-violet-300 font-medium">soluções digitais completas</span>{' '}
              — de sistemas web e SaaS a aplicações desktop e automações. Não sou especialista
              em apenas uma camada: domino o ciclo inteiro, do banco de dados ao deploy em produção.
            </p>
            <p className="text-slate-400 leading-relaxed">
              No front, trabalho com{' '}
              <span className="text-violet-300">React</span>,{' '}
              <span className="text-violet-300">Next.js</span> e{' '}
              <span className="text-violet-300">TypeScript</span>. No back, construo APIs
              robustas com <span className="text-violet-300">Node.js</span> e{' '}
              <span className="text-violet-300">Express</span>, com{' '}
              <span className="text-violet-300">PostgreSQL</span> e{' '}
              <span className="text-violet-300">Prisma ORM</span>. Para desktop e automações,
              uso <span className="text-violet-300">Python</span> com foco em entrega rápida
              e resultado concreto.
            </p>
            <p className="text-slate-400 leading-relaxed">
              Já construí um{' '}
              <span className="text-cyan-400 font-medium">SaaS multi-tenant</span> do zero,
              desenvolvi sistemas para clientes reais e crio automações que eliminam trabalho
              manual. Acredito que o melhor software é aquele que resolve um problema de verdade
              — e faz isso de forma simples, rápida e escalável.
            </p>

            {/* Stats row — automático */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              {[
                { value: `${projects.length}+`, label: 'Projetos' },
                { value: `${certifications.length}+`, label: 'Certificações' },
                { value: `${skills.length}+`, label: 'Tecnologias' },
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