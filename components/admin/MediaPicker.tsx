'use client'

import { useState, useEffect, useRef } from 'react'
import { mediaService } from '@/services/admin.service'
import { Image as ImageIcon, Upload, X, Search, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { MediaData } from '@/types/api'
import { toast } from 'sonner'

interface MediaPickerProps {
  value?:    string
  onChange:  (url: string) => void
  label?:    string
  accept?:   'image' | 'pdf' | 'all'
}

export function MediaPicker({ value, onChange, label = 'Imagem', accept = 'image' }: MediaPickerProps) {
  const [open,    setOpen]    = useState(false)
  const [media,   setMedia]   = useState<MediaData[]>([])
  const [search,  setSearch]  = useState('')
  const [page,    setPage]    = useState(1)
  const [total,   setTotal]   = useState(0)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [selected,  setSelected]  = useState<string | null>(value ?? null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    loadMedia()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, search, page])

  async function loadMedia() {
    setLoading(true)
    try {
      const { data } = await mediaService.getAll({ page, limit: 20, search: search || undefined })
      setMedia(data.items)
      setTotal(data.total)
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const { data } = await mediaService.upload(file)
      onChange(data.url)
      setSelected(data.url)
      setOpen(false)
      toast.success('Arquivo enviado com sucesso!')
    } catch {
      toast.error('Erro ao enviar arquivo.')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  function handleSelect(url: string) {
    setSelected(url)
  }

  function handleConfirm() {
    if (selected) {
      onChange(selected)
      setOpen(false)
    }
  }

  const isImage = (url: string) => /\.(jpg|jpeg|png|webp|gif)$/i.test(url)

  return (
    <div>
      <p className="font-mono text-xs text-slate-500 mb-2">{label}</p>

      {/* Preview + trigger */}
      <div
        onClick={() => setOpen(true)}
        className="relative w-full h-36 rounded-xl border border-violet-600/20 bg-slate-900/40 overflow-hidden cursor-pointer hover:border-violet-500/40 transition-colors group flex items-center justify-center"
      >
        {value ? (
          <>
            {isImage(value) ? (
              <img src={value} alt="preview" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-slate-400">
                <ImageIcon size={28} />
                <p className="font-mono text-xs">PDF selecionado</p>
              </div>
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <p className="font-mono text-xs text-white">Trocar arquivo</p>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-slate-600 group-hover:text-slate-400 transition-colors">
            <ImageIcon size={28} />
            <p className="font-mono text-xs">Selecionar {label.toLowerCase()}</p>
          </div>
        )}
      </div>

      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="mt-1 font-mono text-[10px] text-slate-600 hover:text-red-400 transition-colors"
        >
          Remover
        </button>
      )}

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} />

          <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0d0b18] border border-violet-600/20 rounded-2xl flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-violet-600/10">
              <div>
                <h3 className="font-display font-bold text-white">Biblioteca de Mídias</h3>
                <p className="font-mono text-xs text-slate-500 mt-0.5">{total} arquivo{total !== 1 ? 's' : ''}</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  ref={fileRef}
                  type="file"
                  accept={accept === 'image' ? 'image/*' : accept === 'pdf' ? 'application/pdf' : 'image/*,application/pdf'}
                  className="hidden"
                  onChange={handleUpload}
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition-colors disabled:opacity-50"
                >
                  <Upload size={14} />
                  {uploading ? 'Enviando...' : 'Upload'}
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="px-5 py-3 border-b border-violet-600/10">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Buscar arquivos..."
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1) }}
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-700 bg-slate-900/60 text-slate-300 placeholder-slate-600 font-mono text-xs focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto p-5">
              {loading ? (
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="aspect-square rounded-lg bg-slate-800 animate-pulse" />
                  ))}
                </div>
              ) : media.length === 0 ? (
                <div className="text-center py-16 text-slate-600">
                  <ImageIcon size={40} className="mx-auto mb-3" />
                  <p className="font-mono text-sm">Nenhum arquivo encontrado</p>
                </div>
              ) : (
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
                  {media.map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelect(item.url)}
                      className={cn(
                        'relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200',
                        selected === item.url
                          ? 'border-violet-500 ring-2 ring-violet-500/30'
                          : 'border-transparent hover:border-violet-500/50'
                      )}
                    >
                      {item.mimeType.startsWith('image/') ? (
                        <img
                          src={item.url}
                          alt={item.originalName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                          <p className="font-mono text-[8px] text-slate-500 text-center px-1 break-all">
                            {item.originalName.slice(0, 20)}
                          </p>
                        </div>
                      )}
                      {selected === item.url && (
                        <div className="absolute inset-0 bg-violet-600/30 flex items-center justify-center">
                          <Check size={20} className="text-white drop-shadow" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-5 border-t border-violet-600/10">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-400 text-xs disabled:opacity-30 hover:text-white transition-colors"
                >
                  Anterior
                </button>
                <span className="font-mono text-xs text-slate-600">{page}</span>
                <button
                  type="button"
                  onClick={() => setPage(p => p + 1)}
                  disabled={page * 20 >= total}
                  className="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-400 text-xs disabled:opacity-30 hover:text-white transition-colors"
                >
                  Próxima
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-700 text-slate-400 text-sm hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={!selected}
                  className="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition-colors disabled:opacity-40"
                >
                  Selecionar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}