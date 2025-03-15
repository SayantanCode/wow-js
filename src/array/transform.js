/**
 * Reverses the order of the elements in the array.
 *
 * @param {Array} arr - The array to reverse.
 * @returns {Array} - The reversed array.
 */
const reverse = (arr) => arr.reverse();

/**
 * Rotates the elements of the array by n positions.
 * 
 * @param {Array} arr - The array to rotate.
 * @param {number} n - The number of positions to rotate.
 * @returns {Array} - The rotated array.
 * @example
 * rotate([1, 2, 3, 4, 5], 2); // [3, 4, 5, 1, 2]
 */
const rotate = (arr, n) => arr.slice(n).concat(arr.slice(0, n));

/**
 * Fills elements of the array with a specified value from start index to end index.
 * Similar to Array.prototype.fill.
 * When to use: When you want to fill a range of elements in an array with a specific value.
 * 
 * @param {Array} arr - The array to fill.
 * @param {*} value - The value to fill the array with.
 * @param {number} [start=0] - The start index.
 * @param {number} [end=arr.length] - The end index.
 * @returns {Array} - The filled array.
 * @example
 * fill([1, 2, 3, 4, 5], '*', 1, 3); // [1, '*', '*', 4, 5]
 */
const fill = (arr, value, start, end) => arr.fill(value, start, end);

/**
 * Copies a sequence of elements within the array to the position starting at target.
 * 
 * @param {Array} arr - The array to copy elements within.
 * @param {number} target - The index to copy elements to.
 * @param {number} [start=0] - The start index to copy elements from.
 * @param {number} [end=arr.length] - The end index to copy elements from.
 * @returns {Array} - The array with copied elements.
 */
const copyWithin = (arr, target, start, end) => arr.copyWithin(target, start, end);

/**
 * Applies any of the above functions on the array based on the options passed.
 * Note: You can use negative indices for start, end, and copyWithin options.
 * 
 * @param {Array} arr - The array to apply the transformation on.
 * @param {Object} options - The options to apply the transformation.
 * @property {boolean} [options.reverse=false] - Whether to reverse the array.
 * @property {number} [options.rotate=0] - The number of positions to rotate the array.
 * @property {any} [options.fill=undefined] - The value to fill the array with.
 * @property {number} [options.start=0] - The start index to fill the array from.
 * @property {number} [options.end=arr.length] - The end index to fill the array to.
 * @property {number} [options.copyWithin=0] - The index to copy elements to. This is the target index.
 * @returns {Array} - The transformed array.
 * @example
 * transform([1, 2, 3, 4, 5], {reverse: true}); // [5, 4, 3, 2, 1]
 * transform([1, 2, 3, 4, 5], {rotate: 2}); // [3, 4, 5, 1, 2]
 * transform([1, 2, 3, 4, 5], {fill: '*', start: 1, end: 3}); // [1, '*', '*', 4, 5]
 * transform([1, 2, 3, 4, 5], {copyWithin: 2, start: 1, end: 3}); // [1, 2, 2, 3, 5]
 */
export const transform = (arr, options) => {
    if (!Array.isArray(arr)) {
        throw new Error('The first argument must be an array.');
    }
    //check if array is integer if string but it should be number
  if (arr.some((x) => typeof x === 'string' && !Number.isInteger(Number(x)))) {
    throw new Error('The array must contain only integers.');
  }
    if(typeof options !== 'object') {
        throw new Error('The second argument must be an object.');
    }
  if (options.reverse) {
    return reverse(arr);
  }
  if (options.rotate) {
    if (typeof options.rotate !== 'number') {
      throw new Error('The rotate option must be a number.');
    }
    return rotate(arr, options.rotate);
  }
  if (options.fill) {
    if (typeof options.fill === 'undefined') {
      throw new Error('The fill option must be a value.');
    }
    if(!options.start) {
      options.start = 0;
    }
    if(!options.end) {
        options.end = arr.length;
    }
    if (typeof options.start !== 'number') {
      throw new Error('The start option must be a number.');
    }
    if (typeof options.end !== 'number') {
      throw new Error('The end option must be a number.');
    }
    if(options.start>=arr.length) {
      throw new Error('The start option must be less than the length of the array.');
    }
    if(options.end>=arr.length) {
      throw new Error('The end option must be less than or equal to the length of the array.');
    }
    if(options.start < 0) {
      if(-arr.length<=options.start) {
        options.start = arr.length + options.start;
      }
    }
    if(options.end < 0) {
      if(-arr.length<=options.end) {
        options.end = arr.length + options.end;
      }
    }
    if(options.start > options.end) {
      throw new Error('The start option must be less than or equal to the end option.');
    }
    if(options.end > arr.length) {
      throw new Error('The end option must be less than or equal to the length of the array.');
    }
    return fill(arr, options.fill, options.start, options.end);
  }
  if (options.copyWithin) {
    if (typeof options.copyWithin !== 'number') {
      console.warn('The copyWithin option must be a number.');
      //default to 0
        options.copyWithin = 0;
    }
    if(options.copyWithin>=arr.length) {
      console.warn('The copyWithin option must be less than the length of the array. Not copying...');
        return arr;
    }
    if(options.copyWithin < 0) {
      if(-arr.length<=options.copyWithin) {
        options.copyWithin = arr.length + options.copyWithin;
      }
    }
    if(!options.start) {
      options.start = 0;
    }
    if(!options.end) {
        options.end = arr.length;
    }
    if (typeof options.start !== 'number') {
      throw new Error('The start option must be a number.');
    }
    if (typeof options.end !== 'number') {
      throw new Error('The end option must be a number.');
    }
    if(options.start>=arr.length) {
      throw new Error('The start option must be less than the length of the array.');
    }
    if(options.end>=arr.length) {
      throw new Error('The end option must be less than or equal to the length of the array.');
    }
    if(options.start < 0) {
      if(-arr.length<=options.start) {
        options.start = arr.length + options.start;
      }
    }
    if(options.end < 0) {
      if(-arr.length<=options.end) {
        options.end = arr.length + options.end;
      }
    }
    if(options.start > options.end) {
      throw new Error('The start option must be less than or equal to the end option.');
    }
    if(options.end > arr.length) {
      throw new Error('The end option must be less than or equal to the length of the array.');
    }
    return copyWithin(arr, options.copyWithin, options.start, options.end);
  }
  return arr;
}

