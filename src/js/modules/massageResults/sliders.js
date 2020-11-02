import { tns } from 'tiny-slider/src/tiny-slider';
import { GLOBAL_VARS } from '../../utils/constants/globalVars';

const backResultsWrap = document.querySelector(`.back-results`);
const backResultsSliderNode = backResultsWrap.querySelector(`.back-results__slider`);
const prevButton = backResultsWrap.querySelector(`.slider__button_prev`);
const nextButton = backResultsWrap.querySelector(`.slider__button_next`);

if (globalThis.innerWidth < GLOBAL_VARS.breakpoints.tabletMinWidth) {
  tns({
    container: backResultsSliderNode,
    prevButton: prevButton,
    nextButton: nextButton,
    nav: true,
    navPosition: `bottom`,
    loop: true,
    mouseDrag: true
  });
}
