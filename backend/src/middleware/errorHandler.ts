import type { Request, Response, NextFunction } from 'express'
import multer from 'multer'
import { logger } from '../utils/logger'
import type { ApiResponse } from '../types/index.js'

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  logger.error('Unhandled error', { message: err.message, stack: err.stack })

  // Multer-specific errors
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(413).json({
        success: false,
        error: 'File too large. Maximum size is 100MB.',
      } satisfies ApiResponse)
      return
    }
    res.status(400).json({
      success: false,
      error: `Upload error: ${err.message}`,
    } satisfies ApiResponse)
    return
  }

  // Validation errors (from fileFilter)
  if (err.message.includes('Unsupported file type')) {
    res.status(415).json({
      success: false,
      error: err.message,
    } satisfies ApiResponse)
    return
  }

  // Generic
  res.status(500).json({
    success: false,
    error: 'An unexpected error occurred. Please try again.',
  } satisfies ApiResponse)
}