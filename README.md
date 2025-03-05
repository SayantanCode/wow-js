# wow-js

## Overview
`wow-js` is a powerful and highly customizable utility library designed to simplify common JavaScript operations. It provides multiple helper functions for strings, objects, arrays, and everyday tasks. The package also includes:

- **wowLog**: A feature-rich logging system with custom log levels, file rotation, console logging, and persistent settings.
- **consoleColor**: A simple way to add color to console output for better readability.

## Installation
To install `wow-js`, use npm or yarn:

```sh
npm install wow-js
```

or

```sh
yarn add wow-js
```

## Importing
Since `wow-js` uses ES modules, you can import it as follows:

```js
import { wowLog, consoleColor, stringUtils, arrayUtils, objectUtils } from "wow-js";
```

---

# wowLog - Advanced Logging System

### Features:
- Custom log levels
- Console and file logging
- Log rotation (optional)
- Timestamp customization
- Contextual logging
- Persistent configurations
- Ability to pause and resume logging
- Support for custom transports
- Silent errors option

### Setup
Default setup works without configuration:

```js
wowLog.info("This is a log message");
```

To customize the logger:

```js
wowLog.setLogFilePath("./custom-logs/app.log");
wowLog.setLogRotationSize(10 * 1024 * 1024); // 10MB rotation
wowLog.setLevel("debug");
```

### Logging Methods
```js
wowLog.debug("Debug message");
wowLog.info("Info message");
wowLog.warn("Warning message");
wowLog.error("Error message");
```

### Custom Log Levels
```js
wowLog.defineCustomLevel("critical", 4);
wowLog.critical("Critical system failure!");
```

### File & Console Control
```js
wowLog.enableFileLogging(false); // Disable file logging
wowLog.enableConsoleLogging(true); // Enable console logging
```

### Contextual Logging
```js
wowLog.addContext({ user: "JohnDoe" });
wowLog.info("User logged in");
wowLog.clearContext();
```

### Log Rotation
```js
wowLog.setLogRotationSize(5 * 1024 * 1024); // Rotate at 5MB
```

### Persistent Configuration
Settings persist even after restart:
```js
wowLog.persistConfig();
```

To load settings on startup:
```js
wowLog.loadConfig();
```

### Timer Utility
```js
const timerId = wowLog.startTimer();
setTimeout(() => {
  wowLog.stopTimer(timerId, "Operation completed in");
}, 2000);
```

### Automatic Function Name Logging
```js
wowLog.setAutoFunctionName(true);
function testFunc() {
  wowLog.info("Inside function");
}
testFunc();
```

---

# consoleColor - Styled Console Output

### Usage
```js
console.log(consoleColor.red("This is red text"));
console.log(consoleColor.green("This is green text"));
```

Available Colors:
- `red`
- `green`
- `yellow`
- `blue`
- `magenta`
- `cyan`
- `white`

---

# Utility Functions

## String Utilities (`stringUtils`)
```js
stringUtils.capitalize("hello world"); // "Hello World"
stringUtils.camelCase("hello world"); // "helloWorld"
```

## Array Utilities (`arrayUtils`)
```js
arrayUtils.unique([1, 2, 2, 3]); // [1, 2, 3]
arrayUtils.shuffle([1, 2, 3, 4]);
```

## Object Utilities (`objectUtils`)
```js
objectUtils.deepMerge({ a: 1 }, { b: 2 });
objectUtils.cloneDeep({ key: "value" });
```

---

# License
MIT License

Copyright (c) 2025 Sayantan Chakraborty

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

