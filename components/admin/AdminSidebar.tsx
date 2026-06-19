'use client'

import Link       from 'next/link'
import { usePathname } from 'next/navigation'
import { cn }     from '@/lib/utils'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import {
  LayoutDashboard, FolderKanban, Award, Zap, Briefcase,
  User, Info, Phone, Settings, Search, Image, Users,
  X, LogOut, ChevronRight, Building2,
} from 'lucide-react'

export interface NavItem {
  label:    string
  href:     string
  icon:     React.ElementType
  badge?:   number
}

const NAV_GROUPS = [
  {
    label: 'Geral',
    items: [
      { label: 'Dashboard',   href: '/admin/dashboard',    icon: LayoutDashboard },
      { label: 'Mídias',      href: '/admin/midias',       icon: Image           },
      { label: 'Leads',       href: '/admin/leads',        icon: Users           },
    ],
  },
  {
    label: 'Portfólio',
    items: [
      { label: 'Projetos',      href: '/admin/projetos',      icon: FolderKanban },
      { label: 'Clientes',      href: '/admin/clientes',      icon: Building2    },
      { label: 'Certificados',  href: '/admin/certificados',  icon: Award        },
      { label: 'Habilidades',   href: '/admin/habilidades',   icon: Zap          },
      { label: 'Serviços',      href: '/admin/servicos',      icon: Briefcase    },
    ],
  },
  {
    label: 'Conteúdo',
    items: [
      { label: 'Hero',     href: '/admin/hero',     icon: User   },
      { label: 'Sobre',    href: '/admin/sobre',    icon: Info   },
      { label: 'Contato',  href: '/admin/contato',  icon: Phone  },
    ],
  },
  {
    label: 'Configurações',
    items: [
      { label: 'SEO',            href: '/admin/seo',            icon: Search   },
      { label: 'Configurações',  href: '/admin/configuracoes',  icon: Settings },
    ],
  },
]

interface AdminSidebarProps {
  isOpen:    boolean
  onClose:   () => void
  newLeads?: number
}

export function AdminSidebar({ isOpen, onClose, newLeads = 0 }: AdminSidebarProps) {
  const pathname   = usePathname()
  const { admin, logout } = useAdminAuth()

  return (
    <>
      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed top-0 left-0 h-full w-64 z-50 flex flex-col',
        'bg-[#0d0b18] border-r border-violet-600/15',
        'transition-transform duration-300 ease-in-out',
        isOpen ? 'translate-x-0' : '-translate-x-full',
        'lg:translate-x-0 lg:static lg:z-auto'
      )}>
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-violet-600/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
              <span className="font-display font-bold text-white text-sm">A</span>
            </div>
            <div>
              <p className="font-display font-bold text-white text-sm">Portfolio CMS</p>
              <p className="font-mono text-[10px] text-violet-400">Admin Panel</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          {NAV_GROUPS.map(group => (
            <div key={group.label}>
              <p className="font-mono text-[10px] text-slate-600 uppercase tracking-widest px-2 mb-2">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map(item => {
                  const Icon    = item.icon
                  const active  = pathname === item.href || pathname.startsWith(item.href + '/')
                  const isLeads = item.href === '/admin/leads'

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        'flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group',
                        active
                          ? 'bg-violet-600/20 border border-violet-500/30 text-violet-300'
                          : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={15} className={active ? 'text-violet-400' : 'text-slate-600 group-hover:text-slate-400'} />
                        <span className="font-body text-sm">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {isLeads && newLeads > 0 && (
                          <span className="w-5 h-5 rounded-full bg-violet-600 flex items-center justify-center font-mono text-[10px] text-white">
                            {newLeads > 9 ? '9+' : newLeads}
                          </span>
                        )}
                        {active && <ChevronRight size={12} className="text-violet-400" />}
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User */}
        <div className="px-3 py-4 border-t border-violet-600/10">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-slate-800/40 border border-slate-700/30 mb-2">
            <div className="w-8 h-8 rounded-full bg-violet-600/30 border border-violet-500/30 flex items-center justify-center flex-shrink-0">
              <span className="font-display font-bold text-violet-300 text-sm">
                {admin?.name?.[0] ?? 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display font-semibold text-white text-xs truncate">{admin?.name ?? 'Admin'}</p>
              <p className="font-mono text-[10px] text-slate-600 truncate">{admin?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 border border-transparent hover:border-red-500/20"
          >
            <LogOut size={14} />
            <span className="font-body text-sm">Sair</span>
          </button>
        </div>
      </aside>
    </>
  )
}