import { smartSort } from "../src/array/sort.js";

  // Example Usage
//   const complexData = [[[[[{ value: 3 }, { value: 1 }], [{ value: 2 }]]]]];
  
//   console.log(smartSort(complexData, { key: 'value', order: 'asc', deepSort: true }));
  
  
  // Example Usage
  const people = [
    { name: 'Alice', age: 25 },
    { name: 'Bob', age: 22 },
    { name: 'Charlie', age: 30 },
    { name: 'David', age: 28 },
  ];

  const profile = [
    { name: 'Alice', profileDetails: { name: 'Alice', age: 25, city: 'New York' } },
    { name: 'Charlie', profileDetails: { name: 'Charlie', age: 30, city: 'Los Angeles' } },
    { name: 'Bob', profileDetails: { name: 'Bob', age: 22, city: 'San Francisco' } },
    { name: 'David', profileDetails: { name: 'David', age: 28, city: 'Chicago' } },
    { name: 'Alice', profileDetails: { name: 'Alice', age: 20, city: 'New York' } },
  ];

  const multipleLevels = [
    { name: 'Alice', profileDetails: { name: 'Alice', age: 25, city: { name: 'New York', state: 'NY' } } },
    { name: 'Bob', profileDetails: { name: 'Bob', age: 22, city: { name: 'San Francisco', state: 'CA' } } },
    { name: 'Charlie', profileDetails: { name: 'Charlie', age: 30, city: { name: 'Los Angeles', state: 'CA' } } },
    { name: 'David', profileDetails: { name: 'David', age: 28, city: { name: 'Chicago', state: 'IL' } } },
  ];
  
  console.log(JSON.stringify(smartSort(profile, { key: ['name', 'profileDetails[age]'], order: ['asc', 'desc'] })));