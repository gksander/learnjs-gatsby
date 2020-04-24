import * as React from "react";
import classNames from "classnames";

/**
 * Button
 */
const Button: React.FC<{
  onClick: () => any;
  className?: string;
}> = ({ onClick, className = "", children }) => (
  <button
    onClick={onClick}
    className={classNames(
      "w-8 h-8 flex justify-center items-center bg-primary-700 text-white rounded-full text-xs shadow hover:shadow-lg",
      className,
    )}
  >
    {children}
  </button>
);

export default Button;
