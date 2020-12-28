import { tns } from 'tiny-slider/src/tiny-slider';

const famousClientsSliderWrap = document.querySelector(`.famous-clients .slider`);
const sliderNode = famousClientsSliderWrap.querySelector(`.famous-clients__slider`);
const buttonPrev = famousClientsSliderWrap.querySelector(`.slider__button_prev`);
const buttonNext = famousClientsSliderWrap.querySelector(`.slider__button_next`);

tns({
  container: sliderNode,
  prevButton: buttonPrev,
  nextButton: buttonNext,
  nav: false,
  loop: true,
  mouseDrag: true,
  speed: 800,
  preventScrollOnTouch: `auto`,
  responsive: {
    0: {
      items: 1,
      gutter: 15
    },
    1024: {
      items: 1,
      edgePadding: Math.min(globalThis.innerWidth * 0.21, 260),
      gutter: 0
    }
  }
});
