import axios from 'axios'

const baseURL = import.meta.env.PROD
  ? '/'
  : import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

function readCookie(name) {
  const cookie = document.cookie.split('; ').find((item) => item.startsWith(`${name}=`))
  return cookie ? decodeURIComponent(cookie.slice(name.length + 1)) : ''
}

apiClient.interceptors.request.use((config) => {
  config.headers.set('X-Requested-With', 'XMLHttpRequest')
  if (!['get', 'head', 'options'].includes(config.method?.toLowerCase())) {
    const csrfToken = readCookie('daystar_admin_csrf')
    if (csrfToken) config.headers.set('X-CSRF-Token', csrfToken)
  }
  return config
})

export function apiErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  return error.response?.data?.message || fallback
}

export async function getWithRetry(url, config) {
  const maxRetries = 2

  for (let attempt = 0; ; attempt += 1) {
    try {
      return await apiClient.get(url, config)
    } catch (error) {
      if (config?.signal?.aborted || attempt >= maxRetries || !isTransientGetError(error)) throw error
      await new Promise((resolve) => setTimeout(resolve, 750 * (attempt + 1)))
    }
  }
}

function isTransientGetError(error) {
  if (error.response) return [502, 503, 504].includes(error.response.status)
  return Boolean(error.request) || ['ECONNABORTED', 'ETIMEDOUT'].includes(error.code)
}
