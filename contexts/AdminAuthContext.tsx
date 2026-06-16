'use client'

/**
 * contexts/AdminAuthContext.tsx
 * Contexto de autenticação do painel administrativo.
 * Gerencia estado do admin logado, login e logout.
 */

import {
  createContext, useContext, useEffect, useState, useCallback,
  type ReactNode,
} from 'react'
import { authService } from '@/services/admin.service'
import { getToken, setToken, removeToken, isAuthenticated } from '@/lib/auth'
import type { AdminUser } from '@/types/api'

interface AdminAuthContextValue {
  admin:           AdminUser | null
  isLoading:       boolean
  isAuthenticated: boolean
  login:           (email: string, password: string) => Promise<void>
  logout:          () => void
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin,     setAdmin]     = useState<AdminUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Valida o token existente ao montar
  const validateToken = useCallback(async () => {
    if (!isAuthenticated()) {
      setIsLoading(false)
      return
    }

    try {
      const { data } = await authService.me()
      setAdmin(data.admin)
    } catch {
      removeToken()
      setAdmin(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    validateToken()
  }, [validateToken])

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await authService.login(email, password)
    setToken(data.token)
    setAdmin(data.admin)
  }, [])

  const logout = useCallback(() => {
    removeToken()
    setAdmin(null)
    window.location.href = '/admin/login'
  }, [])

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        isLoading,
        isAuthenticated: !!admin && isAuthenticated(),
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth(): AdminAuthContextValue {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) {
    throw new Error('useAdminAuth deve ser usado dentro de AdminAuthProvider')
  }
  return ctx
}