'use client'

// 📁 CAMINHO: app/admin/(protected)/midias/page.tsx (CRIADO)
// Biblioteca de mídias completa com upload drag-drop, grid, busca e paginação.

import { useState, useEffect, useCallback, useRef } from 'react'
import { AdminShell }   from '@/components/admin/AdminShell'
import { ConfirmDialog }from '@/components/admin/ConfirmDialog'
import { mediaService } from '@/services/admin.service'
import type { MediaData } from '@/types/api'
import { toast } from 'sonner'
import { cn }   from '@/lib/utils'
import {
  Upload, Search, Trash2, Loader2, Image as ImageIcon,
  FileText, Copy, Check, X, UploadCloud,
} from 'lucide-react'

function formatBytes(b: number) {
  if (b < 1024) return `${b} B`
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`
  return `${(b / 1024 / 1024).toFixed(1)} MB`
}

export default function MidiasPage() {
  const [media,      setMedia]      = useState<MediaData[]>([])
  const [loading,    setLoading]    = useState(true)
  const [search,     setSearch]     = useState('')
  const [page,       setPage]       = useState(1)
  const [total,      setTotal]      = useState(0)
  const [uploading,  setUploading]  = useState(false)
  const [progress,   setProgress]   = useState(0)
  const [dragging,   setDragging]   = useState(false)
  const [confirmId,  setConfirmId]  = useState<string | null>(null)
  const [deleting,   setDeleting]   = useState(false)
  const [copied,     setCopied]     = useState<string | null>(null)
  const [selected,   setSelected]   = useState<MediaData | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const LIMIT = 24

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await mediaService.getAll({ page, limit: LIMIT, search: search || undefined })
      setMedia(data.items)
      setTotal(data.total)
    } catch { toast.error('Erro ao carregar mídias.') }
    finally { setLoading(false) }
  }, [page, search])

  useEffect(() => { load() }, [load])

  // Reset page on search
  useEffect(() => { setPage(1) }, [search])

  async function uploadFiles(files: FileList | File[]) {
    const arr = Array.from(files)
    if (!arr.length) return
    setUploading(true)
    setProgress(0)
    try {
      if (arr.length === 1) {
        await mediaService.upload(arr[0], pct => setProgress(pct))
        toast.success('Arquivo enviado!')
      } else {
        await mediaService.uploadBatch(arr, pct => setProgress(pct))
        toast.success(`${arr.length} arquivos enviados!`)
      }
      await load()
    } catch { toast.error('Erro no upload.') }
    finally { setUploading(false); setProgress(0) }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files)
  }

  async function copyUrl(url: string) {
    await navigator.clipboard.writeText(url)
    setCopied(url)
    setTimeout(() => setCopied(null), 2000)
  }

  async function handleDelete() {
    if (!confirmId) return
    setDeleting(true)
    try {
      await mediaService.delete(confirmId)
      setMedia(prev => prev.filter(m => m.id !== confirmId))
      if (selected?.id === confirmId) setSelected(null)
      setTotal(t => t - 1)
      toast.success('Arquivo deletado.')
    } catch { toast.error('Erro ao deletar.') }
    finally { setDeleting(false); setConfirmId(null) }
  }

  const totalPages = Math.ceil(total / LIMIT)

  return (
    <AdminShell title="Biblioteca de Mídias">
      <div className="max-w-7xl space-y-6">
        {/* Toolbar */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar arquivos..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-violet-600/20 bg-[#0d0b18] text-slate-300 placeholder-slate-600 font-mono text-xs focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>
          <input
            ref={fileRef}
            type="file"
            multiple
            accept="image/*,application/pdf"
            className="hidden"
            onChange={e => e.target.files && uploadFiles(e.target.files)}
          />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition-colors disabled:opacity-50"
          >
            <Upload size={15} />
            {uploading ? `${progress}%` : 'Upload'}
          </button>
        </div>

        {/* Drag-drop zone */}
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={cn(
            'border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer',
            dragging
              ? 'border-violet-500 bg-violet-600/10'
              : 'border-violet-600/20 hover:border-violet-500/40 hover:bg-violet-600/5'
          )}
          onClick={() => fileRef.current?.click()}
        >
          <UploadCloud size={32} className={cn('mx-auto mb-3', dragging ? 'text-violet-400' : 'text-slate-600')} />
          <p className="font-mono text-sm text-slate-500">
            {dragging ? 'Solte para fazer upload' : 'Arraste arquivos ou clique para selecionar'}
          </p>
          <p className="font-mono text-xs text-slate-700 mt-1">JPG, PNG, WebP, GIF, PDF — Máx 50MB por arquivo</p>

          {/* Upload progress */}
          {uploading && (
            <div className="mt-4 max-w-xs mx-auto">
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-violet-600 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="font-mono text-xs text-violet-400 mt-1">{progress}% enviado</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <p className="font-mono text-xs text-slate-600">{total} arquivo{total !== 1 ? 's' : ''}</p>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} className="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-400 text-xs disabled:opacity-30 hover:text-white transition-colors">Anterior</button>
              <span className="font-mono text-xs text-slate-600">{page}/{totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-400 text-xs disabled:opacity-30 hover:text-white transition-colors">Próxima</button>
            </div>
          )}
        </div>

        {/* Grid + Detail panel */}
        <div className="flex gap-6">
          {/* Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center py-20"><Loader2 size={24} className="text-violet-400 animate-spin" /></div>
            ) : media.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-violet-600/20 rounded-xl">
                <ImageIcon size={32} className="text-slate-700 mx-auto mb-3" />
                <p className="font-mono text-sm text-slate-600">{search ? 'Nenhum resultado.' : 'Nenhum arquivo ainda.'}</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                {media.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setSelected(selected?.id === item.id ? null : item)}
                    className={cn(
                      'relative group aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200',
                      selected?.id === item.id
                        ? 'border-violet-500 ring-2 ring-violet-500/30'
                        : 'border-transparent hover:border-violet-500/50'
                    )}
                  >
                    {item.mimeType.startsWith('image/') ? (
                      <img src={item.url} alt={item.originalName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-slate-800 border border-slate-700 flex flex-col items-center justify-center p-2">
                        <FileText size={20} className="text-slate-500 mb-1" />
                        <p className="font-mono text-[9px] text-slate-600 text-center break-all leading-tight">
                          {item.originalName.slice(0, 20)}
                        </p>
                      </div>
                    )}

                    {/* Hover actions */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={e => { e.stopPropagation(); copyUrl(item.url) }}
                        className="w-7 h-7 rounded-lg bg-slate-900/80 flex items-center justify-center text-white hover:bg-violet-600 transition-colors"
                      >
                        {copied === item.url ? <Check size={13} /> : <Copy size={13} />}
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); setConfirmId(item.id) }}
                        className="w-7 h-7 rounded-lg bg-slate-900/80 flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Detail panel */}
          {selected && (
            <div className="w-64 flex-shrink-0 bg-[#0d0b18] border border-violet-600/15 rounded-xl p-5 space-y-4 self-start sticky top-6">
              <div className="flex items-center justify-between">
                <p className="font-display font-semibold text-white text-sm">Detalhes</p>
                <button onClick={() => setSelected(null)} className="text-slate-500 hover:text-white transition-colors">
                  <X size={14} />
                </button>
              </div>

              {selected.mimeType.startsWith('image/') ? (
                <img src={selected.url} alt={selected.originalName} className="w-full aspect-square object-cover rounded-lg" />
              ) : (
                <div className="w-full aspect-square bg-slate-800 rounded-lg flex items-center justify-center">
                  <FileText size={40} className="text-slate-600" />
                </div>
              )}

              <div className="space-y-2">
                <div>
                  <p className="font-mono text-[10px] text-slate-600">Nome</p>
                  <p className="font-body text-xs text-slate-300 break-all">{selected.originalName}</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] text-slate-600">Tipo</p>
                  <p className="font-mono text-xs text-slate-400">{selected.mimeType}</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] text-slate-600">Tamanho</p>
                  <p className="font-mono text-xs text-slate-400">{formatBytes(selected.size)}</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] text-slate-600">Enviado em</p>
                  <p className="font-mono text-xs text-slate-400">{new Date(selected.createdAt).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>

              <button
                onClick={() => copyUrl(selected.url)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-violet-600/30 text-violet-300 text-sm hover:bg-violet-600/10 transition-colors"
              >
                {copied === selected.url ? <><Check size={14} /> Copiado!</> : <><Copy size={14} /> Copiar URL</>}
              </button>

              <button
                onClick={() => { setConfirmId(selected.id); setSelected(null) }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-500/20 text-red-400 text-sm hover:bg-red-500/10 transition-colors"
              >
                <Trash2 size={14} /> Deletar
              </button>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={!!confirmId}
        title="Deletar Arquivo"
        description="O arquivo será removido permanentemente do Storage."
        confirmText="Deletar"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmId(null)}
      />
    </AdminShell>
  )
}