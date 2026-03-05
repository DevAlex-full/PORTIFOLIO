// 📁 CAMINHO: portfolio/components/layout/Footer.tsx
'use client'

import { Github, Linkedin, Instagram, Heart } from 'lucide-react'

const socialLinks = [
  {
    icon: Github,
    href: 'https://github.com/DevAlex-full',
    label: 'GitHub',
  },
  {
    icon: Linkedin,
    href: 'https://www.linkedin.com/in/alexander-bueno-43823a358/',
    label: 'LinkedIn',
  },
  {
    icon: Instagram,
    href: 'https://www.instagram.com/devalex_fullstack/',
    label: 'Instagram',
  },
]

const navLinks = [
  { label: 'Sobre', href: '#about' },
  { label: 'Habilidades', href: '#skills' },
  { label: 'Certificações', href: '#certifications' },
  { label: 'Projetos', href: '#projects' },
  { label: 'Contato', href: '#contact' },
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative border-t border-violet-600/10 bg-bg-secondary/50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg overflow-hidden border border-violet-600/30 bg-violet-600/10 flex items-center justify-center">
                <img
                  src="/imagens/logo alex.png"
                  alt="Logo Alexander"
                  width={36}
                  height={36}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <p className="font-display font-bold text-white text-sm">Alexander Bueno Santiago</p>
                <p className="font-mono text-xs text-slate-500">Full Stack Developer</p>
              </div>
            </div>
            <p className="font-body text-sm text-slate-500 leading-relaxed max-w-xs">
              Transformando ideias em experiências digitais elegantes e funcionais.
            </p>
          </div>

          {/* Nav */}
          <div>
            <p className="font-mono text-xs text-slate-600 uppercase tracking-widest mb-4">Navegação</p>
            <ul className="space-y-2">
              {navLinks.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="font-body text-sm text-slate-500 hover:text-violet-400 transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <p className="font-mono text-xs text-slate-600 uppercase tracking-widest mb-4">Redes Sociais</p>
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-lg border border-violet-600/20 flex items-center justify-center text-slate-400 hover:text-white hover:border-violet-500/50 hover:bg-violet-600/15 transition-all duration-300"
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
            <a
              href="#contact"
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-violet-600 text-white font-display font-semibold text-sm hover:bg-violet-500 transition-all"
            >
              Contrate-me
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-violet-600/10 pt-6 flex flex-col items-center gap-2 text-center">
          <p className="font-body text-xs text-slate-500">
            © {year} Alexander Bueno Santiago — Todos os direitos reservados.
          </p>
          <p className="font-body text-xs text-slate-600 flex items-center gap-1.5">
            Desenvolvido por DevAlex-full
            <Heart size={11} className="text-violet-400 fill-violet-400" />
            e muito código
            <span className="ml-1 font-mono text-[10px] px-1.5 py-0.5 rounded border border-violet-600/30 text-violet-500">
              v2.0
            </span>
          </p>
        </div>
      </div>
    </footer>
  )
}