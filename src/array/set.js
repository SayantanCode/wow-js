// unique, intersection, union, difference, symmetricDifference

/**
 * Returns a new array with only the unique values from the input array.
 * @param {Array} arr - The array to filter for unique values.
 * @returns {Array} A new array with unique values.
 */
const unique = (arr) => [...new Set(arr)];



/**
 * Returns a new array with unique objects from the input array based on a specified key or function.
 * @param {Array} arr - The array of objects to filter for uniqueness.
 * @param {string|function} keyOrFn - The key or function to determine uniqueness for each object.
 * @returns {Array} A new array with unique objects.
 */
const uniqueBy = (arr, keyOrFn) => {
  if(!Array.isArray(arr)) {
    throw new TypeError('The first argument must be an array.');
  }
  if(typeof keyOrFn !== 'string' && typeof keyOrFn !== 'function') {
    throw new TypeError('The second argument must be a string or a function.');
  }

  const seen = new Set();
  return arr.filter((item) => {
    // Use the keyOrFn to determine uniqueness. when it's a string, use it as a key to access the property of the object.
    const key = typeof keyOrFn === 'string' ? item[keyOrFn] : keyOrFn(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

/**
 * Returns an array containing the common elements between two arrays.
 * @param {Array} arr1 - The first array.
 * @param {Array} arr2 - The second array.
 * @returns {Array} An array with the intersection of the two arrays.
 */
const intersection = (arr1, arr2) =>
  arr1.filter((value) => arr2.includes(value));

/**
 * Returns an array containing all elements from both arrays, with duplicates removed.
 * @param {Array} arr1 - The first array.
 * @param {Array} arr2 - The second array.
 * @returns {Array} An array with the union of the two arrays.
 */
const union = (arr1, arr2) => [...new Set([...arr1, ...arr2])];

/**
 * Returns an array containing the elements that are in the first array but not in the second.
 * @param {Array} arr1 - The first array.
 * @param {Array} arr2 - The second array.
 * @returns {Array} An array with the difference of the two arrays.
 */
const difference = (arr1, arr2) =>
  arr1.filter((value) => !arr2.includes(value));

/**
 * Returns an array containing the elements that are in either of the arrays, but not in both.
 * @param {Array} arr1 - The first array.
 * @param {Array} arr2 - The second array.
 * @returns {Array} An array with the symmetric difference of the two arrays.
 */
const symmetricDifference = (arr1, arr2) => [
  ...new Set(
    [...arr1, ...arr2].filter(
      (value) => !arr1.includes(value) || !arr2.includes(value)
    )
  ),
];

export const set = (arr1, arr2, options)=>{
  
    if(options.unique) {
        if(!Array.isArray(arr1)) {
            throw new TypeError('The first argument must be an array.');
        }
        return unique(arr1);
    }
    if(options.uniqueBy) {
        if(!Array.isArray(arr1)) {
            throw new TypeError('The first argument must be an array.');
        }
        return uniqueBy(arr1, options.uniqueBy);
    }
    if(options.intersection) {
        if(!Array.isArray(arr1)) {
            throw new TypeError('The first argument must be an array.');
        }
        if(!Array.isArray(arr2)) {
            throw new TypeError('The second argument must be an array.');
        }
        return intersection(arr1, arr2);
    }
    if(options.union) {
        if(!Array.isArray(arr1)) {
            throw new TypeError('The first argument must be an array.');
        }
        if(!Array.isArray(arr2)) {
            throw new TypeError('The second argument must be an array.');
        }
        return union(arr1, arr2);
    }
    if(options.difference) {
        if(!Array.isArray(arr1)) {
            throw new TypeError('The first argument must be an array.');
        }
        if(!Array.isArray(arr2)) {
            throw new TypeError('The second argument must be an array.');
        }
        return difference(arr1, arr2);
    }
    if(options.symmetricDifference) {
        if(!Array.isArray(arr1)) {
            throw new TypeError('The first argument must be an array.');
        }
        if(!Array.isArray(arr2)) {
            throw new TypeError('The second argument must be an array.');
        }
        return symmetricDifference(arr1, arr2);
    }
}