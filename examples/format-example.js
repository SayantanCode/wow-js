import formatDate  from "../src/functions/format.js";
// Example Usage
console.log("1. " + formatDate("2023-10-27 10:30:00", "DD/MM/YYYY hh:mm a"));
console.log(
  "2. " + formatDate(new Date(2023, 9, 27, 10, 30, 0), "DD MMMM YYYY")
);
console.log("3. " + formatDate("10/27/2023", "YYYY-MM-DD"));
console.log("4. " + formatDate("27/10/2023 14:45:15", "HH:mm DD-MM-YYYY"));
console.log(
  "5. " + formatDate("2024-01-15T12:00:00Z", "YYYY-MM-DD HH:mm:ss Z")
);
console.log(
  "6. " + formatDate("2024-01-15T12:00:00+05:30", "YYYY-MM-DD HH:mm:ss ZZ")
);
console.log(
  "7. " + formatDate("Fri, 26 Jan 2024 10:00:00 +0000", "YYYY-MM-DD HH:mm:ss Z")
);
console.log(
  "8. " + formatDate("Fri Jan 26 10:00:00 2024", "YYYY-MM-DD HH:mm:ss")
);
console.log("9. " + formatDate("26 Jan 2024 10:00:00", "YYYY-MM-DD HH:mm:ss"));
console.log("10. " + formatDate("2024012610000", "YYYY-MM-DD, HH:mm:ss"));
console.log(
  "11. " + formatDate(new Date(1677648000000), "DDO MMM, YYYY HH:mm:ss")
); // Unix timestamp
console.log(
  "12. " + formatDate("2025-03-08T09:30:00", "dddd, DD MMMM YYYY, h:mm A")
); // More comprehensive test
console.log(
  "13. " + formatDate("2023-12-31T23:59:59.999Z", "YYYY-MM-DD HH:mm:ss.SSS Z")
);
console.log("14. " + formatDate("2024-02-29T12:00:00", "MMMM D, YYYY")); // Leap year test
console.log("15. " + formatDate("Invalid Date", "YYYY-MM-DD")); // Test with invalid date string
console.log("16. " + formatDate(new Date(), "YYYY-MM-DD HH:mm:ss GMT(Z)")); // Current date/time
