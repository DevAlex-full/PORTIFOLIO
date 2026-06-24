'use client'

// 📁 CAMINHO: components/sections/Testimonials.tsx (CRIADO)
// Seção pública "O que meus clientes dizem" — consome GET /api/feedbacks
// via useEffect. Exibe apenas feedbacks com active: true.
// Feedbacks com featured: true recebem destaque visual.

import { useState, useEffect } from 'react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { getFeedbacks }  from '@/services/public.service'
import type { FeedbackData } from '@/types/api'
import { Star, Quote, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={13}
          className={i < rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}
        />
      ))}
    </div>
  )
}

interface TestimonialsProps {
  // Permite receber dados pré-buscados via SSR (HomeContent) ou buscar
  // sozinho via useEffect se não receber nada.
  initialData?: FeedbackData[]
}

export function Testimonials({ initialData }: TestimonialsProps) {
  const [feedbacks, setFeedbacks] = useState<FeedbackData[]>(initialData ?? [])
  const [loading,   setLoading]   = useState(!initialData)

  useEffect(() => {
    if (initialData) return
    getFeedbacks()
      .then(setFeedbacks)
      .catch(() => setFeedbacks([]))
      .finally(() => setLoading(false))
  }, [initialData])

  // Não renderiza a seção se não houver feedbacks
  if (!loading && feedbacks.length === 0) return null

  const featured = feedbacks.filter(f => f.featured)
  const regular  = feedbacks.filter(f => !f.featured)

  return (
    <section id="testimonials" className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          title="O que meus clientes dizem"
          description="Feedbacks reais de pessoas e empresas que trabalharam comigo"
        />

        {loading && (
          <div className="flex justify-center py-16">
            <Loader2 size={24} className="text-violet-400 animate-spin" />
          </div>
        )}

        {!loading && (
          <div className="space-y-6">
            {/* Feedbacks em destaque */}
            {featured.length > 0 && (
              <div className="grid md:grid-cols-1 lg:grid-cols-1 gap-6">
                {featured.map(fb => (
                  <div
                    key={fb.id}
                    className="relative p-8 rounded-2xl border border-violet-500/30 bg-bg-card overflow-hidden"
                  >
                    {/* Glow decorativo */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10">
                      {/* Quote icon */}
                      <Quote size={32} className="text-violet-600/40 mb-6" />

                      {/* Content */}
                      <blockquote className="text-slate-300 text-base leading-relaxed mb-6 whitespace-pre-line">
                        {fb.content}
                      </blockquote>

                      {/* Author */}
                      <div className="flex items-center gap-4">
                        {fb.imageUrl ? (
                          <img
                            src={fb.imageUrl}
                            alt={fb.clientName}
                            className="w-12 h-12 rounded-full object-cover border-2 border-violet-500/30"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-violet-600/20 border-2 border-violet-500/30 flex items-center justify-center flex-shrink-0">
                            <span className="font-display font-bold text-violet-300 text-lg">
                              {fb.clientName[0].toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="font-display font-bold text-white">{fb.clientName}</p>
                          <p className="font-mono text-xs text-slate-500">
                            {[fb.clientRole, fb.company].filter(Boolean).join(' — ')}
                          </p>
                          {fb.projectName && (
                            <p className="font-mono text-[10px] text-violet-400 mt-0.5">
                              Projeto: {fb.projectName}
                            </p>
                          )}
                        </div>
                        <div className="ml-auto">
                          <StarRating rating={fb.rating} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Feedbacks regulares em grid */}
            {regular.length > 0 && (
              <div className={cn(
                'grid gap-4',
                regular.length === 1 ? 'md:grid-cols-1 max-w-xl' :
                regular.length === 2 ? 'md:grid-cols-2' :
                'md:grid-cols-2 lg:grid-cols-3'
              )}>
                {regular.map(fb => (
                  <div
                    key={fb.id}
                    className="p-6 rounded-xl border border-violet-600/15 bg-bg-card hover:border-violet-500/30 transition-all duration-300"
                  >
                    <Quote size={20} className="text-violet-600/30 mb-4" />
                    <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-5">
                      {fb.content}
                    </p>
                    <div className="flex items-center gap-3">
                      {fb.imageUrl ? (
                        <img src={fb.imageUrl} alt={fb.clientName} className="w-9 h-9 rounded-full object-cover border border-violet-500/20" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-violet-600/15 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
                          <span className="font-display font-bold text-violet-300 text-sm">
                            {fb.clientName[0].toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-display font-semibold text-white text-sm truncate">{fb.clientName}</p>
                        {fb.clientRole && (
                          <p className="font-mono text-[10px] text-slate-600 truncate">{fb.clientRole}</p>
                        )}
                      </div>
                      <StarRating rating={fb.rating} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}