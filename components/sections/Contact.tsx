// 📁 CAMINHO: portfolio/components/sections/Contact.tsx
'use client'

import { useState } from 'react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { cn } from '@/lib/utils'
import { Mail, Phone, MapPin, Github, Linkedin, Instagram, Send, CheckCircle } from 'lucide-react'

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'alex.bueno22@hotmail.com',
    href: 'mailto:alex.bueno22@hotmail.com',
  },
  {
    icon: Phone,
    label: 'Telefone',
    value: '+55 11 98394-3905',
    href: 'tel:+5511983943905',
  },
  {
    icon: MapPin,
    label: 'Localização',
    value: 'São Paulo, SP',
    href: null,
  },
  {
    icon: Github,
    label: 'GitHub',
    value: 'DevAlex-full',
    href: 'https://github.com/DevAlex-full',
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    value: 'alexander-bueno-43823a358',
    href: 'https://www.linkedin.com/in/alexander-bueno-43823a358/',
  },
  {
    icon: Instagram,
    label: 'Instagram',
    value: '@devalex_fullstack',
    href: 'https://www.instagram.com/devalex_fullstack/',
  },
]

export function Contact() {
  const { ref, isVisible } = useScrollAnimation()
  const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    await new Promise((r) => setTimeout(r, 1500))
    setSent(true)
    setSending(false)
  }

  return (
    <section id="contact" className="py-32 relative">
      <div className="absolute inset-0 bg-bg-secondary/30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative">
        <SectionHeader
          title="Entre em Contato"
          description="Vamos trabalhar juntos no seu próximo projeto"
        />

        <div
          ref={ref}
          className={cn(
            'grid lg:grid-cols-2 gap-12 transition-all duration-700',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
        >
          {/* Left: Info */}
          <div>
            <h3 className="font-display font-bold text-white text-xl mb-2">Vamos conversar!</h3>
            <p className="text-slate-400 leading-relaxed mb-8">
              Estou sempre aberto a discutir novas oportunidades e projetos interessantes.
              Entre em contato através dos canais abaixo:
            </p>

            <div className="space-y-3">
              {contactInfo.map(({ icon: Icon, label, value, href }) => (
                <div
                  key={label}
                  className="flex items-center gap-4 p-4 rounded-xl border border-violet-600/15 bg-bg-card hover:border-violet-500/30 transition-all group"
                >
                  <div className="w-9 h-9 rounded-lg bg-violet-600/15 border border-violet-600/20 flex items-center justify-center flex-shrink-0 group-hover:bg-violet-600/25 transition-colors">
                    <Icon size={16} className="text-violet-400" />
                  </div>
                  <div>
                    <p className="font-mono text-xs text-slate-600">{label}</p>
                    {href ? (
                      <a
                        href={href}
                        target={href.startsWith('http') ? '_blank' : undefined}
                        rel="noopener noreferrer"
                        className="font-body text-sm text-slate-300 hover:text-violet-300 transition-colors"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="font-body text-sm text-slate-300">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <div className="p-8 rounded-2xl border border-violet-600/20 bg-bg-card">
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <CheckCircle size={48} className="text-green-400 mb-4" />
                <h3 className="font-display font-bold text-white text-xl mb-2">Mensagem Enviada!</h3>
                <p className="text-slate-400">Obrigado pelo contato. Responderei em breve!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="font-mono text-xs text-slate-500 block mb-2">Seu Nome</label>
                  <input
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState((s) => ({ ...s, name: e.target.value }))}
                    placeholder="Seu Nome"
                    className="w-full px-4 py-3 rounded-lg border border-violet-600/20 bg-bg-primary text-slate-300 placeholder-slate-700 font-body text-sm focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="font-mono text-xs text-slate-500 block mb-2">Seu Email</label>
                  <input
                    type="email"
                    required
                    value={formState.email}
                    onChange={(e) => setFormState((s) => ({ ...s, email: e.target.value }))}
                    placeholder="Seu Email"
                    className="w-full px-4 py-3 rounded-lg border border-violet-600/20 bg-bg-primary text-slate-300 placeholder-slate-700 font-body text-sm focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="font-mono text-xs text-slate-500 block mb-2">Assunto</label>
                  <input
                    type="text"
                    required
                    value={formState.subject}
                    onChange={(e) => setFormState((s) => ({ ...s, subject: e.target.value }))}
                    placeholder="Assunto"
                    className="w-full px-4 py-3 rounded-lg border border-violet-600/20 bg-bg-primary text-slate-300 placeholder-slate-700 font-body text-sm focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="font-mono text-xs text-slate-500 block mb-2">Sua Mensagem</label>
                  <textarea
                    required
                    rows={5}
                    value={formState.message}
                    onChange={(e) => setFormState((s) => ({ ...s, message: e.target.value }))}
                    placeholder="Sua Mensagem"
                    className="w-full px-4 py-3 rounded-lg border border-violet-600/20 bg-bg-primary text-slate-300 placeholder-slate-700 font-body text-sm focus:outline-none focus:border-violet-500 transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-violet-600 text-white font-display font-semibold text-sm hover:bg-violet-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-glow-violet"
                >
                  {sending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      Enviar Mensagem
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}