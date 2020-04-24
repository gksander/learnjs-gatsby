const { colors } = require("tailwindcss/defaultTheme");

module.exports = {
  theme: {
    extend: {
      transitionProperty: {
        height: "height",
      },
      height: {
        halfscreen: "50vh",
      },
      colors: {
        primary: colors.purple,
      },
    },
  },
  variants: {
    transitionProperty: ["responsive"],
    margin: ["responsive", "last"],
  },
  plugins: [],
};
