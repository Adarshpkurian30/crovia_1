/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'crovia-green': {
          50: '#E8F5E9',
          100: '#C8E6C9',
          200: '#A5D6A7',
          300: '#81C784',
          400: '#66BB6A',
          500: '#4CAF50',
          600: '#43A047',
          700: '#388E3C',
          800: '#2E7D32',
          900: '#1B5E20',
        },
        'crovia-brown': {
          50: '#EFEBE9',
          100: '#D7CCC8',
          200: '#BCAAA4',
          300: '#A1887F',
          400: '#8D6E63',
          500: '#795548',
          600: '#6D4C41',
          700: '#5D4037',
          800: '#4E342E',
          900: '#3E2723',
        },
        'crovia-cream': {
          50: '#FFFDF7',
          100: '#FFF9E6',
          200: '#FFF3CC',
          300: '#FFEDB3',
          400: '#FFE799',
          500: '#FFE180',
        },
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-recording': 'pulse-recording 1.5s ease-in-out infinite',
        'bounce-slow': 'bounce 2s infinite',
        'wave': 'wave 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        'pulse-recording': {
          '0%, 100%': {
            transform: 'scale(1)',
            boxShadow: '0 0 0 0 rgba(46, 125, 50, 0.7)'
          },
          '50%': {
            transform: 'scale(1.05)',
            boxShadow: '0 0 0 20px rgba(46, 125, 50, 0)'
          },
        },
        'wave': {
          '0%, 100%': {
            transform: 'translateY(0)'
          },
          '50%': {
            transform: 'translateY(-10px)'
          },
        },
        'float': {
          '0%, 100%': {
            transform: 'translateY(0) rotate(0deg)'
          },
          '50%': {
            transform: 'translateY(-20px) rotate(5deg)'
          },
        },
      },
    },
  },
  plugins: [],
}

