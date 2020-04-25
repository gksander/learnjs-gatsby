import * as React from "react";
import { EditorProps } from "./types";
import { FaSpinner } from "react-icons/fa";
import Loadable from "react-loadable";
import { CodeContext } from "./CodeBlock";

// Placeholder
const PlaceholderEditor: React.FC = () => {
  const { code, height } = React.useContext(CodeContext);

  return (
    <div className="relative">
      <pre
        className="text-xs text-gray-700 p-2 overflow-auto relative"
        style={{
          height: `${height}px`,
        }}
      >
        {code}
      </pre>
      <div className="absolute top-0 left-0 p-2 bg-primary-700 rounded-br">
        <FaSpinner className="fa-spin text-white" />
      </div>
    </div>
  );
};

/**
 * Loadable version
 */
const LoadableLiveAceEditor = Loadable<EditorProps, any>({
  loader: () => import("./LiveAceEditor"),
  loading: PlaceholderEditor,
});

/**
 * Code editor that lazy loads
 */
const CodeEditor: React.FC<EditorProps> = (props) => {
  if (typeof window === "undefined") return <PlaceholderEditor {...props} />;
  return <LoadableLiveAceEditor {...props} />;
};

export default CodeEditor;
