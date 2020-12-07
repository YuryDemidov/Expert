/**
 * Checks if the element is entirely located in the viewport
 *
 * @param {Element} el - Element to be inspected
 * @returns {Boolean} - True if element is placed in viewport and false otherwise
 */
export default function isEntirelyInViewport(el) {
  const rect = el.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= globalThis.innerHeight &&
    rect.right <= globalThis.innerWidth
  );
}
