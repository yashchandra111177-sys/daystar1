import { useState } from 'react'
import { ImageOff } from 'lucide-react'

export default function ImageWithFallback({ src, alt, className = '', ...props }) {
  const [failed, setFailed] = useState(false)

  if (failed || !src) {
    return (
      <div className={`image-fallback ${className}`.trim()} role="img" aria-label={alt || 'Image unavailable'}>
        <ImageOff size={28} strokeWidth={1.5} aria-hidden="true" />
        <span>Image coming soon</span>
      </div>
    )
  }

  return <img src={src} alt={alt} className={className} onError={() => setFailed(true)} {...props} />
}