import { v2 as cloudinary } from 'cloudinary'
import { env } from '../config/env.js'

export function createUploadSignature(req, res) {
  const { cloudName, apiKey, apiSecret, uploadFolder } = env.cloudinary
  if (!cloudName || !apiKey || !apiSecret) {
    return res.status(503).json({ message: 'Image uploads are not configured. Set the Cloudinary environment variables.' })
  }

  const timestamp = Math.floor(Date.now() / 1000)
  const params = { allowed_formats: 'jpg,png,webp,avif', folder: uploadFolder, timestamp }
  const signature = cloudinary.utils.api_sign_request(params, apiSecret)
  res.json({ cloudName, apiKey, ...params, signature })
}