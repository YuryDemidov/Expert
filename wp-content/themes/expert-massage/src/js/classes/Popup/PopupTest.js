import Popup from './Popup';

export default class PopupTest extends Popup {
  constructor(props) {
    super(props);

    this.previousSlideButton = this.node.querySelector(`.popup-massage-test__previous`);
    this.nextSlideButton = this.node.querySelector(`.popup-massage-test__next`);

    this.progressBar = this.node.querySelector(`.test-progress__bar`);
    this.progressOutput = this.node.querySelector(`.test-progress__passed-questions-output`);

    this.slides = this.node.querySelectorAll(`.test-slide`);
    this.successMessage = this.node.querySelector(`.test-success`);
    this.slidesCount = this.slides.length;
    this.currentSlide = 1;
  }

  switchSlide(slideNumber) {
    this.slides.forEach(slide => {
      slide.classList.add(`hidden`);
      if (slide.classList.contains(`test-slide_${slideNumber}`)) {
        slide.classList.remove(`hidden`);
      }
    });

    this.currentSlide = slideNumber;
    if (this.currentSlide === 1) {
      this.previousSlideButton.classList.add(`hidden`);
    } else {
      this.previousSlideButton.classList.remove(`hidden`);
    }
    if (this.currentSlide === this.slidesCount) {
      this.nextSlideButton.textContent = `Завершить тест`;
    } else {
      this.nextSlideButton.textContent = `Далее`;
    }

    this.changeProgressBar(slideNumber);
  }

  changeProgressBar(step) {
    const progress = (step - 1) / (this.slidesCount - 1) * 100; // %
    this.progressBar.style.width = `${progress}%`;
    this.progressOutput.textContent = step - 1;
  }

  showFinalSlide() {
    this.successMessage.classList.remove(`hidden`);
  }

  resetView() {
    this.successMessage.classList.add(`hidden`);
    this.switchSlide(1);

    for (const slide of [3, 6]) {
      this.node.querySelector(`.test-slide_${slide} .text-input`).classList.add(`hidden`);
    }

    this.node.querySelectorAll(`input`).forEach(input => {
      if (input.type === `checkbox` || input.type === `radio`) {
        input.checked = false;
      }
      if (input.type === `text` || input.type === `tel`) {
        input.value = ``;
      }
    });
  }
}
