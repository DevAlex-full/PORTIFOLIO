/**
 * lib/api.ts
 * Instância Axios configurada para o painel administrativo.
 * - Injeta token JWT em todas as requisições
 * - Redireciona para /admin/login em caso de 401
 */

import axios from 'axios'
import { getToken, removeToken } from './auth'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
})

// ── Request interceptor: injeta token ────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ── Response interceptor: trata 401 ──────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken()
      if (typeof window !== 'undefined') {
        window.location.href = '/admin/login'
      }
    }
    return Promise.reject(error)
  }
)

// ── Helper para fetches públicos (SSR / Server Components) ────
export async function publicFetch<T>(path: string): Promise<T> {
  const url = `${API_URL}${path}`
  const res  = await fetch(url, {
    next: { revalidate: 60 },
  })

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${path}`)
  }

  return res.json() as Promise<T>
}