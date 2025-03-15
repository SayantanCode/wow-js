import { uniqueBy } from "../src/array/set.js";

// Example usage:
const objects = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 1, name: 'Charlie' },
    { id: 3, name: 'Bob' },
  ];
  
  // Unique by 'id'
  const uniqueById = uniqueBy(objects, 'id');
  console.log(uniqueById);
  // Output: [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }, { id: 3, name: 'Bob' }]
  
  // Unique by 'name'
  const uniqueByName = uniqueBy(objects, 'name');
  console.log(uniqueByName);
  // Output: [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }, { id: 1, name: 'Charlie' }]
  
  // Unique by a custom function (e.g., combining id and name)
  const uniqueByCombined = uniqueBy(objects, obj => `${obj.id}-${obj.name}`); 
  console.log(uniqueByCombined);
  // explanation of function: obj => `${obj.id}-${obj.name}` is a function that takes an object and returns a string that combines the id and name of the object.
  // how this works: The function is called for each object in the array, and the returned string is used as the key to determine uniqueness. 
  // If the same key is encountered again, the object is filtered out.
  // Output: [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }, { id: 1, name: 'Charlie' }, { id: 3, name: 'Bob' }]
  
  //Example with an array of primitives.
  const primitives = [1,2,2,3,4,4,5];
  const uniquePrimitives = uniqueBy(primitives, item=> item);
  console.log(uniquePrimitives);
  //Output: [1, 2, 3, 4, 5]