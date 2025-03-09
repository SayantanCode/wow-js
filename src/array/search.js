// binary search
export const binarySearch = (arr, target) => {
  let left = 0;
  let right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1;
};
// linear search
export const linearSearch = (arr, target) => arr.indexOf(target);

// Advanced search algorithms

// Interpolation search
// Interpolation search is an improvement over binary search for instances where the values in a sorted array are uniformly distributed. The algorithm calculates the probable position of the target value based on the range of values in the array.
// Time complexity: O(log(log(n))) on average
export const interpolationSearch = (arr, target) => {
  let left = 0;
  let right = arr.length - 1;
  while (left <= right && arr[left] <= target && arr[right] >= target) {
    const mid =
      left +
      Math.floor(
        ((right - left) / (arr[right] - arr[left])) * (target - arr[left])
      );
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1;
};

// Jump search
// Jump search is an improvement over linear search for instances where the values in a sorted array are uniformly distributed. The algorithm divides the array into blocks and performs a linear search on the block containing the target value.
// Time complexity: O(√n)
export const jumpSearch = (arr, target) => {
  const blockSize = Math.floor(Math.sqrt(arr.length));
  let left = 0;
  let right = blockSize - 1;
  while (arr[right] < target) {
    left = right + 1;
    right = Math.min(right + blockSize, arr.length - 1);
  }
  while (left <= right && arr[left] <= target) {
    if (arr[left] === target) {
      return left;
    }
    left++;
  }
  return -1;
};
// Ternary search
export const ternarySearch = (arr, target) => {
  let left = 0;
  let right = arr.length - 1;
  while (left <= right) {
    const mid1 = left + Math.floor((right - left) / 3);
    const mid2 = right - Math.floor((right - left) / 3);
    if (arr[mid1] === target) {
      return mid1;
    } else if (arr[mid2] === target) {
      return mid2;
    } else if (arr[mid1] < target) {
      left = mid1 + 1;
    } else if (arr[mid2] > target) {
      right = mid2 - 1;
    } else {
      left = mid1 + 1;
      right = mid2 - 1;
    }
  }
  return -1;
};
// Exponential search
export const exponentialSearch = (arr, target) => {
  let bound = 1;
  while (bound < arr.length && arr[bound] < target) {
    bound *= 2;
  }
  return binarySearch(arr.slice(bound / 2, Math.min(bound, arr.length)), target);
};
// Fibonacci search
export const fibonacciSearch = (arr, target) => {
  const fib = [0, 1, 1];
  while (fib[fib.length - 1] < arr.length) {
    fib.push(fib[fib.length - 1] + fib[fib.length - 2]);
  }
  let offset = 0;
  for (let i = fib.length - 1; i > 0; i--) {
    const index = Math.min(offset + fib[i - 1], arr.length - 1);
    if (arr[index] < target) {
      offset = index;
    } else if (arr[index] > target) {
      continue;
    } else {
      return index;
    }
  }
  return -1;
};
// Sublist search
// Sublist search is an algorithm that finds the starting index of a sublist within a list. The algorithm compares the sublist with each subarray of the same length in the list.
// Time complexity: O(n*m) where n is the length of the list and m is the length of the sublist
export const sublistSearch = (arr, target) => {
  for (let i = 0; i < arr.length; i++) {
    let j = 0;
    while (j < target.length && arr[i + j] === target[j]) {
      j++;
    }
    if (j === target.length) {
      return i;
    }
  }
  return -1;
};

//Smart search algorithms
export const smartSearch = (arr, target, thresholds = { small: 100, large: 1000 }) => {
  const { small, large } = thresholds;
  if (arr.length < small) {
    return linearSearch(arr, target);
  } else if (arr.length < large) {
    return binarySearch(arr, target);
  } else {
    return interpolationSearch(arr, target);
  }
}
// when the algo is better than the built-in method
// When the array is not sorted and the target value is the first element in the array, binary search is better than linear search.
// When the array is sorted and the target value is the last element in the array, interpolation search is better than binary search.
// When the array is sorted and the target value is the first element in the array, jump search is better than binary search.
// When the array is sorted and the target value is the last element in the array, ternary search is better than binary search.
// When the array is sorted and the target value is the first element in the array, exponential search is better than binary search.
// When the array is sorted and the target value is the first element in the array, fibonacci search is better than binary search.
// When the array is sorted and the target value is the first element in the array, sublist search is better than linear search.