/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        aws: {
          orange: '#FF9900',
          squid: '#232F3E',
          blue: '#2563EB',
          lightBlue: '#F0F7FF',
          accentRed: '#EF4444',
          bgSoft: '#F8FAFC',
          card: '#FFFFFF',
          border: '#E2E8F0',
        },
        dori: {
          blue: '#2563EB',
          lightBlue: '#60A5FA',
          belly: '#F8FAFC',
          accent: '#EF4444',
          gold: '#F59E0B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        rounded: ['Quicksand', 'Inter', 'sans-serif'],
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
