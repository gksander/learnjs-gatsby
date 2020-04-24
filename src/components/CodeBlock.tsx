import * as React from "react";
import CodeEditor from "./CodeEditor";
import InteractiveCodeBlock from "./InteractiveCodeBlock";

/**
 * Code block
 */
const CodeBlock: React.FC<{ height?: number; live?: boolean }> = ({
  children,
  height = 140,
  live = false,
}) => {
  const code = String(children).trim();

  // Live editors
  if (live) {
    return <InteractiveCodeBlock height={height} code={code} />;
  }

  return <CodeEditor code={code} className="rounded mb-5 shadow" />;
};

export default CodeBlock;
