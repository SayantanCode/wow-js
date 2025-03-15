import { advancedFind } from "../src/array/find.js";

  
  // Example usage:
  const users = [
    { id: 1, name: 'Alice', age: 30 },
    { id: 2, name: 'Bob', age: 25 },
    { id: 3, name: 'Charlie', age: 30 },
    { id: 4, name: 'David', age: 28 },
  ];
  
  // Find a single user by ID:
  const userUndefined = advancedFind(users, { id: 5 });
  console.log('User undefined:', userUndefined);
  
    const user = advancedFind(users, { id: 2 });
    console.log(`User ${user?.name}:`, user);

  // Find users with age 30:
  const users30 = advancedFind(users, { age: 30 }, { findAll: true });
  console.log('Users aged 30:', users30);
  
  // Find the index of the first user with age 30:
  const index30 = advancedFind(users, { age: 30 }, { useIndex: true });
  console.log('Index of first user aged 30:', index30);
  
  // Find all indices of users with age 30:
  const indices30 = advancedFind(users, { age: 30 }, { useIndex: true, findAll: true });
  console.log('Indices of users aged 30:', indices30);
  
  // Find using a custom predicate function:
  const youngUsers = advancedFind(users, (user) => user.age < "28", { findAll: true });
  console.log('Young users:', youngUsers);
  
  //Transform data before comparison
  const transformedUsers = advancedFind(users, {name: 'ALICE'}, {findAll:true, transform: (user) => { return {id: user.id, name: user.name.toUpperCase(), age: user.age}}});
  console.log("Transformed users", transformedUsers);
  
  //Find Index using transform.
  const transformedIndex = advancedFind(users, {name: 'ALICE'}, {useIndex: true, transform: (user) => { return {id: user.id, name: user.name.toUpperCase(), age: user.age}}});
  console.log("Transformed index", transformedIndex);