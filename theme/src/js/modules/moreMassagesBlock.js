import { tns } from 'tiny-slider/src/tiny-slider';
import checkDeviceWidth from '../utils/functions/checkDeviceWidth';

const moreMassagesBlockWrap = document.querySelector(`.more-massages`);
const sliderNode = moreMassagesBlockWrap.querySelector(`.more-massages__slider`);
const prevButton = moreMassagesBlockWrap.querySelector(`.slider__button_prev`);
const nextButton = moreMassagesBlockWrap.querySelector(`.slider__button_next`);

const moreMassagesSliderOptions = {
  container: sliderNode,
  prevButton: prevButton,
  nextButton: nextButton,
  loop: true,
  nav: false,
  mouseDrag: true,
  speed: 400,
  preventScrollOnTouch: `auto`,
  responsive: {
    0: {
      items: 1,
      edgePadding: 10,
      gutter: 35
    },
    768: {
      items: 2,
      edgePadding: 12,
      gutter: 35
    },
    1024: {
      items: 3,
      edgePadding: 0,
      gutter: 25
    },
    1200: {
      edgePadding: 20,
      gutter: 50
    }
  }
};

const moreMassagesSlider = tns(moreMassagesSliderOptions);
checkDeviceWidth().isMobile && moreMassagesSlider.goTo(`next`);
