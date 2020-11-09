import { tns } from 'tiny-slider/src/tiny-slider';

const faceResultsSliderWrap = document.querySelector(`.face-results__slider`);
const faceResultsSliderNode = faceResultsSliderWrap.querySelector(`.face-results__slides`);
const prevButton = faceResultsSliderWrap.querySelector(`.slider__button_prev`);
const nextButton = faceResultsSliderWrap.querySelector(`.slider__button_next`);

tns({
  container: faceResultsSliderNode,
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
