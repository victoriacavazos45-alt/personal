/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1B3A5C',
          deep: '#122A45',
          night: '#0C1F36',
          soft: '#2E4E72',
          mist: '#5C7494',
        },
        cream: {
          DEFAULT: '#F5F0E8',
          light: '#FAF7F1',
          dark: '#EDE5D8',
        },
        beige: {
          DEFAULT: '#E5DCCB',
          dark: '#D5C9B2',
        },
        gold: {
          DEFAULT: '#7F6A3E',
          soft: '#9A8556',
        },
        ink: '#22303E',
        correct: {
          bg: '#EBF2E9',
          border: '#5F7E5A',
          text: '#3D5439',
        },
        wrong: {
          bg: '#F6E9E6',
          border: '#A05E50',
          text: '#71402F',
        },
      },
      fontFamily: {
        serif: ['"Source Serif 4"', 'Georgia', '"Times New Roman"', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
      },
      keyframes: {
        pop: {
          '0%': { transform: 'scale(0.6)', opacity: '0' },
          '60%': { transform: 'scale(1.12)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeUp: {
          '0%': { transform: 'translateY(14px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
        burst: {
          '0%': { transform: 'translate(0, 0) scale(1)', opacity: '1' },
          '100%': { transform: 'translate(var(--tx), var(--ty)) scale(0)', opacity: '0' },
        },
        pulseGold: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.15)' },
        },
      },
      animation: {
        pop: 'pop 0.35s cubic-bezier(0.22, 1, 0.36, 1) both',
        fadeUp: 'fadeUp 0.4s ease both',
        shake: 'shake 0.3s ease both',
        burst: 'burst 0.7s ease-out both',
        pulseGold: 'pulseGold 0.8s ease-in-out',
      },
    },
  },
  plugins: [],
}
