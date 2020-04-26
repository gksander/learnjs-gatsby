const clamp = (x: number, min: number, max: number) => {
  if (isNaN(x)) return 0;
  if (x < min) return min;
  if (x > max) return max;
  return x;
};

export default clamp;
