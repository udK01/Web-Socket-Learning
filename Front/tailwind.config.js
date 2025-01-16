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
      colors: {
        primary: "#232428",
        secondary: "#26292D",
        tertiary: "#111214",
        background: "#313338",
        accent: "#5b209a",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
