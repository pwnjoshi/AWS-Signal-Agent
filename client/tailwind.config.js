/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#AD5CFF',
          container: '#9C47FF',
          dark: '#8C33FF',
        },
        secondary: {
          DEFAULT: '#ffc080',
          container: '#fe9800',
        },
        background: 'var(--bg-color)',
        'on-background': 'var(--text-color)',
        'on-surface-variant': 'var(--text-muted)',
        surface: {
          DEFAULT: 'var(--surface-color)',
          dim: 'var(--surface-dim-color)',
          bright: 'var(--surface-bright-color)',
          lowest: 'var(--surface-lowest)',
          low: 'var(--surface-low)',
          container: 'var(--surface-container)',
          high: 'var(--surface-high)',
          highest: 'var(--surface-highest)',
        },
        outline: {
          DEFAULT: 'var(--outline-color)',
          variant: 'var(--outline-variant-color)',
        },
        aws: {
          orange: '#FF9900',
          squid: '#232F3E',
          blue: '#2563EB',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['Plus Jakarta Sans', 'monospace'],
      },
      boxShadow: {
        'purple-glow': '0 0 25px rgba(173, 92, 255, 0.35)',
        'orange-glow': '0 0 25px rgba(255, 153, 0, 0.35)',
        'card-light': '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
}
