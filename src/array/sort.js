// export const smartSort = (data, options = {}) => {
//   options = Object.assign(
//     {
//       deepSort: true, // Whether to sort deeply nested structures
//       key: null, // Key to sort objects by
//       order: "asc", // 'asc' or 'desc'
//       threshold: 20, // Switch to insertion sort if size is below this
//       detectSortedness: true, // Optimize based on pre-sorted %
//     },
//     options
//   );

//   const sortArray = (arr) => {
//     if (arr.length === 0) return arr;

//     // Ensure sorting by key for objects
//     if (typeof arr[0] === "object" && options.key) {
//       return sortByKey(arr);
//     }

//     if (options.detectSortedness && isSorted(arr)) {
//       return options.order === "desc" ? arr.reverse() : arr;
//     }

//     if (arr.length < options.threshold) {
//       return insertionSort(arr);
//     } else if (isNearlySorted(arr)) {
//       return timSort(arr);
//     } else {
//       return quickSort(arr);
//     }
//   };

// //   const deepSort = (data) => {
// //     if (Array.isArray(data)) {
// //       return sortArray(data.map((item) => deepSort(item)));
// //     } else if (typeof data === "object" && data !== null) {
// //       for (let key in data) {
// //         data[key] = deepSort(data[key]);
// //       }
// //     }
// //     return data;
// //   };

// const deepSort = (data, options) => {
//     if (Array.isArray(data)) {
//       let sortedData = data.map((item) => deepSort(item, options));

//       // Sort single values first, then arrays based on length
//       let singleValues = sortedData.filter((item) => !Array.isArray(item));
//       let arrays = sortedData.filter((item) => Array.isArray(item));

//       singleValues = sortArray(singleValues, { order: options.order }).sort((a, b) => {
//         return options.order === "asc" ? a - b : b - a;
//       });
//       arrays = sortArray(arrays, { order: options.order }).sort((a, b) => {
//         return options.order === "asc" ? a.length - b.length : b.length - a.length;
//       });

//       return [...singleValues, ...arrays];
//     } else if (typeof data === "object" && data !== null) {
//       for (let key in data) {
//         data[key] = deepSort(data[key], options);
//       }
//     }
//     return data;
//   };

//   const sortObject = (obj, options) => {
//     if (!options.deepSort) return obj;
//     for (let key in obj) {
//       if (
//         Array.isArray(obj[key]) ||
//         (typeof obj[key] === "object" && obj[key] !== null)
//       ) {
//         obj[key] = deepSort(obj[key], options);
//       }
//     }
//     return obj;
//   };

//   const getNestedValue = (obj, key) => {
//     return key
//       .replace(/\[([^\]]+)\]/g, ".$1") // Convert bracket notation to dot notation
//       .split(".") // Split into parts
//       .reduce((acc, part) => acc && acc[part], obj);
//   };

//   const compareValues = (a, b, keys, orders) => {
//     for (let i = 0; i < keys.length; i++) {
//       let key = keys[i];
//       let order = orders[i] || orders[0]; // Use order[i] if exists, else fallback to first order
//       let valueA = getNestedValue(a, key);
//       let valueB = getNestedValue(b, key);

//       if (valueA < valueB) return order === "asc" ? -1 : 1;
//       if (valueA > valueB) return order === "asc" ? 1 : -1;
//     }
//     return 0;
//   };

//   const sortByKey = (arr) => {
//     const keys = Array.isArray(options.key) ? options.key : [options.key];
//     const orders = Array.isArray(options.order)
//       ? options.order
//       : [options.order];
//     return arr.sort((a, b) => compareValues(a, b, keys, orders));
//   };

//   const quickSort = (arr) => {
//     if (arr.length <= 1) return arr;
//     let pivot = arr[arr.length - 1];
//     let left = [],
//       right = [];
//     for (let i = 0; i < arr.length - 1; i++) {
//       if (arr[i] < pivot) left.push(arr[i]);
//       else right.push(arr[i]);
//     }
//     return [...quickSort(left), pivot, ...quickSort(right)];
//   };

//   const insertionSort = (arr) => {
//     for (let i = 1; i < arr.length; i++) {
//       let key = arr[i],
//         j = i - 1;
//       while (j >= 0 && arr[j] > key) {
//         arr[j + 1] = arr[j];
//         j--;
//       }
//       arr[j + 1] = key;
//     }
//     return arr;
//   };

//   const timSort = (arr) => {
//     return arr.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
//   };

//   const isSorted = (arr) => {
//     for (let i = 1; i < arr.length; i++) {
//       if (arr[i - 1] > arr[i]) return false;
//     }
//     return true;
//   };

