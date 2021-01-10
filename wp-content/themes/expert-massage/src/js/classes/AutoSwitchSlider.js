import isPartiallyInViewport from '../utils/functions/isPartiallyInViewport';

export default class AutoSwitchSlider {
  constructor(slider, slideSwitchThreshold) {
    this.slider = slider;
    this.SLIDE_SWITCH_THRESHOLD = slideSwitchThreshold;
    this.slideSwitchDistance = globalThis.pageYOffset;
  }

  switchSlidesOnScroll() {
    if (isPartiallyInViewport(this.slider.getInfo().container)) {
      if (globalThis.pageYOffset > this.slideSwitchDistance + this.SLIDE_SWITCH_THRESHOLD) {
        this.changeSlide(`next`);
      } else if (globalThis.pageYOffset < this.slideSwitchDistance - this.SLIDE_SWITCH_THRESHOLD) {
        this.changeSlide(`prev`);
      }
    }
  }

  changeSlide(slidePosition) {
    this.slider.goTo(slidePosition);
    this.slideSwitchDistance = globalThis.pageYOffset;
  }

  disableAutoSwitching() {
    this.switchSlidesOnScroll = () => null;
  }
}
