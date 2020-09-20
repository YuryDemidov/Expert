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

if (typeof globalThis !== `object`) {
  import(
    /* webpackChunkName: `polyfills/polyfill-globalThis` */
    './globalThis.js'
  );
}
