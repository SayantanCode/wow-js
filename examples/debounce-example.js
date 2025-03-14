import { debounce } from "../src/functions/debounce.js";
// Example Usage:
const log = debounce((msg) => console.log(msg), 500, { immediate: true, maxWait: 2000 });
  
log("Hello");
setTimeout(() => log("World"), 100);  // Will be debounced
setTimeout(() => log("Again"), 700);  // Will execute after debounce delay
setTimeout(() => log.flush(), 1200);  // Force execution