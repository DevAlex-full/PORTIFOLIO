'use client'

import { useState } from 'react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { cn } from '@/lib/utils'
import { Mail, Phone, MapPin, Github, Linkedin, Instagram, MessageCircle } from 'lucide-react'

// Número do WhatsApp (somente dígitos com código do país)
const WHATSAPP_NUMBER = '5511983943905'

const contactInfo = [
  {
    icon: Phone,
    label: 'WhatsApp',
    value: '+55 11 98394-3905',
    href: `https://wa.me/${WHATSAPP_NUMBER}`,
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'alex.bueno22@hotmail.com',
    href: 'mailto:alex.bueno22@hotmail.com',
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
  const [formState, setFormState] = useState({ name: '', subject: '', message: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const text = 
      `Olá, Alexander! 👋\n\n` +
      `*Nome:* ${formState.name}\n` +
      `*Assunto:* ${formState.subject}\n\n` +
      `*Mensagem:*\n${formState.message}`

    const encoded = encodeURIComponent(text)
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, '_blank')
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

          {/* Right: Form → WhatsApp */}
          <div className="p-8 rounded-2xl border border-violet-600/20 bg-bg-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-lg bg-green-500/15 border border-green-500/30 flex items-center justify-center">
                <MessageCircle size={18} className="text-green-400" />
              </div>
              <div>
                <p className="font-display font-semibold text-white text-sm">Enviar pelo WhatsApp</p>
                <p className="font-mono text-xs text-slate-500">Responderei o mais rápido possível</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="font-mono text-xs text-slate-500 block mb-2">Seu Nome *</label>
                <input
                  type="text"
                  required
                  value={formState.name}
                  onChange={(e) => setFormState((s) => ({ ...s, name: e.target.value }))}
                  placeholder="Como posso te chamar?"
                  className="w-full px-4 py-3 rounded-lg border border-violet-600/20 bg-bg-primary text-slate-300 placeholder-slate-700 font-body text-sm focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>

              <div>
                <label className="font-mono text-xs text-slate-500 block mb-2">Assunto *</label>
                <input
                  type="text"
                  required
                  value={formState.subject}
                  onChange={(e) => setFormState((s) => ({ ...s, subject: e.target.value }))}
                  placeholder="Ex: Orçamento de projeto, Parceria..."
                  className="w-full px-4 py-3 rounded-lg border border-violet-600/20 bg-bg-primary text-slate-300 placeholder-slate-700 font-body text-sm focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>

              <div>
                <label className="font-mono text-xs text-slate-500 block mb-2">Sua Mensagem *</label>
                <textarea
                  required
                  rows={5}
                  value={formState.message}
                  onChange={(e) => setFormState((s) => ({ ...s, message: e.target.value }))}
                  placeholder="Descreva seu projeto ou ideia..."
                  className="w-full px-4 py-3 rounded-lg border border-violet-600/20 bg-bg-primary text-slate-300 placeholder-slate-700 font-body text-sm focus:outline-none focus:border-violet-500 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-green-600 text-white font-display font-semibold text-sm hover:bg-green-500 transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                <MessageCircle size={16} />
                Enviar pelo WhatsApp
              </button>

              <p className="text-center font-mono text-xs text-slate-600">
                Ao clicar, o WhatsApp abrirá com a mensagem já preenchida ✓
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}