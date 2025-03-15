import { smartSearch } from "../src/functions/smartSearch.js";

const users = [
  { name: "Bob", age: 29 },
  { name: "Alice", age: 25 },
  { name: "Charlie", age: 35 },
  ];
  
  const query = { age: { $gt: 20}, age: { $lt: 30 } };
  const options = {fuzzySearch: false, sort:true, sortBy: "age", order: "asc"};
  const results = smartSearch(users, query, options);
  console.log(results);
  
  const query2 = { name: "li" };
  const options2 = {fuzzySearch: false, fuzzyThreshold: 2, sort:false, substringSearch:true};
  const results2 = smartSearch(users, query2, options2);
  console.log("fuzzy",results2);

  const veryComplexBooksData = [
    // one book which has tag bestseller and mystery
    {
      title: "The Da Vinci Code",
      author: "Dan Brown",
      genre: "Mystery",
      year: 2003,
      details: {rating: 4.5, reviews: 1000},
      tag: ["bestseller", "mystery"],
    },
    {
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      genre: "Classic",
      year: 1925,
      details: {rating: 4.5, reviews: 2000},
      tag: ["bestseller", "classic"],
    },
    {
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      genre: "Classic",
      year: 1960,
      details: {rating: 4.8, reviews: 1500},
      tag: ["bestseller", "classic"],
    },
    {
      title: "1984",
      author: "George Orwell",
      genre: "Dystopian",
      year: 1949,
      details: {rating: 4.3, reviews: 3000},
      tag: ["bestseller", "classic"],
    },
    {
      title: "Pride and Prejudice",
      author: "Jane Austen",
      genre: "Romance",
      year: 1813,
      details: {rating: 4.2, reviews: 2500},
      tag: ["bestseller", "classic"],
    },
    {
      title: "Animal Farm",
      author: "George Orwell",
      genre: "Dystopian",
      year: 1945,
      details: {rating: 4.1, reviews: 1800},
      tag: ["bestseller", "classic"],
    },
    {
      title: "Brave New World",
      author: "Aldous Huxley",
      genre: "Dystopian",
      year: 1932,
      details: {rating: 4.0, reviews: 2200},
      tag: ["bestseller", "classic"],
    },
    //low rating
    {
      title: "The Catcher in the Rye",
      author: "J.D. Salinger",
      genre: "Classic",
      year: 1951,
      details: {rating: 3.5, reviews: 1000},
      tag: ["classic"],
    },
    {
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      genre: "Fantasy",
      year: 1937,
      details: {rating: 3.8, reviews: 1500},
      tag: ["bestseller", "fantasy"],
    },
    {
      title: "The Lord of the Rings",
      author: "J.R.R. Tolkien",
      genre: "Fantasy",
      year: 1954,
      details: {rating: 4.2, reviews: 2000},
      tag: ["bestseller", "fantasy"],
    },
    //low reviews
    {
      title: "The Picture of Dorian Gray",
      author: "Oscar Wilde",
      genre: "Classic",
      year: 1890,
      details: {rating: 4.0, reviews: null},
      tag: ["classic"],
    },
  ];
  const query3 = { author: "George Orwell", genre: "Dystopian", year: { $gt: 1940 } };
  const options3 = {fuzzySearch: false, sort:true, sortBy: "year", order: "asc"};
  const results3 = smartSearch(veryComplexBooksData, query3, options3);
  console.log(results3);

  // search by ratings 4.5 and above
  const query4 = { "details.rating": { $gte: 4.5 }} ;
  const options4 = {fuzzySearch: false, sort:true, sortBy: "details.rating", order: "asc"};
  const results4 = smartSearch(veryComplexBooksData, query4, options4);
  console.log(results4);
  // search by tag
  const query5 = { tag: { $in: ["bestseller", "classic"] }}; // when both tags are present
  const query6 = {
    $or: [
        { tag: { $in: ["classic"] } },
        { tag: { $in: ["fantasy"] } },
    ],
}; // when either of the tags is present
  const options5 = {fuzzySearch: false, sort:true, sortBy: "details.rating", order: "desc"};
  const results5 = smartSearch(veryComplexBooksData, query5, options5);
  console.log(results5);
  const results6 = smartSearch(veryComplexBooksData, query6, options5);
  console.log(results6);