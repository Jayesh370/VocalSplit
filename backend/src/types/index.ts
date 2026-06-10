export type JobStatus = 'pending' | 'processing' | 'ready' | 'error'

export interface Job {
  id: string
  status: JobStatus
  originalName: string
  uploadPath: string
  vocalsPath?: string
  instrumentalPath?: string
  errorMessage?: string
  createdAt: Date
  completedAt?: Date
}

export interface ApiResponse<T = undefined> {
  success: boolean
  data?: T
  error?: string
}

export interface UploadResponseData {
  jobId: string
  message: string
}

export interface StatusResponseData {
  jobId: string
  status: JobStatus
  progress?: number
  vocalsUrl?: string
  instrumentalUrl?: string
  originalName?: string
  errorMessage?: string
}

export interface PythonServiceResponse {
  success: boolean
  vocalsPath?: string
  instrumentalPath?: string
  error?: string
}
