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
        surface: {
          DEFAULT: '#09090b',
          dim: '#18181b',
          bright: '#27272a',
          low: '#121216',
          high: '#3f3f46',
        },
        outline: {
          DEFAULT: '#27272a',
          variant: '#3f3f46',
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
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'purple-glow': '0 0 25px rgba(173, 92, 255, 0.35)',
        'orange-glow': '0 0 25px rgba(255, 153, 0, 0.35)',
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
