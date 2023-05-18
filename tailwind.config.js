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
        'batmanGold':"#5c361c",
        'midnightPurple': '#280137',
      },
    },
  },
  plugins: [],
}

