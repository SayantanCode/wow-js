import fs from "fs";
// import { promises as fsPromises } from 'fs';
import path from "path";
import util from "util";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logLevels = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}; // Log levels with priority
const timers = {}; // Object to store timers

let customLogLevels = {}; // Object to store custom log levels
let currentLogLevel = "info"; // Default log level
let logFormat = (level, message) => `[${new Date().toISOString()}] [${level.toUpperCase()}]: ${message}`; // Default log format
let logContext = {}; // Object to store log context data (e.g. user ID, request ID)
let loggingPaused = false; // Flag to pause logging
let autoFunctionName = false; // Flag to include function name in log messages
let silentErrors = false; // Flag to suppress errors
let logToFile = true; // Flag to enable file logging
let logToConsole = true; // Flag to enable console logging
let logFilePath = path.join(__dirname, "logs", "wow.log"); // Default log file path
let logRotationSize = 5 * 1024 * 1024; // Default log rotation size (5MB)
let customTransports = {}; // Object to store custom transports (e.g. logstash, sentry)

// Function to ensure log directory exists
const ensureLogDirExists = () => {
  const logDir = path.dirname(logFilePath);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
};

// Function to rotate logs
const rotateLogs = () => {
  if (fs.existsSync(logFilePath) && fs.statSync(logFilePath).size >= logRotationSize) {
    const rotatedFilePath = `${logFilePath}.${Date.now()}`;
    fs.renameSync(logFilePath, rotatedFilePath);
  }
};

// Function to log messages
const log = (level, ...args) => {
  if (loggingPaused || (logLevels[level] ?? customLogLevels[level]) < logLevels[currentLogLevel]) return;

  const functionName = autoFunctionName ? new Error().stack.split("\n")[3]?.trim().split(" ")[1] : "";
  const message = args.map(arg => (typeof arg === "object" ? util.inspect(arg) : arg)).join(" ");
  let formattedMessage = message;

  if (Object.keys(logContext).length > 0) {
    formattedMessage = `${JSON.stringify(logContext)} - ${message}`;
  }

  const formattedLog = logFormat(level, functionName ? `[${functionName}] ${formattedMessage}` : formattedMessage);

  if (logToConsole) {
    console[level] ? console[level](formattedLog) : console.log(formattedLog);
  }

  if (logToFile) {
    ensureLogDirExists();
    rotateLogs();
    try {
      fs.appendFileSync(logFilePath, formattedLog + "\n");
    } catch (err) {
      if (!silentErrors) throw err;
    }
  }

  Object.values(customTransports).forEach((transport) => transport(level, formattedLog));
};

// Function to create a heading
const heading = (title = "Default Heading") => {
  const repeat = 40 - title.length;
  const headingText = `\n ${"=".repeat(repeat)} ${title.toUpperCase()} ${"=".repeat(repeat)}\n`;

  if (logToConsole) {
    console.log("\n", "=".repeat(repeat), title.toUpperCase(), "=".repeat(repeat), "\n");
  }

  if (logToFile) {
    try {
      fs.appendFileSync(logFilePath, headingText);
    } catch (err) {
      if (!silentErrors) throw err;
    }
  }
};


// Function to start a timer
const startTimer = (label) => {
  timers[label] = process.hrtime();
};

// Function to stop a timer
const stopTimer = (label) => {
  if (!timers[label]) return;
  const diff = process.hrtime(timers[label]);
  const timeTaken = (diff[0] * 1e9 + diff[1]) / 1e6; // Convert to milliseconds
  log("info", `${label} took ${timeTaken.toFixed(2)}ms`);
  delete timers[label];
};

// Export the logger object
const wowLog = {
  setLevel: (level) => {
    if (logLevels[level] !== undefined || customLogLevels[level] !== undefined) {
      currentLogLevel = level;
    }
  },
  format: (formatFunction) => {
    logFormat = formatFunction;
  },
  debug: (...args) => log("debug", ...args),
  info: (...args) => log("info", ...args),
  warn: (...args) => log("warn", ...args),
  error: (...args) => log("error", ...args),
  pause: () => { loggingPaused = true; },
  resume: () => { loggingPaused = false; },
  addContext: (data) => { logContext = { ...logContext, ...data }; },
  clearContext: () => { logContext = {}; },
  disable: () => { logToFile = false; logToConsole = false; },
  enableFileLogging: (enabled) => { logToFile = enabled; },
  enableConsoleLogging: (enabled) => { logToConsole = enabled; },
  setLogFilePath: (filePath) => {
    logFilePath = filePath;
    ensureLogDirExists();
  },
  setSilentErrors: (silent) => { silentErrors = silent; },
  setLogRotationSize: (size) => { logRotationSize = size; },
  addTransport: (name, transportFunction) => { customTransports[name] = transportFunction; },
  removeTransport: (name) => { delete customTransports[name]; },
  defineCustomLevel: (level, priority) => { customLogLevels[level] = priority; },
  heading: (title = "Default Heading") => heading(title),
  startTimer,
  stopTimer,
  setAutoFunctionName: (enabled) => { autoFunctionName = enabled; },
  // persistConfig: () => {
  //   const config = {
  //     logFilePath,
  //     logRotationSize,
  //     logToFile,
  //     logToConsole,
  //     currentLogLevel,
  //     silentErrors,
  //     autoFunctionName,
  //   };
  //   fs.writeFileSync(path.join(__dirname, "wow-log-config.json"), JSON.stringify(config, null, 2));
  // },
};

// Function to load configuration from file
// const loadConfig = async () => {
//   try {
//     const configPath = path.join(__dirname, "wow-log-config.json");
//     if (fs.existsSync(configPath)) {
//       const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
//       logFilePath = config.logFilePath;
//       logRotationSize = config.logRotationSize;
//       logToFile = config.logToFile;
//       logToConsole = config.logToConsole;
//       currentLogLevel = config.currentLogLevel;
//       silentErrors = config.silentErrors;
//       autoFunctionName = config.autoFunctionName;
//       ensureLogDirExists();
//     }
//   } catch (error) {
//     if (!silentErrors) throw error;
//   }
// };

// Load configuration on startup
// (async () => {
//   await loadConfig();
// })();

export default wowLog;