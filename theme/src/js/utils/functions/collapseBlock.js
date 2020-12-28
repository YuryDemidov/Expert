/**
 * Collapses blocks height by changing its CSS max-height property
 * No animation provided. Transition should be added via CSS or block will change it's height immediately
 *
 * @param {HTMLElement} node - Node which should expand it's vertical size
 * @param {Boolean} [clearStyles] - if true, clears max-height and style attribute (if empty) after transition ends
 */
export default function collapseBlock(node, clearStyles) {
  if (node.clientHeight === 0) {
    return;
  }

  if (clearStyles) {
    node.addEventListener(`transitionend`, nodeTransitionHandler);
  }

  node.style.maxHeight = `0px`;

  function nodeTransitionHandler() {
    node.style.maxHeight = null;
    if (node.getAttribute(`style`) === ``) {
      node.removeAttribute(`style`);
    }
    node.removeEventListener(`transitionend`, nodeTransitionHandler);
  }
}
