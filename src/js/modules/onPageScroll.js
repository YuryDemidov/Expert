import { HEADER_STATES } from '../utils/constants/enums/headerStates';
import { VISIBILITY_STATES } from '../utils/constants/enums/visibilityStates';
import { pageHeader } from './pageHeader';
import { scrollUpButton } from './scrollUpButton';
import throttle from '../utils/decorators/throttle';

const SCROLL_THROTTLE_TIME = 80; // ms
const throttledScrollHandler = throttle(pageScrollHandler, SCROLL_THROTTLE_TIME);

globalThis.addEventListener(`scroll`, throttledScrollHandler);

function pageScrollHandler() {
  toggleCommonBlocksState();
}

function toggleCommonBlocksState() {
  if (getPageScrollY() > pageHeader.HEADER_STATE_CHANGE_OFFSET) {
    pageHeader.state = HEADER_STATES.fixed;
    scrollUpButton.state = VISIBILITY_STATES.visible;
  } else {
    pageHeader.state = HEADER_STATES.initial;
    scrollUpButton.state = VISIBILITY_STATES.hidden;
  }
}

function getPageScrollY() {
  return globalThis.pageYOffset;
}
