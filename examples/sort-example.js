import { smartSort } from "../src/array/sort.js";

  // Example Usage
  const complexData = [ 15, 0, [3, 2], 9, 5, [1, 7, 3, [23, 6, 76], [0]], [4, 6, 4, 8], 2, 8, 6, 7 ];
  console.log(smartSort(complexData, {order: 'asc', deepSort: true }));
  
//   console.log(smartSort(complexData, { key: 'value', order: 'desc', deepSort: true }));
  
  
  // Example Usage
  const people = [
    { name: 'Alice', age: 25 },
    { name: 'Bob', age: 22 },
    { name: 'Charlie', age: 30 },
    { name: 'David', age: 28 },
  ];
  console.log(JSON.stringify(smartSort(people, { key: 'name', order: 'desc' })));
  const profile = [
    { name: 'Alice', profileDetails: { name: 'Alice', age: 25, city: 'New York' } },
    { name: 'Charlie', profileDetails: { name: 'Charlie', age: 30, city: 'Los Angeles' } },
    { name: 'Bob', profileDetails: { name: 'Bob', age: 22, city: 'San Francisco' } },
    { name: 'David', profileDetails: { name: 'David', age: 28, city: 'Chicago' } },
    { name: 'Alice', profileDetails: { name: 'Alice', age: 20, city: 'New York' } },
  ];
//   console.log(JSON.stringify(smartSort(profile, { key: ['name', 'profileDetails[age]'], order: ['asc', 'desc'] })));

  const multipleLevels = [
    { name: 'Alice', profileDetails: { name: 'Alice', age: 25, city: { name: 'New York', state: 'NY' } } },
    { name: 'Bob', profileDetails: { name: 'Bob', age: 22, city: { name: 'San Francisco', state: 'CA' } } },
    { name: 'David', profileDetails: { name: 'David', age: 28, city: { name: 'Chicago', state: 'IL' } } },
    { name: 'Charlie', profileDetails: { name: 'Charlie', age: 30, city: { name: 'Los Angeles', state: 'CA' } } },
    { name: 'Alice', profileDetails: { name: 'Alice', age: 20, city: { name: 'Chicago', state: 'IL' } } },
  ];
  console.log(JSON.stringify(smartSort(multipleLevels, { key: ['name', 'profileDetails[city][name]'], order: ['asc', 'asc'] }))); // preference to 1st key value but in case of tie in 1st key value give preference to 2nd key value
[   2,
    5,
    6,
    7,
    8,
    9,
    15,
    [ 2, 3 ],
    [ 4, 4, 6, 8 ],
    [ 1, 3, 7, [ 6, 23, 76 ] ], 
  ]