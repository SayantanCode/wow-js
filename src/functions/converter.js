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
const convertTime = (input, outputUnit = "seconds", timezone = "UTC") => {
    const timeUnits = {
        hr: 3600, hour: 3600, hours: 3600,
        min: 60, minute: 60, minutes: 60, mn: 60,
        sec: 1, second: 1, seconds: 1, sc: 1
    };

    // Normalize Input: Remove extra spaces & convert to lowercase
    let normalizedInput = input.replace(/\s+/g, " ").trim().toLowerCase();

    // Handle 12-hour AM/PM format & convert to 24-hour format
    const amPmRegex = /(am|pm)/i;
    let dateObj;
    if (amPmRegex.test(normalizedInput)) {
        dateObj = new Date(normalizedInput);
    } else {
        // Handle 24-hour format directly
        const timeMatch = normalizedInput.match(/(\d{1,2}):(\d{2}):?(\d{2})?/);
        if (timeMatch) {
            let [_, hh, mm, ss] = timeMatch.map(Number);
            if (isNaN(ss)) ss = 0; // Default seconds to 0 if not provided
            dateObj = new Date();
            dateObj.setHours(hh, mm, ss, 0);
        }
    }

    // Handle direct time units (e.g., "12 hr 30 min 10 sec")
    let totalSeconds = 0;
    const regex = /(\d+)\s*(hr|hour|hours|min|minute|minutes|mn|sec|second|seconds|sc)/gi;
    let match;
    while ((match = regex.exec(normalizedInput)) !== null) {
        totalSeconds += Number(match[1]) * timeUnits[match[2].toLowerCase()];
    }

    // If a valid Date object is created, consider timezone conversion
    if (dateObj && !isNaN(dateObj.getTime())) {
        const utcDate = new Date(dateObj.toLocaleString("en-US", { timeZone: timezone }));
        totalSeconds = (utcDate.getHours() * 3600) + (utcDate.getMinutes() * 60) + utcDate.getSeconds();
    }

    // Convert totalSeconds to the requested output unit
    const conversionMap = {
        hours: totalSeconds / 3600,
        minutes: totalSeconds / 60,
        seconds: totalSeconds
    };

    return conversionMap[outputUnit] || totalSeconds;
};

// Examples:
console.log(convertTime("12 hr 30 min 10 sec", "seconds")); // 45010
console.log(convertTime("6:30 PM", "seconds", "Asia/Kolkata")); // Timezone conversion example
console.log(convertTime("16 Mar 2024, 6:30 PM", "minutes", "America/New_York")); // Date with timezone
console.log(convertTime("20:05:50", "seconds")); // 72350

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

const convertBasic = (inputValue, toUnit) => {
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
            meters:1,
            kilometers:0.001,
            centimeters:100,
            millimeters:1000,
            inches:39.3701,
            feet:3.28084,
            yards:1.09361,
            miles:0.000621371,
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
            grams:1,
            kilograms:0.001,
            pounds:0.00220462,
            ounces:0.035274,
        },
        temperature: {
            celsius: (v, to) => to === "fahrenheit" ? (v * 9 / 5) + 32 : v + 273.15,
            fahrenheit: (v, to) => to === "celsius" ? (v - 32) * 5 / 9 : ((v - 32) * 5 / 9) + 273.15,
            kelvin: (v, to) => to === "celsius" ? v - 273.15 : (v - 273.15) * 9 / 5 + 32,
            c: (v, to) => to === "fahrenheit" ? (v * 9 / 5) + 32 : v + 273.15,
            f: (v, to) => to === "celsius" ? (v - 32) * 5 / 9 : ((v - 32) * 5 / 9) + 273.15,
            k: (v, to) => to === "celsius" ? v - 273.15 : (v - 273.15) * 9 / 5 + 32,
        }
    };
    // Extract value and unit from the input string
    const regex = /^([\d.]+)\s*([a-zA-Z]+)$/i;
    const match = inputValue.match(regex);

    if (!match) return "Invalid input format";

    const value = parseFloat(match[1]);
    const fromUnit = match[2].toLowerCase();

    let type = Object.keys(conversions).find(key => fromUnit in conversions[key]);

    if (!type) return "Invalid unit type";

    if (type === "temperature") {
        const toUnitLower = toUnit.toLowerCase();
        if (!(toUnitLower in conversions.temperature)) return "Invalid temperature unit";
        return conversions.temperature[fromUnit](value, toUnitLower);
    }

    const toUnitLower = toUnit.toLowerCase();
    if (!(toUnitLower in conversions[type])) return "Invalid target unit";

    return (value / conversions[type][fromUnit]) * conversions[type][toUnitLower];
};

// Examples
console.log(convert("100 km", "meter")); // 0.1
console.log(convert("10 kilogram", "gram")); // 10000
console.log(convert("98 celsius", "fahrenheit")); // 208.4
console.log(convert("1 mile", "meter")); // 1609.34

// Main converter function which can handle both basic and time conversions
export const convert = (options) => {
    const { from, to, type = "basic", timeZone= null } = options;
    if (type === "basic") return convertBasic(from, to);
    if (type === "time") return convertTime(from, to, timeZone);
    return "Invalid conversion type";
}

// Examples
console.log(convert({ from: "100 km", to: "meter" })); // 0.1
console.log(convert({ from: "10 kilogram", to: "gram" })); // 10000
console.log(convert({ from: "98 celsius", to: "fahrenheit" })); // 208.4
console.log(convert({ from: "1 mile", to: "meter" })); // 1609.34
console.log(convert({ from: "12 hr 30 min 10 sec", to: "seconds" })); // 45010
console.log(convert({ from: "6:30 PM", to: "seconds", type: "time", timeZone: "Asia/Kolkata" })); // Timezone conversion example
console.log(convert({ from: "16 Mar 2024, 6:30 PM", to: "minutes", type: "time", timeZone: "America/New_York" })); // Date with timezone