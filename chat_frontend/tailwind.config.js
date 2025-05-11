/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        // ".scrollbar-thin": {
        //   scrollbarWidth: "thin",
        //   scrollbarColor: "rgb(31 29 29) white"
        // },
        ".scrollbar-webkit": {
          "&::-webkit-scrollbar": {
            width: "1px",
          },
          "&::-webkit-scrollbar-track": {
            background: "rgb(9 9 11)",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgb(9 9 11)", // Custom color
            borderRadius: "20px",
            // border: "1px solid white",
          },
        },
      };
      addUtilities(newUtilities, ["responsive", "hover"]);
    },
  ],
};
