'use client'


import { useState, useRef, useCallback } from 'react'
import { mediaService } from '@/services/admin.service'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import {
  UploadCloud, X, Loader2, Star, ChevronLeft, ChevronRight, ImageOff,
} from 'lucide-react'
import type { ProjectImage } from '@/types/api'

interface MultiImageUploadProps {
  images:    ProjectImage[]
  onChange:  (images: ProjectImage[]) => void
  maxImages?: number
  label?:     string
}

interface UploadingSlot {
  localId:  string
  localUrl: string
  progress: number
}

const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']

export function MultiImageUpload({
  images, onChange, maxImages = 3, label = 'Imagens',
}: MultiImageUploadProps) {
  const [dragging,  setDragging]  = useState(false)
  const [uploading, setUploading] = useState<UploadingSlot[]>([])
  const fileRef = useRef<HTMLInputElement>(null)

  const remainingSlots = maxImages - images.length - uploading.length
  const isFull = remainingSlots <= 0

  const processFiles = useCallback(async (fileList: FileList | File[]) => {
    const files = Array.from(fileList)
      .filter(f => ACCEPTED_TYPES.includes(f.type))
      .slice(0, Math.max(0, remainingSlots))

    if (files.length === 0) {
      if (fileList.length > 0) {
        toast.error(isFull
          ? `Limite de ${maxImages} imagens atingido.`
          : 'Apenas PNG, JPG ou WEBP são aceitos.'
        )
      }
      return
    }

    // Cria um slot local "enviando..." por arquivo, com preview imediato
    const slots: UploadingSlot[] = files.map(f => ({
      localId:  `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      localUrl: URL.createObjectURL(f),
      progress: 0,
    }))
    setUploading(prev => [...prev, ...slots])

    await Promise.all(files.map(async (file, idx) => {
      const slot = slots[idx]
      try {
        const { data } = await mediaService.upload(file, pct => {
          setUploading(prev => prev.map(s => s.localId === slot.localId ? { ...s, progress: pct } : s))
        })

        // Upload concluído: move da lista "enviando" para a lista real de imagens
        onChange([...images, { src: data.url, alt: file.name }])
        setUploading(prev => prev.filter(s => s.localId !== slot.localId))
        URL.revokeObjectURL(slot.localUrl)
      } catch {
        toast.error(`Erro ao enviar "${file.name}".`)
        setUploading(prev => prev.filter(s => s.localId !== slot.localId))
        URL.revokeObjectURL(slot.localUrl)
      }
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images, remainingSlots, isFull, maxImages])

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    if (e.dataTransfer.files.length) processFiles(e.dataTransfer.files)
  }

  function removeImage(index: number) {
    onChange(images.filter((_, i) => i !== index))
  }

  function moveImage(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= images.length) return
    const next = [...images]
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="font-mono text-xs text-slate-500">{label}</p>
        <p className="font-mono text-[10px] text-slate-600">
          {images.length + uploading.length}/{maxImages}
        </p>
      </div>

      {/* Grid de thumbnails: imagens salvas + slots em upload */}
      {(images.length > 0 || uploading.length > 0) && (
        <div className="grid grid-cols-3 gap-3 mb-3">
          {images.map((img, i) => (
            <div
              key={img.src + i}
              className="group relative aspect-square rounded-xl overflow-hidden border-2 border-violet-600/20 bg-slate-900/40"
            >
              <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />

              {/* Badge de capa */}
              {i === 0 && (
                <span className="absolute top-1.5 left-1.5 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-violet-600/90 text-white">
                  <Star size={9} className="fill-white" />
                  <span className="font-mono text-[9px]">Capa</span>
                </span>
              )}

              {/* Overlay de ações (hover/touch) */}
              <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5">
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="w-7 h-7 rounded-lg bg-red-600/90 flex items-center justify-center text-white hover:bg-red-500 transition-colors"
                  aria-label="Remover imagem"
                >
                  <X size={14} />
                </button>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveImage(i, -1)}
                    disabled={i === 0}
                    className="w-6 h-6 rounded-md bg-slate-900/80 flex items-center justify-center text-white disabled:opacity-30 hover:bg-slate-800 transition-colors"
                    aria-label="Mover para a esquerda"
                  >
                    <ChevronLeft size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveImage(i, 1)}
                    disabled={i === images.length - 1}
                    className="w-6 h-6 rounded-md bg-slate-900/80 flex items-center justify-center text-white disabled:opacity-30 hover:bg-slate-800 transition-colors"
                    aria-label="Mover para a direita"
                  >
                    <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Slots em upload (preview local + spinner) */}
          {uploading.map(slot => (
            <div
              key={slot.localId}
              className="relative aspect-square rounded-xl overflow-hidden border-2 border-violet-500/40 bg-slate-900/40"
            >
              <img src={slot.localUrl} alt="" className="w-full h-full object-cover opacity-50" />
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-1.5">
                <Loader2 size={20} className="text-white animate-spin" />
                <span className="font-mono text-[10px] text-white">{slot.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dropzone */}
      {!isFull ? (
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          className={cn(
            'border-2 border-dashed rounded-xl py-6 text-center cursor-pointer transition-all duration-200',
            dragging
              ? 'border-violet-500 bg-violet-600/10'
              : 'border-violet-600/20 hover:border-violet-500/40 hover:bg-violet-600/5'
          )}
        >
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            multiple
            className="hidden"
            onChange={e => { if (e.target.files) processFiles(e.target.files); e.target.value = '' }}
          />
          <UploadCloud size={22} className={cn('mx-auto mb-2', dragging ? 'text-violet-400' : 'text-slate-600')} />
          <p className="font-mono text-xs text-slate-500">
            Arraste ou clique para enviar
          </p>
          <p className="font-mono text-[10px] text-slate-700 mt-0.5">
            PNG, JPG ou WEBP — até {remainingSlots} restante{remainingSlots !== 1 ? 's' : ''}
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2 py-4 rounded-xl border border-slate-800 bg-slate-900/30">
          <ImageOff size={14} className="text-slate-600" />
          <p className="font-mono text-xs text-slate-600">Limite de {maxImages} imagens atingido</p>
        </div>
      )}
    </div>
  )
}