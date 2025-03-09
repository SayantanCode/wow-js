import fs from "fs";
import path from "path";
import util from "util";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logLevels = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
};
let customLogLevels = {};
let currentLogLevel = "info";
let logFormat = (level, message) => `[${new Date().toISOString()}] [${level.toUpperCase()}]: ${message}`;
let logContext = {};
let loggingPaused = false;
let autoFunctionName = false;
let silentErrors = false;
let logToFile = true;
let logToConsole = true;
let logFilePath = path.join(__dirname, "logs", "wow.log");
let logRotationSize = 5 * 1024 * 1024;
let customTransports = {};
let timers = {};
const ensureLogDirExists = () => {
  const logDir = path.dirname(logFilePath);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, {
      recursive: true
    });
  }
};
const rotateLogs = () => {
  if (fs.existsSync(logFilePath) && fs.statSync(logFilePath).size >= logRotationSize) {
    const rotatedFilePath = `${logFilePath}.${Date.now()}`;
    fs.renameSync(logFilePath, rotatedFilePath);
  }
};
const log = (context, level, ...args) => {
  if (loggingPaused || (logLevels[level] ?? customLogLevels[level]) < logLevels[currentLogLevel]) return;
  const functionName = autoFunctionName ? new Error().stack.split("\n")[3]?.trim().split(" ")[1] : "";
  const message = args.map(arg => typeof arg === "object" ? util.inspect(arg) : arg).join(" ");
  const formattedLog = logFormat(level, functionName ? `[${functionName}] ${message}` : message);
  if (logToConsole) {
    console[level] ? console[level](formattedLog) : console.log(formattedLog);
  }
  if (logToFile) {
    ensureLogDirExists();
    rotateLogs();
    fs.appendFile(logFilePath, formattedLog + "\n", err => {
      if (err && !silentErrors) throw err;
    });
  }
  Object.values(customTransports).forEach(transport => transport(level, formattedLog));
};
const context = Object.keys(logContext).length > 0 ? logContext : null;
const wowLog = {
  setLevel: level => {
    if (logLevels[level] !== undefined || customLogLevels[level] !== undefined) {
      currentLogLevel = level;
    }
  },
  format: formatFunction => {
    logFormat = formatFunction;
  },
  debug: (...args) => log(context, "debug", ...args),
  info: (...args) => log(context, "info", ...args),
  warn: (...args) => log(context, "warn", ...args),
  error: (...args) => log(context, "error", ...args),
  pause: () => {
    loggingPaused = true;
  },
  resume: () => {
    loggingPaused = false;
  },
  addContext: data => {
    logContext = {
      ...logContext,
      ...data
    };
  },
  clearContext: () => {
    logContext = {};
  },
  disable: () => {
    logToFile = false;
    logToConsole = false;
  },
  enableFileLogging: enabled => {
    logToFile = enabled;
  },
  enableConsoleLogging: enabled => {
    logToConsole = enabled;
  },
  setLogFilePath: filePath => {
    logFilePath = filePath;
    ensureLogDirExists();
  },
  setSilentErrors: silent => {
    silentErrors = silent;
  },
  setLogRotationSize: size => {
    logRotationSize = size;
  },
  addTransport: (name, transportFunction) => {
    customTransports[name] = transportFunction;
  },
  removeTransport: name => {
    delete customTransports[name];
  },
  defineCustomLevel: (level, priority) => {
    customLogLevels[level] = priority;
  },
  heading: (title = "Default Heading") => {
    const repeat = 40 - title.length;
    if (logToConsole) console.log("\n===", title.toUpperCase(), "=".repeat(repeat), "\n");
    if (logToFile) fs.appendFileSync(logFilePath, `\n=== ${title.toUpperCase()} ${"=".repeat(repeat)} ===\n`);
  },
  startTimer: label => {
    timers[label] = process.hrtime();
  },
  stopTimer: label => {
    if (!timers[label]) return;
    const diff = process.hrtime(timers[label]);
    const timeTaken = (diff[0] * 1e9 + diff[1]) / 1e6; // Convert to milliseconds
    wowLog.info(`${label} took ${timeTaken.toFixed(2)}ms`);
    delete timers[label];
  },
  setAutoFunctionName: enabled => {
    autoFunctionName = enabled;
  },
  persistConfig: () => {
    const config = {
      logFilePath,
      logRotationSize,
      logToFile,
      logToConsole,
      currentLogLevel,
      silentErrors,
      autoFunctionName
    };
    fs.writeFileSync(path.join(__dirname, "wow-log-config.json"), JSON.stringify(config, null, 2));
  },
  loadConfig: () => {
    try {
      const configPath = path.join(__dirname, "wow-log-config.json");
      if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
        logFilePath = config.logFilePath;
        logRotationSize = config.logRotationSize;
        logToFile = config.logToFile;
        logToConsole = config.logToConsole;
        currentLogLevel = config.currentLogLevel;
        silentErrors = config.silentErrors;
        autoFunctionName = config.autoFunctionName;
        ensureLogDirExists();
      }
    } catch (error) {
      if (!silentErrors) throw error;
    }
  }
};
wowLog.loadConfig();
export default wowLog;