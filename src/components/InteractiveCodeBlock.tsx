import * as React from "react";
import { Resizable } from "re-resizable";
import Button from "./Button";
import { Layer, Rect, Stage, Text } from "react-konva";
import { RectClass, TextClass } from "../util/StageItems";
import {
  FaPlay,
  FaUndoAlt,
  FaAngleRight,
  FaExclamationTriangle,
} from "react-icons/fa";
import CodeEditor from "./CodeEditor";

/**
 * Code block
 */
const InteractiveCodeBlock: React.FC<{ height?: number; code: string }> = ({
  code,
  height = 140,
}) => {
  // Local state
  const [value, setValue] = React.useState(code);
  const [stageItems, setStageItems] = React.useState<
    Array<TextClass | RectClass>
  >([]);
  const [logItems, setLogItems] = React.useState<String[]>([]);
  const [$stageWidth, setStageWidth] = React.useState(200);
  const [$stageHeight, setStageHeight] = React.useState(200);
  const [error, setError] = React.useState<Error | null>(null);

  // Reset stage
  const resetStage = () => {
    setStageItems([]);
    setLogItems([]);
    setError(null);
  };

  // Log helper
  const $log = (val: string) => setLogItems((items) => items.concat(val));

  // Throw error from inside block
  const $error = (error: Error) => setError(error);

  // Rect helper
  const $rect = (...params: ConstructorParameters<typeof RectClass>) =>
    setStageItems((items) => items.concat(new RectClass(...params)));

  // Text helper
  const $text = (...params: ConstructorParameters<typeof TextClass>) => {
    const newTextItem = new TextClass(...params);
    setStageItems((items) => items.concat(newTextItem));
    return newTextItem;
  };

  /**
   * Run code!
   */
  const runCode = React.useCallback(() => {
    // Reset stuff
    resetStage();

    try {
      // Things to inject into func
      const injectables = {
        $log,
        $error,
        $text,
        $rect,
        $stageWidth,
        $stageHeight,
        // Disable some shit
        print: undefined,
        console: undefined,
        document: undefined,
      };
      const injectableKeys = Object.keys(injectables);

      // Build function
      const evaluator = new Function(
        `"use strict";return ({${injectableKeys.join(",")}} = {}) => {
          try {${value}} catch (err) {$error(err)}
        }`,
      )();

      evaluator(injectables);
    } catch (error) {
      console.log(error);
    }
  }, [$text, $rect, $stageWidth, $stageHeight]);

  // Reset code
  const resetCode = () => {
    setValue(code);
    runCode();
  };

  // When stage size changes, rerun code.
  React.useEffect(runCode, [$stageWidth, $stageHeight]);

  // When to show log
  const showLog = logItems.length > 0;

  return (
    <div className="mb-5">
      <div className="border rounded shadow bg-white">
        <CodeEditor
          code={value}
          onCodeChange={setValue}
          onKeyDown={(e) => {
            if (e.metaKey && /enter/i.test(e.key)) runCode();
          }}
        />
        <div className="flex relative flex-wrap">
          {/* Control buttons */}
          <div className="absolute left-0 top-0 z-10 py-2 -mx-4">
            <Button onClick={runCode} className="mb-2">
              <FaPlay />
            </Button>
            <Button onClick={resetCode}>
              <FaUndoAlt />
            </Button>
          </div>
          {(() => {
            if (error) {
              return (
                <div
                  style={{ height: "200px" }}
                  className="flex flex-col justify-center items-center w-full border-b-8 border-red-700 px-4"
                >
                  <FaExclamationTriangle className="text-red-700 text-5xl mb-3" />
                  <div className="bg-gray-100 border font-mono px-2 py-1 rounded text-gray-700 text-sm">
                    {String(error)}
                  </div>
                </div>
              );
            }

            return (
              <React.Fragment>
                <div className="flex-1 py-3 flex justify-center">
                  <Resizable
                    size={{ width: $stageWidth, height: $stageHeight }}
                    onResizeStop={(e, dir, ref, d) => {
                      setStageWidth((oldW) => oldW + d.width);
                      setStageHeight((oldH) => oldH + d.height);
                    }}
                    minWidth={200}
                    minHeight={200}
                    className="border shadow-md relative"
                  >
                    {/* Here's the actual stage */}
                    <Stage
                      width={$stageWidth}
                      height={$stageHeight}
                      className="w-full h-full"
                    >
                      <Layer>
                        {stageItems.map((item, i) => {
                          // Text
                          if (item instanceof TextClass) {
                            return (
                              <Text
                                key={item.id}
                                text={item.text}
                                x={item.x}
                                y={item.y}
                                fontSize={18}
                                {...item.options}
                              />
                            );
                          }

                          // Rectangle
                          if (item instanceof RectClass) {
                            return (
                              <Rect
                                key={item.id}
                                width={item.width}
                                height={item.height}
                                x={item.x}
                                y={item.y}
                                fill="red"
                                {...item.options}
                              />
                            );
                          }

                          return null;
                        })}
                      </Layer>
                    </Stage>
                    {/* Dimensions indicator */}
                    <div className="absolute bottom-0 right-0 px-2 py-1 bg-white rounded-tl border-l border-t text-xs">
                      {$stageWidth}px x {$stageHeight}px
                    </div>
                  </Resizable>
                </div>
                {showLog && (
                  <div className="w-full md:w-1/3 border-t md:border-l">
                    <div className="px-2 py-1 text-lg">Log</div>
                    {logItems.map((item, i) => (
                      <div key={i} className="px-1 py-1 flex items-center">
                        <div className="w-4">
                          <FaAngleRight />
                        </div>
                        <div className="ml-1 whitespace-no-wrap overflow-auto hide-scrollbar">
                          {String(item)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </React.Fragment>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default InteractiveCodeBlock;
