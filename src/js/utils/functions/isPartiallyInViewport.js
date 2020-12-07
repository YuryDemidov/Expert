/**
 * Checks that at least part of the element is located in the viewport
 *
 * @param {Element} el - Element to be inspected
 * @returns {Boolean} - True if element is partially or entirely placed in viewport and false otherwise
 */
export default function isPartiallyInViewport(el) {
  const rect = el.getBoundingClientRect();

  return (
    rect.bottom >= 0 &&
    rect.right >= 0 &&
    rect.top <= globalThis.innerHeight &&
    rect.left <= globalThis.innerWidth
  );
}
