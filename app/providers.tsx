'use client'

/**
 * app/providers.tsx
 * Wrapper de providers globais do Next.js.
 * Envolve apenas o que precisa de contexto client-side.
 */

import { AdminAuthProvider } from '@/contexts/AdminAuthContext'
import { Toaster } from 'sonner'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      {children}
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e1b2e',
            border:     '1px solid rgba(124, 58, 237, 0.3)',
            color:      '#e2e8f0',
          },
        }}
      />
    </AdminAuthProvider>
  )
}