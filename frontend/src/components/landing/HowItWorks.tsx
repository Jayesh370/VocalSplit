const steps = [
  {
    number: '01',
    title: 'Upload your audio',
    description: 'Drag and drop or browse to select an MP3, WAV, FLAC, or M4A file up to 100MB.',
  },
  {
    number: '02',
    title: 'AI processes the track',
    description: 'Demucs analyzes the audio and separates vocals from all other instruments using deep learning.',
  },
  {
    number: '03',
    title: 'Preview and download',
    description: 'Listen to each stem in the browser, then download the vocals and instrumental as separate files.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-4 sm:px-6 border-t border-surface-border">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="section-label mb-3">Simple process</p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-text-primary">
            Three steps to separated stems
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-8 left-1/3 right-1/3 h-px bg-gradient-to-r from-accent-violet/50 via-accent-cyan/50 to-accent-violet/50" />

          {steps.map((step, i) => (
            <div key={step.number} className="relative flex flex-col items-center text-center">
              {/* Step number bubble */}
              <div className="relative mb-6">
                <div className="w-16 h-16 rounded-2xl bg-surface-raised border border-surface-border flex items-center justify-center relative z-10">
                  <span className="font-mono font-bold text-xl text-accent-violet-glow">
                    {step.number}
                  </span>
                </div>
                {/* Glow */}
                <div className="absolute inset-0 bg-accent-violet/10 rounded-2xl blur-md" />
              </div>

              <h3 className="font-display font-semibold text-text-primary text-lg mb-3">
                {step.title}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed max-w-xs">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
