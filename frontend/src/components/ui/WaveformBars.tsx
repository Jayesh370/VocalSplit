import { cn } from '@/utils'

interface WaveformBarsProps {
  className?: string
  color?: string
}

export function WaveformBars({ className, color }: WaveformBarsProps) {
  return (
    <div
      className={cn('flex items-center gap-[3px]', className)}
      aria-hidden="true"
      style={color ? ({ '--wf-color': color } as React.CSSProperties) : undefined}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className="waveform-bar" style={{ background: color }} />
      ))}
    </div>
  )
}
