import { Navigate, useLocation } from 'react-router-dom'
import { useAdminAuth } from '../context/AdminAuthContext'

export default function AdminRoute({ children }) {
  const { admin, loading } = useAdminAuth()
  const location = useLocation()

  if (loading) return <main className="admin-screen-state" role="status">Checking admin session…</main>
  if (!admin) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  return children
}