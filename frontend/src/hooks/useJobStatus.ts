import { useEffect, useRef, useCallback } from 'react'
import axios from 'axios'
import { useAppStore } from '@/stores/appStore'
import { getApiUrl } from '@/utils'
import type { ApiResponse, StatusResponse } from '@/types'

const POLL_INTERVAL = 2500
const MAX_POLLS = 120 // 5 minutes max

export function useJobStatus() {
  const { jobResult, setJobResult, setScreen } = useAppStore()
  const pollCount = useRef(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const poll = useCallback(async (jobId: string) => {
    try {
      const { data } = await axios.get<ApiResponse<StatusResponse>>(
        getApiUrl(`/api/status/${jobId}`)
      )

      if (!data.success || !data.data) return

      const result = data.data

      if (result.status === 'ready') {
        setJobResult({
          jobId,
          status: 'ready',
          vocalsUrl: getApiUrl(result.vocalsUrl!),
          instrumentalUrl: getApiUrl(result.instrumentalUrl!),
          originalName: result.originalName,
        })
        setScreen('results')
        return
      }

      if (result.status === 'error') {
        setJobResult({
          jobId,
          status: 'error',
          errorMessage: result.errorMessage || 'Processing failed.',
        })
        setScreen('upload')
        return
      }

      // Still processing — schedule next poll
      pollCount.current += 1
      if (pollCount.current < MAX_POLLS) {
        timerRef.current = setTimeout(() => poll(jobId), POLL_INTERVAL)
      } else {
        setJobResult({
          jobId,
          status: 'error',
          errorMessage: 'Processing timed out. Please try again.',
        })
        setScreen('upload')
      }
    } catch {
      // Network hiccup — retry
      timerRef.current = setTimeout(() => poll(jobId), POLL_INTERVAL * 2)
    }
  }, [setJobResult, setScreen])

  useEffect(() => {
    if (jobResult?.status === 'processing' && jobResult.jobId) {
      pollCount.current = 0
      poll(jobResult.jobId)
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [jobResult?.jobId, jobResult?.status, poll])
}
