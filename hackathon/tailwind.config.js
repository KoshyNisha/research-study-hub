/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'umich-blue': '#00274C',
        'umich-maize': '#FFCB05',
      },
    },
  },
  plugins: [],
}
