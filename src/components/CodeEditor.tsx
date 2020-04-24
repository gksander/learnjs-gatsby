import * as React from "react";
import Highlight, { defaultProps } from "prism-react-renderer";
import theme from "prism-react-renderer/themes/shadesOfPurple";
import Editor from "react-simple-code-editor";
import classNames from "classnames";

const highlight = (code: string) => (
  <Highlight {...defaultProps} theme={theme} code={code} language="jsx">
    {({ className, style, tokens, getLineProps, getTokenProps }) => (
      <React.Fragment>
        {tokens.map((line, i) => (
          <div {...getLineProps({ line, key: i })}>
            {/*<span className="inline-block w-6 select-none">{i + 1}</span>*/}
            {line.map((token, key) => (
              <span {...getTokenProps({ token, key })} />
            ))}
          </div>
        ))}
      </React.Fragment>
    )}
  </Highlight>
);

// @ts-ignore
/**
 * Code editor (wraps react-simple-code-editor)
 */
const CodeEditor: React.FC<{
  code: string;
  onCodeChange?: (val: string) => any;
  className?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}> = ({
  code = "",
  onCodeChange = (v) => null,
  className = "",
  onKeyDown = (e) => null,
}) => (
  // @ts-ignore
  <Editor
    value={code}
    highlight={highlight}
    onValueChange={onCodeChange}
    style={{
      boxSizing: "border-box",
      fontFamily: '"Dank Mono", "Fira Code", monospace',
      ...theme.plain,
    }}
    className={classNames("text-sm", className)}
    padding={10}
    textareaClassName="code-editor-textarea-override"
    preClassName="code-editor-pre-override"
    onKeyDown={onKeyDown}
  />
);

export default CodeEditor;
