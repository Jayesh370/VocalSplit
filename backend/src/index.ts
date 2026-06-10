import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { uploadRouter } from './routes/uploadRoutes'
import { statusRouter } from './routes/statusRoutes'
import { errorHandler } from './middleware/errorHandler'
import { apiLimiter } from './middleware/rateLimiter'
import { logger } from './utils/logger'

const app = express()
const PORT = parseInt(process.env.PORT || '3001', 10)

// Trust proxy headers (needed on Railway/Render)
app.set('trust proxy', 1)

// CORS
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim())

app.use(
  cors({
    origin: (origin, cb) => {
      // Allow requests with no origin (curl, Postman, same-origin)
      if (!origin || allowedOrigins.includes(origin)) {
        cb(null, true)
      } else {
        cb(new Error(`CORS: origin ${origin} not allowed`))
      }
    },
    credentials: false,
  })
)

app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))

// Apply general rate limiter to all routes
app.use('/api', apiLimiter)

// Routes
app.use('/api', uploadRouter)
app.use('/api', statusRouter)

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Route not found.' })
})

// Error handler (must be last)
app.use(errorHandler)

app.listen(PORT, () => {
  logger.info(`VocalSplit AI backend running`, { port: PORT })
})

export default app