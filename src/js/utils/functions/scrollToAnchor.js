export default function scrollToAnchor({
  node,
  gap = document.querySelector(`.page__header`).getBoundingClientRect().height + 100,
  callback
}) {
  if (!node || !node.getBoundingClientRect) {
    return;
  }

  scrollTo({
    top: node.getBoundingClientRect().top - document.body.getBoundingClientRect().top - gap,
    behavior: `smooth`
  });

  let isScrolling;
  scrollEndCallbackLauncher();
  function scrollEndCallbackLauncher() {
    if (Math.ceil(node.getBoundingClientRect().top) >= Math.floor(gap)) {
      callback && callback();
      clearTimeout(isScrolling);
    } else {
      isScrolling = setTimeout(scrollEndCallbackLauncher, 66);
    }
  }
}
