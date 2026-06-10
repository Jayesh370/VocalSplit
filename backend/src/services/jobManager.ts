import { v4 as uuidv4 } from 'uuid'
import type { Job, JobStatus } from '../types/index.js'
import { logger } from '../utils/logger'

// In-memory job store (no database needed)
const jobs = new Map<string, Job>()

// Auto-cleanup jobs older than 30 minutes
const JOB_TTL_MS = 30 * 60 * 1000

export const jobManager = {
  create(originalName: string, uploadPath: string): Job {
    const job: Job = {
      id: uuidv4(),
      status: 'pending',
      originalName,
      uploadPath,
      createdAt: new Date(),
    }
    jobs.set(job.id, job)
    logger.info('Job created', { jobId: job.id, originalName })
    return job
  },

  get(id: string): Job | undefined {
    return jobs.get(id)
  },

  update(id: string, updates: Partial<Job>): Job | null {
    const job = jobs.get(id)
    if (!job) return null
    const updated = { ...job, ...updates }
    jobs.set(id, updated)
    return updated
  },

  setStatus(id: string, status: JobStatus, extras?: Partial<Job>): void {
    const job = jobs.get(id)
    if (!job) return
    jobs.set(id, {
      ...job,
      status,
      ...(extras || {}),
      ...(status === 'ready' || status === 'error' ? { completedAt: new Date() } : {}),
    })
    logger.info('Job status updated', { jobId: id, status })
  },

  delete(id: string): void {
    jobs.delete(id)
    logger.info('Job deleted from store', { jobId: id })
  },

  // Sweep expired jobs from memory
  sweepExpired(): void {
    const now = Date.now()
    for (const [id, job] of jobs.entries()) {
      if (now - job.createdAt.getTime() > JOB_TTL_MS) {
        jobs.delete(id)
        logger.info('Job expired and removed from store', { jobId: id })
      }
    }
  },
}

// Run sweep every 10 minutes
setInterval(() => jobManager.sweepExpired(), 10 * 60 * 1000)