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

// globalThis
if (typeof globalThis !== `object`) {
  import(
    /* webpackChunkName: `polyfills/polyfill-globalThis` */
    './globalThis.js'
  );
}

// Element.closest()
if (typeof Element.prototype.closest !== `function`) {
  import(
    /* webpackChunkName: `polyfills/polyfill-closest` */
    './closest.js'
  );
}
