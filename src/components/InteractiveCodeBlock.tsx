import * as React from "react";
import { Resizable } from "re-resizable";
import Button from "./Button";
import { Circle, Layer, Rect, Stage, Star, Text } from "react-konva";
import {
  CircleClass,
  RectClass,
  StarClass,
  TextClass,
} from "../util/StageItems";
import {
  FaPlay,
  FaUndoAlt,
  FaAngleRight,
  FaExclamationTriangle,
} from "react-icons/fa";
import CodeEditor from "./CodeEditor";

// Type of stage items
type StageItem = TextClass | RectClass | CircleClass | StarClass;

// Action types
type Action =
  | {
      type: "ADD_ITEM";
      item: StageItem;
    }
  | {
      type: "ANIMATE_ITEM";
      item: StageItem;
      config: object;
    }
  | {
      type: "LOG";
      value: any;
    };

// Component props
type Props = {
  height?: number;
  code: string;
};

// Component state
type State = {
  value: string;
  actions: Action[];
  stageItems: StageItem[];
  logItems: string[];
  $stageWidth: number;
  $stageHeight: number;
  error: Error | null;
};

/**
 * Interactive editor class
 */
class InteractiveCodeBlock extends React.Component<Props, State> {
  // Instantiate state
  constructor(props: Props) {
    super(props);

    this.state = {
      value: props.code,
      actions: [],
      stageItems: [],
      logItems: [],
      $stageWidth: 200,
      $stageHeight: 200,
      error: null,
    };
  }

  // Resetting state
  resetStage() {
    this.setState({
      actions: [],
      stageItems: [],
      logItems: [],
      error: null,
    });
  }

  // Add an action item
  addActionItem(action: Action) {
    this.setState((prev) => ({
      ...prev,
      actions: prev.actions.concat(action),
    }));
  }

  // Log error
  $error(error: Error) {
    this.setState({ error });
  }

  // Log helper
  $log(value: any) {
    this.addActionItem({ type: "LOG", value });
  }

  // Rect helper
  $rect(...params: ConstructorParameters<typeof RectClass>) {
    const item = new RectClass(...params);
    this.addActionItem({ type: "ADD_ITEM", item });
    return item;
  }

  // Circle helper
  $circle(...params: ConstructorParameters<typeof CircleClass>) {
    const item = new CircleClass(...params);
    this.addActionItem({ type: "ADD_ITEM", item });
    return item;
  }

  // Star helper
  $star(...params: ConstructorParameters<typeof StarClass>) {
    const item = new StarClass(...params);
    this.addActionItem({ type: "ADD_ITEM", item });
    return item;
  }

  // Text helper
  $text(...params: ConstructorParameters<typeof TextClass>) {
    const item = new TextClass(...params);
    this.addActionItem({ type: "ADD_ITEM", item });
    return item;
  }

  // Animation helper
  $animate(item: StageItem, config = {}) {
    this.addActionItem({ type: "ANIMATE_ITEM", item, config });
    return item;
  }

  // Reset our code back to original
  resetCode() {
    this.setState({ value: this.props.code });
    this.runCode();
  }

  /**
   * Actually execute user's code
   */
  async __runUserCode__() {
    for (let action of this.state.actions) {
      await new Promise((resolve, reject) => {
        switch (action.type) {
          // Add an item
          case "ADD_ITEM": {
            const item = action.item;

            this.setState(
              (prev) => ({
                ...prev,
                stageItems: prev.stageItems.concat(item),
              }),
              resolve,
            );
            break;
          }

          // Animate an item
          case "ANIMATE_ITEM": {
            action.item?.node?.to?.({
              ...action?.config,
              onFinish: () => resolve(true),
            });
            break;
          }

          // Log stuff
          case "LOG": {
            const value = action.value;

            this.setState(
              (prev) => ({
                ...prev,
                logItems: prev.logItems.concat(value),
              }),
              resolve,
            );
            break;
          }
        }
      });
    }
  }

  /**
   * Try to run code
   */
  runCode() {
    this.resetStage();

    // Bind our actions/state
    const { $stageWidth, $stageHeight } = this.state;
    const $rect = this.$rect.bind(this);
    const $circle = this.$circle.bind(this);
    const $star = this.$star.bind(this);
    const $text = this.$text.bind(this);
    const $animate = this.$animate.bind(this);
    const $error = this.$error.bind(this);
    const $log = this.$log.bind(this);
    const __runUserCode__ = this.__runUserCode__.bind(this);

    try {
      // Things to inject into func
      const injectables = {
        $error,
        $log,
        $rect,
        $circle,
        $star,
        $text,
        $animate,
        $stageWidth,
        $stageHeight,

        // Disable some stuff
        print: undefined,
        console: undefined,
        document: undefined,

        // Executor
        __runUserCode__,
      };
      const injectableKeys = Object.keys(injectables);

      // Build function
      const evaluator = new Function(
        `"use strict";return ({${injectableKeys.join(",")}} = {}) => {
          try {${this.state.value}} catch (err) {$error(err)}
        }`,
      )();

      evaluator(injectables);
      setTimeout(this.__runUserCode__.bind(this));
    } catch (err) {
      $error(err);
      console.log(err);
    }
  }

  /**
   * Screen markup
   */
  render() {
    const {
      logItems,
      value,
      $stageWidth,
      $stageHeight,
      error,
      stageItems,
    } = this.state;

    return (
      <div className="mb-5">
        <div className="border rounded shadow bg-white">
          <CodeEditor
            code={value}
            onCodeChange={(value) => this.setState({ value })}
            onKeyDown={(e) => {
              if (e.metaKey && /enter/i.test(e.key)) this.runCode();
            }}
          />
          <div className="flex relative flex-wrap">
            {/* Control buttons */}
            <div className="absolute left-0 top-0 z-10 py-2 -mx-4">
              <Button
                onClick={this.runCode.bind(this)}
                className="mb-2"
                label="Run Code"
              >
                <FaPlay />
              </Button>
              <Button onClick={this.resetCode.bind(this)} label="Reset Code">
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
                        this.setState((prev) => ({
                          ...prev,
                          $stageWidth: prev.$stageWidth + d.width,
                          $stageHeight: prev.$stageHeight + d.height,
                        }));
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
                                  ref={(node) => (item.node = node)}
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
                                  ref={(node) => (item.node = node)}
                                />
                              );
                            }

                            // Circle
                            if (item instanceof CircleClass) {
                              return (
                                <Circle
                                  key={item.id}
                                  radius={item.radius}
                                  x={item.x}
                                  y={item.y}
                                  fill="red"
                                  {...item.options}
                                  ref={(node) => (item.node = node)}
                                />
                              );
                            }

                            // Star
                            if (item instanceof StarClass) {
                              return (
                                <Star
                                  key={item.id}
                                  innerRadius={0.5 * item.radius}
                                  outerRadius={item.radius}
                                  x={item.x}
                                  y={item.y}
                                  fill="red"
                                  numPoints={5}
                                  {...item.options}
                                  ref={(node) => (item.node = node)}
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
                  {logItems.length > 0 && (
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
  }
}

export default InteractiveCodeBlock;
