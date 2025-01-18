/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        spotifyGreen: '#1DB954',
      },
      keyframes: {
        appear: {
          '0%': { opacity: 0 },
          '100%': {
            opacity: 1,
          },
        },
      },
      animation: {
        appear: 'appear 0.4s forwards ease-in',
      },
    },
  },
  plugins: [],
};
