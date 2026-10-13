/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#e8f5ee",
          100: "#c9e8d6",
          600: "#0b6e4f",
          700: "#095c42",
          800: "#01411c",
          900: "#013015",
        },
      },
    },
  },
  plugins: [],
};
