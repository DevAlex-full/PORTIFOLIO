'use client'

import { ArrowDown, Github, Linkedin, Mail, Download } from 'lucide-react'
import { projects } from '@/data/projects'

export function Hero() {
  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-20 overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large glow orb */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-violet-600/8 blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 rounded-full bg-cyan-500/5 blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />

        {/* Grid lines decorative */}
        <div className="absolute top-20 right-10 opacity-20">
          <div className="w-32 h-32 border border-violet-600/30 rounded-lg rotate-12 animate-float" style={{ animationDelay: '1s' }} />
          <div className="w-20 h-20 border border-cyan-500/20 rounded-lg -rotate-6 animate-float mt-4 ml-8" />
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-600/30 bg-violet-600/10 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="font-mono text-xs text-violet-300">Disponível para projetos</span>
            </div>

            {/* Name */}
            <h1 className="font-display font-bold leading-tight mb-4">
              <span className="block text-slate-400 text-xl mb-2">Olá, eu sou</span>
              <span className="block text-4xl md:text-6xl text-white">Alexander</span>
              <span className="block text-4xl md:text-6xl bg-gradient-to-r from-violet-400 via-violet-300 to-cyan-400 bg-clip-text text-transparent">
                Bueno Santiago
              </span>
            </h1>

            {/* Typing SVG */}
            <div className="mb-8">
              <img
                src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=18&duration=4000&pause=500&color=9615F7&center=false&width=435&lines=Seja+Bem-Vindo!;Sou+Desenvolvedor+Web+FullStack;E+Estudante+de+Sistemas+para+Internet"
                alt="Typing SVG"
                className="h-8"
              />
            </div>

            {/* Description */}
            <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-lg">
              Transformo ideias complexas em soluções digitais elegantes e funcionais.
              Especializado em{' '}
              <span className="text-violet-300 font-medium">React</span>,{' '}
              <span className="text-violet-300 font-medium">Next.js</span> e{' '}
              <span className="text-violet-300 font-medium">Node.js</span> — cada projeto
              é uma oportunidade de aplicar arquitetura limpa e código testável.
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
              <a
                href="/src/assets/Alex Santiago - Dev.pdf"
                download
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-violet-600/30 text-violet-300 font-display font-semibold text-sm hover:border-violet-500 hover:bg-violet-600/10 transition-all duration-300 hover:-translate-y-0.5"
              >
                <Download size={15} />
                Download CV
              </a>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs text-slate-600">SOCIAL</span>
              <div className="h-px w-8 bg-slate-700" />
              {[
                { icon: Github, href: 'https://github.com/DevAlex-full', label: 'GitHub' },
                { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
                { icon: Mail, href: 'mailto:alex.bueno22@hotmail.com', label: 'Email' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
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
            {/* Floating card */}
            <div className="relative">
              {/* Main profile visual */}
              <div className="w-72 h-72 rounded-2xl border border-violet-600/30 bg-bg-card relative overflow-hidden shadow-card">
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-transparent z-10" />

                {/* Foto real */}
                <img
                  src="/imagens/alex%20(1).jpeg"
                  alt="Alexander Bueno Santiago"
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement
                    if (fallback) fallback.style.display = 'flex'
                  }}
                />
                {/* Fallback se foto não existir */}
                <div
                  className="hidden absolute inset-0 items-center justify-center"
                  style={{ display: 'none' }}
                >
                  <div className="text-center">
                    <div className="w-28 h-28 rounded-full border-2 border-violet-500/50 bg-violet-600/20 flex items-center justify-center mx-auto mb-4">
                      <span className="font-display text-4xl font-bold text-violet-300">A</span>
                    </div>
                    <p className="font-display font-bold text-white">Alexander</p>
                    <p className="font-mono text-xs text-violet-400 mt-1">Full Stack Dev</p>
                  </div>
                </div>

                {/* Scan line effect */}
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
                <p className="font-mono text-xs text-slate-500">projetos</p>
                <p className="font-display font-bold text-cyan-400 text-xl mt-0.5">{projects.length}+</p>
              </div>

              <div className="absolute top-1/2 -right-16 bg-bg-card border border-violet-600/20 rounded-xl px-4 py-2.5 shadow-card animate-float" style={{ animationDelay: '1s' }}>
                <p className="font-mono text-xs text-slate-500">status</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="font-mono text-xs text-green-400">available</span>
                </div>
              </div>

              {/* Orbit ring */}
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