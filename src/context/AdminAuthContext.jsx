import { createContext, useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { adminApi } from '../api/admin'

const AdminAuthContext = createContext(null)

export function AdminAuthProvider({ children }) {
  const { pathname } = useLocation()
  const isAdminPath = pathname.startsWith('/admin')
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(() => window.location.pathname.startsWith('/admin'))

  useEffect(() => {
    if (!isAdminPath) return undefined
    let active = true
    setLoading(true)
    adminApi.me()
      .then((currentAdmin) => { if (active) setAdmin(currentAdmin) })
      .catch(() => { if (active) setAdmin(null) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [isAdminPath])

  const login = async (credentials) => {
    const currentAdmin = await adminApi.login(credentials)
    setAdmin(currentAdmin)
    return currentAdmin
  }

  const logout = async () => {
    try {
      await adminApi.logout()
    } finally {
      setAdmin(null)
    }
  }

  return <AdminAuthContext.Provider value={{ admin, loading, login, logout }}>{children}</AdminAuthContext.Provider>
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (!context) throw new Error('useAdminAuth must be used within AdminAuthProvider.')
  return context
}