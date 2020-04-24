import * as React from "react";
import { MDXProvider } from "@mdx-js/react";
import "../assets/tailwind.css";
import componentMap from "../util/componentMap";
import Sidebar from "./Sidebar";
import { Helmet } from "react-helmet";
import { graphql, useStaticQuery } from "gatsby";

const SiteLayout: React.FC<any> = (props) => {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            author
          }
        }
      }
    `,
  );

  const metaDescription = site.siteMetadata.description;
  const title = props?.pageContext?.frontmatter?.title ?? "LearnJS";

  return (
    <React.Fragment>
      <Helmet
        htmlAttributes={{
          lang: "en",
        }}
        title={title}
        titleTemplate={`%s | ${site.siteMetadata.title}`}
        meta={[
          {
            name: `description`,
            content: metaDescription,
          },
          {
            property: `og:title`,
            content: title,
          },
          {
            property: `og:description`,
            content: metaDescription,
          },
          {
            property: `og:type`,
            content: `website`,
          },
          {
            name: `twitter:card`,
            content: `summary`,
          },
          {
            name: `twitter:creator`,
            content: site.siteMetadata.author,
          },
          {
            name: `twitter:title`,
            content: title,
          },
          {
            name: `twitter:description`,
            content: metaDescription,
          },
        ]}
      />
      <Sidebar />
      <div className="relative md:ml-64 bg-gray-100 px-4 md:px-10 py-4 min-h-screen">
        <div className="max-w-2xl mx-auto">
          <MDXProvider components={componentMap}>{props.children}</MDXProvider>
        </div>
      </div>
    </React.Fragment>
  );
};

export default SiteLayout;
