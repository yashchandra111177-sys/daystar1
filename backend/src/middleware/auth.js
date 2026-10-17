import crypto from 'node:crypto'
import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

export const sessionCookieName = 'daystar_admin_session'
export const csrfCookieName = 'daystar_admin_csrf'
const sessionDurationMs = 8 * 60 * 60 * 1000

export const cookieOptions = {
  path: '/',
  secure: env.nodeEnv === 'production',
  sameSite: env.nodeEnv === 'production' ? 'none' : 'lax',
}

export function setAdminSession(res, adminId) {
  const csrfToken = crypto.randomBytes(32).toString('hex')
  const token = jwt.sign({ sub: adminId, csrf: csrfToken }, env.jwtSecret, { expiresIn: '8h' })
  res.cookie(sessionCookieName, token, { ...cookieOptions, httpOnly: true, maxAge: sessionDurationMs })
  res.cookie(csrfCookieName, csrfToken, { ...cookieOptions, httpOnly: false, maxAge: sessionDurationMs })
}

export function clearAdminSession(res) {
  res.clearCookie(sessionCookieName, { ...cookieOptions, httpOnly: true })
  res.clearCookie(csrfCookieName, { ...cookieOptions, httpOnly: false })
}

export function authenticateAdmin(req, res, next) {
  const token = req.cookies?.[sessionCookieName]
  if (!token) return res.status(401).json({ message: 'Authentication required.' })

  try {
    req.adminSession = jwt.verify(token, env.jwtSecret)
    next()
  } catch {
    clearAdminSession(res)
    return res.status(401).json({ message: 'Your session has expired. Please sign in again.' })
  }
}

export function requireCsrf(req, res, next) {
  const headerToken = req.get('X-CSRF-Token')
  const cookieToken = req.cookies?.[csrfCookieName]
  const sessionToken = req.adminSession?.csrf
  if (!headerToken || !cookieToken || !sessionToken || headerToken !== cookieToken || headerToken !== sessionToken) {
    return res.status(403).json({ message: 'Request verification failed. Refresh your session and try again.' })
  }
  next()
}

export function requireTrustedAdminRequest(req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next()
  const origin = req.get('Origin')
  if (!origin || !env.allowedOrigins.includes(origin) || req.get('X-Requested-With') !== 'XMLHttpRequest') {
    return res.status(403).json({ message: 'Request origin is not allowed.' })
  }
  next()
}