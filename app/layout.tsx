

import type { Metadata } from 'next'
// @ts-ignore: global CSS import type declarations
import './globals.css'
import { Providers }       from './providers'
import { getSiteSettings } from '@/services/public.service'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()

  return {
    title:       settings.siteTitle    ?? 'Alexander Bueno Santiago — Desenvolvedor Full Stack',
    description: settings.description ?? 'Desenvolvedor Full Stack com experiência em sistemas web, SaaS, aplicações desktop, APIs e automações.',
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
      <body className="min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}