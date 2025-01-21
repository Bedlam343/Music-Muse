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
        blinkBorder: {
          '0%': { borderColor: 'transparent' },
          '50%': { borderColor: '#1DB954' },
          '100%': { borderColor: 'transparent' },
        },
      },
      animation: {
        appear: 'appear 0.4s forwards ease-in',
        'blink-border': 'blinkBorder 1.5s 5',
      },
    },
  },
  plugins: [],
};
