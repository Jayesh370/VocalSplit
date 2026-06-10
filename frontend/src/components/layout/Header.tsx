import { useAppStore } from '@/stores/appStore'

export function Header() {
  const { screen, reset } = useAppStore()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-surface-border/50 backdrop-blur-md bg-surface-base/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <button
          onClick={reset}
          className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-violet rounded-lg"
          aria-label="Go to homepage"
        >
          {/* Logo mark */}
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 bg-accent-violet rounded-lg opacity-20 group-hover:opacity-30 transition-opacity" />
            <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8 relative">
              <rect width="32" height="32" rx="8" fill="url(#logoGrad)" />
              <path d="M8 20 L12 12 L16 24 L20 10 L24 20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <defs>
                <linearGradient id="logoGrad" x1="0" y1="0" x2="32" y2="32">
                  <stop offset="0%" stopColor="#7C3AED" />
                  <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="font-display font-bold text-lg text-text-primary">
            VocalSplit <span className="text-accent-violet-glow">AI</span>
          </span>
        </button>

        <nav className="hidden sm:flex items-center gap-1">
          {screen === 'landing' ? (
            <>
              <a href="#features" className="btn-ghost text-sm">Features</a>
              <a href="#how-it-works" className="btn-ghost text-sm">How it works</a>
              <a href="#faq" className="btn-ghost text-sm">FAQ</a>
            </>
          ) : (
            <button onClick={reset} className="btn-ghost text-sm">
              ← Back to home
            </button>
          )}
        </nav>
      </div>
    </header>
  )
}
