// app/layout.tsx (ALTERADO)
// Metadata agora vem da API via generateMetadata (SSR).
// Providers injetados para suporte ao painel admin.

import type { Metadata } from 'next'
import './globals.css'
import { Header }          from '@/components/layout/Header'
import { Footer }          from '@/components/layout/Footer'
import { WhatsAppButton }  from '@/components/ui/WhatsAppButton'
import { Analytics }       from '@vercel/analytics/react'
import { Providers }       from './providers'
import { getSiteSettings } from '@/services/public.service'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()

  return {
    title:       settings.siteTitle     ?? 'Alexander Bueno Santiago — Desenvolvedor Full Stack',
    description: settings.description  ?? 'Desenvolvedor Full Stack com experiência em sistemas web, SaaS, aplicações desktop, APIs e automações.',
    keywords:    settings.keywords?.length
      ? settings.keywords
      : ['Full Stack', 'React', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'SaaS', 'Freelancer'],
    authors: [{ name: 'Alexander Bueno Santiago' }],
    icons: {
      icon:     settings.faviconUrl ?? '/favicon.ico',
      shortcut: '/favicon-32x32.png',
    },
    openGraph: {
      title:       settings.ogTitle       ?? settings.siteTitle,
      description: settings.ogDescription ?? settings.description,
      type: 'website',
    },
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="mesh-bg grid-bg min-h-screen">
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
          <WhatsAppButton />
          <Analytics />
        </Providers>
      </body>
    </html>
  )
}