// Bubble sort algorithm
export const bubbleSort = (arr, order) => {
  order = order.toString().toLowerCase();
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (
        order === "asc" || order === "1"
          ? arr[j] > arr[j + 1]
          : arr[j] < arr[j + 1]
      ) {
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
};

// Selection sort algorithm
export const selectionSort = (arr, order) => {
  order = order.toString().toLowerCase();
  for (let i = 0; i < arr.length; i++) {
    let minIndex = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (
        order === "asc" || order === "1"
          ? arr[j] < arr[minIndex]
          : arr[j] > arr[minIndex]
      ) {
        minIndex = j;
      }
    }
    if (minIndex !== i) {
      let temp = arr[i];
      arr[i] = arr[minIndex];
      arr[minIndex] = temp;
    }
  }
  return arr;
};

// Insertion sort algorithm
export const insertionSort = (arr, order) => {
  order = order.toString().toLowerCase();
  for (let i = 1; i < arr.length; i++) {
    let j = i;
    while (
      j > 0 &&
      (order === "asc" || order === "1"
        ? arr[j] < arr[j - 1]
        : arr[j] > arr[j - 1])
    ) {
      let temp = arr[j];
      arr[j] = arr[j - 1];
      arr[j - 1] = temp;
      j--;
    }
  }
  return arr;
};

// Shell sort algorithm
export const shellSort = (arr, order) => {
  order = order.toString().toLowerCase();
  for (let gap = Math.floor(arr.length / 2); gap > 0; gap /= 2) {
    for (let i = gap; i < arr.length; i += 1) {
      let j = i;
      let temp = arr[i];
      while (
        j >= gap &&
        (order === "asc" || order === "1"
          ? arr[j - gap] > temp
          : arr[j - gap] < temp)
      ) {
        arr[j] = arr[j - gap];
        j -= gap;
      }
      arr[j] = temp;
    }
  }
  return arr;
};

// Quick sort algorithm
export const quickSort = (arr, order) => {
  order = order.toString().toLowerCase();
  if (arr.length > 1) {
    const pivot = arr[arr.length - 1];
    const left = [];
    const right = [];
    for (let i = 0; i < arr.length - 1; i++) {
      if (order === "asc" || order === "1" ? arr[i] < pivot : arr[i] > pivot) {
        left.push(arr[i]);
      } else {
        right.push(arr[i]);
      }
    }
    return [...quickSort(left, order), pivot, ...quickSort(right, order)];
  } else {
    return arr;
  }
};

// Heap sort algorithm
export const heapSort = (arr, order) => {
  order = order.toString().toLowerCase();
  const n = arr.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i, order);
  }
  for (let i = n - 1; i >= 0; i--) {
    const temp = arr[0];
    arr[0] = arr[i];
    arr[i] = temp;
    heapify(arr, i, 0, order);
  }
  return arr;
};

const heapify = (arr, n, i, order) => {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;
  if (
    order === "asc" || order === "1"
      ? arr[left] > arr[largest]
      : arr[left] < arr[largest]
  ) {
    largest = left;
  }
  if (
    right < n &&
    (order === "asc" || order === "1"
      ? arr[right] > arr[largest]
      : arr[right] < arr[largest])
  ) {
    largest = right;
  }
  if (largest !== i) {
    const temp = arr[i];
    arr[i] = arr[largest];
    arr[largest] = temp;
    heapify(arr, n, largest, order);
  }
};

// Counting sort algorithm
export const countingSort = (arr, order) => {
  order = order.toString().toLowerCase();
  const max = Math.max(...arr);
  const min = Math.min(...arr);
  const count = new Array(max - min + 1).fill(0);
  for (let i = 0; i < arr.length; i++) {
    count[arr[i] - min]++;
  }
  let j = 0;
  for (let i = 0; i < count.length; i++) {
    while (count[i] > 0) {
      arr[j] = i + min;
      j++;
      count[i]--;
    }
  }
  return arr;
};

// Radix sort algorithm
export const radixSort = (arr, order) => {
  order = order.toString().toLowerCase();
  const max = Math.max(...arr);
  const min = Math.min(...arr);
  const maxDigit = max.toString().length;
  for (let i = 0; i < maxDigit; i++) {
    const buckets = Array.from({ length: 10 }, () => []);
    for (let j = 0; j < arr.length; j++) {
      const digit = Math.floor((arr[j] - min) / 10 ** i) % 10;
      buckets[digit].push(arr[j]);
    }
    arr = [].concat(...buckets);
  }
  return order === "asc" || order === "1" ? arr : arr.reverse();
};

// Merge sort algorithm
export const mergeSort = (arr, order) => {
  order = order.toString().toLowerCase();
  if (arr.length > 1) {
    const middle = Math.floor(arr.length / 2);
    const left = arr.slice(0, middle);
    const right = arr.slice(middle);
    return merge(mergeSort(left, order), mergeSort(right, order), order);
  } else {
    return arr;
  }
};

const merge = (left, right, order) => {
  const result = [];
  let leftIndex = 0;
  let rightIndex = 0;
  while (leftIndex < left.length && rightIndex < right.length) {
    if (
      order === "asc" || order === "1"
        ? left[leftIndex] < right[rightIndex]
        : left[leftIndex] > right[rightIndex]
    ) {
      result.push(left[leftIndex]);
      leftIndex++;
    } else {
      result.push(right[rightIndex]);
      rightIndex++;
    }
  }
  return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
};

