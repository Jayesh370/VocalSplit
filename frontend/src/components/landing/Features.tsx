const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.348 14.651a3.75 3.75 0 010-5.303m5.304-.001a3.75 3.75 0 010 5.304m-7.425 2.122a6.75 6.75 0 010-9.546m9.546 0a6.75 6.75 0 010 9.546M5.106 18.894c-3.808-3.808-3.808-9.98 0-13.789m13.788 0c3.808 3.808 3.808 9.981 0 13.79M12 12h.008v.007H12V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
    title: 'AI-Powered Separation',
    description: 'Uses Meta\'s Demucs deep learning model — the same technology used by professional audio engineers.',
    accent: '#7C3AED',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: 'Fast Processing',
    description: 'Optimized pipeline delivers results in minutes. No queues, no waiting rooms, no subscription required.',
    accent: '#06B6D4',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
      </svg>
    ),
    title: 'High Quality Output',
    description: 'Stems are exported at high bitrate MP3. Clean separation with minimal bleed between tracks.',
    accent: '#10B981',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18-3a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3m18 0V6m0 3H3" />
      </svg>
    ),
    title: 'Multiple Formats',
    description: 'Upload MP3, WAV, FLAC, or M4A files up to 100MB. We handle the conversion automatically.',
    accent: '#F59E0B',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15.75A3.75 3.75 0 108.25 12 3.75 3.75 0 0012 15.75zm0 0v1.5m0-10.5V3m0 14.25A8.25 8.25 0 1020.25 12H21" />
      </svg>
    ),
    title: 'In-Browser Preview',
    description: 'Play, pause, seek, and adjust volume for each separated track right in your browser — before downloading.',
    accent: '#EC4899',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: 'Privacy First',
    description: 'Your audio is processed and immediately deleted. We never store, share, or analyze your files.',
    accent: '#7C3AED',
  },
]

export function Features() {
  return (
    <section id="features" className="py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="section-label mb-3">Why VocalSplit AI</p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-text-primary">
            Everything you need to split a track
          </h2>
          <p className="text-text-secondary mt-4 text-lg max-w-xl mx-auto">
            Professional-grade vocal separation, available to anyone with a browser.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat) => (
            <div key={feat.title} className="card-hover p-6 group">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-300"
                style={{ background: `${feat.accent}20`, color: feat.accent }}
              >
                {feat.icon}
              </div>
              <h3 className="font-display font-semibold text-text-primary text-lg mb-2">
                {feat.title}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                {feat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
