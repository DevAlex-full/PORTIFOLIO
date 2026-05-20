// 📁 CAMINHO: app/layout.tsx

import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'
import { Analytics } from '@vercel/analytics/react'

export const metadata: Metadata = {
  title: 'Alexander Bueno Santiago — Desenvolvedor Full Stack',
  description:
    'Desenvolvedor Full Stack com experiência em sistemas web, SaaS, aplicações desktop, APIs e automações. Do planejamento à entrega, soluções digitais completas para o seu negócio.',
  keywords: [
    'Full Stack',
    'React',
    'Next.js',
    'TypeScript',
    'Node.js',
    'Python',
    'SaaS',
    'Desktop',
    'Freelancer',
    'Developer',
    'Portfolio',
  ],
  authors: [{ name: 'Alexander Bueno Santiago' }],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-32x32.png',
  },
  openGraph: {
    title: 'Alexander Bueno Santiago — Desenvolvedor Full Stack',
    description:
      'Sistemas web, SaaS, aplicações desktop e automações. Soluções digitais completas do planejamento à entrega.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="mesh-bg grid-bg min-h-screen">
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
        <Analytics />
      </body>
    </html>
  )
}