import { apiClient } from './client'

export const adminApi = {
  async login(credentials) {
    const { data } = await apiClient.post('/api/admin/login', credentials)
    return data.admin
  },
  async me() {
    const { data } = await apiClient.get('/api/admin/me')
    return data.admin
  },
  async logout() {
    await apiClient.post('/api/admin/logout')
  },
  async listProducts() {
    const { data } = await apiClient.get('/api/admin/products')
    return data.products
  },
  async createProduct(product) {
    const { data } = await apiClient.post('/api/admin/products', product)
    return data.product
  },
  async updateProduct(id, product) {
    const { data } = await apiClient.put(`/api/admin/products/${encodeURIComponent(id)}`, product)
    return data.product
  },
  async deleteProduct(id) {
    await apiClient.delete(`/api/admin/products/${encodeURIComponent(id)}`)
  },
  async listBlogs() {
    const { data } = await apiClient.get('/api/admin/blogs')
    return data.blogs
  },
  async createBlog(blog) {
    const { data } = await apiClient.post('/api/admin/blogs', blog)
    return data.blog
  },
  async updateBlog(id, blog) {
    const { data } = await apiClient.put(`/api/admin/blogs/${encodeURIComponent(id)}`, blog)
    return data.blog
  },
  async deleteBlog(id) {
    await apiClient.delete(`/api/admin/blogs/${encodeURIComponent(id)}`)
  },
  async createUploadSignature() {
    const { data } = await apiClient.post('/api/admin/uploads/signature')
    return data
  },
}