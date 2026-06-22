import axios from 'axios'
import { getToken, removeToken } from './auth'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

export const api = axios.create({
  baseURL: API_URL,
  // SEM Content-Type padrão aqui — deixamos o Axios detectar por si.
  timeout: 15_000,
})

// ── Request interceptor ──────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    // Token JWT
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Define Content-Type: application/json somente para requisições
    // que NÃO enviam FormData. Para FormData o Axios (e o browser) geram
    // o header multipart/form-data;boundary=... automaticamente.
    if (
      config.data !== undefined &&
      !(config.data instanceof FormData) &&
      !config.headers['Content-Type']
    ) {
      config.headers['Content-Type'] = 'application/json'
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