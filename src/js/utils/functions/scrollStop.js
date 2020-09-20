/*!
 * Run a callback function after scrolling has stopped
 * (c) 2017 Chris Ferdinandi, MIT License, https://gomakethings.com
 * @param  {Function} callback The function to run after scrolling
 */
export default function scrollStop(callback, once) {
  // Make sure a valid callback was provided
  if (!callback || typeof callback !== 'function') {
    return;
  }
  // Setup scrolling variable
  let isScrolling;
  // Listen for scroll events
  globalThis.addEventListener('scroll', evt => {
    // Clear our timeout throughout the scroll
    globalThis.clearTimeout(isScrolling);
    // Set a timeout to run after scrolling ends
    isScrolling = setTimeout(() => {
      // Run the callback
      callback();
    }, 66);
  }, {
    once: once
  });
};
