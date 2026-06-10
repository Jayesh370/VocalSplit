import { cn } from '@/utils'

interface ProgressBarProps {
  value: number // 0-100
  className?: string
  showLabel?: boolean
}

export function ProgressBar({ value, className, showLabel }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value))

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between text-xs text-text-secondary mb-1">
          <span>Uploading…</span>
          <span>{clamped}%</span>
        </div>
      )}
      <div className="h-1.5 bg-surface-border rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-accent-violet to-accent-cyan rounded-full transition-all duration-300"
          style={{ width: `${clamped}%` }}
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  )
}
