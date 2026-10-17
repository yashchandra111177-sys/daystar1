import { MessageCircle } from 'lucide-react'
import { useState } from 'react'
import { formatPrice, whatsappUrl } from '../config/siteConfig'

export default function WhatsAppButton({ product, children = 'Enquire on WhatsApp', className = '', compact = false }) {
  const [showSetupMessage, setShowSetupMessage] = useState(false)
  const hasProductInfo = typeof product?.name === 'string'
    && Boolean(product.name.trim())
    && typeof product.price === 'number'
    && Number.isFinite(product.price)
    && product.price >= 0
  const message = hasProductInfo
    ? `Hi! I'm interested in ${product.name.trim()}, priced at ${formatPrice(product.price)}. Could you share more details?`
    : 'Hi! I would love to know more about your collection.'
  const href = whatsappUrl(message)
  const buttonClass = `button button--whatsapp ${compact ? 'button--compact' : ''} ${className}`.trim()

  if (!href) {
    return (
      <span>
        <button type="button" className={buttonClass} onClick={() => setShowSetupMessage(true)} aria-label="WhatsApp contact is not configured">
          <MessageCircle size={18} strokeWidth={1.8} aria-hidden="true" />
          <span>{children}</span>
        </button>
        {showSetupMessage && <span role="status"> Set the store WhatsApp number in src/config/siteConfig.js.</span>}
      </span>
    )
  }

  return (
    <a
      className={buttonClass}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={hasProductInfo ? `Enquire about ${product.name} on WhatsApp` : 'Contact us on WhatsApp'}
    >
      <MessageCircle size={18} strokeWidth={1.8} aria-hidden="true" />
      <span>{children}</span>
    </a>
  )
}