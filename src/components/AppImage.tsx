import React from "react";

/**
 * App Image
 */
const AppImage: React.FC = (props) => {
  return (
    <div className="rounded overflow-hidden border shadow mx-auto max-w-xl mb-4">
      <img {...props} className="w-full" />
    </div>
  );
};

export default AppImage;
