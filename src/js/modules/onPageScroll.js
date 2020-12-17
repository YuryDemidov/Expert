import AOS from 'aos';
import 'aos/dist/aos.css';
import { GLOBAL_VARS } from '../utils/constants/globalVars';
import { HEADER_STATES } from '../utils/constants/enums/headerStates';
import { VISIBILITY_STATES } from '../utils/constants/enums/visibilityStates';
import { pageHeader } from './pageHeader';
import { reviewsAutoplaySlider } from './reviewsBlock';
import { scrollUpButton } from './scrollUpButton';
import { specialistAutoplaySlider } from './specialistsSlider';
import checkDeviceWidth from '../utils/functions/checkDeviceWidth';
import isPartiallyInViewport from '../utils/functions/isPartiallyInViewport';
import throttle from '../utils/decorators/throttle';

const SCROLL_THROTTLE_TIME = 80; // ms
const isHeaderStatic = !!document.querySelector(`.service-page, .article-page`);
const communicationMethods = document.querySelector(`.communication-methods`);
const featuresListItems = document.querySelectorAll(`.features-list__item`);
const massageChoosingTestContent = document.querySelector(`.massage-choosing-test__content`);
const massageChoosingTestImage = document.querySelector(`.massage-choosing-test__image`);
const pageFooter = document.querySelector(`.page__footer`);
const throttledScrollHandler = throttle(pageScrollHandler, SCROLL_THROTTLE_TIME);

addAosAnimations();
AOS.init({
  once: true
});
globalThis.addEventListener(`scroll`, throttledScrollHandler);

function pageScrollHandler() {
  toggleCommonBlocksState();
  reviewsAutoplaySlider && reviewsAutoplaySlider.switchSlidesOnScroll();
  specialistAutoplaySlider && specialistAutoplaySlider.switchSlidesOnScroll();
}

function toggleCommonBlocksState() {
  if (globalThis.pageYOffset > pageHeader.HEADER_STATE_CHANGE_OFFSET) {
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

function addAosAnimations() {
  featuresListItems.forEach(item => {
    if (globalThis.innerWidth < GLOBAL_VARS.breakpoints.smallDesktopMinWidth) {
      item.dataset.aos = `fade-up`;
    }
  });

  if (checkDeviceWidth().isMobile) {
    delete massageChoosingTestContent.dataset.aos;
    delete massageChoosingTestImage.dataset.aos;
  }
}
