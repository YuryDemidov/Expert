/**
 * Expands blocks height by changing its CSS max-height property
 * No animation provided. Transition should be added via CSS or block will change it's height immediately
 * Function clears max-height and style attribute (if it is empty) after transition ends
 *
 * @param {HTMLElement} node - Node which should expand it's vertical size
 */
export default function expandBlock(node) {
  if (node.scrollHeight === node.clientHeight) {
    return;
  }

  node.addEventListener(`transitionend`, nodeTransitionHandler);
  node.style.maxHeight = `${node.scrollHeight}px`;

  function nodeTransitionHandler() {
    node.style.maxHeight = null;
    if (node.getAttribute(`style`) === ``) {
      node.removeAttribute(`style`);
    }
    node.removeEventListener(`transitionend`, nodeTransitionHandler);
  }
}
