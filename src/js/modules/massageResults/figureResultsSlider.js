import { tns } from 'tiny-slider/src/tiny-slider';

const figureResultsSliderWrap = document.querySelector(`.figure-results__slider`);
let figureResultsSlider;

initSlider();

function initSlider() {
  if (!figureResultsSliderWrap) {
    return;
  }

  const figureResultsSliderNode = figureResultsSliderWrap.querySelector(`.figure-results__slides`);
  const prevButton = figureResultsSliderWrap.querySelector(`.slider__button_prev`);
  const nextButton = figureResultsSliderWrap.querySelector(`.slider__button_next`);

  figureResultsSlider = tns({
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
        speed: 1000,
        nav: false
      }
    }
  });
}

export { figureResultsSlider };
