import bcrypt from 'bcryptjs'
import Admin from '../models/Admin.js'
import { clearAdminSession, setAdminSession } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const login = asyncHandler(async (req, res) => {
  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : ''
  const password = typeof req.body?.password === 'string' ? req.body.password : ''
  if (!emailPattern.test(email) || email.length > 254 || !password || Buffer.byteLength(password, 'utf8') > 72) {
    return res.status(400).json({ message: 'Enter a valid email and password.' })
  }

  const admin = await Admin.findOne({ email }).select('+passwordHash')
  const validPassword = admin && await bcrypt.compare(password, admin.passwordHash)
  if (!validPassword) return res.status(401).json({ message: 'Email or password is incorrect.' })

  setAdminSession(res, String(admin._id))
  res.json({ admin: { id: String(admin._id), email: admin.email } })
})

export const currentAdmin = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.adminSession.sub).select('email').lean()
  if (!admin) return res.status(401).json({ message: 'Authentication required.' })
  res.json({ admin: { id: String(admin._id), email: admin.email } })
})

export const logout = asyncHandler(async (req, res) => {
  clearAdminSession(res)
  res.status(204).end()
})