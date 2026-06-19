'use client'

import { ArrowDown, Github, Linkedin, Mail, Download } from 'lucide-react'
import type { HeroData } from '@/types/api'

interface HeroProps {
  data: HeroData
}

export function Hero({ data }: HeroProps) {
  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
  }

  // Número de projetos não vem mais daqui — removido (passa via About se necessário)
  const typingSvgUrl = data.typingSvgUrl ??
    'https://readme-typing-svg.demolab.com?font=Fira+Code&size=18&duration=4000&pause=500&color=9615F7&center=false&width=435&lines=Seja+Bem-Vindo!;Desenvolvedor+FullStack+S%C3%AAnior;Web+%E2%80%A2+Desktop+%E2%80%A2+APIs+%E2%80%A2+Automa%C3%A7%C3%B5es'

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-20 overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-violet-600/8 blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 rounded-full bg-cyan-500/5 blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-20 right-10 opacity-20">
          <div className="w-32 h-32 border border-violet-600/30 rounded-lg rotate-12 animate-float" style={{ animationDelay: '1s' }} />
          <div className="w-20 h-20 border border-cyan-500/20 rounded-lg -rotate-6 animate-float mt-4 ml-8" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <div>
            {/* CORREÇÃO 3: foto em mobile/tablet — antes a única versão da
                foto estava dentro de "hidden lg:flex" (visível apenas a
                partir de 1024px), então ela simplesmente não existia em
                nenhum breakpoint menor. Este bloco é uma versão mais
                simples (sem os badges flutuantes decorativos, que não
                cabem bem em telas estreitas), visível só abaixo de "lg"
                — a versão desktop completa, mais abaixo, continua exatamente
                como estava. */}
            <div className="flex lg:hidden justify-center mb-10">
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-2xl border border-violet-600/30 bg-bg-card overflow-hidden shadow-card flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-transparent z-10" />
                <img
                  src={data.photoUrl ?? '/imagens/alex%20(1).jpeg'}
                  alt={data.name ?? 'Alexander Bueno Santiago'}
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement
                    if (fallback) fallback.style.display = 'flex'
                  }}
                />
                <div className="hidden absolute inset-0 items-center justify-center" style={{ display: 'none' }}>
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full border-2 border-violet-500/50 bg-violet-600/20 flex items-center justify-center mx-auto mb-2">
                      <span className="font-display text-2xl font-bold text-violet-300">
                        {data.name?.[0] ?? 'A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Badge disponível */}
            {data.available && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-600/30 bg-violet-600/10 mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="font-mono text-xs text-violet-300">Disponível para projetos</span>
              </div>
            )}

            {/* Name */}
            <h1 className="font-display font-bold leading-tight mb-4">
              <span className="block text-slate-400 text-xl mb-2">Olá, eu sou</span>
              {data.name ? (
                <>
                  <span className="block text-4xl md:text-6xl text-white">
                    {data.name.split(' ')[0]}
                  </span>
                  <span className="block text-4xl md:text-6xl bg-gradient-to-r from-violet-400 via-violet-300 to-cyan-400 bg-clip-text text-transparent">
                    {data.name.split(' ').slice(1).join(' ')}
                  </span>
                </>
              ) : (
                <>
                  <span className="block text-4xl md:text-6xl text-white">Alexander</span>
                  <span className="block text-4xl md:text-6xl bg-gradient-to-r from-violet-400 via-violet-300 to-cyan-400 bg-clip-text text-transparent">
                    Bueno Santiago
                  </span>
                </>
              )}
            </h1>

            {/* Typing SVG */}
            <div className="mb-8">
              <img
                src={typingSvgUrl}
                alt={data.role ?? 'Desenvolvedor Full Stack'}
                className="h-8"
              />
            </div>

            {/* Description */}
            <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-lg">
              {data.description || (
                <>
                  Construo soluções digitais completas — sistemas{' '}
                  <span className="text-violet-300 font-medium">web</span>,{' '}
                  <span className="text-violet-300 font-medium">SaaS</span>,{' '}
                  <span className="text-violet-300 font-medium">aplicações desktop</span> e{' '}
                  <span className="text-violet-300 font-medium">automações</span>. Do back-end ao deploy,
                  entrego arquitetura sólida e resultado real para o seu negócio.
                </>
              )}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 mb-12">
              <a
                href="#projects"
                onClick={(e) => { e.preventDefault(); document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }) }}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-violet-600 text-white font-display font-semibold text-sm hover:bg-violet-500 transition-all duration-300 shadow-lg hover:shadow-glow-violet hover:-translate-y-0.5"
              >
                Ver Projetos
              </a>
              {data.cvUrl && (
                <a
                  href={data.cvUrl}
                  download
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-violet-600/30 text-violet-300 font-display font-semibold text-sm hover:border-violet-500 hover:bg-violet-600/10 transition-all duration-300 hover:-translate-y-0.5"
                >
                  <Download size={15} />
                  Download CV
                </a>
              )}
            </div>

            {/* Social links */}
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs text-slate-600">SOCIAL</span>
              <div className="h-px w-8 bg-slate-700" />
              {[
                { icon: Github,   href: data.githubUrl,   label: 'GitHub'   },
                { icon: Linkedin, href: data.linkedinUrl, label: 'LinkedIn' },
                { icon: Mail,     href: data.emailAddress ? `mailto:${data.emailAddress}` : null, label: 'Email' },
              ].filter(s => !!s.href).map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href!}
                  target={href?.startsWith('mailto') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-violet-500/50 hover:bg-violet-600/10 transition-all duration-300"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Right: Visual */}
          <div className="hidden lg:flex justify-center items-center relative">
            <div className="relative">
              {/* Main profile visual */}
              <div className="w-72 h-72 rounded-2xl border border-violet-600/30 bg-bg-card relative overflow-hidden shadow-card">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-transparent z-10" />
                <img
                  src={data.photoUrl ?? '/imagens/alex%20(1).jpeg'}
                  alt={data.name ?? 'Alexander Bueno Santiago'}
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement
                    if (fallback) fallback.style.display = 'flex'
                  }}
                />
                <div className="hidden absolute inset-0 items-center justify-center" style={{ display: 'none' }}>
                  <div className="text-center">
                    <div className="w-28 h-28 rounded-full border-2 border-violet-500/50 bg-violet-600/20 flex items-center justify-center mx-auto mb-4">
                      <span className="font-display text-4xl font-bold text-violet-300">
                        {data.name?.[0] ?? 'A'}
                      </span>
                    </div>
                    <p className="font-display font-bold text-white">{data.name?.split(' ')[0] ?? 'Alexander'}</p>
                    <p className="font-mono text-xs text-violet-400 mt-1">Full Stack Dev</p>
                  </div>
                </div>
                <div className="absolute inset-0 overflow-hidden opacity-20 z-20 pointer-events-none">
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-violet-400 to-transparent animate-scan" />
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -top-4 -right-8 bg-bg-card border border-violet-600/30 rounded-xl px-4 py-2.5 shadow-card animate-float">
                <p className="font-mono text-xs text-slate-500">stack</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-display font-bold text-white text-sm">React + Next</span>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-8 bg-bg-card border border-cyan-500/20 rounded-xl px-4 py-2.5 shadow-card animate-float" style={{ animationDelay: '2s' }}>
                <p className="font-mono text-xs text-slate-500">status</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="font-mono text-xs text-green-400">
                    {data.available ? 'available' : 'busy'}
                  </span>
                </div>
              </div>

              <div className="absolute inset-0 -m-8 rounded-full border border-violet-600/10 animate-spin-slow" />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="flex justify-center mt-16">
          <button
            onClick={scrollToAbout}
            className="flex flex-col items-center gap-2 text-slate-600 hover:text-violet-400 transition-colors group"
          >
            <span className="font-mono text-xs">scroll</span>
            <ArrowDown size={16} className="animate-bounce group-hover:text-violet-400" />
          </button>
        </div>
      </div>
    </section>
  )
}