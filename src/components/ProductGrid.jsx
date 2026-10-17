import ProductCard from './ProductCard'

export default function ProductGrid({ items = [], className = '' }) {
  return (
    <div className={`product-grid ${className}`.trim()}>
      {items.map((product) => <ProductCard key={product.id} product={product} />)}
    </div>
  )
}