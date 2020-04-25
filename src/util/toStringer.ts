/**
 * Rounding
 */
function round(x: number, n: number) {
  return Math.round(x * Math.pow(10, n)) / Math.pow(10, n);
}

/**
 * Stringifier
 */
function toStringer(val: any): string {
  if (Array.isArray(val)) {
    return `[${val.map((v) => toStringer(v)).join(", ")}]`;
  }

  if (typeof val === "number") {
    return round(val, 8).toString();
  }

  // Logging out object. Handle stage items separately
  if (typeof val === "object") {
    let v = val;

    // If looking at Stage item, remove node and id
    if (val.node) {
      const { node, id, ...rest } = val;
      v = rest;
    }

    return JSON.stringify(v, null, 2);
  }

  return val?.toString?.() ?? String(val);
}

export default toStringer;
