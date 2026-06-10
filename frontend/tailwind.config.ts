import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Deep space dark palette with electric violet accent
        surface: {
          base: '#080B14',
          raised: '#0D1221',
          overlay: '#131929',
          border: '#1E2A40',
        },
        accent: {
          violet: '#7C3AED',
          'violet-bright': '#8B5CF6',
          'violet-glow': '#A78BFA',
          cyan: '#06B6D4',
          'cyan-dim': '#0891B2',
        },
        text: {
          primary: '#F0F4FF',
          secondary: '#8B99B5',
          muted: '#4A5568',
        },
        status: {
          success: '#10B981',
          error: '#F43F5E',
          warning: '#F59E0B',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(124,58,237,0.25) 0%, transparent 70%)',
        'card-shine': 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 50%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'spin-slow': 'spin 3s linear infinite',
        'waveform': 'waveform 1.2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        waveform: {
          '0%, 100%': { transform: 'scaleY(0.4)' },
          '50%': { transform: 'scaleY(1)' },
        },
      },
      boxShadow: {
        'violet-glow': '0 0 30px rgba(124, 58, 237, 0.3)',
        'violet-sm': '0 0 15px rgba(124, 58, 237, 0.2)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 8px 40px rgba(0, 0, 0, 0.6)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}

export default config
