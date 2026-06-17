

import { Header }         from '@/components/layout/Header'
import { Footer }         from '@/components/layout/Footer'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'
import { Analytics }      from '@vercel/analytics/react'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mesh-bg grid-bg min-h-screen">
      <Header />
      <main>{children}</main>
      <Footer />
      <WhatsAppButton />
      <Analytics />
    </div>
  )
}