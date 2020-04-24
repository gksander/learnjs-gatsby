const path = require("path");

module.exports = {
  siteMetadata: {
    title: `LearnJS`,
    description: `Learn programming, with a great friend - JavaScript!`,
    author: `Grant Sander`,
  },
  plugins: [
    // Site head
    `gatsby-plugin-react-helmet`,

    // Allow typescript
    `gatsby-plugin-typescript`,

    // Postcss
    `gatsby-plugin-postcss`,
    {
      resolve: `gatsby-plugin-purgecss`,
      options: {
        tailwind: true,
      },
    },

    // Webfonts
    {
      resolve: "gatsby-plugin-web-font-loader",
      options: {
        google: {
          families: ["Raleway:300,400,700,900"],
        },
      },
    },

    // Image related
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-remark-images`,

    // MDX
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        defaultLayouts: {
          default: path.resolve("./src/components/SiteLayout.tsx"),
        },
        gatsbyRemarkPlugins: [
          `gatsby-remark-heading-slug`,
          `gatsby-remark-copy-linked-files`,
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 1000,
              disableBgImageOnAlpha: true,
            },
          },
        ],
        remarkPlugins: [require("remark-emoji")],
      },
    },

    // Sourcing filesystem for images
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/assets/img`,
      },
    },

    // Sourcing for pages
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: `${__dirname}/src/pages`,
      },
    },

    // PWA config
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `LearnJS`,
        short_name: `LearnJS`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
};
