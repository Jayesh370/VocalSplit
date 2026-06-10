import { Router, type Request, type Response } from 'express'
import path from 'path'
import fs from 'fs'
import { jobManager } from '../services/jobManager'
import { scheduleJobCleanup } from '../services/cleanupService'
import { logger } from '../utils/logger'
import type { ApiResponse, StatusResponseData } from '../types/index.js'

export const statusRouter = Router()

// GET /api/status/:jobId — poll for processing status
statusRouter.get('/status/:jobId', (req: Request, res: Response) => {
  const { jobId } = req.params
  const job = jobManager.get(jobId)

  if (!job) {
    res.status(404).json({
      success: false,
      error: 'Job not found. It may have expired.',
    } satisfies ApiResponse)
    return
  }

  const data: StatusResponseData = {
    jobId: job.id,
    status: job.status,
    originalName: job.originalName,
    ...(job.status === 'ready' && {
      vocalsUrl: `/api/download/${job.id}/vocals`,
      instrumentalUrl: `/api/download/${job.id}/instrumental`,
    }),
    ...(job.status === 'error' && {
      errorMessage: job.errorMessage,
    }),
  }

  res.json({ success: true, data } satisfies ApiResponse<StatusResponseData>)
})

// GET /api/download/:jobId/:track — stream the audio file
statusRouter.get('/download/:jobId/:track', (req: Request, res: Response) => {
  const { jobId, track } = req.params

  if (track !== 'vocals' && track !== 'instrumental') {
    res.status(400).json({
      success: false,
      error: 'Track must be "vocals" or "instrumental".',
    } satisfies ApiResponse)
    return
  }

  const job = jobManager.get(jobId)

  if (!job || job.status !== 'ready') {
    res.status(404).json({
      success: false,
      error: 'Job not found or not ready.',
    } satisfies ApiResponse)
    return
  }

  const filePath = track === 'vocals' ? job.vocalsPath : job.instrumentalPath

  if (!filePath || !fs.existsSync(filePath)) {
    res.status(404).json({
      success: false,
      error: 'Audio file not found. It may have already been downloaded.',
    } satisfies ApiResponse)
    return
  }

  const baseName = job.originalName.replace(/\.[^.]+$/, '')
  const downloadName = `${baseName}_${track}.mp3`

  logger.info('Serving download', { jobId, track, downloadName })

  res.setHeader('Content-Type', 'audio/mpeg')
  res.setHeader('Content-Disposition', `attachment; filename="${downloadName}"`)
  res.setHeader('Cache-Control', 'no-store')

  const stream = fs.createReadStream(filePath)
  stream.pipe(res)

  stream.on('end', () => {
    // Schedule full job cleanup 5 seconds after serving
    scheduleJobCleanup(
      job.uploadPath,
      job.vocalsPath,
      job.instrumentalPath,
      60000
    )
    // jobManager.delete(jobId)
  })

  stream.on('error', (err) => {
    logger.error('Stream error during download', { jobId, err })
    if (!res.headersSent) {
      res.status(500).json({ success: false, error: 'Failed to stream file.' })
    }
  })
})

// GET /api/health
statusRouter.get('/health', async (_req, res) => {
  res.json({ success: true, data: { status: 'ok', timestamp: new Date().toISOString() } })
})