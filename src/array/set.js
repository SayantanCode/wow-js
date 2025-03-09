// unique, intersection, union, difference, symmetricDifference
export const unique = (arr) => [...new Set(arr)];
export const intersection = (arr1, arr2) =>
  arr1.filter((value) => arr2.includes(value));
export const union = (arr1, arr2) => [...new Set([...arr1, ...arr2])];
export const difference = (arr1, arr2) =>
  arr1.filter((value) => !arr2.includes(value));
export const symmetricDifference = (arr1, arr2) => [
  ...new Set(
    [...arr1, ...arr2].filter(
      (value) => !arr1.includes(value) || !arr2.includes(value)
    )
  ),
];