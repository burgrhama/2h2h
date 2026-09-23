/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'game-dark': '#0f1419',
        'game-darker': '#0a0e13',
        'game-card': 'rgba(30, 41, 59, 0.4)',
        'game-purple': '#a855f7',
        'game-green': '#22c55e',
        'game-pink': '#ec4899',
        'game-blue': '#06b6d4',
      },
      fontFamily: {
        'display': ['Inter', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}
