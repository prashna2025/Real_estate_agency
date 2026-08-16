/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#FAF8F5',
          dark: '#F0EBE1',
        },
        charcoal: {
          DEFAULT: '#1E1E1E',
          light: '#3A3834',
          muted: '#6E685F',
        },
        terracotta: {
          DEFAULT: '#8C4A32',
          hover: '#733B26',
        },
        stone: {
          DEFAULT: '#E8E5DF', // For subtle borders
        }
      },
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
      },
      transitionTimingFunction: {
        'slow-ease': 'cubic-bezier(0.16, 1, 0.3, 1)',
      }
    },
  },
  plugins: [],
}