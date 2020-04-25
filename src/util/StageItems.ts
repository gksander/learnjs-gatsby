import { v4 as uuidv4 } from "uuid";

/**
 * Text items
 */
export class TextClass {
  id = uuidv4();
  x!: number;
  y!: number;
  text!: string;
  options: any = {};
  node: any = null;

  constructor(text = "", x = 0, y = 0, options = {}) {
    this.text = text;
    this.x = x;
    this.y = y;
    this.options = options;
  }
}

/**
 * Rectangle class
 */
export class RectClass {
  // Properties
  id = uuidv4();
  width!: number;
  height!: number;
  x!: number;
  y!: number;
  options: any = {};
  node: any = null;

  constructor(width = 0, height = 0, x = 0, y = 0, options = {}) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.options = options;
  }
}

/**
 * Circles
 */
export class CircleClass {
  id = uuidv4();
  radius!: number;
  x!: number;
  y!: number;
  options: any = {};
  node: any = null;

  constructor(radius = 0, x = 0, y = 0, options = {}) {
    this.radius = radius;
    this.x = x;
    this.y = y;
    this.options = options;
  }
}

/**
 * Rectangle class
 */
export class StarClass {
  // Properties
  id = uuidv4();
  radius!: number;
  x!: number;
  y!: number;
  options: any = {};
  node: any = null;

  constructor(radius = 0, x = 0, y = 0, options = {}) {
    this.radius = radius;
    this.x = x;
    this.y = y;
    this.options = options;
  }
}
