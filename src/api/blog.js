import { apiClient, getWithRetry } from './client'

export async function listBlogs(config) {
  const { data } = await getWithRetry('/api/blogs', config)
  return data.blogs
}

export async function getBlog(slug) {
  const { data } = await apiClient.get(`/api/blogs/${encodeURIComponent(slug)}`)
  return data.blog
}