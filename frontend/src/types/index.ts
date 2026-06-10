export type AppScreen = 'landing' | 'upload' | 'processing' | 'results'

export type JobStatus = 'pending' | 'processing' | 'ready' | 'error'

export interface JobResult {
  jobId: string
  status: JobStatus
  vocalsUrl?: string
  instrumentalUrl?: string
  originalName?: string
  errorMessage?: string
  progress?: number
}

export interface UploadState {
  file: File | null
  uploading: boolean
  progress: number
  error: string | null
}

export interface AudioPlayerState {
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  muted: boolean
}

export type TrackType = 'original' | 'vocals' | 'instrumental'

export interface Track {
  type: TrackType
  label: string
  url: string
  color: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface UploadResponse {
  jobId: string
  message: string
}

export interface StatusResponse {
  jobId: string
  status: JobStatus
  progress?: number
  vocalsUrl?: string
  instrumentalUrl?: string
  originalName?: string
  errorMessage?: string
}

export const ACCEPTED_TYPES = {
  'audio/mpeg': ['.mp3'],
  'audio/wav': ['.wav'],
  'audio/flac': ['.flac'],
  'audio/x-m4a': ['.m4a'],
  'audio/mp4': ['.m4a'],
} as const

export const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB
