import { ArrowRight, LockKeyhole } from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { useAdminAuth } from '../../context/AdminAuthContext'
import Logo from '../../components/Logo'

export default function AdminLogin() {
  const { admin, loading, login } = useAdminAuth()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (admin) return <Navigate to={location.state?.from || '/admin/dashboard'} replace />

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login({ email, password })
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'We could not sign you in. Check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="admin-login-page">
      <div className="admin-login-page__wash" aria-hidden="true" />
      <section className="admin-login-panel" aria-labelledby="admin-login-title">
        <Logo />
        <div className="admin-login-panel__icon"><LockKeyhole size={21} /></div>
        <p className="eyebrow">Private studio</p>
        <h1 id="admin-login-title">Welcome back.</h1>
        <p className="admin-login-panel__intro">Sign in to tend to your collection.</p>
        {loading ? <div className="admin-form-message" role="status">Checking your session…</div> : (
          <form className="admin-form" onSubmit={submit}>
            <label>Email address<input type="email" name="email" autoComplete="username" required maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} /></label>
            <label>Password<input type="password" name="password" autoComplete="current-password" required maxLength={72} value={password} onChange={(event) => setPassword(event.target.value)} /></label>
            {error && <p className="admin-form-error" role="alert">{error}</p>}
            <button className="button button--primary" type="submit" disabled={submitting}>{submitting ? 'Signing in…' : 'Sign in'} <ArrowRight size={16} /></button>
          </form>
        )}
        <Link className="admin-login-panel__back" to="/">Back to the shop</Link>
      </section>
      <p className="admin-login-page__caption">Thoughtfully chosen, always.</p>
    </main>
  )
}