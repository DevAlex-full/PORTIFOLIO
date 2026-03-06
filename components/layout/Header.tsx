'use client'

import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRouter, usePathname } from 'next/navigation'

const navItems = [
  { label: 'Início', href: '#home' },
  { label: 'Sobre', href: '#about' },
  { label: 'Habilidades', href: '#skills' },
  { label: 'Certificações', href: '#certifications' },
  { label: 'Projetos', href: '#projects' },
  { label: 'Contato', href: '#contact' },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20)

      // Active section detection
      const sections = navItems.map((item) => item.href.replace('#', ''))
      for (const section of [...sections].reverse()) {
        const el = document.getElementById(section)
        if (el && window.scrollY >= el.offsetTop - 100) {
          setActiveSection(section)
          break
        }
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNavClick = (href: string) => {
    setMobileOpen(false)
    const id = href.replace('#', '')

    // Se estiver na home, faz scroll direto
    if (pathname === '/') {
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    } else {
      // Se estiver em outra rota (/projects), navega para home + âncora
      router.push(`/${href}`)
    }
  }

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled
          ? 'py-3 bg-bg-primary/80 backdrop-blur-xl border-b border-violet-600/10 shadow-lg'
          : 'py-5 bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#home"
          onClick={(e) => { e.preventDefault(); handleNavClick('#home') }}
          className="flex items-center gap-2 group"
        >
          {/* Logo — arquivo favicon-32x32.png na pasta public/ */}
          <div className="w-9 h-9 rounded-lg overflow-hidden border border-violet-600/30 group-hover:border-violet-500/50 transition-all duration-300 bg-violet-600/10 flex items-center justify-center">
            <img
              src="/imagens/logo alex.png"
              alt="Logo Alexander"
              width={36}
              height={36}
              className="w-full h-full object-contain"
            />
          </div>
          <span className="font-display font-bold text-white text-sm hidden sm:block">
            Alexander<span className="text-violet-400">.</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = activeSection === item.href.replace('#', '')
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => { e.preventDefault(); handleNavClick(item.href) }}
                className={cn(
                  'relative px-4 py-2 font-body text-sm font-medium rounded-lg transition-all duration-300',
                  isActive
                    ? 'text-violet-400'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                )}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-violet-400" />
                )}
              </a>
            )
          })}
        </nav>

        {/* CTA Button */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="/vitrine-clientes"
            className="font-mono text-xs px-4 py-2 rounded-lg border border-cyan-500/30 text-cyan-400 hover:border-cyan-500 hover:bg-cyan-500/10 transition-all duration-300"
          >
            ★ Clientes
          </a>
          <a
            href="/projects"
            className="font-mono text-xs px-4 py-2 rounded-lg border border-violet-600/30 text-violet-400 hover:border-violet-500 hover:bg-violet-600/10 transition-all duration-300"
          >
            Ver Projetos
          </a>
          <a
            href="#contact"
            onClick={(e) => { e.preventDefault(); handleNavClick('#contact') }}
            className="font-mono text-xs px-4 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-500 transition-all duration-300 shadow-lg hover:shadow-glow-violet"
          >
            Contrate-me
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden w-9 h-9 rounded-lg border border-violet-600/20 flex items-center justify-center text-slate-400 hover:text-white hover:border-violet-500/40 transition-all"
          aria-label="Menu"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          'md:hidden absolute top-full left-0 right-0 bg-bg-primary/95 backdrop-blur-xl border-b border-violet-600/10 overflow-hidden transition-all duration-300',
          mobileOpen ? 'max-h-96 py-4' : 'max-h-0'
        )}
      >
        <nav className="flex flex-col px-6 gap-1">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => { e.preventDefault(); handleNavClick(item.href) }}
              className="py-3 px-4 font-body text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={(e) => { e.preventDefault(); handleNavClick('#contact') }}
            className="mt-2 py-3 px-4 font-mono text-sm text-center bg-violet-600 text-white rounded-lg hover:bg-violet-500 transition-all"
          >
            Entre em Contato
          </a>
        </nav>
      </div>
    </header>
  )
}