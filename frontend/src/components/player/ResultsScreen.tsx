import { useAppStore } from '@/stores/appStore'
import { AudioPlayer } from '@/components/player/AudioPlayer'

export function ResultsScreen() {
  const { jobResult, reset } = useAppStore()

  if (!jobResult || jobResult.status !== 'ready') return null

  const { vocalsUrl, instrumentalUrl, jobId, originalName } = jobResult

  const baseName = originalName
    ? originalName.replace(/\.[^.]+$/, '')
    : 'track'

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-status-success/15 border border-status-success/30 mb-6">
            <svg className="w-4 h-4 text-status-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-status-success text-sm font-medium">Separation complete</span>
          </div>

          <h1 className="font-display font-bold text-3xl sm:text-4xl text-text-primary mb-3">
            Your stems are ready
          </h1>
          <p className="text-text-secondary">
            Preview each track below, then download. Files are deleted after download.
          </p>
        </div>

        {/* Track players */}
        <div className="space-y-4">
          {/* Vocals */}
          {vocalsUrl && (
            <div>
              <p className="section-label mb-2 px-1">Vocals</p>
              <AudioPlayer
                src={vocalsUrl}
                label="Vocals"
                accentColor="#7C3AED"
                downloadUrl={vocalsUrl}
                downloadName={`${baseName}_vocals.mp3`}
              />
            </div>
          )}

          {/* Instrumental */}
          {instrumentalUrl && (
            <div>
              <p className="section-label mb-2 px-1">Instrumental</p>
              <AudioPlayer
                src={instrumentalUrl}
                label="Instrumental"
                accentColor="#06B6D4"
                downloadUrl={instrumentalUrl}
                downloadName={`${baseName}_instrumental.mp3`}
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={reset}
            className="btn-primary w-full sm:w-auto justify-center"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            Split another track
          </button>
        </div>

        <p className="text-center text-text-muted text-xs mt-6">
          Files are automatically deleted from our servers after download
        </p>
      </div>
    </div>
  )
}
