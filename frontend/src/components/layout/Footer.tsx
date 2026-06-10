export function Footer() {
  return (
    <footer className="border-t border-surface-border mt-24 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6">
              <rect width="32" height="32" rx="8" fill="url(#footerGrad)" />
              <path d="M8 20 L12 12 L16 24 L20 10 L24 20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <defs>
                <linearGradient id="footerGrad" x1="0" y1="0" x2="32" y2="32">
                  <stop offset="0%" stopColor="#7C3AED" />
                  <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
              </defs>
            </svg>
            <span className="font-display font-semibold text-text-primary">VocalSplit AI</span>
          </div>

          <p className="text-text-muted text-sm text-center">
            Powered by{' '}
            <a
              href="https://github.com/facebookresearch/demucs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary hover:text-accent-violet-glow transition-colors"
            >
              Demucs
            </a>
            {' '}· Files are automatically deleted after processing
          </p>

          <p className="text-text-muted text-xs">
            © {new Date().getFullYear()} VocalSplit AI
          </p>
        </div>
      </div>
    </footer>
  )
}
