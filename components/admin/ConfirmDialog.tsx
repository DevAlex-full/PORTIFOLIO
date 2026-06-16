'use client'

// 📁 CAMINHO: components/admin/ConfirmDialog.tsx (CRIADO)

import { AlertTriangle, X } from 'lucide-react'

interface ConfirmDialogProps {
  open:        boolean
  title:       string
  description: string
  confirmText?: string
  onConfirm:   () => void
  onCancel:    () => void
  loading?:    boolean
}

export function ConfirmDialog({
  open, title, description,
  confirmText = 'Confirmar',
  onConfirm, onCancel, loading,
}: ConfirmDialogProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-md bg-[#0d0b18] border border-violet-600/20 rounded-2xl p-6 shadow-2xl">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X size={14} />
        </button>

        <div className="flex items-center gap-4 mb-4">
          <div className="w-11 h-11 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={20} className="text-red-400" />
          </div>
          <div>
            <h3 className="font-display font-bold text-white">{title}</h3>
            <p className="text-slate-400 text-sm mt-0.5">{description}</p>
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-6">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 rounded-lg border border-slate-700 text-slate-400 text-sm hover:text-white hover:border-slate-600 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-500 transition-colors disabled:opacity-50"
          >
            {loading ? 'Deletando...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}