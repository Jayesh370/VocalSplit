import axios from 'axios'
import FormData from 'form-data'
import fs from 'fs'
import path from 'path'
import { logger } from '../utils/logger'

const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000'

export interface SeparationResult {
  vocalsPath: string
  instrumentalPath: string
}

/**
 * Send the uploaded audio file to the Python Demucs service
 * and receive paths to the generated stems.
 */
export async function separateAudio(
  uploadPath: string,
  jobId: string
): Promise<SeparationResult> {
  const form = new FormData()
  form.append('audio', fs.createReadStream(uploadPath), {
    filename: path.basename(uploadPath),
  })
  form.append('job_id', jobId)

  logger.info('Sending audio to Python service', {
    jobId,
    url: `${PYTHON_SERVICE_URL}/separate`,
  })

  const response = await axios.post<{
    success: boolean
    vocals_path: string
    instrumental_path: string
    error?: string
  }>(`${PYTHON_SERVICE_URL}/separate`, form, {
    headers: form.getHeaders(),
    // Allow up to 10 minutes for long tracks
    timeout: 10 * 60 * 1000,
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  })

  if (!response.data.success) {
    throw new Error(response.data.error || 'Python service returned failure')
  }

  logger.info('Python service completed separation', { jobId })

  return {
    vocalsPath: response.data.vocals_path,
    instrumentalPath: response.data.instrumental_path,
  }
}

/**
 * Check that the Python service is reachable.
 */
export async function checkPythonHealth(): Promise<boolean> {
  try {
    const res = await axios.get(`${PYTHON_SERVICE_URL}/health`, { timeout: 5000 })
    return res.status === 200
  } catch {
    return false
  }
}