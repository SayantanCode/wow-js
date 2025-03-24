/**
 * Formats a date/time object or string using a format string.
 * @param {Date|string} date - The date/time to format.  If a string, it will be parsed.
 * @param {string} formatString - The format string (e.g., "YYYY-MM-DD", "HH:mm:ss", "DD/MM/YYYY hh:mm A").
 * @returns {string} The formatted date/time string, or an error message if parsing fails.
 * @example
 * formatDate("2023-10-27 10:30:00", "DD/MM/YYYY hh:mm a"); // "27/10/2023 10:30 am"
 * formatDate(new Date(1677648000000), "DDO MMM, YYYY HH:mm:ss"); // "01st Jan, 2023 10:50:00"
 * formatDate("Invalid Date", "YYYY-MM-DD"); // "Error: Invalid date string"
 * formatDate(new Date(), "YYYY-MM-DD HH:mm:ss GMT(Z)"); // "2025-03-21 12:23:00 GMT(+05:30)"
 * formatDate("2025-03-21T12:23:00 +0530", "YYYY-MM-DD HH:mm:ss ZZ"); // "2025-03-21 12:23:00 +05:30"
 */
const formatDate = (date, formatString) => {
  let dateObj;

  if (date instanceof Date) {
    dateObj = date;
    // console.log("Date is a Date object");
  } else if (typeof date === "string") {
    // Array of objects containing regex and format
    const dateFormats = [
      {
        regex: /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z?$/,
        format: "iso8601",
      },
      {
        regex: /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})$/,
        format: "basicIso8601",
      },
      {
        regex:
          /^(?:(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{4})\s(\d{2}):(\d{2}):(\d{2})\s(?:(UT|GMT|[ECMP][SD]T)|[+\-]\d{4})?$/,
        format: "rfc2822",
      },
      {
        regex: /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/,
        format: "commonFormat1",
      }, // YYYY-MM-DD HH:MM:SS
      {
        regex: /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})$/,
        format: "commonFormat2",
      }, // DD/MM/YYYY HH:MM:SS
      { regex: /^(\d{2})\/(\d{2})\/(\d{4})$/, format: "commonFormat3" }, // DD/MM/YYYY
      { regex: /^(\d{4})-(\d{2})-(\d{2})$/, format: "commonFormat4" }, // YYYY-MM-DD
      {
        regex:
          /^(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{4})$/,
        format: "commonFormat5",
      }, // DD Mon YYYY
      { regex: /^\d+$/, format: "timestamp" }, // Check if it is a timestamp
    ];

    let matchedFormat = null;
    for (const df of dateFormats) {
      if (df.regex.test(date)) {
        matchedFormat = df.format;
        break;
      }
    }

    if (matchedFormat) {
      const match = date.match(
        dateFormats.find((df) => df.format === matchedFormat).regex
      );
      switch (matchedFormat) {
        case "iso8601":
          dateObj = new Date(date);
          break;
        case "basicIso8601":
          dateObj = new Date(
            Date.UTC(
              parseInt(match[1]),
              parseInt(match[2]) - 1,
              parseInt(match[3]),
              parseInt(match[4]),
              parseInt(match[5]),
              parseInt(match[6])
            )
          );
          break;
        case "rfc2822":
          const monthMap = {
            Jan: 0,
            Feb: 1,
            Mar: 2,
            Apr: 3,
            May: 4,
            Jun: 5,
            Jul: 6,
            Aug: 7,
            Sep: 8,
            Oct: 9,
            Nov: 10,
            Dec: 11,
          };
          dateObj = new Date(
            parseInt(match[3]),
            monthMap[match[2]],
            parseInt(match[1]),
            parseInt(match[4]),
            parseInt(match[5]),
            parseInt(match[6])
          );
          break;
        case "commonFormat1":
          dateObj = new Date(
            parseInt(match[1]),
            parseInt(match[2]) - 1,
            parseInt(match[3]),
            parseInt(match[4]),
            parseInt(match[5]),
            parseInt(match[6])
          );
          break;
        case "commonFormat2":
          dateObj = new Date(
            parseInt(match[3]),
            parseInt(match[2]) - 1,
            parseInt(match[1]),
            parseInt(match[4]),
            parseInt(match[5]),
            parseInt(match[6])
          );
          break;
        case "commonFormat3":
          dateObj = new Date(
            parseInt(match[3]),
            parseInt(match[2]) - 1,
            parseInt(match[1])
          );
          break;
        case "commonFormat4":
          dateObj = new Date(
            parseInt(match[1]),
            parseInt(match[2]) - 1,
            parseInt(match[3])
          );
          break;
        case "commonFormat5":
          const monthMap2 = {
            Jan: 0,
            Feb: 1,
            Mar: 2,
            Apr: 3,
            May: 4,
            Jun: 5,
            Jul: 6,
            Aug: 7,
            Sep: 8,
            Oct: 9,
            Nov: 10,
            Dec: 11,
          };
          dateObj = new Date(
            parseInt(match[3]),
            monthMap2[match[2]],
            parseInt(match[1])
          );
          break;
        case "timestamp":
          dateObj = new Date(parseInt(date));
          break;
        default:
          break;
      }
    } else {
      try {
        dateObj = new Date(date); // Fallback to built-in Date parsing
        if (isNaN(dateObj.getTime())) {
          return "Error: Invalid date string";
        }
      } catch (e) {
        return "Error: Invalid date string";
      }
    }
  } else {
    return "Error: Invalid date type.  Must be a Date object or a string.";
  }

  const formatReplacements = {
    YYYY: dateObj.getFullYear(),
    YY: String(dateObj.getFullYear()).slice(-2),
    MMMM: dateObj.toLocaleString("default", { month: "long" }),
    MMM: dateObj.toLocaleString("default", { month: "short" }),
    MM: String(dateObj.getMonth() + 1).padStart(2, "0"),
    M: dateObj.getMonth() + 1,
    DDO: String(dateObj.getDate()).padStart(2, "0") + (() => {
      const day = dateObj.getDate();
      if (day > 3 && day < 21) return "th";
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    })(),
    DD: String(dateObj.getDate()).padStart(2, "0"),
    DO: dateObj.getDate() + (() => {
      const day = dateObj.getDate();
      if (day > 3 && day < 21) return "th";
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    })(),
    D: dateObj.getDate(),
    O: (() => {
      const day = dateObj.getDate();
      if (day > 3 && day < 21) return "th";
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    })(),
    HH: String(dateObj.getHours()).padStart(2, "0"),
    H: dateObj.getHours(),
    hh: String(dateObj.getHours() % 12 || 12).padStart(2, "0"),
    h: dateObj.getHours() % 12 || 12,
    mm: String(dateObj.getMinutes()).padStart(2, "0"),
    m: dateObj.getMinutes(),
    ss: String(dateObj.getSeconds()).padStart(2, "0"),
    s: dateObj.getSeconds(),
    SSS: String(dateObj.getMilliseconds()).padStart(3, "0"),
    A: dateObj.getHours() < 12 ? "AM" : "PM",
    a: dateObj.getHours() < 12 ? "am" : "pm",
    A_: dateObj.getHours() < 12 ? "A.M." : "P.M.",
    a_: dateObj.getHours() < 12 ? "a.m." : "p.m.",
    
    dddd: dateObj.toLocaleString("default", { weekday: "long" }),
    ddd: dateObj.toLocaleString("default", { weekday: "short" }),
    Z: (() => {
      const offset = dateObj.getTimezoneOffset();
      const sign = offset > 0 ? "-" : "+";
      const hours = Math.floor(Math.abs(offset) / 60);
      const minutes = Math.abs(offset) % 60;
      return (
        sign +
        String(hours).padStart(2, "0") +
        ":" +
        String(minutes).padStart(2, "0")
      );
    })(),
    ZZ: (() => {
      const offset = dateObj.getTimezoneOffset();
      const sign = offset > 0 ? "-" : "+";
      const hours = Math.floor(Math.abs(offset) / 60);
      const minutes = Math.abs(offset) % 60;
      return (
        sign + String(hours).padStart(2, "0") + String(minutes).padStart(2, "0")
      );
    })(),
  };

  const formattedString = formatString.replace(/(\w+)|(\W)/g, (match, key) => {
    if (formatReplacements[key]) {
      return formatReplacements[key];
    }
    return match; // Return the literal character if it's not a format key
  });
  return formattedString;
};

export default formatDate;
