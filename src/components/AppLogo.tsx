import * as React from "react";
import { Link } from "gatsby";

/**
 * App logo, used in layout
 */
const AppLogo: React.FC = () => (
  <Link to="/" className="py-2 text-xl font-black">
    <span className="text-primary-800">Learn</span>
    <span>JS</span>
  </Link>
);

export default AppLogo;
