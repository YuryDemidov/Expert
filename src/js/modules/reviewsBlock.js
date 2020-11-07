import { tns } from 'tiny-slider/src/tiny-slider';
import debounce from '../utils/decorators/debounce';
import checkDeviceWidth from '../utils/functions/checkDeviceWidth';
import isTextOverflows from '../utils/functions/isTextOverflows';
import cutLastWord from '../utils/functions/cutLastWord';
import expandBlock from '../utils/functions/expandBlock';

const MOBILE_SLIDER_CARD_RATIO = 0.74;
const MOBILE_SLIDER_PADDING_RATIO = 0.065;
const SLIDER_RESIZE_DEBOUNCE_TIME = 400; // ms
const EXPANDING_BUTTON_CLASS = `review-card__expand-button`;
const EXPANDING_BUTTON_TEXT = `Читать полностью`;
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
  speed: 400,
  preventScrollOnTouch: `auto`,
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

reviewsSliderNode.querySelectorAll(`.review-card__text`).forEach(reviewText => {
  reviewText.dataset.cutted = ``;
  if (isTextOverflows(reviewText)) {
    cutReviewText(reviewText);
  }
});

const debouncedSliderResizeHandler = debounce(sliderResizeHandler, SLIDER_RESIZE_DEBOUNCE_TIME);
reviewsSliderNode.addEventListener(`click`, expandingButtonClickHandler);
reviewsSlider.events.on(`indexChanged`, collapseReviews);
globalThis.addEventListener(`resize`, debouncedSliderResizeHandler);
globalThis.addEventListener(`click`, toggleSliderAutoplay);

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
  if (globalThis.innerWidth === initialWindowWidth || !checkDeviceWidth().isMobile) {
    return;
  }
  initialWindowWidth = globalThis.innerWidth;

  reviewsSliderOptions.responsive[`0`] = calcSliderResponsiveParams(1);
  reviewsSlider.destroy();
  reviewsSlider = reviewsSlider.rebuild();
}

function toggleSliderAutoplay(evt) {
  if (evt.target.closest(`.reviews-block__slider`)) {
    reviewsSlider.pause();
  }
}

function cutReviewText(node) {
  const STRING_LENGTH_GAP = 50;
  const initialText = node.textContent;

  node.textContent = initialText.slice(0, Math.round((node.clientHeight / node.scrollHeight) * initialText.length) + STRING_LENGTH_GAP);

  while (isTextOverflows(node)) {
    node.textContent = cutLastWord(node.textContent);
  }

  node.textContent = node.textContent.slice(0, node.textContent.length - EXPANDING_BUTTON_TEXT.length - 1);
  node.textContent = node.textContent.trim();
  node.textContent = cutLastWord(node.textContent);
  const cuttedText = initialText.slice(node.textContent.length);
  node.textContent += `.. `;
  const remainingText = node.textContent;
  node.textContent = ``;

  appendTextNode(node, remainingText, `review-card__remaining-text`);
  appendTextNode(node, cuttedText, `review-card__hidden-text`, `hidden`);
  appendExpandingButton(node);
}

function appendTextNode(place, text, ...classes) {
  const textNode = document.createElement(`span`);
  textNode.textContent = text;
  classes.forEach(nodeClass => {
    textNode.classList.add(nodeClass);
  })
  place.appendChild(textNode);
}

function appendExpandingButton(place) {
  const button = document.createElement(`a`);
  button.href = `#`;
  button.textContent = EXPANDING_BUTTON_TEXT;
  button.classList.add(EXPANDING_BUTTON_CLASS, `link`, `link_secondary`);
  place.appendChild(button);
}

function expandingButtonClickHandler(evt) {
  if (!evt.target.classList.contains(EXPANDING_BUTTON_CLASS)) {
    return;
  }
  evt.preventDefault();

  const review = evt.target.closest(`.review-card__text`);
  const remainingText = review.querySelector(`.review-card__remaining-text`);
  const hiddenText = review.querySelector(`.review-card__hidden-text`);

  remainingText.textContent = remainingText.textContent.slice(0, remainingText.textContent.lastIndexOf(`..`));
  evt.target.classList.add(`hidden`);
  hiddenText.classList.remove(`hidden`);
  expandBlock(review, true);
  delete review.dataset.cutted;
}

function collapseReviews() {
  reviewsSliderNode.querySelectorAll(`.review-card__text:not([data-cutted])`).forEach(review => {
    review.querySelector(`.review-card__remaining-text`).textContent += `.. `;
    review.querySelector(`.review-card__hidden-text`).classList.add(`hidden`);
    review.querySelector(`.review-card__expand-button`).classList.remove(`hidden`);
    review.dataset.cutted = ``;
  });
}
