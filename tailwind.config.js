/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        'teal-accent': 'teal',
        'light-text': '#2d3748', // A dark gray
        'dark-text': '#f7fafc',  // A soft white
      },
      backgroundImage: {
        'gradient-light': 'linear-gradient(120deg, #f3e8ff 0%, #e0f2fe 100%)',
        'gradient-dark': 'linear-gradient(120deg, #38235d 0%, #111827 100%)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        arabic: ['var(--arabic-font-family, "Noto Naskh Arabic")', 'serif'],
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slideInRightAnim': {
          '0%': { transform: 'translateX(50px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slideOutLeftAnim': {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(-50px)', opacity: '0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-in-right': 'slideInRightAnim 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'slide-out-left': 'slideOutLeftAnim 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards',
      },
    },
  },
  plugins: [],
}