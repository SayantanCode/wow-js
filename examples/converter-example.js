import { convert } from "../src/functions/converter.js";

// Simple usage
console.log(convert({ from: "10 hr 20 mn 30 sec", to: "minutes", type: "time" })); // 3600
console.log(convert({ from: "1 mn", to: "seconds", type: "time" })); // 60
console.log(convert({ from: "1 second", to: "seconds", type: "time" })); // 1
console.log(convert({ from: "8:30pm @Asia/Kolkata", to: "min", type: "time" })); // Timezone conversion example

//test pass **dont change this format for now**
console.log(convert({ from: ["17/03/2024, 6:30 AM @Asia/Calcutta", "17/04/2024, 22:30"], to: "hours", type: "time" })); // Date with timezone
console.log(convert({ from: ["20/03/2025, 6:30 AM", "now"], to: "hours", type: "time" })); // Date with timezone
console.log(convert({ from: ["17th March, 2024, 6:30 AM @Asia/Calcutta",
    "18th April, 2024, 6:30 AM @Asia/Calcutta"], to:"hours", type:"time"})); // Date with timezone
console.log(convert({ from: ["now", '6:30 PM'], to: "hr", type: "time" }));
// // Examples with "now":
// console.log(convert({from:["now@Asia/Kolkata", "1 hour"], to: "mn", type: "time"})); // Difference between now and one hour from now
// console.log(convertTime(["09:00@EST", "now@PST"], "minutes")); // Difference between 9 AM EST and current time in PST
// console.log(convertTime(["now@Asia/Kolkata", "10 minutes"], "seconds")); // Difference between current time in Kolkata and 10 minutes from then
// console.log(convertTime(["now", "now"], "seconds")); // Should be 0

// // Example with a specific future time from now:
// const futureTime = new Date(Date.now() + 3600000); // 1 hour in the future
// const futureTimeString = `${futureTime.getHours().toString().padStart(2, '0')}:${futureTime.getMinutes().toString().padStart(2, '0')}:${futureTime.getSeconds().toString().padStart(2, '0')}`;
// console.log(convert({ from: ["now", futureTimeString], to: "seconds", type: "time" }));

// // Example where "now" is the start time with a timezone:
// console.log(convertTime(["now@Europe/London", "1 hour"], "seconds"));

// // Example where "now" is the end time with a timezone:
// console.log(convertTime(["22:00@UTC", "now@America/New_York"], "seconds"));
// console.log(convert({from:["18th March 2025, 08:00PM@Asia/Kolkata", "now@Asia/Kolkata"], to: "hr", type: "time"}));