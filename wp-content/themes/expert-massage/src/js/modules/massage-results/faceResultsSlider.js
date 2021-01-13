import { tns } from 'tiny-slider/src/tiny-slider';
import { resultsWrapper } from './addMassageToAppointment';

const faceResultsSliderWrap = resultsWrapper && resultsWrapper.querySelector(`.face-results__slider`);

initSlider();

function initSlider() {
  if (!faceResultsSliderWrap) {
    return;
  }

  const faceResultsSliderNode = faceResultsSliderWrap.querySelector(`.face-results__slides`);
  const prevButton = faceResultsSliderWrap.querySelector(`.slider__button_prev`);
  const nextButton = faceResultsSliderWrap.querySelector(`.slider__button_next`);

  tns({
    container: faceResultsSliderNode,
    prevButton: prevButton,
    nextButton: nextButton,
    mouseDrag: true,
    autoHeight: true,
    nav: true,
    responsive: {
      0: {
        speed: 500,
        navPosition: `bottom`
      },
      1024: {
        speed: 1000
      }
    }
  });
}
