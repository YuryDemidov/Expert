import { tns } from 'tiny-slider/src/tiny-slider';
import { GLOBAL_VARS } from '../../utils/constants/globalVars';

const backResultsWrap = document.querySelector(`.back-results`);
const backResultsSliderNode = backResultsWrap.querySelector(`.back-results__slider`);
const prevButton = backResultsWrap.querySelector(`.slider__button_prev`);
const nextButton = backResultsWrap.querySelector(`.slider__button_next`);
let backResultsSlider;

if (globalThis.innerWidth < GLOBAL_VARS.breakpoints.tabletMinWidth) {
  backResultsSlider = tns({
    container: backResultsSliderNode,
    prevButton: prevButton,
    nextButton: nextButton,
    nav: true,
    navPosition: `bottom`,
    loop: true,
    mouseDrag: true,
    autoHeight: true
  });
}

export { backResultsSlider };
