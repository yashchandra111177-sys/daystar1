export default function ProductNotice({ loading, error, empty, onRetry, emptyTitle = 'Nothing here just yet', emptyMessage = 'Check back soon for new finds.' }) {
  if (loading) return <div className="product-notice" role="status">Gathering the collection…</div>
  if (error) return <div className="product-notice product-notice--error" role="alert"><p>{error}</p><button type="button" onClick={() => onRetry?.()}>Try again</button></div>
  if (empty) return <div className="product-notice"><h2>{emptyTitle}</h2><p>{emptyMessage}</p></div>
  return null
}