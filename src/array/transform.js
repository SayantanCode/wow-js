// reverse, rotate, fill, copyWithin
export const reverse = (arr) => arr.reverse();
export const rotate = (arr, n) => arr.slice(n).concat(arr.slice(0, n));
export const fill = (arr, value, start, end) => arr.fill(value, start, end);
export const copyWithin = (arr, target, start, end) =>
  arr.copyWithin(target, start, end);



