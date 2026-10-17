import { apiClient } from './client'

export async function listBlogs() {
  const { data } = await apiClient.get('/api/blogs')
  return data.blogs
}

export async function getBlog(slug) {
  const { data } = await apiClient.get(`/api/blogs/${encodeURIComponent(slug)}`)
  return data.blog
}