import dotenv from 'dotenv'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const currentDirectory = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: resolve(currentDirectory, '../../.env') })

const isProduction = process.env.NODE_ENV === 'production'

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  allowedOrigins: (process.env.FRONTEND_ORIGINS || (isProduction ? '' : 'http://localhost:5173'))
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
    uploadFolder: process.env.CLOUDINARY_UPLOAD_FOLDER || 'daystar-products',
  },
}

export function validateRuntimeEnvironment() {
  const missing = []
  if (!env.mongoUri) missing.push('MONGODB_URI')
  if (!env.jwtSecret || env.jwtSecret.length < 32) missing.push('JWT_SECRET (minimum 32 characters)')
  if (!env.allowedOrigins.length) missing.push('FRONTEND_ORIGINS')
  if (missing.length) {
    throw new Error(`Missing or invalid required environment variables: ${missing.join(', ')}`)
  }
}