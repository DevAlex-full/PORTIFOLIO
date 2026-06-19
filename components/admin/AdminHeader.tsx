'use client'


import Link from 'next/link'
import { Menu, ExternalLink, Bell } from 'lucide-react'

interface AdminHeaderProps {
  title:       string
  onMenuClick: () => void
  newLeads?:   number
}

export function AdminHeader({ title, onMenuClick, newLeads = 0 }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-[#0a0812]/90 backdrop-blur-md border-b border-violet-600/10">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <Menu size={18} />
        </button>
        <div>
          <h1 className="font-display font-bold text-white text-lg leading-none">{title}</h1>
          <p className="font-mono text-[10px] text-slate-600 mt-0.5">Portfolio CMS</p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Badge de leads novos */}
        {newLeads > 0 && (
          <Link
            href="/admin/leads"
            className="relative flex items-center gap-2 px-3 py-2 rounded-lg border border-violet-500/30 bg-violet-600/10 text-violet-300 hover:bg-violet-600/20 transition-colors"
          >
            <Bell size={14} />
            <span className="font-mono text-xs">{newLeads} novo{newLeads > 1 ? 's' : ''}</span>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-violet-500 border-2 border-[#0a0812]" />
          </Link>
        )}

        {/* Ver site */}
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-slate-800/60 transition-colors border border-transparent hover:border-slate-700/40"
        >
          <ExternalLink size={14} />
          <span className="font-mono text-xs hidden sm:block">Ver Site</span>
        </Link>
      </div>
    </header>
  )
}