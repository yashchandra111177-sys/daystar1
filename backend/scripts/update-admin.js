import bcrypt from 'bcryptjs'
import { connectDatabase } from '../src/config/database.js'
import { validateRuntimeEnvironment } from '../src/config/env.js'
import Admin from '../src/models/Admin.js'

const email = process.env.ADMIN_UPDATE_EMAIL?.trim().toLowerCase()
const password = process.env.ADMIN_UPDATE_PASSWORD

if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  console.error('Set a valid ADMIN_UPDATE_EMAIL before running this script.')
  process.exit(1)
}
if (!password || password.length < 14 || Buffer.byteLength(password, 'utf8') > 72) {
  console.error('Set a unique ADMIN_UPDATE_PASSWORD of at least 14 characters and no more than 72 UTF-8 bytes.')
  process.exit(1)
}

try {
  validateRuntimeEnvironment()
  await connectDatabase()
  const admins = await Admin.find({}).select('_id').limit(2).lean()
  if (admins.length !== 1) {
    throw new Error(`Expected exactly one administrator, found ${admins.length}. No account was changed.`)
  }

  const passwordHash = await bcrypt.hash(password, 12)
  await Admin.updateOne({ _id: admins[0]._id }, { $set: { email, passwordHash } })
  console.info(`Administrator credentials updated for ${email}. Remove ADMIN_UPDATE_EMAIL and ADMIN_UPDATE_PASSWORD.`)
} catch (error) {
  if (error?.code === 11000) {
    console.error('An administrator already uses that email. No account was changed.')
  } else {
    console.error(`Admin credential update failed: ${error.message}`)
  }
  process.exitCode = 1
} finally {
  const mongoose = await import('mongoose')
  await mongoose.default.disconnect()
}
