/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#171717",
        secondary: "#272727",
        "light-subtle": "250, 250, 250, 0.5",
        "dark-subtle": "39, 39, 39, 0.5",
      },
    },
  },
  plugins: [],
};
