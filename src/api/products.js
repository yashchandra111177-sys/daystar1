import { apiClient } from './client'

export const publicProductsApi = {
  async list(config) {
    const { data } = await apiClient.get('/api/products', config)
    return data.products
  },
  async get(id, config) {
    const { data } = await apiClient.get(`/api/products/${encodeURIComponent(id)}`, config)
    return data.product
  },
}