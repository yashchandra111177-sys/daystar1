import { ArrowLeft, ArrowRight, Check, Heart, PackageCheck } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Footer from '../components/Footer'
import ImageWithFallback from '../components/ImageWithFallback'
import ProductGrid from '../components/ProductGrid'
import SectionHeading from '../components/SectionHeading'
import WhatsAppButton from '../components/WhatsAppButton'
import { formatPrice } from '../config/siteConfig'
import { publicProductsApi } from '../api/products'
import { apiErrorMessage } from '../api/client'
import { useProducts } from '../context/ProductsContext'

export default function ProductDetails() {
  const { id } = useParams()
  const { products } = useProducts()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setProduct(null)
    setError('')
    publicProductsApi.get(id, { signal: controller.signal })
      .then(setProduct)
      .catch((requestError) => {
        if (requestError.name === 'CanceledError') return
        if (requestError.response?.status === 404) setProduct(null)
        else setError(apiErrorMessage(requestError, 'We could not load this product right now.'))
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [id])

  if (loading) return <><main className="empty-state product-missing" role="status"><p>Finding this little thing…</p></main><Footer /></>
  if (error) return <><main className="empty-state product-missing" role="alert"><p>{error}</p><Link to="/shop" className="button button--primary">Back to the collection <ArrowRight size={17} /></Link></main><Footer /></>

  if (!product) {
    return <><main className="empty-state product-missing"><span className="eyebrow">A little detour</span><h1>That piece has wandered off.</h1><p>It may have found a new home, or the link may be a little out of date.</p><Link to="/shop" className="button button--primary">Back to the collection <ArrowRight size={17} /></Link></main><Footer /></>
  }

  const related = products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4)

  return (
    <>
      <main className="product-detail-page">
        <div className="container">
          <div className="breadcrumbs product-breadcrumbs"><Link to="/">Home</Link><ArrowRight size={13} /><Link to="/shop">Shop</Link><ArrowRight size={13} /><span>{product.name}</span></div>
          <div className="product-detail">
            <div className="product-detail__gallery"><div className="product-detail__main-image"><ImageWithFallback src={product.image} alt={product.name} /></div>{product.additionalImages?.length > 0 && <div className="product-detail__thumbnails">{product.additionalImages.map((image) => <ImageWithFallback key={image} src={image} alt={`${product.name}, detail view`} loading="lazy" />)}</div>}</div>
            <div className="product-detail__info"><p className="eyebrow">{product.category}</p><h1>{product.name}</h1><div className="product-detail__price">{formatPrice(product.price)}{product.originalPrice && <span>{formatPrice(product.originalPrice)}</span>}</div><p className="product-detail__description">{product.description}</p><div className="product-detail__rule" /><div className="product-detail__availability"><span className="availability-dot" /><span>{product.available ? 'Available to enquire' : 'Currently unavailable'}</span></div><WhatsAppButton product={product} className="product-detail__whatsapp" /><p className="product-detail__note"><Heart size={15} /> A real person will get back to you with all the details.</p><div className="product-detail__perks"><div><PackageCheck size={19} /><span>Carefully packed</span></div><div><Check size={19} /><span>Selected with care</span></div></div></div>
          </div>
        </div>
        {related.length > 0 && <section className="section related-section"><div className="container"><div className="section-topline"><SectionHeading eyebrow="In good company" title="You might also like" align="left" /><Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="text-link">More in {product.category} <ArrowRight size={17} /></Link></div><ProductGrid items={related} /></div></section>}
      </main>
      <Footer />
    </>
  )
}