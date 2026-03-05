'use client'

import { useEffect, useRef } from 'react'

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mouseX = 0
    let mouseY = 0
    let ringX = 0
    let ringY = 0

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`
    }

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const animate = () => {
      ringX = lerp(ringX, mouseX, 0.12)
      ringY = lerp(ringY, mouseY, 0.12)
      ring.style.transform = `translate(${ringX}px, ${ringY}px)`
      requestAnimationFrame(animate)
    }

    const onMouseEnterLink = () => {
      dot.classList.add('scale-150')
      ring.classList.add('scale-150', 'border-violet-400')
    }

    const onMouseLeaveLink = () => {
      dot.classList.remove('scale-150')
      ring.classList.remove('scale-150', 'border-violet-400')
    }

    window.addEventListener('mousemove', onMouseMove)
    animate()

    const links = document.querySelectorAll('a, button, [role="button"]')
    links.forEach((l) => {
      l.addEventListener('mouseenter', onMouseEnterLink)
      l.addEventListener('mouseleave', onMouseLeaveLink)
    })

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 -ml-1 -mt-1 bg-violet-500 rounded-full pointer-events-none z-[99999] transition-transform duration-75"
        style={{ willChange: 'transform' }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-8 h-8 -ml-4 -mt-4 border border-violet-500/60 rounded-full pointer-events-none z-[99998] transition-transform duration-100"
        style={{ willChange: 'transform' }}
      />
    </>
  )
}