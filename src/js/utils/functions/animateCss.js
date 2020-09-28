export default function animateCss(element, animationName, callback) {
  const node = typeof element === `string` ? document.querySelector(element) : element;

  if (node.classList.contains(`animated`) || node.classList.contains(`hidden`)) {
    return;
  }
  node.classList.add(`animated`, animationName);

  node.addEventListener(`animationend`, animationEndHandler);

  function animationEndHandler() {
    node.classList.remove(`animated`);
    node.classList.remove(animationName);
    node.removeEventListener(`animationend`, animationEndHandler);

    if (typeof callback === `function`) {
      callback();
    }
  }
}
