'use client'

// 📁 CAMINHO: app/admin/(protected)/servicos/page.tsx (CRIADO)

import { useState, useEffect, useCallback } from 'react'
import { AdminShell }          from '@/components/admin/AdminShell'
import { ConfirmDialog }       from '@/components/admin/ConfirmDialog'
import { servicePlanService, serviceExtraService } from '@/services/admin.service'
import type { ServicePlanData, ServiceExtraData } from '@/types/api'
import { toast } from 'sonner'
import { cn }   from '@/lib/utils'
import { Plus, Pencil, Trash2, X, Save, Loader2, Briefcase, Check } from 'lucide-react'

const PLAN_EMPTY: Partial<ServicePlanData> = {
  name: '', price: '', period: 'entrega única', description: '',
  features: [], highlighted: false, badge: '', ctaText: 'Solicitar Orçamento',
  ctaMessage: '', order: 0, active: true,
}

const EXTRA_EMPTY: Partial<ServiceExtraData> = {
  label: '', description: '', icon: 'Server', order: 0, active: true,
}

export default function ServicosPage() {
  const [plans,        setPlans]        = useState<ServicePlanData[]>([])
  const [extras,       setExtras]       = useState<ServiceExtraData[]>([])
  const [loading,      setLoading]      = useState(true)
  const [editingPlan,  setEditingPlan]  = useState<Partial<ServicePlanData> | null>(null)
  const [editingExtra, setEditingExtra] = useState<Partial<ServiceExtraData> | null>(null)
  const [saving,       setSaving]       = useState(false)
  const [confirmDelete,setConfirmDelete]= useState<{ id: string; type: 'plan' | 'extra' } | null>(null)
  const [deleting,     setDeleting]     = useState(false)
  const [featureInput, setFeatureInput] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [p, e] = await Promise.all([servicePlanService.getAll(), serviceExtraService.getAll()])
      setPlans(p.data); setExtras(e.data)
    } catch { toast.error('Erro ao carregar serviços.') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  function setPlan(key: keyof ServicePlanData, val: unknown) {
    setEditingPlan(e => e ? { ...e, [key]: val } : null)
  }

  function addFeature() {
    const v = featureInput.trim()
    if (!v) return
    setPlan('features', [...(editingPlan?.features ?? []), v])
    setFeatureInput('')
  }

  async function savePlan() {
    if (!editingPlan?.name || !editingPlan.price || !editingPlan.ctaMessage) {
      toast.error('Nome, preço e mensagem CTA são obrigatórios.')
      return
    }
    setSaving(true)
    try {
      if (editingPlan.id) {
        const { data } = await servicePlanService.update(editingPlan.id, editingPlan)
        setPlans(prev => prev.map(x => x.id === editingPlan.id ? data : x))
        toast.success('Plano atualizado!')
      } else {
        const { data } = await servicePlanService.create(editingPlan)
        setPlans(prev => [...prev, data])
        toast.success('Plano criado!')
      }
      setEditingPlan(null)
    } catch { toast.error('Erro ao salvar.') }
    finally { setSaving(false) }
  }

  async function saveExtra() {
    if (!editingExtra?.label || !editingExtra.description || !editingExtra.icon) {
      toast.error('Label, descrição e ícone são obrigatórios.')
      return
    }
    setSaving(true)
    try {
      if (editingExtra.id) {
        const { data } = await serviceExtraService.update(editingExtra.id, editingExtra)
        setExtras(prev => prev.map(x => x.id === editingExtra.id ? data : x))
        toast.success('Extra atualizado!')
      } else {
        const { data } = await serviceExtraService.create(editingExtra)
        setExtras(prev => [...prev, data])
        toast.success('Extra criado!')
      }
      setEditingExtra(null)
    } catch { toast.error('Erro ao salvar.') }
    finally { setSaving(false) }
  }

  async function handleDelete() {
    if (!confirmDelete) return
    setDeleting(true)
    try {
      if (confirmDelete.type === 'plan') {
        await servicePlanService.delete(confirmDelete.id)
        setPlans(prev => prev.filter(x => x.id !== confirmDelete.id))
      } else {
        await serviceExtraService.delete(confirmDelete.id)
        setExtras(prev => prev.filter(x => x.id !== confirmDelete.id))
      }
      toast.success('Item deletado.')
    } catch { toast.error('Erro ao deletar.') }
    finally { setDeleting(false); setConfirmDelete(null) }
  }

  if (loading) return <AdminShell title="Serviços"><div className="flex justify-center py-32"><Loader2 size={24} className="text-violet-400 animate-spin" /></div></AdminShell>

  return (
    <AdminShell title="Serviços">
      <div className="max-w-5xl space-y-10">
        {/* Plans */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-white">Planos de Serviço</h2>
            <button onClick={() => { setEditingPlan({ ...PLAN_EMPTY }); setFeatureInput('') }} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 text-white text-sm hover:bg-violet-500 transition-colors">
              <Plus size={14} /> Novo Plano
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {plans.map(plan => (
              <div key={plan.id} className={cn(
                'relative p-5 rounded-xl border bg-[#0d0b18] space-y-3 transition-all',
                plan.highlighted ? 'border-violet-500/40' : 'border-violet-600/15'
              )}>
                {plan.badge && <span className="absolute -top-2.5 left-4 font-mono text-[10px] px-2 py-0.5 rounded-full bg-violet-600 text-white border border-violet-500">{plan.badge}</span>}
                <div>
                  <p className="font-display font-bold text-white">{plan.name}</p>
                  <p className="font-display font-semibold text-violet-400">{plan.price}</p>
                  <p className="font-mono text-[10px] text-slate-600">{plan.period}</p>
                </div>
                <div className="space-y-1">
                  {plan.features.slice(0, 3).map(f => (
                    <div key={f} className="flex items-center gap-1.5 text-slate-400 text-xs"><Check size={10} className="text-green-400 flex-shrink-0" />{f}</div>
                  ))}
                  {plan.features.length > 3 && <p className="font-mono text-[10px] text-slate-600">+{plan.features.length - 3} mais</p>}
                </div>
                <div className="flex gap-2 pt-2">
                  <button onClick={() => { setEditingPlan({ ...plan }); setFeatureInput('') }} className="flex-1 py-1.5 rounded-lg border border-slate-700 text-slate-400 text-xs hover:text-violet-400 hover:border-violet-500/40 transition-colors flex items-center justify-center gap-1"><Pencil size={11} />Editar</button>
                  <button onClick={() => setConfirmDelete({ id: plan.id, type: 'plan' })} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"><Trash2 size={13} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Extras */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-white">Serviços Extras</h2>
            <button onClick={() => setEditingExtra({ ...EXTRA_EMPTY })} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 text-white text-sm hover:bg-violet-500 transition-colors">
              <Plus size={14} /> Novo Extra
            </button>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
            {extras.map(extra => (
              <div key={extra.id} className="group p-4 rounded-xl border border-violet-600/15 bg-[#0d0b18] space-y-2 hover:border-violet-500/30 transition-all">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-violet-600/15 border border-violet-600/20 flex items-center justify-center">
                    <Briefcase size={14} className="text-violet-400" />
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setEditingExtra({ ...extra })} className="w-7 h-7 rounded flex items-center justify-center text-slate-600 hover:text-violet-400 transition-colors"><Pencil size={12} /></button>
                    <button onClick={() => setConfirmDelete({ id: extra.id, type: 'extra' })} className="w-7 h-7 rounded flex items-center justify-center text-slate-600 hover:text-red-400 transition-colors"><Trash2 size={12} /></button>
                  </div>
                </div>
                <p className="font-display font-semibold text-white text-sm">{extra.label}</p>
                <p className="text-slate-500 text-xs leading-relaxed">{extra.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Plan Modal */}
      {editingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setEditingPlan(null)} />
          <div className="relative w-full max-w-lg bg-[#0d0b18] border border-violet-600/20 rounded-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-violet-600/10">
              <h3 className="font-display font-bold text-white">{editingPlan.id ? 'Editar' : 'Novo'} Plano</h3>
              <button onClick={() => setEditingPlan(null)} className="text-slate-500 hover:text-white transition-colors"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: 'Nome *', k: 'name', p: 'Site & Landing Page' },
                { label: 'Preço *', k: 'price', p: 'A partir de R$ 800' },
                { label: 'Período', k: 'period', p: 'entrega única' },
                { label: 'Badge', k: 'badge', p: 'Mais Solicitado' },
                { label: 'Texto do CTA', k: 'ctaText', p: 'Solicitar Orçamento' },
              ].map(({ label, k, p }) => (
                <div key={k}>
                  <label className="font-mono text-xs text-slate-500 block mb-2">{label}</label>
                  <input type="text" value={(editingPlan as Record<string, string>)[k] ?? ''} onChange={e => setPlan(k as keyof ServicePlanData, e.target.value)} placeholder={p}
                    className="w-full px-4 py-2.5 rounded-xl border border-violet-600/20 bg-slate-900/60 text-slate-300 placeholder-slate-700 text-sm focus:outline-none focus:border-violet-500 transition-colors" />
                </div>
              ))}
              <div>
                <label className="font-mono text-xs text-slate-500 block mb-2">Descrição</label>
                <textarea value={editingPlan.description ?? ''} onChange={e => setPlan('description', e.target.value)} rows={2}
                  className="w-full px-4 py-3 rounded-xl border border-violet-600/20 bg-slate-900/60 text-slate-300 text-sm focus:outline-none focus:border-violet-500 transition-colors resize-none" />
              </div>
              <div>
                <label className="font-mono text-xs text-slate-500 block mb-2">Features</label>
                <div className="flex gap-2 mb-2">
                  <input value={featureInput} onChange={e => setFeatureInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addFeature())} placeholder="Feature..."
                    className="flex-1 px-4 py-2 rounded-xl border border-violet-600/20 bg-slate-900/60 text-slate-300 placeholder-slate-700 text-sm focus:outline-none focus:border-violet-500 transition-colors" />
                  <button onClick={addFeature} className="px-3 py-2 rounded-xl bg-violet-600/20 border border-violet-600/30 text-violet-300 hover:bg-violet-600/30 transition-colors"><Plus size={14} /></button>
                </div>
                <div className="space-y-1.5">
                  {(editingPlan.features ?? []).map((f, i) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/40 border border-slate-700/40">
                      <Check size={11} className="text-green-400 flex-shrink-0" />
                      <span className="flex-1 text-slate-300 text-sm">{f}</span>
                      <button onClick={() => setPlan('features', editingPlan.features!.filter((_, j) => j !== i))} className="text-slate-600 hover:text-red-400 transition-colors"><X size={12} /></button>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="font-mono text-xs text-slate-500 block mb-2">Mensagem WhatsApp CTA *</label>
                <textarea value={editingPlan.ctaMessage ?? ''} onChange={e => setPlan('ctaMessage', e.target.value)} rows={3}
                  placeholder="Olá, Alexander! Tenho interesse no pacote..."
                  className="w-full px-4 py-3 rounded-xl border border-violet-600/20 bg-slate-900/60 text-slate-300 placeholder-slate-700 text-sm focus:outline-none focus:border-violet-500 transition-colors resize-none" />
              </div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-slate-500">Em Destaque</span>
                <button onClick={() => setPlan('highlighted', !editingPlan.highlighted)} className={`relative w-10 h-5 rounded-full transition-colors ${editingPlan.highlighted ? 'bg-violet-600' : 'bg-slate-700'}`}>
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${editingPlan.highlighted ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-violet-600/10 flex justify-end gap-3">
              <button onClick={() => setEditingPlan(null)} className="px-4 py-2 rounded-lg border border-slate-700 text-slate-400 text-sm hover:text-white transition-colors">Cancelar</button>
              <button onClick={savePlan} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 text-white text-sm hover:bg-violet-500 transition-colors disabled:opacity-50">
                {saving ? <><Loader2 size={14} className="animate-spin" />Salvando...</> : <><Save size={14} />Salvar</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Extra Modal */}
      {editingExtra && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setEditingExtra(null)} />
          <div className="relative w-full max-w-md bg-[#0d0b18] border border-violet-600/20 rounded-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-violet-600/10">
              <h3 className="font-display font-bold text-white">{editingExtra.id ? 'Editar' : 'Novo'} Extra</h3>
              <button onClick={() => setEditingExtra(null)} className="text-slate-500 hover:text-white transition-colors"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: 'Label *', k: 'label', p: 'Aplicação Desktop (.exe)' },
                { label: 'Ícone (Lucide) *', k: 'icon', p: 'Monitor, Bot, Smartphone...' },
              ].map(({ label, k, p }) => (
                <div key={k}>
                  <label className="font-mono text-xs text-slate-500 block mb-2">{label}</label>
                  <input type="text" value={(editingExtra as Record<string, string>)[k] ?? ''} onChange={e => setEditingExtra(prev => prev ? { ...prev, [k]: e.target.value } : null)} placeholder={p}
                    className="w-full px-4 py-2.5 rounded-xl border border-violet-600/20 bg-slate-900/60 text-slate-300 placeholder-slate-700 text-sm focus:outline-none focus:border-violet-500 transition-colors" />
                </div>
              ))}
              <div>
                <label className="font-mono text-xs text-slate-500 block mb-2">Descrição *</label>
                <textarea value={editingExtra.description ?? ''} onChange={e => setEditingExtra(prev => prev ? { ...prev, description: e.target.value } : null)} rows={2} placeholder="Descrição do serviço..."
                  className="w-full px-4 py-3 rounded-xl border border-violet-600/20 bg-slate-900/60 text-slate-300 placeholder-slate-700 text-sm focus:outline-none focus:border-violet-500 transition-colors resize-none" />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-violet-600/10 flex justify-end gap-3">
              <button onClick={() => setEditingExtra(null)} className="px-4 py-2 rounded-lg border border-slate-700 text-slate-400 text-sm hover:text-white transition-colors">Cancelar</button>
              <button onClick={saveExtra} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 text-white text-sm hover:bg-violet-500 transition-colors disabled:opacity-50">
                {saving ? <><Loader2 size={14} className="animate-spin" />Salvando...</> : <><Save size={14} />Salvar</>}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog open={!!confirmDelete} title="Deletar Item" description="Esta ação não pode ser desfeita." confirmText="Deletar" loading={deleting} onConfirm={handleDelete} onCancel={() => setConfirmDelete(null)} />
    </AdminShell>
  )
}