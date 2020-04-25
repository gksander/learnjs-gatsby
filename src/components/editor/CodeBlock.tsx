import * as React from "react";
import { Resizable } from "re-resizable";
import { Circle, Layer, Rect, Stage, Star, Text } from "react-konva";
import {
  CircleClass,
  RectClass,
  StarClass,
  TextClass,
} from "../../util/StageItems";
import {
  FaPlayCircle,
  FaAngleRight,
  FaExclamationTriangle,
} from "react-icons/fa";
import localForage from "localforage";
import classNames from "classnames";
import toStringer from "../../util/toStringer";
import CodeEditor from "./CodeEditor";

// Type of stage items
type StageItem = TextClass | RectClass | CircleClass | StarClass;
type Animation = {
  item: StageItem;
  [key: string]: any;
};

// Action types
type Action =
  | {
      type: "ADD_ITEM";
      item: StageItem;
    }
  | {
      type: "ANIMATE_ITEMS";
      animations: Animation[];
    }
  | {
      type: "LOG";
      value: any;
    };

// Component props
type Props = {
  height?: number;
  children: string;
  id: string;
};

// Component state
type State = {
  mode: "default" | "yours";
  value: string;
  yourCode: string;
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
      mode: "default",
      value: props.children,
      yourCode: props.children,
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
  $animate(...args: Animation[]) {
    this.addActionItem({ type: "ANIMATE_ITEMS", animations: args });
  }

  // Reset our code back to original
  resetCode() {
    this.setState({ value: this.props.children, mode: "default" });
  }

  // Change back to users code
  changeToUsersCode() {
    this.setState((prev) => ({
      ...prev,
      value: prev.yourCode,
      mode: "yours",
    }));
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

          // Animate some items
          case "ANIMATE_ITEMS": {
            const animations = action.animations;

            // Wait for all animations to resolve
            return Promise.all(
              animations.map(
                (anim) =>
                  new Promise((res) => {
                    anim?.item?.node?.to?.({
                      ...anim,
                      onFinish: () => res(true),
                    });
                  }),
              ),
            ).then(resolve);

            break;
          }

          // Log stuff
          case "LOG": {
            const value = action.value;

            this.setState(
              (prev) => ({
                ...prev,
                logItems: prev.logItems.concat(toStringer(value)),
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
    // Reset state
    this.resetStage();

    // Save code on run....
    if (this.state.value !== this.props.children) {
      this.setState({ mode: "yours", yourCode: this.state.value });
      if (this.props.id) localForage.setItem(this.props.id, this.state.value);
    }

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
          try {${this.state.value};\n;} catch (err) {$error(err)}
        }`,
      )();

      evaluator(injectables);
      setTimeout(this.__runUserCode__.bind(this));
    } catch (err) {
      $error(err);
      console.log(err);
    }
  }

  // On mount, see if we've got stored code
  async componentDidMount() {
    try {
      if (this.props.id) {
        const storedCode = await localForage.getItem(this.props.id);
        if (storedCode) this.setState({ yourCode: String(storedCode) });
      }
    } catch (_) {}
    this.runCode();
  }

  /**
   * Screen markup
   */
  render() {
    const {
      mode,
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
          <div className="flex flex-wrap border-b">
            <button
              className="w-1/3 py-1 flex justify-center items-center text-primary-700 font-bold w-full md:w-1/2 border-b md:border-b-0 focus:outline-none active:bg-primary-100"
              onClick={this.runCode.bind(this)}
            >
              <span className="mr-1">
                {value !== this.props.children && "Save & "}Run
              </span>
              <FaPlayCircle />
            </button>
            <button
              className={classNames(
                "w-1/2 md:w-1/4 py-1",
                mode === "default" &&
                  "border-b-2 border-primary-700 bg-primary-100",
              )}
              disabled={mode === "default"}
              onClick={this.resetCode.bind(this)}
            >
              Default
            </button>
            <button
              className={classNames(
                "w-1/2 md:w-1/4 border-b-4 border-transparent py-1",
                mode === "yours" &&
                  "border-b-2 border-primary-700 bg-primary-100",
              )}
              disabled={mode === "yours"}
              onClick={this.changeToUsersCode.bind(this)}
            >
              Yours
            </button>
          </div>
          <CodeEditor
            value={value}
            height={this.props.height || 140}
            id={this.props.id}
            onRun={this.runCode.bind(this)}
            onChange={(value) => this.setState({ value })}
          />
          <div className="flex relative flex-wrap border-t">
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
                      className="border shadow-md overflow-hidden"
                      bounds="parent"
                      grid={[10, 10]}
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
                  <div className="w-full md:w-1/3 border-t md:border-t-0 md:border-l">
                    <div className="px-2 py-1 text-lg">Log</div>
                    {logItems.length === 0 ? (
                      <div className="px-2 italic text-xs text-gray-700">
                        <div className="mb-1">Nothing to see here...</div>
                        <div>
                          Use <span className="text-red-700">$log</span> to log
                          things here.
                        </div>
                      </div>
                    ) : (
                      logItems.map((item, i) => (
                        <div
                          key={i}
                          className="pl-1 pr-2 py-1 flex items-start"
                        >
                          <div className="w-4 mt-1">
                            <FaAngleRight />
                          </div>
                          <pre className="ml-1 overflow-auto hide-scrollbar text-xs bg-gray-100 p-1 rounded block w-full">
                            {String(item)}
                          </pre>
                        </div>
                      ))
                    )}
                  </div>
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
