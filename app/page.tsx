// app/page.tsx (ALTERADO)
// Server Component assíncrono — busca todos os dados no servidor.
// Passa os dados para HomeContent via props. Zero useEffect no site público.

import { Suspense }    from 'react'
import { HomeContent } from '@/components/sections/HomeContent'
import { getHomeData } from '@/services/public.service'

export const revalidate = 60

export default async function Home() {
  const data = await getHomeData()
  return (
    <Suspense fallback={null}>
      <HomeContent {...data} />
    </Suspense>
  )
}