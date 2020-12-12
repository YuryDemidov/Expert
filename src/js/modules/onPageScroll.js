import { HEADER_STATES } from '../utils/constants/enums/headerStates';
import { VISIBILITY_STATES } from '../utils/constants/enums/visibilityStates';
import { pageHeader } from './pageHeader';
import { scrollUpButton } from './scrollUpButton';
import throttle from '../utils/decorators/throttle';
import isPartiallyInViewport from '../utils/functions/isPartiallyInViewport';

const SCROLL_THROTTLE_TIME = 80; // ms
const throttledScrollHandler = throttle(pageScrollHandler, SCROLL_THROTTLE_TIME);
const isHeaderStatic = !!document.querySelector(`.service-page, .article-page`);
const communicationMethods = document.querySelector(`.communication-methods`);
const pageFooter = document.querySelector(`.page__footer`);

globalThis.addEventListener(`scroll`, throttledScrollHandler);

function pageScrollHandler() {
  toggleCommonBlocksState();
}

function toggleCommonBlocksState() {
  if (getPageScrollY() > pageHeader.HEADER_STATE_CHANGE_OFFSET) {
    if (!isHeaderStatic) {
      pageHeader.state = HEADER_STATES.fixed;
    }
    communicationMethods.dataset.state = `fixed`;
    scrollUpButton.state = VISIBILITY_STATES.visible;
  } else {
    if (!isHeaderStatic) {
      pageHeader.state = HEADER_STATES.initial;
    }
    communicationMethods.dataset.state = `static`;
    scrollUpButton.state = VISIBILITY_STATES.hidden;
  }

  if (isPartiallyInViewport(pageFooter)) {
    communicationMethods.dataset.hidden = ``;
  } else {
    delete communicationMethods.dataset.hidden;
  }
}

function getPageScrollY() {
  return globalThis.pageYOffset;
}
