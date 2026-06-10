import { create } from 'zustand'
import type { AppScreen, JobResult, UploadState } from '@/types'

interface AppStore {
  screen: AppScreen
  uploadState: UploadState
  jobResult: JobResult | null

  setScreen: (screen: AppScreen) => void
  setUploadState: (state: Partial<UploadState>) => void
  setJobResult: (result: JobResult | null) => void
  reset: () => void
}

const initialUploadState: UploadState = {
  file: null,
  uploading: false,
  progress: 0,
  error: null,
}

export const useAppStore = create<AppStore>((set) => ({
  screen: 'landing',
  uploadState: initialUploadState,
  jobResult: null,

  setScreen: (screen) => set({ screen }),

  setUploadState: (partial) =>
    set((state) => ({
      uploadState: { ...state.uploadState, ...partial },
    })),

  setJobResult: (jobResult) => set({ jobResult }),

  reset: () =>
    set({
      screen: 'landing',
      uploadState: initialUploadState,
      jobResult: null,
    }),
}))
