/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          bg: '#050a14',
          'bg-secondary': '#0d1524',
          'bg-card': '#141b2e',
          border: '#1a2438',
        },
        accent: {
          success: '#10b981',
          warning: '#f59e0b',
          danger: '#ef4444',
        },
        text: {
          primary: '#ffffff',
          secondary: '#b0b0b0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontWeight: {
        normal: '600',
        bold: '700',
        extrabold: '800',
        black: '900',
      },
    },
  },
  plugins: [],
}

