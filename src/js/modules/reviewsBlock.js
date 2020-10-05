import { tns } from 'tiny-slider/src/tiny-slider';
import debounce from '../utils/decorators/debounce';
import checkDeviceWidth from '../utils/functions/checkDeviceWidth';
import isTextOverflows from '../utils/functions/isTextOverflows';

const MOBILE_SLIDER_CARD_RATIO = 0.74;
const MOBILE_SLIDER_PADDING_RATIO = 0.065;
const SLIDER_RESIZE_DEBOUNCE_TIME = 400; // ms
const reviewsSliderWrap = document.querySelector(`.reviews-block__slider`);
const reviewsSliderNode = reviewsSliderWrap.querySelector(`.reviews-block__reviews-list`);
const reviewsSliderButtonPrevious = reviewsSliderWrap.querySelector(`.slider__button_prev`);
const reviewsSliderButtonNext = reviewsSliderWrap.querySelector(`.slider__button_next`);
let initialWindowWidth = globalThis.innerWidth;

const reviewsSliderOptions = {
  container: reviewsSliderNode,
  prevButton: reviewsSliderButtonPrevious,
  nextButton: reviewsSliderButtonNext,
  nav: true,
  navPosition: `bottom`,
  loop: true,
  mouseDrag: true,
  swipeAngle: false,
  speed: 400,
  responsive: {
    0: calcSliderResponsiveParams(1),
    768: {
      items: 2,
      fixedWidth: false,
      edgePadding: 12,
      gutter: 35
    },
    1024: {
      items: 3
    },
    1200: {
      gutter: 50
    }
  }
};
let reviewsSlider = tns(reviewsSliderOptions);

const debouncedSliderResizeHandler = debounce(sliderResizeHandler, SLIDER_RESIZE_DEBOUNCE_TIME);
globalThis.addEventListener(`resize`, debouncedSliderResizeHandler);

function calcSliderResponsiveParams(items) {
  const params = {
    items: items
  }

  params.fixedWidth = Math.round(globalThis.innerWidth * MOBILE_SLIDER_CARD_RATIO / 2) * 2;
  params.edgePadding = (globalThis.innerWidth - params.fixedWidth) / 2
  params.gutter = Math.round(globalThis.innerWidth * MOBILE_SLIDER_PADDING_RATIO);

  return params;
}

function sliderResizeHandler() {
  if (globalThis.innerWidth === initialWindowWidth) {
    return;
  }
  initialWindowWidth = globalThis.innerWidth;

  if (checkDeviceWidth().isMobile) {
    reviewsSliderOptions.responsive['0'] = calcSliderResponsiveParams(1);
  }

  reviewsSlider.destroy();
  reviewsSlider = reviewsSlider.rebuild();
}

function cutReviewText() {
  while (isTextOverflows()) {
    console.log(1);
  }
}
