import { AlertTriangle, ArrowUpRight, Edit3, Package, Plus, Search, Trash2, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminApi } from '../../api/admin'
import { apiErrorMessage } from '../../api/client'
import { formatPrice } from '../../config/siteConfig'
import ImageWithFallback from '../../components/ImageWithFallback'
import ProductForm from '../../components/ProductForm'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState(undefined)
  const [deleting, setDeleting] = useState(null)
  const [deleteError, setDeleteError] = useState('')
  const [deletingNow, setDeletingNow] = useState(false)

  const loadProducts = async () => {
    setLoading(true)
    setError('')
    try { setProducts(await adminApi.listProducts()) }
    catch (requestError) { setError(apiErrorMessage(requestError, 'Could not load products.')) }
    finally { setLoading(false) }
  }

  useEffect(() => { loadProducts() }, [])

  const visibleProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return products.filter((product) => `${product.name} ${product.category}`.toLowerCase().includes(normalized))
  }, [products, query])

  const saveProduct = async (payload) => {
    if (editing) await adminApi.updateProduct(editing.id, payload)
    else await adminApi.createProduct(payload)
    setEditing(undefined)
    setNotice(editing ? 'Product details updated.' : 'Product added to the collection.')
    await loadProducts()
  }

  const removeProduct = async () => {
    if (!deleting) return
    setDeletingNow(true)
    setDeleteError('')
    try {
      await adminApi.deleteProduct(deleting.id)
      setDeleting(null)
      setNotice(`${deleting.name} was removed from the collection.`)
      await loadProducts()
    } catch (requestError) {
      setDeleteError(apiErrorMessage(requestError, 'The product could not be deleted.'))
    } finally {
      setDeletingNow(false)
    }
  }

  return (
    <main className="admin-content">
      <div className="admin-page-heading"><div><p className="eyebrow">Keep the collection lovely</p><h1>Products</h1><p>Add a new find, update its details or set it aside.</p></div><button type="button" className="button button--primary" onClick={() => { setNotice(''); setEditing(null) }}><Plus size={17} /> Add product</button></div>
      {notice && <div className="admin-success" role="status">{notice}<button type="button" aria-label="Dismiss message" onClick={() => setNotice('')}><X size={16} /></button></div>}
      <section className="admin-panel admin-products-panel">
        <div className="admin-products-toolbar"><div className="admin-products-count"><Package size={18} /><span>{loading ? 'Loading products…' : `${products.length} ${products.length === 1 ? 'product' : 'products'}`}</span></div><label className="admin-search"><Search size={17} /><span className="sr-only">Search admin products</span><input placeholder="Search name or category" value={query} onChange={(event) => setQuery(event.target.value)} /><button type="button" aria-label="Clear search" hidden={!query} onClick={() => setQuery('')}><X size={14} /></button></label></div>
        {error && <div className="admin-alert" role="alert">{error}<button type="button" onClick={loadProducts}>Try again</button></div>}
        {!error && loading ? <div className="admin-panel__state" role="status">Loading your products…</div> : null}
        {!error && !loading && products.length === 0 && <div className="admin-panel__state"><span className="admin-empty-icon"><Package size={22} /></span><h2>Your collection is waiting.</h2><p>Add your first product to get started.</p><button type="button" className="button button--primary" onClick={() => setEditing(null)}><Plus size={16} /> Add first product</button></div>}
        {!error && !loading && products.length > 0 && visibleProducts.length === 0 && <div className="admin-panel__state"><p>No products match “{query}”.</p><button type="button" className="button button--outline" onClick={() => setQuery('')}>Clear search</button></div>}
        {!error && !loading && visibleProducts.length > 0 && <div className="admin-product-list">{visibleProducts.map((product) => <article className="admin-product-row" key={product.id}><ImageWithFallback src={product.image} alt="" className="admin-product-row__image" /><div className="admin-product-row__details"><span>{product.category}</span><h2>{product.name}</h2><p>{formatPrice(product.price)}{product.originalPrice ? <del>{formatPrice(product.originalPrice)}</del> : null}</p></div><div className="admin-product-row__badges">{product.featured && <span>Featured</span>}{product.newArrival && <span>New</span>}<span className={product.available ? 'admin-status admin-status--available' : 'admin-status admin-status--unavailable'}>{product.available ? 'Available' : 'Unavailable'}</span></div><div className="admin-product-row__actions"><Link to={`/product/${product.id}`} target="_blank" rel="noreferrer" className="admin-icon-action" aria-label={`View ${product.name} on storefront`} title="View storefront"><ArrowUpRight size={17} /></Link><button type="button" className="admin-icon-action" aria-label={`Edit ${product.name}`} title="Edit product" onClick={() => { setNotice(''); setEditing(product) }}><Edit3 size={16} /></button><button type="button" className="admin-icon-action admin-icon-action--danger" aria-label={`Delete ${product.name}`} title="Delete product" onClick={() => { setDeleteError(''); setDeleting(product) }}><Trash2 size={16} /></button></div></article>)}</div>}
      </section>
      {editing !== undefined && <div className="admin-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setEditing(undefined) }}><section className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="product-form-title"><div className="admin-modal__heading"><div><p className="eyebrow">{editing ? 'Make it just right' : 'Add to the collection'}</p><h2 id="product-form-title">{editing ? 'Edit product' : 'New product'}</h2></div><button type="button" className="admin-icon-action" aria-label="Close form" onClick={() => setEditing(undefined)}><X size={19} /></button></div><ProductForm key={editing?.id || 'new-product'} initialProduct={editing || null} onSave={saveProduct} onCancel={() => setEditing(undefined)} /></section></div>}
      {deleting && <div className="admin-modal-backdrop" role="presentation"><section className="admin-confirm-modal" role="alertdialog" aria-modal="true" aria-labelledby="delete-title"><span className="admin-confirm-modal__icon"><AlertTriangle size={21} /></span><h2 id="delete-title">Remove this product?</h2><p><strong>{deleting.name}</strong> will be removed from the storefront. This cannot be undone.</p>{deleteError && <p className="admin-form-error" role="alert">{deleteError}</p>}<div className="admin-form__actions"><button type="button" className="button button--outline" onClick={() => setDeleting(null)} disabled={deletingNow}>Keep product</button><button type="button" className="button button--danger" onClick={removeProduct} disabled={deletingNow}>{deletingNow ? 'Removing…' : 'Remove product'}</button></div></section></div>}
    </main>
  )
}