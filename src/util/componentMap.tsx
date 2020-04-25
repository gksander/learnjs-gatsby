import AppImage from "../components/AppImage";
import * as React from "react";
import CodeBlock from "../components/editor/CodeBlock";
import Alert from "../components/Alert";
import AppVideo from "../components/AppVideo";
import { Link } from "gatsby";

/**
 * Transform elements
 */
const componentMap: { [key: string]: React.FC<any> } = {
  // Overriding standard tags
  a: (props) => {
    const classNames = "text-primary-700";

    return /^(http|\/static)/.test(props.href) ? (
      <a className={classNames} target="_blank" {...props} />
    ) : (
      <Link to={props.href} className={classNames} {...props} />
    );
  },
  pre: (props) => <div {...props} />,
  code: (props) => <CodeBlock {...props} />,
  h1: (props) => <h1 className="text-5xl border-b mb-5" {...props} />,
  h2: (props) => <h2 className="text-2xl mb-3" {...props} />,
  p: (props) => <p className="mb-5 last:mb-0" {...props} />,
  inlineCode: (props) => (
    <code
      className="text-red-700 px-1 bg-gray-200 rounded text-sm"
      {...props}
    />
  ),
  blockquote: (props) => <Alert {...props} />,
  ul: (props) => <ul className="list-disc ml-6 mb-5" {...props} />,
  li: (props) => <li className="mb-2 last:mb-0 pl-1" {...props} />,
  ol: (props) => <ol className="list-decimal ml-6 mb-5" {...props} />,
  img: (props) => {
    if (/gatsby/i.test(props.className)) return <img {...props} />;
    return (
      <a
        className="max-w-xl border rounded shadow overflow-hidden block"
        href={props.src}
        target="_blank"
        rel="noopener"
      >
        <img {...props} />
      </a>
    );
  },
  // Custom app image
  AppVideo,
  Alert,
};

export default componentMap;
