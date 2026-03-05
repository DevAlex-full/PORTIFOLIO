import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  href?: string
  target?: string
  rel?: string
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  href,
  target,
  rel,
  onClick,
  type = 'button',
  disabled,
}: ButtonProps) {
  const base =
    'inline-flex items-center gap-2 font-display font-semibold rounded-lg transition-all duration-300 relative overflow-hidden group'

  const variants = {
    primary:
      'bg-violet-600 hover:bg-violet-500 text-white shadow-lg hover:shadow-glow-violet hover:-translate-y-0.5',
    outline:
      'border border-violet-600/40 hover:border-violet-500 text-violet-400 hover:text-white hover:bg-violet-600/10 hover:-translate-y-0.5',
    ghost:
      'text-slate-400 hover:text-white hover:bg-white/5',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  }

  const classes = cn(base, variants[variant], sizes[size], className)

  if (href) {
    return (
      <a href={href} target={target} rel={rel} className={classes}>
        {children}
      </a>
    )
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  )
}