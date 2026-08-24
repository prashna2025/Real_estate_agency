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
          DEFAULT: '#F7F9FA',
          dark: '#EDF2F4',
        },
        charcoal: {
          DEFAULT: '#172A36',
          light: '#294451',
          muted: '#637681',
        },
        terracotta: {
          DEFAULT: '#147D83',
          hover: '#0F6267',
        },
        stone: {
          DEFAULT: '#DCE5E8',
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