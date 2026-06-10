import { useCallback } from 'react'
import axios from 'axios'
import { useAppStore } from '@/stores/appStore'
import { validateAudioFile, getApiUrl } from '@/utils'
import type { ApiResponse, UploadResponse } from '@/types'

export function useUpload() {
  const { setScreen, setUploadState, setJobResult } = useAppStore()

  const uploadFile = useCallback(async (file: File) => {
    const validationError = validateAudioFile(file)
    if (validationError) {
      setUploadState({ error: validationError })
      return
    }

    setUploadState({ file, uploading: true, progress: 0, error: null })
    setScreen('upload')

    const formData = new FormData()
    formData.append('audio', file)

    try {
      const { data } = await axios.post<ApiResponse<UploadResponse>>(
        getApiUrl('/api/upload'),
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (evt) => {
            if (evt.total) {
              const percent = Math.round((evt.loaded / evt.total) * 100)
              setUploadState({ progress: percent })
            }
          },
        }
      )

      if (!data.success || !data.data) {
        throw new Error(data.error || 'Upload failed')
      }

      const { jobId } = data.data
      setJobResult({ jobId, status: 'processing' })
      setUploadState({ uploading: false, progress: 100 })
      setScreen('processing')
    } catch (err) {
      const message =
        axios.isAxiosError(err)
          ? err.response?.data?.error || err.message
          : 'Upload failed. Please try again.'
      setUploadState({ uploading: false, error: message })
    }
  }, [setScreen, setUploadState, setJobResult])

  return { uploadFile }
}
