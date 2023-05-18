/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx}"
  ],
  safelist: [
    {
      pattern: /bg-./
    }
  ],
  theme: {
    extend: {
      colors: {
        'lightGray':'#fcfcfc',
        'batmanGold':'#5c361c',
        'white': '#ffffff',
        'midnightPurple': '#280137',
        'black':'#000000',
      },
    },
  },
  plugins: [],
}

