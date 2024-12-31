/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // You can extend the default theme here
      colors: {
        'uno-red': '#ff0000',
        'uno-blue': '#0000ff',
        'uno-green': '#00ff00',
        'uno-yellow': '#ffff00',
      }
    },
  },
  plugins: [],
}