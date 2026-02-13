/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#6C5CE7',
        secondary: '#00D2D3',
        background: '#0F0F1A',
        surface: '#1A1A2E',
        surfaceElevated: '#252540',
        text: '#E8E8F0',
        textMuted: '#6B6B80',
        accent: '#FF6B6B',
        work: '#6C5CE7',
        break: '#00D2D3',
        longBreak: '#F9CA24',
        streak: '#FF9F43',
        success: '#2ED573',
        border: '#2A2A45',
        lightBackground: '#F5F5FA',
        lightSurface: '#FFFFFF',
        lightText: '#1A1A2E',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        flame: 'flame 1.5s ease-in-out infinite',
      },
      keyframes: {
        flame: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.1)' },
        },
      },
    },
  },
  plugins: [],
};
