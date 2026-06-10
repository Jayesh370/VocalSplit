import { useState } from 'react'
import { cn } from '@/utils'

const faqs = [
  {
    q: 'What audio formats are supported?',
    a: 'VocalSplit AI supports MP3, WAV, FLAC, and M4A files up to 100MB. Most common audio formats work out of the box.',
  },
  {
    q: 'How long does processing take?',
    a: 'Processing typically takes 1–4 minutes depending on the length of the track and server load. A 3-minute song usually processes in about 90 seconds.',
  },
  {
    q: 'Are my files stored anywhere?',
    a: 'No. Your audio file is processed entirely in-memory and on temporary disk storage. Both the original upload and the separated stems are deleted immediately after you download them, or automatically after a short timeout.',
  },
  {
    q: 'What AI model is used for separation?',
    a: 'We use Demucs (htdemucs model) by Meta AI Research — one of the highest-quality open-source music source separation models available.',
  },
  {
    q: 'What quality are the output files?',
    a: 'The separated tracks are exported as high-quality MP3 files (320kbps). The quality of separation depends on the input audio, but results are generally very clean for modern music.',
  },
  {
    q: 'Does it work on all genres?',
    a: 'Demucs works well across most genres — pop, rock, hip-hop, R&B, and electronic music typically yield the best results. Heavily layered orchestral music or tracks with lots of reverb may have some bleed between stems.',
  },
  {
    q: 'Is there a cost or account required?',
    a: 'No account, no subscription, no cost. Just upload, process, and download.',
  },
]

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-surface-border last:border-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-5 text-left gap-4 group focus-visible:outline-none"
      >
        <span className="font-display font-medium text-text-primary group-hover:text-accent-violet-glow transition-colors">
          {q}
        </span>
        <svg
          className={cn(
            'w-5 h-5 text-text-secondary flex-shrink-0 transition-transform duration-300',
            open && 'rotate-180'
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div
        className={cn(
          'overflow-hidden transition-all duration-300',
          open ? 'max-h-64 pb-5' : 'max-h-0'
        )}
      >
        <p className="text-text-secondary text-sm leading-relaxed">{a}</p>
      </div>
    </div>
  )
}

export function FAQ() {
  return (
    <section id="faq" className="py-24 px-4 sm:px-6 border-t border-surface-border">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <p className="section-label mb-3">Common questions</p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-text-primary">
            Frequently asked
          </h2>
        </div>

        <div className="card p-2 sm:p-4">
          {faqs.map((item) => (
            <FaqItem key={item.q} {...item} />
          ))}
        </div>
      </div>
    </section>
  )
}
