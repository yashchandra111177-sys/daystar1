import { ArrowUpRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatPrice } from '../config/siteConfig'
import ImageWithFallback from './ImageWithFallback'
import WhatsAppButton from './WhatsAppButton'

export default function ProductCard({ product }) {
  return (
    <article className="product-card">
      <Link className="product-card__image-link" to={`/product/${product.id}`} aria-label={`View ${product.name}`}>
        <div className="product-card__image-wrap">
          <ImageWithFallback src={product.image} alt={product.name} className="product-card__image" loading="lazy" />
          {product.newArrival && <span className="product-card__badge"><Sparkles size={12} /> Just in</span>}
          <span className="product-card__quick-view" aria-hidden="true"><ArrowUpRight size={19} /></span>
        </div>
      </Link>
      <div className="product-card__body">
        <p className="product-card__category">{product.category}</p>
        <div className="product-card__heading-row">
          <h3><Link to={`/product/${product.id}`}>{product.name}</Link></h3>
          <span className="product-card__price">{formatPrice(product.price)}</span>
        </div>
        {product.originalPrice && (
          <p className="product-card__was-price">{formatPrice(product.originalPrice)} <span>Special price</span></p>
        )}
        <WhatsAppButton product={product} compact className="product-card__enquire">Ask about this piece</WhatsAppButton>
      </div>
    </article>
  )
}