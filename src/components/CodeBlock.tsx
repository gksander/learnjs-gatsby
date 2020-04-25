import * as React from "react";
import CodeEditor from "./CodeEditor";
import InteractiveCodeBlock from "./InteractiveCodeBlock";

/**
 * Code block
 */
const CodeBlock: React.FC<{ height?: number; live?: boolean; id: string }> = ({
  children,
  height = 140,
  live = false,
  id = "",
}) => {
  const code = String(children).trim();

  // Live editors
  if (live) {
    return <InteractiveCodeBlock height={height} code={code} id={id} />;
  }

  return <CodeEditor code={code} className="rounded mb-5 shadow" />;
};

export default CodeBlock;
