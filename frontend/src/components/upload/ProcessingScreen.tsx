import { useJobStatus } from '@/hooks/useJobStatus'
import { useAppStore } from '@/stores/appStore'
import { WaveformBars } from '@/components/ui/WaveformBars'

const messages = [
  'Analyzing audio structure…',
  'Running Demucs neural network…',
  'Separating vocal frequencies…',
  'Extracting instrumental stems…',
  'Finalizing audio tracks…',
  'Almost there…',
]

export function ProcessingScreen() {
  // This hook polls and transitions to results when ready
  useJobStatus()

  const { jobResult } = useAppStore()

  // Cycle through messages based on elapsed time
  const msgIndex = Math.floor(Date.now() / 8000) % messages.length

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-24">
      <div className="max-w-md w-full text-center">
        {/* Animated rings */}
        <div className="relative mx-auto w-32 h-32 mb-10">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-2 border-accent-violet/20 animate-ping" />
          {/* Middle ring */}
          <div className="absolute inset-3 rounded-full border-2 border-accent-violet/30 animate-pulse" />
          {/* Inner circle */}
          <div className="absolute inset-6 rounded-full bg-accent-violet/10 border border-accent-violet/50 flex items-center justify-center">
            <WaveformBars />
          </div>
          {/* Spinning arc */}
          <svg
            className="absolute inset-0 w-full h-full animate-spin-slow"
            viewBox="0 0 128 128"
            fill="none"
          >
            <circle
              cx="64" cy="64" r="60"
              stroke="url(#spinGrad)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="100 280"
            />
            <defs>
              <linearGradient id="spinGrad" x1="0" y1="0" x2="128" y2="128">
                <stop offset="0%" stopColor="#7C3AED" />
                <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <h2 className="font-display font-bold text-2xl text-text-primary mb-3">
          Processing your audio
        </h2>

        <p className="text-text-secondary text-sm mb-8 min-h-[1.25rem] transition-all">
          {messages[msgIndex]}
        </p>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {['Upload', 'Analyze', 'Separate', 'Ready'].map((label, i) => {
            const isDone = i < 2
            const isActive = i === 2
            return (
              <div key={label} className="flex items-center gap-3">
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-2 h-2 rounded-full transition-colors ${
                    isDone ? 'bg-status-success' :
                    isActive ? 'bg-accent-violet animate-pulse' :
                    'bg-surface-border'
                  }`} />
                  <span className={`text-xs font-mono ${
                    isDone ? 'text-status-success' :
                    isActive ? 'text-accent-violet-glow' :
                    'text-text-muted'
                  }`}>{label}</span>
                </div>
                {i < 3 && <div className="w-6 h-px bg-surface-border mb-4" />}
              </div>
            )
          })}
        </div>

        {/* File name */}
        {jobResult?.jobId && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-raised border border-surface-border">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-violet animate-pulse" />
            <span className="text-text-muted text-xs font-mono">
              Job {jobResult.jobId.slice(0, 8)}…
            </span>
          </div>
        )}

        <p className="text-text-muted text-xs mt-6">
          This usually takes 1–4 minutes · Don't close this tab
        </p>
      </div>
    </div>
  )
}
