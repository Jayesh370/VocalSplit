import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { ACCEPTED_TYPES, MAX_FILE_SIZE } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDuration(seconds: number): string {
  if (isNaN(seconds) || !isFinite(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function validateAudioFile(file: File): string | null {
  const acceptedMimes = Object.keys(ACCEPTED_TYPES)
  const acceptedExts = ['.mp3', '.wav', '.flac', '.m4a']

  const ext = '.' + file.name.split('.').pop()?.toLowerCase()
  const mimeOk = acceptedMimes.includes(file.type)
  const extOk = acceptedExts.includes(ext)

  if (!mimeOk && !extOk) {
    return `Unsupported file type. Please upload MP3, WAV, FLAC, or M4A.`
  }

  if (file.size > MAX_FILE_SIZE) {
    return `File too large. Maximum size is 100MB (your file is ${formatFileSize(file.size)}).`
  }

  return null
}

export function getApiUrl(path: string): string {
  const base = import.meta.env.VITE_API_URL || ''
  return `${base}${path}`
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
