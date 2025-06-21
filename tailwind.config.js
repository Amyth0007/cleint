/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      screens: {
        xs: '450px', // New custom breakpoint
      }
    },
  },
  plugins: [],

}

