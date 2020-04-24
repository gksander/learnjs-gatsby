import React from "react";
import Highlight, { defaultProps, Language } from "prism-react-renderer";
import theme from "prism-react-renderer/themes/shadesOfPurple";

/**
 * Static code block with Prism
 */
const StaticCodeBlock: React.FC<{ className?: string; code: string }> = ({
  code = "",
  className = "language-js",
}) => {
  const language = className.replace(/language-/, "");

  return (
    <div className="text-xs">
      <Highlight
        {...defaultProps}
        code={code}
        language={language as Language}
        theme={theme}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={className} style={{ ...style, padding: "20px" }}>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line, key: i })}>
                <span className="inline-block w-4">{i + 1}</span>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
};

export default StaticCodeBlock;
