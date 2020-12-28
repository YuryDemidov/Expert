/**
 * Cuts the last word of input string.
 * If gets not string, string with one word or empty string returns input without changes
 *
 * @param {String} text - Input string
 * @returns {String} - Processed string
 */
export default function cutLastWord(text) {
  if (typeof text !== 'string') {
    return text;
  }

  const lastSpaceIndex = text.lastIndexOf(` `);
  if (!~lastSpaceIndex) {
    return text;
  }

  return text.slice(0, lastSpaceIndex);
}
