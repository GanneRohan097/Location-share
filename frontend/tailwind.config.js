/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        gradient: {
          "0%": {
            backgroundPosition: "0% 100%",
          },
          "50%": {
            backgroundPosition: "100% 0%",
          },
          "100%": {
            backgroundPosition: "0% 100%",
          },
        },
      },
      animation: {
        gradient: "gradient 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};