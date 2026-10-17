import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import AdminLayout from './components/AdminLayout'
import AdminRoute from './components/AdminRoute'
import Navbar from './components/Navbar'
import About from './pages/About'
import Contact from './pages/Contact'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import ProductDetails from './pages/ProductDetails'
import Shop from './pages/Shop'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminBlogs from './pages/admin/AdminBlogs'
import AdminLogin from './pages/admin/AdminLogin'
import AdminProducts from './pages/admin/AdminProducts'
import BlogIndex from './pages/BlogIndex'
import BlogArticle from './pages/BlogArticle'
import { ProductsProvider } from './context/ProductsContext'
import { AdminAuthProvider } from './context/AdminAuthContext'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

function AppContent() {
  const { pathname } = useLocation()
  const isAdminPath = pathname.startsWith('/admin')

  return (
    <>
      <ScrollToTop />
      {!isAdminPath && <Navbar />}
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="blogs" element={<AdminBlogs />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<BlogIndex />} />
        <Route path="/blog/:slug" element={<BlogArticle />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default function App() {
  return <BrowserRouter><ProductsProvider><AdminAuthProvider><AppContent /></AdminAuthProvider></ProductsProvider></BrowserRouter>
}