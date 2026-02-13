/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#6C5CE7',
        secondary: '#00D2D3',
        background: '#0F0F1A',
        surface: '#1A1A2E',
        'surface-elevated': '#252540',
        'text-primary': '#E8E8F0',
        'text-muted': '#6B6B80',
        accent: '#FF6B6B',
        work: '#6C5CE7',
        break: '#00D2D3',
        'long-break': '#F9CA24',
        streak: '#FF9F43',
        success: '#2ED573',
        border: '#2A2A45',
        'light-bg': '#F5F5FA',
        'light-surface': '#FFFFFF',
        'light-text': '#1A1A2E',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'timer': ['72px', { lineHeight: '80px', fontWeight: '700' }],
        'stat': ['32px', { lineHeight: '40px', fontWeight: '700' }],
      },
      maxWidth: {
        app: '480px',
      },
      keyframes: {
        'flame-pulse': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.1)' },
        },
      },
      animation: {
        'flame': 'flame-pulse 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};