/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        'teal-accent': 'teal',
        'light-bg': '#FFFFFF',
        'dark-bg': '#1a202c', // A very dark gray
        'light-text': '#2d3748', // A dark gray
        'dark-text': '#f7fafc',  // A soft white
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        arabic: ['"Noto Naskh Arabic"', 'serif'],
      },
    },
  },
  plugins: [],
}