import * as React from "react";
import { MDXProvider } from "@mdx-js/react";
import "../assets/tailwind.css";
import componentMap from "../util/componentMap";
import Sidebar from "./Sidebar";

const SiteLayout: React.FC = ({ children }) => (
  <React.Fragment>
    <Sidebar />
    <div className="relative md:ml-64 bg-gray-100 px-4 md:px-10 py-4 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <MDXProvider components={componentMap}>{children}</MDXProvider>
      </div>
    </div>
  </React.Fragment>
);

export default SiteLayout;
