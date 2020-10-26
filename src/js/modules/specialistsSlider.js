import { tns } from 'tiny-slider/src/tiny-slider';
import isTextOverflows from '../utils/functions/isTextOverflows';
import expandBlock from '../utils/functions/expandBlock';
import { appointmentPopup } from './popups/popupAppointment';

const specialistsSliderWrap = document.querySelector(`.specialists .slider`);
const specialistsSliderNode = specialistsSliderWrap.querySelector(`.specialists__list`);
const specialistsSliderPrevious = specialistsSliderWrap.querySelector(`.slider__button_prev`);
const specialistsSliderNext = specialistsSliderWrap.querySelector(`.slider__button_next`);

const specialistsSlider = tns({
  container: specialistsSliderNode,
  prevButton: specialistsSliderPrevious,
  nextButton: specialistsSliderNext,
  nav: true,
  navPosition: `bottom`,
  items: 1,
  loop: true,
  mouseDrag: true,
  swipeAngle: false,
  speed: 500,
  edgePadding: 10,
  gutter: 40
});

specialistsSliderNode.querySelectorAll(`.specialist-card`).forEach(card => {
  const descriptionNode = card.querySelector(`.specialist-card__description`);
  const appointmentButton = card.querySelector(`.specialist-card__appointment .button`);
  if (isTextOverflows(descriptionNode)) {
    appendExpandButton(descriptionNode);
  }

  appointmentButton.addEventListener(`click`, evt => addSpecialistId(appointmentButton.dataset.specialistId));
});

function appendExpandButton(place) {
  const expandButtonWrap = document.createElement(`div`);
  expandButtonWrap.classList.add(`specialist-card__expand-button`);

  const expandButton = document.createElement(`a`);
  expandButton.href = `#`;
  expandButton.classList.add(`link`, `link_secondary`, `underline`);
  expandButton.textContent = `Читать полностью`;

  expandButtonWrap.appendChild(expandButton);
  place.appendChild(expandButtonWrap);

  expandButtonWrap.addEventListener(`click`, expandDescription);
}

function expandDescription(evt) {
  evt.preventDefault();

  const description = this.closest(`.specialist-card__description`);

  expandBlock(description, false);
  this.parentNode.removeChild(this);
}

function addSpecialistId(id) {
  const appointmentForm = appointmentPopup.node.querySelector(`.application-form__form`);
  let specialistInput = appointmentForm.querySelector(`[name=specialist-id]`);
  if (!specialistInput) {
    specialistInput = document.createElement(`input`);
    specialistInput.name = `specialist-id`;
    specialistInput.type = `hidden`;
    appointmentForm.appendChild(specialistInput);
  }
  specialistInput.value = id;
}
