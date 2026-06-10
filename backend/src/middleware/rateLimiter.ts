import rateLimit from 'express-rate-limit'

// Limit uploads: 20 per hour per IP
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    error: 'Too many uploads. Please wait before trying again.',
  },
  standardHeaders: true,
  legacyHeaders: false,
})

// General API limiter: 200 req per 15 min
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: {
    success: false,
    error: 'Too many requests. Please slow down.',
  },
  standardHeaders: true,
  legacyHeaders: false,
})
