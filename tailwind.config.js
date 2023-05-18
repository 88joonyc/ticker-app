/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        'white': '#ffffff',
        "black":"#000000",
        "lightGray":"#fcfcfc",
        'midnightPurple': '#280137',
        'batmanGold':"#5c361c"
      },
    },
  },
  plugins: [],
}

