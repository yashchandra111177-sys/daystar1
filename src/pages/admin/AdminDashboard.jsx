import { ArrowRight, Package, Plus, Shapes } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminApi } from '../../api/admin'
import { apiErrorMessage } from '../../api/client'
import { formatPrice } from '../../config/siteConfig'
import ImageWithFallback from '../../components/ImageWithFallback'

export default function AdminDashboard() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadProducts = async () => {
    setLoading(true)
    setError('')
    try { setProducts(await adminApi.listProducts()) }
    catch (requestError) { setError(apiErrorMessage(requestError, 'Could not load the product overview.')) }
    finally { setLoading(false) }
  }

  useEffect(() => { loadProducts() }, [])

  const categoryCount = new Set(products.map((product) => product.category)).size

  return (
    <main className="admin-content">
      <div className="admin-page-heading"><div><p className="eyebrow">Your collection, at a glance</p><h1>Good morning.</h1><p>Here is what is happening in your little corner of the shop.</p></div><Link className="button button--primary" to="/admin/products"><Plus size={17} /> Add a product</Link></div>
      {error && <div className="admin-alert" role="alert">{error} <button type="button" onClick={loadProducts}>Try again</button></div>}
      <section className="admin-stats" aria-label="Catalog summary">
        <article className="admin-stat"><span className="admin-stat__icon"><Package size={20} /></span><p>Total products</p><strong>{loading ? '—' : products.length}</strong><small>In your collection</small></article>
        <article className="admin-stat admin-stat--blue"><span className="admin-stat__icon"><Shapes size={20} /></span><p>Categories</p><strong>{loading ? '—' : categoryCount}</strong><small>Thoughtful little worlds</small></article>
        <article className="admin-stat admin-stat--yellow"><span className="admin-stat__icon"><span aria-hidden="true">✳</span></span><p>Featured pieces</p><strong>{loading ? '—' : products.filter((product) => product.featured).length}</strong><small>On the storefront</small></article>
      </section>
      <section className="admin-panel admin-recent">
        <div className="admin-panel__heading"><div><p className="eyebrow">Recently tended</p><h2>Latest products</h2></div><Link className="admin-text-link" to="/admin/products">Manage products <ArrowRight size={16} /></Link></div>
        {loading ? <p className="admin-panel__state" role="status">Loading your products…</p> : products.length === 0 ? <div className="admin-panel__state"><p>Your collection is ready for its first addition.</p><Link to="/admin/products" className="button button--outline">Add the first product <ArrowRight size={16} /></Link></div> : (
          <div className="admin-recent-list">{products.slice(0, 5).map((product) => <article className="admin-recent-row" key={product.id}><ImageWithFallback src={product.image} alt="" /><div><h3>{product.name}</h3><p>{product.category}</p></div><strong>{formatPrice(product.price)}</strong><span className={`admin-status ${product.available ? 'admin-status--available' : 'admin-status--unavailable'}`}>{product.available ? 'Available' : 'Unavailable'}</span></article>)}</div>
        )}
      </section>
    </main>
  )
}