'use client'

// 📁 CAMINHO: app/admin/(protected)/projetos/page.tsx (CRIADO)

import { useState, useEffect, useCallback } from 'react'
import { AdminShell }      from '@/components/admin/AdminShell'
import { ConfirmDialog }   from '@/components/admin/ConfirmDialog'
import { projectService }  from '@/services/admin.service'
import type { ProjectData } from '@/types/api'
import { toast } from 'sonner'
import { cn }   from '@/lib/utils'
import Link     from 'next/link'
import {
  Plus, Pencil, Trash2, ExternalLink, Star, Eye, EyeOff,
  Loader2, Search, FolderKanban,
} from 'lucide-react'

export default function ProjetosPage() {
  const [projects, setProjects] = useState<ProjectData[]>([])
  const [loading,  setLoading]  = useState(true)
  const [search,   setSearch]   = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)
  const [confirmId,setConfirmId]= useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await projectService.getAll()
      setProjects(data)
    } catch { toast.error('Erro ao carregar projetos.') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  async function toggleActive(p: ProjectData) {
    try {
      await projectService.update(p.id, { active: !p.active })
      setProjects(prev => prev.map(x => x.id === p.id ? { ...x, active: !x.active } : x))
      toast.success(`Projeto ${!p.active ? 'ativado' : 'desativado'}.`)
    } catch { toast.error('Erro ao atualizar status.') }
  }

  async function handleDelete() {
    if (!confirmId) return
    setDeleting(confirmId)
    try {
      await projectService.delete(confirmId)
      setProjects(prev => prev.filter(x => x.id !== confirmId))
      toast.success('Projeto deletado.')
    } catch { toast.error('Erro ao deletar.') }
    finally { setDeleting(null); setConfirmId(null) }
  }

  const filtered = projects.filter(p =>
    !search || p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <AdminShell title="Projetos">
      <div className="max-w-6xl space-y-6">
        {/* Toolbar */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar projetos..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-violet-600/20 bg-[#0d0b18] text-slate-300 placeholder-slate-600 font-mono text-xs focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>
          <Link
            href="/admin/projetos/novo"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition-colors"
          >
            <Plus size={15} /> Novo Projeto
          </Link>
        </div>

        {/* Count */}
        <p className="font-mono text-xs text-slate-600">
          {filtered.length} projeto{filtered.length !== 1 ? 's' : ''}
          {search ? ' encontrado' : ''}
          {search && filtered.length !== 1 ? 's' : ''}
        </p>

        {/* List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={24} className="text-violet-400 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-violet-600/20 rounded-xl">
            <FolderKanban size={32} className="text-slate-700 mx-auto mb-3" />
            <p className="font-mono text-sm text-slate-600">
              {search ? 'Nenhum resultado.' : 'Nenhum projeto cadastrado.'}
            </p>
            {!search && (
              <Link href="/admin/projetos/novo" className="mt-3 inline-block font-mono text-xs text-violet-400 hover:text-violet-300">
                Criar primeiro projeto →
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(p => (
              <div
                key={p.id}
                className={cn(
                  'group flex items-center gap-4 p-4 rounded-xl border bg-[#0d0b18] transition-all duration-200',
                  p.active
                    ? 'border-violet-600/15 hover:border-violet-500/30'
                    : 'border-slate-800/60 opacity-60 hover:opacity-80'
                )}
              >
                {/* Thumb */}
                <div className="w-14 h-14 rounded-lg bg-slate-800 border border-slate-700 overflow-hidden flex-shrink-0">
                  {p.image ? (
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FolderKanban size={20} className="text-slate-600" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {p.featured && <Star size={11} className="text-violet-400 fill-violet-400 flex-shrink-0" />}
                    <p className="font-display font-semibold text-white text-sm truncate">{p.title}</p>
                    {p.highlight && (
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-400 border border-cyan-500/20 whitespace-nowrap">
                        {p.highlight}
                      </span>
                    )}
                  </div>
                  <p className="font-mono text-[10px] text-slate-600 truncate max-w-sm">{p.shortDescription}</p>
                  <div className="flex gap-1 mt-1.5 flex-wrap">
                    {p.tags.slice(0, 4).map(t => (
                      <span key={t} className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-500">
                        {t}
                      </span>
                    ))}
                    {p.tags.length > 4 && (
                      <span className="font-mono text-[9px] text-slate-600">+{p.tags.length - 4}</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  {p.linkDemo && (
                    <a
                      href={p.linkDemo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                    >
                      <ExternalLink size={14} />
                    </a>
                  )}
                  <button
                    onClick={() => toggleActive(p)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                    title={p.active ? 'Desativar' : 'Ativar'}
                  >
                    {p.active ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                  <Link
                    href={`/admin/projetos/${p.id}`}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-violet-400 hover:bg-violet-600/10 transition-colors"
                  >
                    <Pencil size={14} />
                  </Link>
                  <button
                    onClick={() => setConfirmId(p.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!confirmId}
        title="Deletar Projeto"
        description="Esta ação não pode ser desfeita. O projeto será removido permanentemente."
        confirmText="Deletar"
        loading={!!deleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmId(null)}
      />
    </AdminShell>
  )
}