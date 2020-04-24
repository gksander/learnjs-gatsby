import * as React from "react";
import { FiAlertCircle } from "react-icons/fi";

/**
 * Blockquote, styled as more of an alert
 */
const Alert: React.FC = ({ children }) => (
  <div className="mb-4 flex flex-wrap border border-b-4 border-primary-700 py-3 px-3 bg-white rounded-tl rounded-tr shadow">
    <div className="flex md:items-center w-full md:w-auto justify-center mb-3 md:mb-0">
      <FiAlertCircle className="text-5xl md:text-3xl text-primary-700" />
    </div>
    <div className="md:flex-1 md:pl-3">{children}</div>
  </div>
);

export default Alert;
