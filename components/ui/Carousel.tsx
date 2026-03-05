// 📁 CAMINHO: portfolio/components/ui/Carousel.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CarouselProps {
  images: { src: string; alt: string }[]
}

export function Carousel({ images }: CarouselProps) {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  const next = useCallback(() => {
    setCurrent((c) => (c === images.length - 1 ? 0 : c + 1))
  }, [images.length])

  const prev = useCallback(() => {
    setCurrent((c) => (c === 0 ? images.length - 1 : c - 1))
  }, [images.length])

  // Auto-play a cada 3s — pausa se o usuário estiver interagindo
  useEffect(() => {
    if (images.length <= 1 || paused) return
    const timer = setInterval(next, 3000)
    return () => clearInterval(timer)
  }, [images.length, paused, next])

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation()
    setPaused(true)
    prev()
    // Retoma auto-play após 6s de inatividade
    setTimeout(() => setPaused(false), 6000)
  }

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    setPaused(true)
    next()
    setTimeout(() => setPaused(false), 6000)
  }

  const handleDot = (i: number) => {
    setPaused(true)
    setCurrent(i)
    setTimeout(() => setPaused(false), 6000)
  }

  if (images.length === 1) {
    return (
      <div className="relative h-52 overflow-hidden bg-bg-secondary">
        <img
          src={images[0].src}
          alt={images[0].alt}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-card via-transparent to-transparent opacity-60" />
      </div>
    )
  }

  return (
    <div
      className="relative h-52 overflow-hidden bg-bg-secondary group/carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Track */}
      <div
        className="flex h-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {images.map((img) => (
          <div key={img.src} className="min-w-full h-full flex-shrink-0">
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-bg-card via-transparent to-transparent opacity-60 pointer-events-none" />

      {/* Prev button */}
      <button
        onClick={handlePrev}
        className={cn(
          'absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full z-10',
          'bg-bg-primary/70 backdrop-blur-sm border border-violet-600/30',
          'flex items-center justify-center text-white',
          'opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-200',
          'hover:bg-violet-600/60'
        )}
        aria-label="Imagem anterior"
      >
        <ChevronLeft size={14} />
      </button>

      {/* Next button */}
      <button
        onClick={handleNext}
        className={cn(
          'absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full z-10',
          'bg-bg-primary/70 backdrop-blur-sm border border-violet-600/30',
          'flex items-center justify-center text-white',
          'opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-200',
          'hover:bg-violet-600/60'
        )}
        aria-label="Próxima imagem"
      >
        <ChevronRight size={14} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => handleDot(i)}
            className={cn(
              'h-1.5 rounded-full transition-all duration-300',
              i === current
                ? 'bg-violet-400 w-4'
                : 'bg-white/40 w-1.5 hover:bg-white/70'
            )}
            aria-label={`Ir para imagem ${i + 1}`}
          />
        ))}
      </div>

      {/* Barra de progresso do auto-play */}
      {!paused && (
        <div className="absolute bottom-0 left-0 h-px bg-violet-500/40 z-10 w-full">
          <div
            key={current}
            className="h-full bg-violet-400"
            style={{
              animation: 'progressBar 3s linear forwards',
            }}
          />
        </div>
      )}
    </div>
  )
}