import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { env } from './config/env.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'
import adminRoutes from './routes/adminRoutes.js'
import productRoutes from './routes/productRoutes.js'
import blogRoutes from './routes/blogRoutes.js'

const app = express()

if (env.nodeEnv === 'production') app.set('trust proxy', 1)

app.use(helmet())
app.use(cors({
  origin(origin, callback) {
    if (!origin || env.allowedOrigins.includes(origin)) return callback(null, true)
    callback(new Error('Origin is not allowed by CORS.'))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-Requested-With', 'X-CSRF-Token'],
  maxAge: 600,
}))
app.use(express.json({ limit: '32kb', strict: true }))
app.use(cookieParser())

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))
app.use('/api/products', productRoutes)
app.use('/api/blogs', blogRoutes)
app.use('/api/admin', adminRoutes)
app.use(notFoundHandler)
app.use(errorHandler)

export default app