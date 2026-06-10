import { Router, type Request, type Response, type NextFunction } from 'express'
import { upload } from '../middleware/multerConfig'
import { uploadLimiter } from '../middleware/rateLimiter'
import { jobManager } from '../services/jobManager'
import { separateAudio } from '../services/pythonService'
import { deleteFile } from '../services/cleanupService'
import { logger } from '../utils/logger'
import type { ApiResponse, UploadResponseData } from '../types/index.js'

export const uploadRouter = Router()

uploadRouter.post(
  '/upload',
  uploadLimiter,
  (req: Request, res: Response, next: NextFunction) => {
    upload.single('audio')(req, res, (err) => {
      if (err) return next(err)
      next()
    })
  },
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      res.status(400).json({
        success: false,
        error: 'No audio file provided.',
      } satisfies ApiResponse)
      return
    }

    const job = jobManager.create(req.file.originalname, req.file.path)

    // Respond immediately with jobId — processing happens async
    res.status(202).json({
      success: true,
      data: {
        jobId: job.id,
        message: 'File received. Processing has started.',
      },
    } satisfies ApiResponse<UploadResponseData>)

    // Kick off async processing (do not await in request handler)
    processJob(job.id, job.uploadPath).catch((err: unknown) => {
      logger.error('Unhandled processing error', { jobId: job.id, err })
    })
  }
)

async function processJob(jobId: string, uploadPath: string): Promise<void> {
  jobManager.setStatus(jobId, 'processing')

  try {
    const result = await separateAudio(uploadPath, jobId)

    jobManager.setStatus(jobId, 'ready', {
      vocalsPath: result.vocalsPath,
      instrumentalPath: result.instrumentalPath,
    })

    // Delete the original upload now that stems are ready
    deleteFile(uploadPath)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Processing failed'
    logger.error('Audio separation failed', { jobId, error: message })
    jobManager.setStatus(jobId, 'error', { errorMessage: message })
    deleteFile(uploadPath)
  }
}