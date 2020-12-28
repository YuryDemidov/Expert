export default function debounce(func, ms, immediate) {
  let timeout;
  return function() {
    const context = this
    const args = arguments;
    const delayedFunc = function() {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(delayedFunc, ms);
    if (callNow) {
      func.apply(context, args);
    }
  };
}
