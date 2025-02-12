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
        primary_light: "#f5f5f5",
        secondary_light: "#e8e8e8",
        tertiary_light: "#d6d6d6",
        background_light: "#ffffff",
        accent_light: "#8a2be2",
      },
      screens: {
        "2xs": "360px",
        xs: "480px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
