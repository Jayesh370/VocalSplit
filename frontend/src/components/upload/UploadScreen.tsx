import { useAppStore } from '@/stores/appStore'
import { DropZone } from '@/components/upload/DropZone'

export function UploadScreen() {
  const { uploadState } = useAppStore()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-24">
      <div className="max-w-xl w-full text-center">
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-text-primary mb-3">
          Upload your audio file
        </h1>
        <p className="text-text-secondary mb-10">
          MP3, WAV, FLAC, or M4A · Max 100 MB
        </p>

        <DropZone />

        {uploadState.error && (
          <button
            className="mt-6 btn-ghost text-sm text-text-secondary"
            onClick={() => window.location.reload()}
          >
            Try again
          </button>
        )}
      </div>
    </div>
  )
}
