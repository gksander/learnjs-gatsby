import * as React from "react";
import classNames from "classnames";
import { FaBars, FaTimes } from "react-icons/fa";
import navItems from "../util/navItems";
import AppLogo from "./AppLogo";
import { Link, StaticQuery, graphql } from "gatsby";
import { useLocation } from "@reach/router";

/**
 * Sidebar from Creative Tim.
 */
const Sidebar: React.FC = () => {
  // Local state
  const [collapseShow, setCollapseShow] = React.useState("hidden");

  // Util
  const location = useLocation();
  const activePathname = location.pathname.replace(/\/$/, "");
  const activeHash = location.hash;

  // On pathname change, hide dropdown
  React.useEffect(() => setCollapseShow("hidden"), [activePathname]);

  // Markup
  return (
    <StaticQuery
      query={graphql`
        query RouteGroups {
          allMdx(sort: { order: ASC, fields: frontmatter___order }) {
            group(field: frontmatter___section) {
              edges {
                node {
                  id
                  frontmatter {
                    section
                    title
                    order
                    path
                  }
                  tableOfContents
                }
              }
            }
          }
        }
      `}
    >
      {(data: QueryData) => {
        return (
          <nav className="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-no-wrap md:overflow-hidden shadow-xl bg-white flex flex-wrap items-center justify-between relative md:w-64 z-20 py-4 px-6 sticky top-0">
            <div className="md:flex-col md:items-stretch md:min-h-full md:flex-no-wrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
              <AppLogo />
              <button
                className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
                type="button"
                onClick={() => setCollapseShow("bg-white m-2 py-3 px-6")}
              >
                <FaBars />
              </button>
              {/* Collapse */}
              <div
                className={
                  "md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded " +
                  collapseShow
                }
              >
                {/* Collapse header */}
                <div className="md:min-w-full md:hidden block pb-4 mb-4 border-b border-solid border-gray-300">
                  <div className="flex flex-wrap">
                    <div className="w-6/12">
                      <AppLogo />
                    </div>
                    <div className="w-6/12 flex justify-end">
                      <button
                        type="button"
                        className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
                        onClick={() => setCollapseShow("hidden")}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  </div>
                </div>
                {/* Navigation */}
                <div className="overflow-auto h-halfscreen md:h-auto hide-scrollbar">
                  {data.allMdx.group.map((group, i) => {
                    const title = group.edges[0].node.frontmatter.section;

                    return (
                      <React.Fragment key={title}>
                        <h6 className="md:min-w-full text-gray-900 text-sm uppercase font-bold block pt-1 mb-2 no-underline">
                          {title}
                        </h6>
                        {group.edges.map(({ node }) => (
                          <React.Fragment key={node.id}>
                            <div className="items-center">
                              <Link
                                to={node.frontmatter.path}
                                className={classNames(
                                  "hover:text-primary-700 text-xs uppercase py-1 font-bold block",
                                  node.frontmatter.path === activePathname
                                    ? "text-primary-700 underline"
                                    : "text-gray-700",
                                )}
                              >
                                {node.frontmatter.title}
                              </Link>
                            </div>
                            {node.frontmatter.path === activePathname && (
                              <div className="pl-2 mb-1">
                                {(
                                  node.tableOfContents?.items?.[0]?.items ?? []
                                ).map(({ title, url }) => (
                                  <a
                                    key={url}
                                    className={classNames(
                                      "block text-sm text-gray-700 hover:text-primary-700 whitespace-no-wrap truncate mb-1 last:mb-0",
                                      activeHash === url && "text-primary-700",
                                    )}
                                    href={url}
                                  >
                                    {title}
                                  </a>
                                ))}
                              </div>
                            )}
                          </React.Fragment>
                        ))}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            </div>
          </nav>
        );
      }}
    </StaticQuery>
  );
};

export default Sidebar;

/**
 * Types for query
 */
export interface QueryData {
  allMdx: AllMdx;
}

export interface AllMdx {
  group: Group[];
}

export interface Group {
  edges: Edge[];
}

export interface Edge {
  node: Node;
}

export interface Node {
  id: string;
  frontmatter: Frontmatter;
  tableOfContents: TableOfContents;
}

export interface Frontmatter {
  section: string;
  title: string;
  order: number;
  path: string;
}

export interface TableOfContents {
  items: TableOfContentsItem[];
}

export interface TableOfContentsItem {
  url: string;
  title: string;
  items?: ItemItem[];
}

export interface ItemItem {
  url: string;
  title: string;
}
