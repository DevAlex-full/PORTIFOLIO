import { api } from '@/lib/api'
import type {
  ProjectData, CertificationData, SkillData,
  ServicePlanData, ServiceExtraData,
  HeroData, AboutData, ContactData, SiteSettingsData,
  LeadData, MediaData, DashboardStats, ClientData, FeedbackData,
} from '@/types/api'

// ============================================================
// AUTH
// ============================================================
export const authService = {
  login: (email: string, password: string) =>
    api.post<{ token: string; admin: { id: string; email: string; name: string } }>(
      '/api/auth/login', { email, password }
    ),

  me: () => api.get<{ admin: { id: string; email: string; name: string } }>('/api/auth/me'),

  changePassword: (currentPassword: string, newPassword: string) =>
    api.post('/api/auth/change-password', { currentPassword, newPassword }),
}

// ============================================================
// DASHBOARD
// ============================================================
export const dashboardService = {
  getStats: () => api.get<DashboardStats>('/api/dashboard/stats'),
}

// ============================================================
// PROJECTS
// ============================================================
export const projectService = {
  getAll:   ()               => api.get<ProjectData[]>('/api/projects/all'),
  getOne:   (id: string)     => api.get<ProjectData>(`/api/projects/${id}`),
  create:   (data: Partial<ProjectData>) => api.post<ProjectData>('/api/projects', data),
  update:   (id: string, data: Partial<ProjectData>) => api.put<ProjectData>(`/api/projects/${id}`, data),
  delete:   (id: string)     => api.delete(`/api/projects/${id}`),
  reorder:  (id: string, order: number) => api.patch(`/api/projects/${id}/order`, { order }),
}

// ============================================================
// CLIENTS — Vitrine de clientes / cases
// ============================================================
export const clientService = {
  getAll:   ()               => api.get<ClientData[]>('/api/clients/all'),
  create:   (data: Partial<ClientData>) => api.post<ClientData>('/api/clients', data),
  update:   (id: string, data: Partial<ClientData>) => api.put<ClientData>(`/api/clients/${id}`, data),
  delete:   (id: string)     => api.delete(`/api/clients/${id}`),
  reorder:  (id: string, order: number) => api.patch(`/api/clients/${id}/order`, { order }),
}

// ============================================================
// CERTIFICATIONS
// ============================================================
export const certificationService = {
  getAll:  ()               => api.get<CertificationData[]>('/api/certifications/all'),
  create:  (data: Partial<CertificationData>) => api.post<CertificationData>('/api/certifications', data),
  update:  (id: string, data: Partial<CertificationData>) => api.put<CertificationData>(`/api/certifications/${id}`, data),
  delete:  (id: string)     => api.delete(`/api/certifications/${id}`),
}

// ============================================================
// SKILLS
// ============================================================
export const skillService = {
  getAll:  ()               => api.get<SkillData[]>('/api/skills/all'),
  create:  (data: Partial<SkillData>) => api.post<SkillData>('/api/skills', data),
  update:  (id: string, data: Partial<SkillData>) => api.put<SkillData>(`/api/skills/${id}`, data),
  delete:  (id: string)     => api.delete(`/api/skills/${id}`),
}

// ============================================================
// SERVICES
// ============================================================
export const servicePlanService = {
  getAll:  ()               => api.get<ServicePlanData[]>('/api/services/plans'),
  create:  (data: Partial<ServicePlanData>) => api.post<ServicePlanData>('/api/services/plans', data),
  update:  (id: string, data: Partial<ServicePlanData>) => api.put<ServicePlanData>(`/api/services/plans/${id}`, data),
  delete:  (id: string)     => api.delete(`/api/services/plans/${id}`),
}

export const serviceExtraService = {
  getAll:  ()               => api.get<ServiceExtraData[]>('/api/services/extras'),
  create:  (data: Partial<ServiceExtraData>) => api.post<ServiceExtraData>('/api/services/extras', data),
  update:  (id: string, data: Partial<ServiceExtraData>) => api.put<ServiceExtraData>(`/api/services/extras/${id}`, data),
  delete:  (id: string)     => api.delete(`/api/services/extras/${id}`),
}

