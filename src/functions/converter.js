/**
 * Converts a time string to a desired output unit.
 * Supports inputs in the format "12:30 PM", "12hr 30min 10sec", "12 hr 30 min 10 sec", "12:30:10", "12 hr 30 min", etc.
 * Supports direct time units (e.g., "12 hr 30 min 10 sec").
 * Supports timezone conversion using the "timezone" parameter.
 * Returns the converted time in the requested output unit (default is "seconds").
 * @param {string} input The time string to be converted.
 * @param {string} [outputUnit="seconds"] The desired output unit. Can be "hours", "minutes", or "seconds".
 * @param {string} [timezone="UTC"] The timezone to use for timezone conversion.
 * @returns {number} The converted time in the requested output unit.
 */

// Examples:
// console.log(convertTime("12 hr 30 min 10 sec", "seconds")); // 45010
// console.log(convertTime("6:30 PM", "seconds", "Asia/Kolkata")); // Timezone conversion example
// console.log(convertTime("16 Mar 2024, 6:30 PM", "minutes", "America/New_York")); // Date with timezone
// console.log(convertTime("20:05:50", "seconds")); // 72350

const TIMEZONE_REGEX = /@([A-Za-z/_-]+)$/;
// const DATE_TIME_REGEX = /(\d{1,2}(?:st|nd|rd|th)?(?:\s\w+)+?),?\s*(\d{4})?,?\s*(\d{1,2}:\d{2}\s?(?:AM|PM|am|pm)?)?/;

const VALID_TIMEZONES = Intl.supportedValuesOf
  ? Intl.supportedValuesOf("timeZone")
  : ["UTC", "Asia/Kolkata", "America/New_York", "Europe/London"];
const MONTHS_MAP = {
  jan: "January",
  feb: "February",
  mar: "March",
  apr: "April",
  may: "May",
  jun: "June",
  jul: "July",
  aug: "August",
  sep: "September",
  oct: "October",
  nov: "November",
  dec: "December",
};
// List of regex patterns to match different datetime formats
const DATE_PATTERNS = [
  {
    regex: /^now$/i, // "now" or "NOW" in any case
    format: "Now Format",
  },
  {
    regex:
      /^(\d{1,2})(st|nd|rd|th)?\s+([A-Za-z]+),?\s+(\d{4}),?\s+(\d{1,2}:\d{2}\s?(?:AM|PM|Am|Pm|am|pm)?)?$/,
    format: "Ordinal Date with Year",
  },
  {
    regex:
      /^([A-Za-z]+)\s+(\d{1,2}),?\s+(\d{4}),?\s+(\d{1,2}:\d{2}\s?(?:AM|PM|Am|Pm|am|pm)?)?$/,
    format: "Month First Format",
  },
  {
    regex:
      /^(\d{2})\/(\d{2})\/(\d{4}),?\s+(\d{1,2}:\d{2}\s?(?:AM|PM|Am|Pm|am|pm)?)?$/,
    format: "DD/MM/YYYY Format",
  },
  {
    regex:
      /^(\d{4})-(\d{2})-(\d{2})\s+(\d{1,2}:\d{2}\s?(?:AM|PM|Am|Pm|am|pm)?)?$/,
    format: "YYYY-MM-DD Format",
  },
  {
    regex:
      /^(\d{1,2}:\d{2}\s?(?:AM|PM|Am|Pm|am|pm)?)$/,
    format: "Only Time Format",
  },
  {
    regex: /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z)$/,
    format: "MongoDB ISO 8601 Format",
  },
];

