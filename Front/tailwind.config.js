/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        garamond: ['"EB Garamond"', "serif"],
        roboto: ["Roboto", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
