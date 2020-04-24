// const purgecss = [
//   require("@fullhuman/postcss-purgecss"),
//   {
//     content: ["./src/components/*.tsx", "./src/util/componentMap.tsx"],
//     defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
//   },
// ];

module.exports = {
  plugins: [
    require("postcss-import"),
    require("tailwindcss"),
    require("autoprefixer"),
  ],
};
