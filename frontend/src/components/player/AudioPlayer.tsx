import { useAudioPlayer } from '@/hooks/useAudioPlayer'
import { formatDuration, cn } from '@/utils'
import { WaveformBars } from '@/components/ui/WaveformBars'

interface AudioPlayerProps {
  src: string
  label: string
  accentColor: string
  downloadUrl: string
  downloadName: string
}

export function AudioPlayer({ src, label, accentColor, downloadUrl, downloadName }: AudioPlayerProps) {
  const { state, togglePlay, seek, setVolume, toggleMute } = useAudioPlayer(src)
  const { isPlaying, currentTime, duration, volume, muted } = state

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div
      className="card p-5 sm:p-6 transition-all duration-300"
      style={{ '--accent': accentColor } as React.CSSProperties}
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          {/* Animated icon when playing */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${accentColor}20` }}
          >
            {isPlaying ? (
              <WaveformBars color={accentColor} />
            ) : (
              <svg className="w-5 h-5" style={{ color: accentColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
              </svg>
            )}
          </div>
          <div>
            <p className="font-display font-semibold text-text-primary">{label}</p>
            <p className="text-text-muted text-xs">
              {formatDuration(currentTime)} / {formatDuration(duration)}
            </p>
          </div>
        </div>

        {/* Download button */}
        <a
          href={downloadUrl}
          download={downloadName}
          className="btn-secondary text-sm py-2 px-4"
          aria-label={`Download ${label}`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Download
        </a>
      </div>

      {/* Seek bar */}
      <div className="mb-4">
        <input
          type="range"
          min={0}
          max={duration || 100}
          value={currentTime}
          step={0.1}
          onChange={(e) => seek(Number(e.target.value))}
          className="w-full"
          aria-label="Seek"
          style={{
            background: `linear-gradient(to right, ${accentColor} ${progress}%, #1E2A40 ${progress}%)`,
          }}
        />
      </div>

      {/* Controls row */}
      <div className="flex items-center gap-3">
        {/* Play / Pause */}
        <button
          onClick={togglePlay}
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white transition-all duration-200 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-raised"
          style={{ background: accentColor, boxShadow: `0 0 16px ${accentColor}50` }}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5.14v14l11-7-11-7z" />
            </svg>
          )}
        </button>

        {/* Volume area */}
        <div className="flex items-center gap-2 flex-1">
          <button
            onClick={toggleMute}
            className="text-text-secondary hover:text-text-primary transition-colors focus-visible:outline-none flex-shrink-0"
            aria-label={muted ? 'Unmute' : 'Mute'}
          >
            {muted || volume === 0 ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            ) : volume < 0.5 ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M12 6a7.975 7.975 0 015.657 2.343m0 0a8 8 0 010 11.314M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            )}
          </button>

          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={muted ? 0 : volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-20 sm:w-28"
            aria-label="Volume"
          />
        </div>
      </div>
    </div>
  )
}