// ============================================================
// SINGLE RECORDS
// ============================================================
export const heroService = {
  get:    ()                 => api.get<HeroData>('/api/hero'),
  update: (data: Partial<HeroData>) => api.put<HeroData>('/api/hero', data),
}

export const aboutService = {
  get:    ()                 => api.get<AboutData>('/api/about'),
  update: (data: Partial<AboutData>) => api.put<AboutData>('/api/about', data),
}

export const contactService = {
  get:    ()                 => api.get<ContactData>('/api/contact'),
  update: (data: Partial<ContactData>) => api.put<ContactData>('/api/contact', data),
}

export const settingsService = {
  get:    ()                 => api.get<SiteSettingsData>('/api/settings'),
  update: (data: Partial<SiteSettingsData>) => api.put<SiteSettingsData>('/api/settings', data),
}

// ============================================================
// LEADS
// ============================================================
export const leadService = {
  getAll: (params?: {
    page?: number; limit?: number
    status?: string; archived?: boolean; search?: string
  }) => api.get<{
    leads: LeadData[]; total: number; page: number; totalPages: number
  }>('/api/leads', { params }),

  getOne: (id: string) => api.get<LeadData>(`/api/leads/${id}`),

  create: (data: Partial<LeadData>) =>
    api.post<{ lead: LeadData }>('/api/leads', data),

  update: (id: string, data: Partial<LeadData>) =>
    api.put<LeadData>(`/api/leads/${id}`, data),

  updateStatus: (id: string, status: string) =>
    api.patch<LeadData>(`/api/leads/${id}/status`, { status }),
  archive:      (id: string, archived = true) =>
    api.patch<LeadData>(`/api/leads/${id}/archive`, { archived }),
  delete:       (id: string) => api.delete(`/api/leads/${id}`),
}

// ============================================================
// MEDIA
// ============================================================
export const mediaService = {
  getAll: (params?: { page?: number; limit?: number; search?: string }) =>
    api.get<{ items: MediaData[]; total: number; page: number; totalPages: number }>(
      '/api/media', { params }
    ),

  upload: (file: File, onProgress?: (pct: number) => void) => {
    const fd = new FormData()
    fd.append('file', file)
    // CORREÇÃO: NÃO definir Content-Type manualmente. O axios/navegador
    // precisa gerar esse header automaticamente com o boundary correto.
    // Definir 'multipart/form-data' sem boundary quebra o parser
    // @fastify/multipart no backend e o upload falha silenciosamente.
    return api.post<MediaData>('/api/media', fd, {
      onUploadProgress: (e) => {
        if (onProgress && e.total) {
          onProgress(Math.round((e.loaded * 100) / e.total))
        }
      },
    })
  },

  uploadBatch: (files: File[], onProgress?: (pct: number) => void) => {
    const fd = new FormData()
    files.forEach(f => fd.append('files', f))
    // Mesma correção: sem header manual de Content-Type.
    return api.post<{ results: unknown[] }>('/api/media/batch', fd, {
      onUploadProgress: (e) => {
        if (onProgress && e.total) {
          onProgress(Math.round((e.loaded * 100) / e.total))
        }
      },
    })
  },

  delete: (id: string) => api.delete(`/api/media/${id}`),
}

// ============================================================
// FEEDBACKS — Depoimentos de clientes
// ============================================================
export const feedbackService = {
  getAll:  ()                                   => api.get<FeedbackData[]>('/api/feedbacks/all'),
  create:  (data: Partial<FeedbackData>)        => api.post<FeedbackData>('/api/feedbacks', data),
  update:  (id: string, data: Partial<FeedbackData>) => api.put<FeedbackData>(`/api/feedbacks/${id}`, data),
  delete:  (id: string)                         => api.delete(`/api/feedbacks/${id}`),
}