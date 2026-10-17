import { createContext, useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { apiErrorMessage } from '../api/client'
import { publicProductsApi } from '../api/products'

const ProductsContext = createContext(null)

export function ProductsProvider({ children }) {
  const { pathname } = useLocation()
  const isAdminPath = pathname.startsWith('/admin')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const refresh = async (signal) => {
    setLoading(true)
    setError('')
    try {
      const result = await publicProductsApi.list(signal ? { signal } : undefined)
      setProducts(result)
    } catch (requestError) {
      if (!signal?.aborted) setError(apiErrorMessage(requestError, 'We could not load the collection right now.'))
    } finally {
      if (!signal?.aborted) setLoading(false)
    }
  }

  useEffect(() => {
    if (isAdminPath) return undefined
    const controller = new AbortController()
    refresh(controller.signal)
    return () => controller.abort()
  }, [isAdminPath])

  return <ProductsContext.Provider value={{ products, loading, error, refresh }}>{children}</ProductsContext.Provider>
}

export function useProducts() {
  const context = useContext(ProductsContext)
  if (!context) throw new Error('useProducts must be used within ProductsProvider.')
  return context
}