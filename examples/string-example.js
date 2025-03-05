import { string } from "../src/index.js";
const myString = "....Hello";
const myHTML = "<p>This is a long HTML string.</p>";

console.log(
  string.trim(myString, {
    chars: ".",
  })
);

console.log(
  string.trim(myHTML, {
    length: 20,
    html: true,
    htmlSide: "end",
    pattern: "___",
  })
);
