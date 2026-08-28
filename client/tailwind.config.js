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
          DEFAULT: 'rgb(var(--color-primary-rgb) / <alpha-value>)',
          container: 'rgb(var(--color-primary-container-rgb) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'rgb(var(--color-secondary-rgb) / <alpha-value>)',
          container: 'rgb(var(--color-secondary-container-rgb) / <alpha-value>)',
        },
        background: 'rgb(var(--bg-color-rgb) / <alpha-value>)',
        'on-background': 'rgb(var(--text-color-rgb) / <alpha-value>)',
        'on-surface-variant': 'rgb(var(--text-muted-rgb) / <alpha-value>)',
        surface: {
          DEFAULT: 'rgb(var(--surface-color-rgb) / <alpha-value>)',
          dim: 'rgb(var(--surface-dim-rgb) / <alpha-value>)',
          bright: 'rgb(var(--surface-bright-rgb) / <alpha-value>)',
          lowest: 'rgb(var(--surface-lowest-rgb) / <alpha-value>)',
          low: 'rgb(var(--surface-low-rgb) / <alpha-value>)',
          container: 'rgb(var(--surface-container-rgb) / <alpha-value>)',
          high: 'rgb(var(--surface-high-rgb) / <alpha-value>)',
          highest: 'rgb(var(--surface-highest-rgb) / <alpha-value>)',
        },
        outline: {
          DEFAULT: 'rgb(var(--outline-color-rgb) / <alpha-value>)',
          variant: 'rgb(var(--outline-variant-rgb) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['Plus Jakarta Sans', 'monospace'],
      },
      boxShadow: {
        'purple-glow': '0 0 20px rgba(173, 92, 255, 0.3)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
      }
    },
  },
  plugins: [],
}
