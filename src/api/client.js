import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

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