//   const isNearlySorted = (arr) => {
//     let sortedCount = 0;
//     for (let i = 1; i < arr.length; i++) {
//       if (arr[i - 1] <= arr[i]) sortedCount++;
//     }
//     return sortedCount / arr.length > 0.8;
//   };

//   if (Array.isArray(data)) {
//     return deepSort(data, options);
//   } else if (typeof data === "object" && data !== null) {
//     return sortObject(data, options);
//   }
//   return data;
// };

export const smartSort = (data, options = {}) => {
    options = Object.assign(
      {
        deepSort: true,
        key: null,
        order: "asc",
        threshold: 20,
        detectSortedness: true,
      },
      options
    );
  
    const sortArray = (arr) => {
      if (arr.length === 0) return arr;
  
      if (typeof arr[0] === "object" && options.key) {
        return sortByKey(arr);
      }
  
      if (options.detectSortedness && isSorted(arr)) {
        return options.order === "desc" ? arr.reverse() : arr;
      }
  
      if (arr.length < options.threshold) {
        return insertionSort(arr);
      } else if (isNearlySorted(arr)) {
        return timSort(arr);
      } else {
        return quickSort(arr);
      }
    };
  
    const deepSort = (data, options) => {
      if (Array.isArray(data)) {
        let sortedData = data.map((item) => deepSort(item, options));
  
        let singleValues = sortedData.filter((item) => !Array.isArray(item));
        let arrays = sortedData.filter((item) => Array.isArray(item));
  
        singleValues = sortArray(singleValues);
        arrays = arrays.map(sortArray);
        
        if (options.order === "asc") {
          arrays.sort((a, b) => a.length - b.length);
        } else {
          arrays.sort((a, b) => b.length - a.length);
        }
        
        return options.order === "asc" ? [...singleValues, ...arrays] : [...arrays, ...singleValues];
      } else if (typeof data === "object" && data !== null) {
        for (let key in data) {
          data[key] = deepSort(data[key], options);
        }
      }
      return data;
    };
    const getNestedValue = (obj, key) => {
        return key
          .replace(/\[([^\]]+)\]/g, ".$1")
          .split(".")
          .reduce((acc, part) => acc && acc[part], obj);
      };
    const sortObject = (obj, options) => {
      if (!options.deepSort) return obj;
      for (let key in obj) {
        if (
          Array.isArray(obj[key]) ||
          (typeof obj[key] === "object" && obj[key] !== null)
        ) {
          obj[key] = deepSort(obj[key], options);
        }
      }
      return obj;
    };
    const compareValues = (a, b, keys, orders) => {
        for (let i = 0; i < keys.length; i++) {
          let key = keys[i];
          let order = orders[i] || orders[0];
          let valueA = getNestedValue(a, key);
          let valueB = getNestedValue(b, key);
    
          if (valueA < valueB) return order === "asc" ? -1 : 1;
          if (valueA > valueB) return order === "asc" ? 1 : -1;
        }
        return 0;
      };
    const sortByKey = (arr) => {
        const keys = Array.isArray(options.key) ? options.key : [options.key];
        const orders = Array.isArray(options.order)
          ? options.order
          : [options.order];
        return arr.sort((a, b) => compareValues(a, b, keys, orders));
      };
    const quickSort = (arr) => {
      if (arr.length <= 1) return arr;
      let pivot = arr[arr.length - 1];
      let left = [],
        right = [];
      for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] < pivot) left.push(arr[i]);
        else right.push(arr[i]);
      }
      return [...quickSort(left), pivot, ...quickSort(right)];
    };
  
    const insertionSort = (arr) => {
      for (let i = 1; i < arr.length; i++) {
        let key = arr[i],
          j = i - 1;
        while (j >= 0 && arr[j] > key) {
          arr[j + 1] = arr[j];
          j--;
        }
        arr[j + 1] = key;
      }
      return arr;
    };
  
    const timSort = (arr) => {
      return arr.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
    };
  
    const isSorted = (arr) => {
      for (let i = 1; i < arr.length; i++) {
        if (arr[i - 1] > arr[i]) return false;
      }
      return true;
    };
  
    const isNearlySorted = (arr) => {
      let sortedCount = 0;
      for (let i = 1; i < arr.length; i++) {
        if (arr[i - 1] <= arr[i]) sortedCount++;
      }
      return sortedCount / arr.length > 0.8;
    };
  
    if (Array.isArray(data)) {
      return deepSort(data, options);
    } else if (typeof data === "object" && data !== null) {
      return sortObject(data, options);
    }
    return data;
  };
  