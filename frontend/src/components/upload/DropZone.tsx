import { useCallback, useState } from 'react'
import { cn, validateAudioFile, formatFileSize } from '@/utils'
import { useUpload } from '@/hooks/useUpload'
import { useAppStore } from '@/stores/appStore'
import { ProgressBar } from '@/components/ui/ProgressBar'

export function DropZone() {
  const [dragging, setDragging] = useState(false)
  const { uploadFile } = useUpload()
  const { uploadState } = useAppStore()

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) uploadFile(file)
    },
    [uploadFile]
  )

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(true)
  }

  const handleDragLeave = () => setDragging(false)

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) uploadFile(file)
      // Reset input so same file can be re-selected
      e.target.value = ''
    },
    [uploadFile]
  )

  const { uploading, progress, error, file } = uploadState

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Drop area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !uploading && document.getElementById('dropzone-input')?.click()}
        className={cn(
          'relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-200 cursor-pointer',
          dragging
            ? 'border-accent-violet bg-accent-violet/10 shadow-violet-glow scale-[1.01]'
            : uploading
            ? 'border-surface-border bg-surface-raised cursor-not-allowed'
            : 'border-surface-border bg-surface-raised hover:border-accent-violet/50 hover:bg-surface-overlay'
        )}
        role="button"
        tabIndex={uploading ? -1 : 0}
        aria-label="Upload audio file"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !uploading) {
            document.getElementById('dropzone-input')?.click()
          }
        }}
      >
        {/* Upload icon */}
        <div className={cn(
          'mx-auto w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-colors',
          dragging ? 'bg-accent-violet/30' : 'bg-surface-overlay'
        )}>
          <svg
            className={cn('w-7 h-7 transition-colors', dragging ? 'text-accent-violet-bright' : 'text-text-secondary')}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
        </div>

        <p className="font-display font-semibold text-text-primary text-base mb-1">
          {dragging ? 'Drop it here' : 'Drop your audio file here'}
        </p>
        <p className="text-text-secondary text-sm">
          or{' '}
          <span className="text-accent-violet-glow font-medium">browse files</span>
        </p>
        <p className="text-text-muted text-xs mt-3">
          MP3 · WAV · FLAC · M4A &nbsp;·&nbsp; max 100 MB
        </p>

        <input
          id="dropzone-input"
          type="file"
          accept=".mp3,.wav,.flac,.m4a,audio/mpeg,audio/wav,audio/flac,audio/x-m4a,audio/mp4"
          className="sr-only"
          onChange={handleFileInput}
          disabled={uploading}
        />
      </div>

      {/* File selected + upload progress */}
      {file && uploading && (
        <div className="mt-4 card p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-accent-violet/15 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-accent-violet-glow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-text-primary text-sm font-medium truncate">{file.name}</p>
              <p className="text-text-muted text-xs">{formatFileSize(file.size)}</p>
            </div>
          </div>
          <ProgressBar value={progress} showLabel />
        </div>
      )}

      {/* Validation error */}
      {error && (
        <div className="mt-4 flex items-start gap-3 p-4 rounded-xl bg-status-error/10 border border-status-error/30">
          <svg className="w-5 h-5 text-status-error flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <p className="text-status-error text-sm">{error}</p>
        </div>
      )}
    </div>
  )
}
