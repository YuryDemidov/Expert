import { tns } from 'tiny-slider/src/tiny-slider';

const figureResultsSliderWrap = document.querySelector(`.figure-results__slider`);
const figureResultsSliderNode = figureResultsSliderWrap.querySelector(`.figure-results__slides`);
const prevButton = figureResultsSliderWrap.querySelector(`.slider__button_prev`);
const nextButton = figureResultsSliderWrap.querySelector(`.slider__button_next`);

const figureResultsSlider = tns({
  container: figureResultsSliderNode,
  prevButton: prevButton,
  nextButton: nextButton,
  mouseDrag: true,
  autoHeight: true,
  responsive: {
    0: {
      speed: 500,
      nav: true,
      navPosition: `bottom`
    },
    1024: {
      speed: 1200,
      nav: false
    }
  }
});

export { figureResultsSlider };
