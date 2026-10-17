import { ArrowRight, Search, SlidersHorizontal, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Footer from '../components/Footer'
import ProductGrid from '../components/ProductGrid'
import SectionHeading from '../components/SectionHeading'
import { categories } from '../data/products'
import ProductNotice from '../components/ProductNotice'
import { useProducts } from '../context/ProductsContext'

export default function Shop() {
  const { products, loading, error, refresh } = useProducts()
  const [searchParams, setSearchParams] = useSearchParams()
  const queryParam = searchParams.get('q') || ''
  const categoryParam = searchParams.get('category') || 'All pieces'
  const [query, setQuery] = useState(queryParam)
  const [category, setCategory] = useState(categoryParam)
  const [sortBy, setSortBy] = useState('featured')
  const categoryOptions = [...new Set([...categories, ...products.map((product) => product.category)])]

  useEffect(() => setQuery(queryParam), [queryParam])
  useEffect(() => setCategory(categoryParam), [categoryParam])

  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    const result = products.filter((product) => {
      const matchesCategory = category === 'All pieces' || product.category === category
      const matchesQuery = !normalizedQuery || `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(normalizedQuery)
      return matchesCategory && matchesQuery
    })

    if (sortBy === 'low') result.sort((a, b) => a.price - b.price)
    if (sortBy === 'high') result.sort((a, b) => b.price - a.price)
    if (sortBy === 'newest') result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    if (sortBy === 'featured') result.sort((a, b) => Number(b.featured) - Number(a.featured))
    return result
  }, [category, query, sortBy])

  const updateQuery = (value) => {
    setQuery(value)
    const nextParams = new URLSearchParams(searchParams)
    if (value.trim()) nextParams.set('q', value.trim())
    else nextParams.delete('q')
    setSearchParams(nextParams, { replace: true })
  }

  const selectCategory = (value) => {
    setCategory(value)
    const nextParams = new URLSearchParams(searchParams)
    if (value === 'All pieces') nextParams.delete('category')
    else nextParams.set('category', value)
    setSearchParams(nextParams, { replace: true })
  }

  return (
    <>
      <main className="shop-page">
        <div className="shop-intro"><div className="container"><div className="breadcrumbs"><Link to="/">Home</Link><ArrowRight size={13} /><span>Shop</span></div><SectionHeading eyebrow="The considered collection" title="Shop all products" description="Useful, lovely things for all the little moments in between." /></div></div>
        <div className="container shop-content">
          <div className="shop-toolbar">
            <div className="shop-toolbar__count"><span className="shop-toolbar__sparkle">✳</span><span>{visibleProducts.length} thoughtful finds</span></div>
            <div className="shop-toolbar__controls">
              <label className="shop-search"><Search size={17} aria-hidden="true" /><span className="sr-only">Search products</span><input value={query} onChange={(event) => updateQuery(event.target.value)} placeholder="Search the collection" /><button type="button" aria-label="Clear search" onClick={() => updateQuery('')} hidden={!query}><X size={15} /></button></label>
              <label className="sort-select"><SlidersHorizontal size={16} aria-hidden="true" /><span className="sr-only">Sort products</span><select value={sortBy} onChange={(event) => setSortBy(event.target.value)}><option value="featured">Featured</option><option value="low">Price: Low to High</option><option value="high">Price: High to Low</option><option value="newest">Newest</option></select></label>
            </div>
          </div>
          <div className="category-filters" aria-label="Filter by category"><button type="button" className={category === 'All pieces' ? 'is-active' : ''} onClick={() => selectCategory('All pieces')}>All pieces</button>{categoryOptions.map((item) => <button type="button" key={item} className={category === item ? 'is-active' : ''} onClick={() => selectCategory(item)}>{item}</button>)}</div>
          {loading || error ? <ProductNotice loading={loading} error={error} onRetry={refresh} /> : visibleProducts.length ? <ProductGrid items={visibleProducts} /> : (
            <div className="empty-state"><span className="empty-state__icon"><Search size={23} /></span><h2>No little thing found</h2><p>Try another search or choose a different category.</p><button type="button" className="button button--outline" onClick={() => { updateQuery(''); selectCategory('All pieces') }}>Clear filters <X size={16} /></button></div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}