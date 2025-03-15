import consoleColor from "../logger/consoleColor.js";

/**
 * Advanced find function with performance optimizations and enhanced features.
 *
 * @param {Array} array The array to search within.
 * @param {object|function} criteriaOrFunction The search criteria (object) or a custom predicate function.
 * @param {object} options Optional parameters for the search.
 * @param {boolean} options.useIndex Whether to return the index instead of the element.
 * @param {boolean} options.findAll Whether to return all matching elements.
 * @param {function} options.transform A function to transform each element before comparison.
 * @returns {any|any[]|number|number[]} The found element(s), index(es), or undefined.
 */
export const advancedFind = (array, criteriaOrFunction, options = {}) => {
  try {
    if (!Array.isArray(array)) {
      throw new TypeError('The first argument must be an array.');
    }

    const { useIndex = false, findAll = false, transform } = options;
    const results = findAll ? [] : undefined;

    if (typeof criteriaOrFunction === 'function') {
      // Custom predicate function
      for (let i = 0; i < array.length; i++) {
        const element = transform ? transform(array[i]) : array[i];
        if (criteriaOrFunction(element, i, array)) {
          if (findAll) {
            results.push(useIndex ? i : array[i]);
          } else {
            return useIndex ? i : array[i];
          }
        }
      }
    } else if (typeof criteriaOrFunction === 'object' && criteriaOrFunction !== null) {
      // Object criteria
      const keys = Object.keys(criteriaOrFunction);

      for (let i = 0; i < array.length; i++) {
        const element = transform ? transform(array[i]) : array[i];
        let match = true;

        for (const key of keys) {
          if (element === null || typeof element !== 'object' || element[key] !== criteriaOrFunction[key]) {
            match = false;
            break;
          }
        }

        if (match) {
          if (findAll) {
            results.push(useIndex ? i : array[i]);
          } else {
            return useIndex ? i : array[i];
          }
        }
      }
    } else {
      throw new TypeError('The second argument must be a function or a non-null object.');
    }

    return results; // Return undefined if not found
  } catch (error) {
    console.error(consoleColor(`Error in advancedFind:, ${error}`, 'red'));
    throw error;
  }
}
  
