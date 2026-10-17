import { Router } from 'express'
import { rateLimit } from 'express-rate-limit'
import { login, currentAdmin, logout } from '../controllers/adminAuthController.js'
import { createProduct, deleteProduct, listAdminProducts, updateProduct } from '../controllers/adminProductsController.js'
import { authenticateAdmin, requireCsrf, requireTrustedAdminRequest } from '../middleware/auth.js'
import { createUploadSignature } from '../controllers/uploadController.js'
import { createBlog, deleteBlog, listAdminBlogs, updateBlog } from '../controllers/adminBlogsController.js'

const router = Router()
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { message: 'Too many sign-in attempts. Please wait and try again.' },
})

router.use(requireTrustedAdminRequest)
router.post('/login', loginLimiter, login)
router.use(authenticateAdmin)
router.get('/me', currentAdmin)
router.post('/logout', requireCsrf, logout)
router.get('/products', listAdminProducts)
router.post('/products', requireCsrf, createProduct)
router.put('/products/:id', requireCsrf, updateProduct)
router.delete('/products/:id', requireCsrf, deleteProduct)
router.post('/uploads/signature', requireCsrf, createUploadSignature)
router.get('/blogs', listAdminBlogs)
router.post('/blogs', requireCsrf, createBlog)
router.put('/blogs/:id', requireCsrf, updateBlog)
router.delete('/blogs/:id', requireCsrf, deleteBlog)

export default router