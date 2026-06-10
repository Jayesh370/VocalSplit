import fs from 'fs'
import path from 'path'
import { logger } from '../utils/logger'

/**
 * Safely delete a file, ignoring missing file errors.
 */
export function deleteFile(filePath: string): void {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
      logger.info('File deleted', { path: filePath })
    }
  } catch (err) {
    logger.warn('Failed to delete file', { path: filePath, err })
  }
}

/**
 * Delete all files associated with a job after a delay.
 * Delay allows the download response to complete first.
 */
export function scheduleJobCleanup(
  uploadPath: string,
  vocalsPath?: string,
  instrumentalPath?: string,
  delayMs = 600000
): void {
  setTimeout(() => {
    deleteFile(uploadPath)
    if (vocalsPath) deleteFile(vocalsPath)
    if (instrumentalPath) deleteFile(instrumentalPath)
  }, delayMs)
}

/**
 * Ensure the uploads/temp directory exists.
 */
export function ensureUploadDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
    logger.info('Created upload directory', { dir })
  }
}