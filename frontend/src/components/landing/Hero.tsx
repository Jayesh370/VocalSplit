import { useCallback } from 'react'
import { useAppStore } from '@/stores/appStore'
import { useUpload } from '@/hooks/useUpload'
import { validateAudioFile } from '@/utils'
import { WaveformBars } from '@/components/ui/WaveformBars'

export function Hero() {
  const { setScreen } = useAppStore()
  const { uploadFile } = useUpload()

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      const file = e.dataTransfer.files[0]
      if (file) uploadFile(file)
    },
    [uploadFile]
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) uploadFile(file)
    },
    [uploadFile]
  )

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 pt-24 pb-16 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-hero-glow pointer-events-none" />

      {/* Decorative grid lines */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(#A78BFA 1px, transparent 1px), linear-gradient(90deg, #A78BFA 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent-violet/30 bg-accent-violet/10 mb-8">
          <WaveformBars />
          <span className="section-label">AI Vocal Separation</span>
        </div>

        {/* Headline */}
        <h1 className="font-display font-bold text-5xl sm:text-6xl md:text-7xl leading-[1.05] text-balance mb-6">
          Split any song into{' '}
          <span className="gradient-text">vocals</span>
          {' '}and{' '}
          <span className="gradient-text">instruments</span>
        </h1>

        <p className="text-text-secondary text-lg sm:text-xl max-w-2xl mx-auto mb-12 text-balance leading-relaxed">
          Upload an audio file. Our AI isolates the vocal track and the instrumental — separately, instantly, for free.
        </p>

        {/* CTA Drop Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="relative mx-auto max-w-lg group cursor-pointer"
          onClick={() => document.getElementById('hero-file-input')?.click()}
          role="button"
          tabIndex={0}
          aria-label="Upload audio file"
          onKeyDown={(e) => e.key === 'Enter' && document.getElementById('hero-file-input')?.click()}
        >
          <div className="border-2 border-dashed border-surface-border group-hover:border-accent-violet/60 rounded-2xl p-10 transition-all duration-300 bg-surface-raised/50 group-hover:bg-surface-raised group-hover:shadow-violet-sm">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-accent-violet/15 flex items-center justify-center group-hover:bg-accent-violet/25 transition-colors">
                <svg className="w-8 h-8 text-accent-violet-glow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              </div>
              <div>
                <p className="font-display font-semibold text-text-primary text-lg">
                  Drop your audio file here
                </p>
                <p className="text-text-secondary text-sm mt-1">
                  or <span className="text-accent-violet-glow">browse files</span> · MP3, WAV, FLAC, M4A · max 100MB
                </p>
              </div>
            </div>
          </div>

          <input
            id="hero-file-input"
            type="file"
            accept=".mp3,.wav,.flac,.m4a,audio/mpeg,audio/wav,audio/flac,audio/x-m4a,audio/mp4"
            className="sr-only"
            onChange={handleFileInput}
          />
        </div>

        {/* Trust note */}
        <p className="mt-6 text-text-muted text-sm">
          No account needed · Files deleted immediately after processing
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-muted animate-bounce">
        <span className="text-xs font-mono tracking-widest uppercase">Scroll</span>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  )
}
