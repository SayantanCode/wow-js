import { wowLog } from "../src/index.js";
// wowLog.configure({
//   logLevel: "debug",
//   logFilePath: "./logs/wow.log",
//   logRotationSize: 5 * 1024 * 1024,
//   logToFile: true,
//   logToConsole: true,
//   silentErrors: false,
//   autoFunctionName: false,
// });
wowLog.setLevel("debug");
wowLog.info("This message will not have the context.");
wowLog.addContext({ context: "test" });
wowLog.info('This message will have the context.');
wowLog.clearContext();
wowLog.heading("Test Heading")
wowLog.startTimer("Check Load Time");
wowLog.info("Starting timer...");
wowLog.info("This is a test message.");
wowLog.error("This is an error message.");
wowLog.warn("This is a warning message.");
wowLog.debug("This is a debug message.");
wowLog.clearContext();
const interval = setInterval(() => {
  wowLog.info("This is a test2 message.");
}, 1000);
const promise = new Promise((resolve) => {
  setTimeout(() => {
    wowLog.clearContext();
    wowLog.stopTimer("Check Load Time");
    resolve();
  }, 15000);
});
promise.then(() => {
  clearInterval(interval);
  wowLog.info("Timer stopped.");
});

wowLog.addContext({ context: "test2" });
wowLog.info('This message will have the context.');

