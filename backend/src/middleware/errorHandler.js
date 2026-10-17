export function notFoundHandler(req, res) {
  res.status(404).json({ message: 'The requested API route was not found.' })
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error)
  if (error?.message === 'Origin is not allowed by CORS.') return res.status(403).json({ message: 'Request origin is not allowed.' })
  if (error?.type === 'entity.too.large') return res.status(413).json({ message: 'Request body is too large.' })
  if (error?.name === 'ValidationError') {
    return res.status(400).json({ message: 'Product validation failed.', errors: Object.fromEntries(Object.entries(error.errors).map(([key, value]) => [key, value.message])) })
  }
  if (error?.code === 11000) return res.status(409).json({ message: 'A record with that value already exists.' })

  console.error('API error:', error?.message || 'Unknown error')
  res.status(500).json({ message: 'An unexpected server error occurred.' })
}