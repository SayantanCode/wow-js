import { parseDocument } from "htmlparser2";

/**
 * Trims a string or array of strings with various options, including HTML trimming.
 * Note: You can only use array of strings when options are | chars | leftChars | rightChars|. Check details.
 *
 * @param {string} str - The input string.
 * @param {object} [options={}] - Optional configuration.
 * @param {string|string[]} [options.chars=" "] - Characters to trim. Can be a string or an array of strings.
 * @param {string} [options.side="both"] - "left", "right", or "both".
 * @param {string|string[]} [options.leftChars] - Characters to trim from the left (overrides `chars`).
 * @param {string|string[]} [options.rightChars] - Characters to trim from the right (overrides `chars`).
 * @param {RegExp} [options.regex] - Regular expression to match characters to trim.
 * @param {number} [options.length] - Trims to a specific length, preserving HTML tags.
 * @param {string} [options.htmlSide="start"] - "start" or "end" for length trimming.
 * @param {boolean} [options.html=false] - If true, trims HTML content while preserving structure.
 * @param {string} [options.pattern='...'] - The pattern to append/prepend when trimming HTML.
 * @returns {string} - The trimmed string.
 *
 * @example
 * trim("  Hello  "); // "Hello"
 * trim("...Hello...", { chars: "." }); // "Hello"
 * trim("  Hello  ", { side: "left" }); // "Hello  "
 * trim("123abc456", { regex: /[0-9]/ }); // "abc"
 * trim("<p>This is a long HTML string.</p>", { length: 20, html: true, }); // "<p>This is a <b>long...</b></p>"
 * trim("<p>This is a long HTML string.</p>", { length: 20, html: true, htmlSide: "end", pattern:'___' }); // "<p>___ a long HTML string.</p>"
 */
const trim = (str, options = {}) => {
  if (typeof str !== "string") str = String(str);
  const {
    chars = " ",
    side = "both",
    leftChars,
    rightChars,
    regex,
    length,
    htmlSide = "start",
    html = false,
    pattern = "..."
  } = options;
  if (html && typeof length === "number" && length > 0) {
    const dom = parseDocument(str);
    const getText = nodes => nodes.map(node => node.type === "text" ? node.data : node.children ? getText(node.children) : "").join("");
    const text = getText(dom.children);
    if (text.length <= length) return str;
    const trimmedText = htmlSide === "end" ? pattern + text.slice(-length) : text.slice(0, length) + pattern;
    let result = "",
      trimmedIndex = 0,
      openTags = [];
    const processNode = nodes => {
      for (const node of nodes) {
        if (node.type === "text") {
          const nodeText = node.data;
          const slice = trimmedText.slice(trimmedIndex, trimmedIndex + nodeText.length);
          if (trimmedIndex >= trimmedText.length) continue;
          result += slice;
          trimmedIndex += nodeText.length;
        } else if (node.type === "tag") {
          const tagName = node.name;
          const startTag = `<${tagName}>`;
          const endTag = node.children?.length ? `</${tagName}>` : "";
          result += startTag;
          if (node.children) {
            openTags.push(tagName);
            processNode(node.children);
            result += endTag;
            openTags.pop();
          }
        }
      }
    };
    processNode(dom.children);
    for (let i = openTags.length - 1; i >= 0; i--) {
      result += `</${openTags[i]}>`;
    }
    return result;
  }
  if (regex) {
    return str.replace(new RegExp(`^(${regex.source})+|(${regex.source})+$`, "g"), "");
  }
  const getTrimChars = sideChars => {
    if (typeof sideChars === "string") return sideChars;
    if (Array.isArray(sideChars)) return sideChars.join("");
    return chars;
  };
  const leftTrimChars = getTrimChars(leftChars);
  const rightTrimChars = getTrimChars(rightChars);
  let start = 0,
    end = str.length - 1;
  if (side === "left" || side === "both") {
    while (start <= end && leftTrimChars.includes(str[start])) start++;
  }
  if (side === "right" || side === "both") {
    while (end >= start && rightTrimChars.includes(str[end])) end--;
  }
  return str.substring(start, end + 1);
};
export default trim;