import { BookOpen, LayoutDashboard, LogOut, Package, Store } from 'lucide-react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAdminAuth } from '../context/AdminAuthContext'
import Logo from './Logo'

export default function AdminLayout() {
  const { admin, logout } = useAdminAuth()
  const navigate = useNavigate()
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    try { await logout() } finally { navigate('/admin/login', { replace: true }) }
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand"><Logo /><span className="admin-sidebar__badge">STUDIO</span></div>
        <p className="admin-sidebar__label">Workspace</p>
        <nav className="admin-sidebar__nav" aria-label="Admin navigation">
          <NavLink to="/admin/dashboard" className={({ isActive }) => `admin-sidebar__link ${isActive ? 'is-active' : ''}`}><LayoutDashboard size={18} /><span>Dashboard</span></NavLink>
          <NavLink to="/admin/products" className={({ isActive }) => `admin-sidebar__link ${isActive ? 'is-active' : ''}`}><Package size={18} /><span>Products</span></NavLink>
          <NavLink to="/admin/blogs" className={({ isActive }) => `admin-sidebar__link ${isActive ? 'is-active' : ''}`}><BookOpen size={18} /><span>Journal</span></NavLink>
        </nav>
        <div className="admin-sidebar__bottom">
          <div className="admin-sidebar__account"><span className="admin-avatar">{admin?.email?.[0]?.toUpperCase() || 'M'}</span><span><strong>Administrator</strong><small>{admin?.email}</small></span></div>
          <button type="button" className="admin-sidebar__logout" onClick={handleLogout} disabled={loggingOut}><LogOut size={17} /><span>{loggingOut ? 'Signing out…' : 'Log out'}</span></button>
          <NavLink to="/" className="admin-sidebar__store"><Store size={16} /> View storefront <span aria-hidden="true">↗</span></NavLink>
        </div>
      </aside>
      <div className="admin-main"><header className="admin-mobile-bar"><Logo /><button type="button" className="admin-sidebar__logout" onClick={handleLogout} aria-label="Log out"><LogOut size={17} /></button></header><Outlet /></div>
    </div>
  )
}