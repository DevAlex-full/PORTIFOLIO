
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title:  'Admin — Portfolio CMS',
  robots: { index: false, follow: false },
}

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#0a0812] min-h-screen">
      {children}
    </div>
  )
}