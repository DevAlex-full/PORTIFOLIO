

import { Suspense }       from 'react'
import { HomeContent }    from '@/components/sections/HomeContent'
import { getHomeData }    from '@/services/public.service'

// Revalida a cada 60 segundos (ISR)
export const revalidate = 60

export default async function Home() {
  const data = await getHomeData()

  return (
    <Suspense fallback={null}>
      <HomeContent {...data} />
    </Suspense>
  )
}