'use client'

// 📁 CAMINHO: app/admin/(protected)/projetos/[id]/page.tsx (CRIADO)
// Usado tanto para criar (id='novo') quanto para editar.

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AdminShell }      from '@/components/admin/AdminShell'
import { MediaPicker }     from '@/components/admin/MediaPicker'
import { projectService }  from '@/services/admin.service'
import type { ProjectData } from '@/types/api'
import { toast }           from 'sonner'
import { ArrowLeft, Loader2, Plus, X, Save } from 'lucide-react'
import Link from 'next/link'

const EMPTY: Partial<ProjectData> = {
  title: '', slug: '', shortDescription: '', fullDescription: '',
  image: '', images: [], tags: [], categories: [],
  featured: false, highlight: '', linkDemo: '', linkGithub: '',
  linkGithubFront: '', linkGithubBack: '', status: 'active', order: 0, active: true,
}

export default function ProjectFormPage() {
  const { id }    = useParams<{ id: string }>()
  const router    = useRouter()
  const isNew     = id === 'novo'

  const [form,    setForm]    = useState<Partial<ProjectData>>(EMPTY)
  const [loading, setLoading] = useState(!isNew)
  const [saving,  setSaving]  = useState(false)
  const [tagInput,setTagInput]= useState('')
  const [catInput,setCatInput]= useState('')

  const load = useCallback(async () => {
    if (isNew) return
    try {
      const { data } = await projectService.getOne(id)
      setForm(data)
    } catch { toast.error('Projeto não encontrado.'); router.replace('/admin/projetos') }
    finally { setLoading(false) }
  }, [id, isNew, router])

  useEffect(() => { load() }, [load])

  function set(key: keyof ProjectData, value: unknown) {
    setForm(f => ({ ...f, [key]: value }))
  }

  function addTag() {
    const v = tagInput.trim()
    if (!v || form.tags?.includes(v)) return
    set('tags', [...(form.tags ?? []), v])
    setTagInput('')
  }

  function addCat() {
    const v = catInput.trim()
    if (!v || form.categories?.includes(v)) return
    set('categories', [...(form.categories ?? []), v])
    setCatInput('')
  }

  async function handleSave() {
    if (!form.title || !form.shortDescription) {
      toast.error('Título e descrição curta são obrigatórios.')
      return
    }
    setSaving(true)
    try {
      if (isNew) {
        await projectService.create(form)
        toast.success('Projeto criado!')
      } else {
        await projectService.update(id, form)
        toast.success('Projeto atualizado!')
      }
      router.push('/admin/projetos')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
      toast.error(msg ?? 'Erro ao salvar projeto.')
    } finally { setSaving(false) }
  }

  if (loading) {
    return (
      <AdminShell title="Projeto">
        <div className="flex justify-center py-32"><Loader2 size={24} className="text-violet-400 animate-spin" /></div>
      </AdminShell>
    )
  }

  return (
    <AdminShell title={isNew ? 'Novo Projeto' : 'Editar Projeto'}>
      <div className="max-w-4xl space-y-6">
        {/* Back */}
        <Link href="/admin/projetos" className="inline-flex items-center gap-2 font-mono text-xs text-slate-500 hover:text-violet-400 transition-colors group">
          <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" /> Voltar
        </Link>

        {/* Form */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main fields */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-[#0d0b18] border border-violet-600/15 rounded-xl p-6 space-y-5">
              <h3 className="font-display font-semibold text-white text-sm">Informações Básicas</h3>

              <Field label="Título *">
                <Input value={form.title ?? ''} onChange={v => set('title', v)} placeholder="Nome do projeto" />
              </Field>

              <Field label="Slug">
                <Input value={form.slug ?? ''} onChange={v => set('slug', v)} placeholder="auto-gerado se vazio" mono />
              </Field>

              <Field label="Descrição Curta *">
                <textarea
                  value={form.shortDescription ?? ''}
                  onChange={e => set('shortDescription', e.target.value)}
                  rows={3}
                  placeholder="Resumo do projeto (exibido nos cards)"
                  className="w-full px-4 py-3 rounded-xl border border-violet-600/20 bg-slate-900/60 text-slate-300 placeholder-slate-700 text-sm focus:outline-none focus:border-violet-500 transition-colors resize-none"
                />
              </Field>

              <Field label="Descrição Completa">
                <textarea
                  value={form.fullDescription ?? ''}
                  onChange={e => set('fullDescription', e.target.value)}
                  rows={5}
                  placeholder="Descrição detalhada (modal / página do projeto)"
                  className="w-full px-4 py-3 rounded-xl border border-violet-600/20 bg-slate-900/60 text-slate-300 placeholder-slate-700 text-sm focus:outline-none focus:border-violet-500 transition-colors resize-none"
                />
              </Field>
            </div>

            {/* Links */}
            <div className="bg-[#0d0b18] border border-violet-600/15 rounded-xl p-6 space-y-5">
              <h3 className="font-display font-semibold text-white text-sm">Links</h3>
              <Field label="Demo / Site"><Input value={form.linkDemo ?? ''} onChange={v => set('linkDemo', v)} placeholder="https://..." /></Field>
              <Field label="GitHub"><Input value={form.linkGithub ?? ''} onChange={v => set('linkGithub', v)} placeholder="https://github.com/..." /></Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="GitHub Front-End"><Input value={form.linkGithubFront ?? ''} onChange={v => set('linkGithubFront', v)} placeholder="https://..." /></Field>
                <Field label="GitHub Back-End"><Input value={form.linkGithubBack ?? ''} onChange={v => set('linkGithubBack', v)} placeholder="https://..." /></Field>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-[#0d0b18] border border-violet-600/15 rounded-xl p-6 space-y-5">
              <h3 className="font-display font-semibold text-white text-sm">Tecnologias</h3>
              <div className="flex gap-2">
                <input
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="React, Node.js..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-violet-600/20 bg-slate-900/60 text-slate-300 placeholder-slate-700 font-mono text-xs focus:outline-none focus:border-violet-500 transition-colors"
                />
                <button type="button" onClick={addTag} className="px-4 py-2.5 rounded-xl bg-violet-600/20 border border-violet-600/30 text-violet-300 text-sm hover:bg-violet-600/30 transition-colors">
                  <Plus size={15} />
                </button>
              </div>
              {(form.tags ?? []).length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {(form.tags ?? []).map(t => (
                    <span key={t} className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-violet-600/15 border border-violet-600/20 text-violet-300 font-mono text-xs">
                      {t}
                      <button type="button" onClick={() => set('tags', form.tags!.filter(x => x !== t))} className="text-violet-500 hover:text-red-400 transition-colors"><X size={11} /></button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Categorias */}
            <div className="bg-[#0d0b18] border border-violet-600/15 rounded-xl p-6 space-y-5">
              <h3 className="font-display font-semibold text-white text-sm">Categorias</h3>
              <div className="flex gap-2">
                <input
                  value={catInput}
                  onChange={e => setCatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCat())}
                  placeholder="web, landing, commercial..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-violet-600/20 bg-slate-900/60 text-slate-300 placeholder-slate-700 font-mono text-xs focus:outline-none focus:border-violet-500 transition-colors"
                />
                <button type="button" onClick={addCat} className="px-4 py-2.5 rounded-xl bg-violet-600/20 border border-violet-600/30 text-violet-300 text-sm hover:bg-violet-600/30 transition-colors">
                  <Plus size={15} />
                </button>
              </div>
              {(form.categories ?? []).length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {(form.categories ?? []).map(c => (
                    <span key={c} className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-mono text-xs">
                      {c}
                      <button type="button" onClick={() => set('categories', form.categories!.filter(x => x !== c))} className="text-cyan-500 hover:text-red-400 transition-colors"><X size={11} /></button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar fields */}
          <div className="space-y-5">
            {/* Imagem */}
            <div className="bg-[#0d0b18] border border-violet-600/15 rounded-xl p-6">
              <MediaPicker
                value={form.image ?? ''}
                onChange={url => set('image', url)}
                label="Imagem Principal"
              />
            </div>

            {/* Options */}
            <div className="bg-[#0d0b18] border border-violet-600/15 rounded-xl p-6 space-y-4">
              <h3 className="font-display font-semibold text-white text-sm">Opções</h3>

              <Toggle label="Ativo" checked={form.active ?? true} onChange={v => set('active', v)} />
              <Toggle label="Em Destaque" checked={form.featured ?? false} onChange={v => set('featured', v)} />

              <Field label="Highlight (badge)">
                <Input value={form.highlight ?? ''} onChange={v => set('highlight', v)} placeholder="Ex: SaaS • Multi-tenant" />
              </Field>

              <Field label="Ordem">
                <input
                  type="number"
                  value={form.order ?? 0}
                  onChange={e => set('order', Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-violet-600/20 bg-slate-900/60 text-slate-300 font-mono text-xs focus:outline-none focus:border-violet-500 transition-colors"
                />
              </Field>

              <Field label="Status">
                <select
                  value={form.status ?? 'active'}
                  onChange={e => set('status', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-violet-600/20 bg-slate-900/60 text-slate-300 font-mono text-xs focus:outline-none focus:border-violet-500 transition-colors"
                >
                  <option value="active">Ativo</option>
                  <option value="archived">Arquivado</option>
                  <option value="draft">Rascunho</option>
                </select>
              </Field>
            </div>

            {/* Save */}
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-violet-600 text-white font-display font-semibold text-sm hover:bg-violet-500 transition-colors disabled:opacity-50"
            >
              {saving ? <><Loader2 size={15} className="animate-spin" /> Salvando...</> : <><Save size={15} /> Salvar Projeto</>}
            </button>
          </div>
        </div>
      </div>
    </AdminShell>
  )
}

// ── Sub-components ────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="font-mono text-xs text-slate-500 block mb-2">{label}</label>
      {children}
    </div>
  )
}

function Input({ value, onChange, placeholder, mono }: {
  value: string; onChange: (v: string) => void; placeholder?: string; mono?: boolean
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-4 py-2.5 rounded-xl border border-violet-600/20 bg-slate-900/60 text-slate-300 placeholder-slate-700 ${mono ? 'font-mono text-xs' : 'text-sm'} focus:outline-none focus:border-violet-500 transition-colors`}
    />
  )
}

function Toggle({ label, checked, onChange }: {
  label: string; checked: boolean; onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-mono text-xs text-slate-400">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-5 rounded-full transition-colors ${checked ? 'bg-violet-600' : 'bg-slate-700'}`}
      >
        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
    </div>
  )
}