import bcrypt from 'bcryptjs'
import { connectDatabase } from '../src/config/database.js'
import { validateRuntimeEnvironment } from '../src/config/env.js'
import Admin from '../src/models/Admin.js'

const email = process.env.ADMIN_SETUP_EMAIL?.trim().toLowerCase()
const password = process.env.ADMIN_SETUP_PASSWORD

if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  console.error('Set a valid ADMIN_SETUP_EMAIL in backend/.env before running this script.')
  process.exit(1)
}
if (!password || password.length < 14 || Buffer.byteLength(password, 'utf8') > 72 || password.startsWith('REPLACE_WITH_')) {
  console.error('Set a unique ADMIN_SETUP_PASSWORD of at least 14 characters and no more than 72 UTF-8 bytes in backend/.env.')
  process.exit(1)
}

try {
  validateRuntimeEnvironment()
  await connectDatabase()
  if (await Admin.exists({})) {
    console.error('An administrator already exists. No account was changed.')
    process.exitCode = 1
  } else {
    const passwordHash = await bcrypt.hash(password, 12)
    await Admin.create({ email, passwordHash })
    console.info(`Administrator created for ${email}. Remove ADMIN_SETUP_PASSWORD from backend/.env.`)
  }
} catch (error) {
  console.error(`Admin setup failed: ${error.message}`)
  process.exitCode = 1
} finally {
  const mongoose = await import('mongoose')
  await mongoose.default.disconnect()
}