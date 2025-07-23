// admin/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // This line is crucial for React/Vite projects
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}