const parseDateTime = (input, defaultZone = "UTC", referenceDate = new Date()) => {
  let timeZone = defaultZone;
  let matchZone = input.match(TIMEZONE_REGEX);
  if (matchZone) {
    timeZone = matchZone[1].trim();
    if (!VALID_TIMEZONES.includes(timeZone)) {
      console.warn(`Unknown timezone. Assuming UTC.`);
      timeZone = "UTC";
    }
  }

  let datePart = null,
    yearPart = null,
    timePart = "00:00 AM"; // Default values
  for (let pattern of DATE_PATTERNS) {
    let match = input.replace(TIMEZONE_REGEX, "").trim().match(pattern.regex);
    if (match) {
      //   console.log(`Matched Format: ${pattern.format}`);

      switch (pattern.format) {
        case "Now Format":
          return new Date(new Date().toLocaleString("en-US", { timeZone }));
        case "Ordinal Date with Year":
          datePart = `${match[1]} ${MONTHS_MAP[match[3].toLowerCase()] || match[3]}`;
          yearPart = match[4];
          timePart = match[5] || "00:00 AM";
          break;
        case "Month First Format":
          datePart = `${match[2]} ${match[1]}`;
          yearPart = match[3];
          timePart = match[4] || "00:00 AM";
          break;
        case "DD/MM/YYYY Format":
          datePart = `${match[2]} ${MONTHS_MAP[match[1].toLowerCase()] || match[1]}`;
          yearPart = match[3];
          timePart = match[4] || "00:00 AM";
          break;
        case "YYYY-MM-DD Format":
          datePart = `${match[3]} ${match[2]}`;
          yearPart = match[1];
          timePart = match[4] || "00:00 AM";
          break;
        case "Only Time Format":
          if (!referenceDate)
            throw new Error(
              "A reference date is required when only time is provided."
            );
          datePart =
            referenceDate.getDate() +
            " " +
            referenceDate.toLocaleString("en-US", { month: "long" });
          yearPart = referenceDate.getFullYear();
          timePart = match[1];
          break;
        case "MongoDB ISO 8601 Format":
          // datePart = new Date(match[1]).toLocaleString('en-US', { month: 'long' });
          // yearPart = new Date(match[1]).getFullYear();
          // timePart = new Date(match[1]).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
          // break;
          return new Date(
            new Date(match[1]).toLocaleString("en-US", { timeZone })
          ); // Directly convert MongoDB ISO 8601 format
      }
      break; // Stop checking after first successful match
    }
  }

  if (!datePart) throw new Error(`Invalid datetime format: ${input}`);

  let normalizedDate = datePart.replace(/(\d+)(st|nd|rd|th)/, "$1"); // Remove ordinal suffix
  let finalDateStr = `${normalizedDate}, ${yearPart} ${timePart}`;

  let dateObj = new Date(finalDateStr);
  return new Date(dateObj.toLocaleString("en-US", { timeZone }));
};

const calculateTimeDifference = ([startInput, endInput], unit, withUnits=false) => {
  let startZone = startInput.match(TIMEZONE_REGEX)?.[1] || "UTC";
  let endZone = endInput.match(TIMEZONE_REGEX)?.[1] || startZone;

  if (!startInput.includes("@")) startInput += ` @${endZone}`;
  if (!endInput.includes("@")) endInput += ` @${startZone}`;

  const startDateTime = parseDateTime(startInput, startZone);
  const endDateTime = parseDateTime(endInput, endZone);
    // console.log(`startDateTime: ${startDateTime}, endDateTime: ${endDateTime}`);
  let diffMs = endDateTime - startDateTime;

  switch (unit) {
    case "years":
      return withUnits ? `${endDateTime.getFullYear() - startDateTime.getFullYear()} years` : endDateTime.getFullYear() - startDateTime.getFullYear();
    case "year":
      return withUnits ? `${endDateTime.getFullYear() - startDateTime.getFullYear()} year` : endDateTime.getFullYear() - startDateTime.getFullYear();
    case "yrs":
      return withUnits ? `${endDateTime.getFullYear() - startDateTime.getFullYear()} yrs` : endDateTime.getFullYear() - startDateTime.getFullYear();
    case "yr":
      return withUnits ? `${endDateTime.getFullYear() - startDateTime.getFullYear()} yr` : endDateTime.getFullYear() - startDateTime.getFullYear();
    case "months":
      return (
        withUnits ? `${(endDateTime.getFullYear() - startDateTime.getFullYear()) * 12 + (endDateTime.getMonth() - startDateTime.getMonth())} months` :
        (endDateTime.getFullYear() - startDateTime.getFullYear()) * 12 +
        (endDateTime.getMonth() - startDateTime.getMonth())
      );
    case "month":
      return (
        withUnits ? `${(endDateTime.getFullYear() - startDateTime.getFullYear()) * 12 + (endDateTime.getMonth() - startDateTime.getMonth())} month` :
        (endDateTime.getFullYear() - startDateTime.getFullYear()) * 12 +
        (endDateTime.getMonth() - startDateTime.getMonth())
      );
    case "mths":
      return (
        withUnits ? `${(endDateTime.getFullYear() - startDateTime.getFullYear()) * 12 + (endDateTime.getMonth() - startDateTime.getMonth())} mths` :
        (endDateTime.getFullYear() - startDateTime.getFullYear()) * 12 +
        (endDateTime.getMonth() - startDateTime.getMonth())
      );
    case "mth":
      return (
        withUnits ? `${(endDateTime.getFullYear() - startDateTime.getFullYear()) * 12 + (endDateTime.getMonth() - startDateTime.getMonth())} mth` :
        (endDateTime.getFullYear() - startDateTime.getFullYear()) * 12 +
        (endDateTime.getMonth() - startDateTime.getMonth())
      );
    case "days":
      return withUnits ? `${diffMs / (1000 * 60 * 60 * 24)} days` : diffMs / (1000 * 60 * 60 * 24);
    case "day":
      return withUnits ? `${diffMs / (1000 * 60 * 60 * 24)} day` : diffMs / (1000 * 60 * 60 * 24);
    case "dys":
      return withUnits ? `${diffMs / (1000 * 60 * 60 * 24)} dys` : diffMs / (1000 * 60 * 60 * 24);
    case "dy":
      return withUnits ? `${diffMs / (1000 * 60 * 60 * 24)} dy` : diffMs / (1000 * 60 * 60 * 24);
    case "hours":
      return withUnits ? `${diffMs / (1000 * 60 * 60)} hours` : diffMs / (1000 * 60 * 60);
    case "hour":
      return withUnits ? `${diffMs / (1000 * 60 * 60)} hour` : diffMs / (1000 * 60 * 60);
    case "hr":
      return withUnits ? `${diffMs / (1000 * 60 * 60)} hr` : diffMs / (1000 * 60 * 60);
    case "minutes":
      return withUnits ? `${diffMs / (1000 * 60)} minutes` : diffMs / (1000 * 60);
    case "minute":
      return withUnits ? `${diffMs / (1000 * 60)} minute` : diffMs / (1000 * 60);
    case "min":
      return withUnits ? `${diffMs / (1000 * 60)} min` : diffMs / (1000 * 60);
    case "seconds":
      return withUnits ? `${diffMs / 1000} seconds` : diffMs / 1000;
    case "second":
      return withUnits ? `${diffMs / 1000} second` : diffMs / 1000;
    case "sec":
      return withUnits ? `${diffMs / 1000} sec` : diffMs / 1000;
    case "sc":
      return withUnits ? `${diffMs / 1000} sc` : diffMs / 1000;
    default:
      throw new Error(
        "Invalid unit. Choose from: years, months, days, hours, minutes, seconds."
      );
  }
};

