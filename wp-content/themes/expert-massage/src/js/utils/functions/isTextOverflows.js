/**
 * Checks if node's text content overflows node's container in vertical or horizontal directions
 * Ignores nodes with CSS rule overflow: visible
 *
 * @param {HTMLElement} node - The node to be inspected.
 * @returns {Boolean} - True if text overflows, false if not
 */
export default function isTextOverflows(node) {
  return node.scrollWidth > node.clientWidth || node.scrollHeight > node.clientHeight;
}
