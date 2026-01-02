/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        success: '#10b981',
        danger: '#ef4444',
        primary: '#1f2937'
      }
    },
  },
  plugins: [],
}
