// 📁 CAMINHO: portfolio/app/layout.tsx

import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Alexander Bueno Santiago — Full Stack Developer',
  description:
    'Desenvolvedor Web Full Stack especializado em React, Next.js, TypeScript e Node.js. Criando experiências digitais incríveis através de código limpo e design criativo.',
  keywords: ['Full Stack', 'React', 'Next.js', 'TypeScript', 'Node.js', 'Developer', 'Portfolio'],
  authors: [{ name: 'Alexander Bueno Santiago' }],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-32x32.png',
  },
  openGraph: {
    title: 'Alexander Bueno Santiago — Full Stack Developer',
    description: 'Desenvolvedor Web Full Stack especializado em React, Next.js e TypeScript.',
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
      </body>
    </html>
  )
}