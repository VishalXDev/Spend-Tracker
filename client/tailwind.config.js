/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',  // Add this if you have components or utilities in src
  ],
  theme: {
    extend: {
      // You can add custom colors, fonts, or spacing here
    },
  },
  plugins: [],
}
