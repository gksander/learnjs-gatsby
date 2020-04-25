import * as React from "react";
import AceEditor from "react-ace";
import { addCompleter } from "ace-builds/src-noconflict/ext-language_tools";
// @ts-ignore
import ace from "ace-builds/src-min-noconflict/ace";
import { EditorProps } from "./types";

ace.config.set("basePath", "/ace-resources/");
ace.config.setModuleUrl(
  "ace/mode/javascript_worker",
  "/ace-resources/worker-javascript.js",
);
ace.config.setModuleUrl("ace/theme/chrome", "/ace-resources/theme-chrome.js");

/**
 * A live ace editor
 */
const LiveAceEditor: React.FC<EditorProps> = ({
  value,
  id,
  onRun = () => null,
  onChange = (_) => null,
}) => {
  React.useEffect(() => {
    addCompleter({
      // @ts-ignore
      getCompletions(editor, session, pos, prefix, callback) {
        callback(
          null,
          [
            { name: "$log", caption: "Write to log" },
            { name: "$text", caption: "Draw text" },
            { name: "$rect", caption: "Draw a rectangle" },
            { name: "$circle", caption: "Draw a circle" },
            { name: "$start", caption: "Draw a star" },
            { name: "$animate", caption: "Animate items" },
          ].map((piece) => ({
            name: piece.name,
            value: piece.name,
            caption: piece.caption,
            meta: "LearnJS",
            score: 1000,
          })),
        );
      },
    });
  }, []);

  return (
    <label>
      <AceEditor
        mode="javascript"
        theme="chrome"
        value={value}
        width="100%"
        name={id}
        tabSize={2}
        commands={[
          {
            name: "run",
            bindKey: { win: "Ctrl-Enter", mac: "Command-Enter" },
            exec: onRun,
          },
        ]}
        className="text-xs"
        enableLiveAutocompletion={true}
        onChange={onChange}
        minLines={2}
        maxLines={25}
      />
    </label>
  );
};

export default LiveAceEditor;