const parseDateTimeString = (dateTimeString) => {
    let normalizedInput = dateTimeString.replace(/\s+/g, " ").trim();

    if (normalizedInput.toLowerCase() === "now") {
        // Get current time
        const now = new Date();
        const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        return Math.floor((now - midnight) / 1000); // Seconds since midnight
    }

    // Handle time formats like "08:00PM@Asia/Kolkata"
    const timeMatch = normalizedInput.match(
        /(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?\s*(?:@([a-zA-Z/_]+))?/i
    );

    if (timeMatch) {
        let [_, hh, mm, ss, period] = timeMatch;
        hh = Number(hh);
        mm = Number(mm);
        ss = ss ? Number(ss) : 0;

        if (period) {
            if (period.toUpperCase() === "PM" && hh < 12) hh += 12;
            if (period.toUpperCase() === "AM" && hh === 12) hh = 0;
        }

        const midnight = new Date();
        midnight.setHours(0, 0, 0, 0); // Midnight today

        const dateObj = new Date(midnight);
        dateObj.setHours(hh, mm, ss);

        return Math.floor((dateObj - midnight) / 1000); // Seconds since midnight
    }

    // Handle durations like "2 hours 30 minutes"
    const timeUnits = {
        hr: 3600, hour: 3600, hours: 3600,
        min: 60, minute: 60, minutes: 60, mn: 60,
        sec: 1, second: 1, seconds: 1, sc: 1
    };

    const durationMatch = normalizedInput.match(/(\d+)\s*(hr|hour|hours|min|minute|minutes|mn|sec|second|seconds|sc)/gi);
    if (durationMatch) {
        return durationMatch.reduce((total, match) => {
            let [value, unit] = match.split(/\s+/);
            return total + Number(value) * timeUnits[unit];
        }, 0);
    }

    return NaN;
};

// ✅ **Fixed Test Cases**
// console.log(calculateTimeDifference([
//     "6:30 AM", // No date, assumes today
//     "10:30 PM" // Same day assumed
// ], 'hours'));

// console.log(calculateTimeDifference([
//     "17th March, 2024, 6:30 AM @America/New_York",
//     "18th March, 2024, 6:30 AM @Asia/Kolkata"
// ], 'hours'));

// console.log(calculateTimeDifference([
//     "March 17, 2024, 6:30 AM @Asia/Tokyo",
//     "March 18, 2025, 6:30 AM @Europe/London"
// ], 'years'));

// console.log(calculateTimeDifference([
//     "17/03/2024, 6:30 am",
//     "17/03/2024, 22:30"
// ], 'hours'));

// Example Usage
// console.log(calculateTimeDifference([
//     "17th March, 2024, 6:30 AM @America/New_York",
//     "18th March, 2024, 6:30 AM @Asia/Kolkata"
// ], 'hours'));

// console.log(calculateTimeDifference([
//     "March 17, 2024, 6:30 AM @Asia/Tokyo",
//     "March 18, 2025, 6:30 AM @Europe/London"
// ], 'years'));

// console.log(calculateTimeDifference([
//     "6:30 AM",
//     "10:30 PM"
// ], 'hours'));

// console.log(calculateTimeDifference([
//     "17/03/2024, 6:30 am",
//     "17/03/2024, 22:30"
// ], 'hours'));

const convertTime = (input, outputUnit = "seconds", withUnits = false) => {
  const timeUnits = {
    hr: 3600,
    hour: 3600,
    hours: 3600,
    min: 60,
    minute: 60,
    minutes: 60,
    mn: 60,
    sec: 1,
    second: 1,
    seconds: 1,
    sc: 1,
  };

  


  let totalSeconds = 0;

  if (Array.isArray(input) && input.length === 2) {
    return calculateTimeDifference(input, outputUnit, withUnits);
  } else if (typeof input === "string") {
    totalSeconds = parseDateTimeString(input);
  }

  const conversionMap = {
    hours: totalSeconds / 3600,
    hr: totalSeconds / 3600,
    hour: totalSeconds / 3600,
    minutes: totalSeconds / 60,
    min: totalSeconds / 60,
    minute: totalSeconds / 60,
    mn: totalSeconds / 60,
    seconds: totalSeconds,
    sec: totalSeconds,
    second: totalSeconds,
    sc: totalSeconds,
    seconds: totalSeconds,
  };
  return conversionMap[outputUnit.toLowerCase()] + (withUnits ? ` ${outputUnit.toLowerCase()}` : "") || totalSeconds + (withUnits ? ` ${outputUnit.toLowerCase()}` : "");
};

// Test cases
// console.log(convertTime(["now", "1 hour"], "seconds"));
// console.log(convertTime(["09:00@EST", "now@PST"], "minutes"));
// console.log(convertTime(["now@Asia/Kolkata", "10 minutes"], "seconds"));
// console.log(convertTime(["now", "now"], "seconds"));
// console.log(convertTime(["now@Europe/London", "1 hour"], "seconds"));
// console.log(convertTime(["08:00@UTC", "now@America/New_York"], "seconds"));
// console.log(convertTime("08:00PM@Asia/Kolkata", "seconds"));

// Your example:
// console.log(convertTime(["17th March 2025, 6:30 Am @Asia/Kolkata", "now@Asia/Kolkata"], "minutes"));

// Examples with "now":
// console.log(convertTime(["now", "1 hour"], "seconds")); // Difference between now and one hour from now
// console.log(convertTime(["09:00@EST", "now@PST"], "minutes")); // Difference between 9 AM EST and current time in PST
// console.log(convertTime(["now@Asia/Kolkata", "10 minutes"], "seconds")); // Difference between current time in Kolkata and 10 minutes from then
// console.log(convertTime(["now", "now"], "seconds")); // Should be 0

// // Example with a specific future time from now:
// const futureTime = new Date(Date.now() + 3600000); // 1 hour in the future
// const futureTimeString = `${futureTime.getHours().toString().padStart(2, '0')}:${futureTime.getMinutes().toString().padStart(2, '0')}:${futureTime.getSeconds().toString().padStart(2, '0')}`;
// console.log(convertTime(["now", futureTimeString], "seconds"));

// // Example where "now" is the start time with a timezone:
// console.log(convertTime(["now@Europe/London", "1 hour"], "seconds"));

// // Example where "now" is the end time with a timezone:
// console.log(convertTime(["08:00@UTC", "now@America/New_York"], "seconds"));

/**
 * Converts a given input value from one unit to another within the categories of length, weight, or temperature.
 *
 * @param {string} inputValue - The input value with the unit to be converted (e.g., "100 km", "10 kg").
 * @param {string} toUnit - The target unit to convert the input value to (e.g., "meter", "gram").
 * @returns {number|string} - The converted value in the target unit, or an error message if conversion is not possible.
 *
 * @example
 * convertBasic("100 km", "meter"); // Returns 100000
 * convertBasic("10 kg", "gram"); // Returns 10000
 * convertBasic("98 celsius", "fahrenheit"); // Returns 208.4
 *
 * @remarks
 * The function supports various units for length (e.g., meter, kilometer, mile), weight (e.g., gram, kilogram, pound),
 * and temperature (e.g., celsius, fahrenheit, kelvin). Temperature conversions are handled via specific functions
 * due to their non-linear nature. The input value must be a string in the format "{number} {unit}".
 */

const convertBasic = (inputValue, toUnit, withUnits=false) => {
  const conversions = {
    length: {
      meter: 1,
      kilometer: 0.001,
      centimeter: 100,
      millimeter: 1000,
      inch: 39.3701,
      foot: 3.28084,
      yard: 1.09361,
      mile: 0.000621371,
      m: 1,
      km: 0.001,
      cm: 100,
      mm: 1000,
      in: 39.3701,
      ft: 3.28084,
      yd: 1.09361,
      mi: 0.000621371,
      meters: 1,
      kilometers: 0.001,
      centimeters: 100,
      millimeters: 1000,
      inches: 39.3701,
      feet: 3.28084,
      yards: 1.09361,
      miles: 0.000621371,
    },
    weight: {
      gram: 1,
      kilogram: 0.001,
      pound: 0.00220462,
      ounce: 0.035274,
      g: 1,
      kg: 0.001,
      lb: 0.00220462,
      oz: 0.035274,
      grams: 1,
      kilograms: 0.001,
      pounds: 0.00220462,
      ounces: 0.035274,
    },
    temperature: {
      celsius: (v, to) => (to === "fahrenheit" ? (v * 9) / 5 + 32 : v + 273.15),
      fahrenheit: (v, to) =>
        to === "celsius" ? ((v - 32) * 5) / 9 : ((v - 32) * 5) / 9 + 273.15,
      kelvin: (v, to) =>
        to === "celsius" ? v - 273.15 : ((v - 273.15) * 9) / 5 + 32,
      c: (v, to) => (to === "fahrenheit" ? (v * 9) / 5 + 32 : v + 273.15),
      f: (v, to) =>
        to === "celsius" ? ((v - 32) * 5) / 9 : ((v - 32) * 5) / 9 + 273.15,
      k: (v, to) =>
        to === "celsius" ? v - 273.15 : ((v - 273.15) * 9) / 5 + 32,
    },
  };
  // Extract value and unit from the input string
  const regex = /^([\d.]+)\s*([a-zA-Z]+)$/i;
  const match = inputValue.match(regex);

  if (!match) return "Invalid input format";

  const value = parseFloat(match[1]);
  const fromUnit = match[2].toLowerCase();

  let type = Object.keys(conversions).find(
    (key) => fromUnit in conversions[key]
  );

  if (!type) return "Invalid unit type";

  if (type === "temperature") {
    const toUnitLower = toUnit.toLowerCase();
    if (!(toUnitLower in conversions.temperature))
      return "Invalid temperature unit";
    return conversions.temperature[fromUnit](value, toUnitLower) + (withUnits ? ` ${toUnit}` : '');
  }

  const toUnitLower = toUnit.toLowerCase();
  if (!(toUnitLower in conversions[type])) return "Invalid target unit";

  return (value / conversions[type][fromUnit]) * conversions[type][toUnitLower] + (withUnits ? ` ${toUnit}` : '');
};

// Examples
// console.log(convert("100 km", "meter")); // 0.1
// console.log(convert("10 kilogram", "gram")); // 10000
// console.log(convert("98 celsius", "fahrenheit")); // 208.4
// console.log(convert("1 mile", "meter")); // 1609.34

// Main converter function which can handle both basic and time conversions
export const convert = (options) => {
  const { from, to, type = "basic", withUnits = false } = options;
  if (type === "basic") return convertBasic(from, to, withUnits);
  if (type === "time") return convertTime(from, to, withUnits);
  return "Invalid conversion type";
};

// Examples
// console.log(convert({ from: "100 km", to: "meter" })); // 0.1
// console.log(convert({ from: "10 kilogram", to: "gram" })); // 10000
// console.log(convert({ from: "98 celsius", to: "fahrenheit" })); // 208.4
// console.log(convert({ from: "1 mile", to: "meter" })); // 1609.34
// console.log(convert({ from: "12 hr 30 min 10 sec", to: "seconds" })); // 45010
// console.log(convert({ from: "6:30 PM", to: "seconds", type: "time", timeZone: "Asia/Kolkata" })); // Timezone conversion example
// console.log(convert({ from: "16 Mar 2024, 6:30 PM", to: "minutes", type: "time", timeZone: "America/New_York" })); // Date with timezone
