// Scrolling methods
import smoothscroll from 'smoothscroll-polyfill';
smoothscroll.polyfill();

// Fetch
if (!(`fetch` in self)) {
  import(
    /* webpackChunkName: `polyfills/polyfill-fetch` */
    './fetch.js'
  );
}

// Element.closest()
if (typeof Element.prototype.closest !== `function`) {
  import(
    /* webpackChunkName: `polyfills/polyfill-closest` */
    './closest.js'
  );
}