// Description: This file contains the implementation of the sorting algorithms: bubble sort, quick sort, heap sort, counting sort, radix sort, and merge sort.
// When to use which sorting algorithm?
// Bubble sort: When the number of elements is small, and the list is nearly sorted.
// Quick sort: When the number of elements is large, and the list is not sorted.
// Heap sort: When the number of elements is large, and the list is not sorted.
// Counting sort: When the number of elements is large, and the list is not sorted.
// Radix sort: When the number of elements is large, and the list is not sorted.
// Merge sort: When the number of elements is large, and the list is not sorted.

// BigO: Bubble sort: O(n^2), Quick sort: O(nlog(n)), Heap sort: O(nlog(n)), Counting sort: O(n+k), Radix sort: O(nk), Merge sort: O(nlog(n))
// Space complexity: Bubble sort: O(1), Quick sort: O(log(n)), Heap sort: O(1), Counting sort: O(n+k), Radix sort: O(n+k), Merge sort: O(n)

// Reference: https://www.geeksforgeeks.org/sorting-algorithms/

// Quick vs Heap vs Merge vs Counting vs Radix sort
// Quick sort is faster than heap sort and merge sort in practice.
// Heap sort is faster than merge sort in practice.
// Merge sort is stable, while quick sort and heap sort are not stable.
// Counting sort and radix sort are non-comparison-based sorting algorithms.
// Counting sort is faster than radix sort when the range of elements is small.
// Radix sort is faster than counting sort when the range of elements is large.
// Merge sort is faster than quick sort and heap sort when the number of elements is large.
// Best use cases: Quick sort: general-purpose, Merge sort: linked lists, Heap sort: priority queues, Counting sort: small range, Radix sort: large range

// Most general-purpose sorting algorithms are comparison-based sorting algorithms.
// Comparison-based sorting algorithms have a lower bound of O(nlog(n)) for time complexity.
// Non-comparison-based sorting algorithms have a time complexity of O(n) or O(n+k).
// Non-comparison-based sorting algorithms are faster than comparison-based sorting algorithms for large datasets.
// Comparison-based sorting algorithms are faster than non-comparison-based sorting algorithms for small datasets.
// Non-comparison-based sorting algorithms are not suitable for all types of data.
// Comparison-based sorting algorithms are suitable for all types of data.
// Non-comparison-based sorting algorithms are stable.
// Comparison-based sorting algorithms are not stable.
// Non-comparison-based sorting algorithms are not in-place.
// Comparison-based sorting algorithms are in-place.

// In summary, comparison-based sorting algorithms are suitable for small datasets, while non-comparison-based sorting algorithms are suitable for large datasets.
// So it is essential to choose the right sorting algorithm based on the size of the dataset and the type of data.
// We prefer selection sort, bubble sort, and insertion sort for small datasets.
// We prefer quick sort, heap sort, merge sort, counting sort, and radix sort for large datasets.
// We prefer counting sort and radix sort for integer data.
// For smart sorting, we can use a combination of sorting algorithms based on the size of the dataset and the type of data.

export const smartSort = (arr, options = {}) => {
  const {
    order = "asc",
    type = "integer",
    algorithm = "auto",
    key = null,
    threshold = { small: 100, large: 1000 },
  } = options;

  const getValue = (item) => (key ? item[key] : item);

  if (algorithm === "auto") {
    if (type === "integer") {
      if (arr.length < threshold.small) {
        return countingSort(arr.map(getValue), order);
      } else {
        return radixSort(arr.map(getValue), order);
      }
    } else {
      if (arr.length < threshold.large) {
        return mergeSort(arr.map(getValue), order);
      } else {
        return quickSort(arr.map(getValue), order);
      }
    }
  } else {
    const sortAlgorithms = {
      bubble: bubbleSort,
      selection: selectionSort,
      insertion: insertionSort,
      merge: mergeSort,
      quick: quickSort,
      heap: heapSort,
      counting: countingSort,
      radix: radixSort,
    };

    if (!sortAlgorithms[algorithm]) {
      throw new Error(`Invalid sorting algorithm: ${algorithm}`);
    }

    return sortAlgorithms[algorithm](arr.map(getValue), order);
  }
};

// Basic js sort
export const basicSort = (arr, options = {}) => {
  const { order = "asc", key = null } = options;
  const getValue = (item) => (key ? item[key] : item);
  return arr.sort((a, b) => {
    const valueA = getValue(a);
    const valueB = getValue(b);
    return order === "asc" || order === "1" ? valueA - valueB : valueB - valueA;
  });
};

// Choose sort
export const chooseSort = (arr, options = {}) => {
  const { order = "asc", key = null, algorithm } = options;
  const sortAlgorithms = {
    bubble: bubbleSort,
    selection: selectionSort,
    insertion: insertionSort,
    merge: mergeSort,
    quick: quickSort,
    heap: heapSort,
    counting: countingSort,
    radix: radixSort,
  };
  if (!sortAlgorithms[algorithm]) {
    throw new Error(`Invalid sorting algorithm: ${algorithm}`);
  } else {
    return sortAlgorithms[algorithm](arr, order);
  }
};
