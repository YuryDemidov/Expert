import AppointmentForm from '../classes/AppointmentForm';

const priceListCallbackForm = document.querySelector(`.price-list-callback-form`);
const buttonFormTrigger = priceListCallbackForm.querySelector(`.price-list-callback-form__trigger`);
const buttonFormClose = priceListCallbackForm.querySelector(`.price-list-callback-form__close`);
const formInitialContent = priceListCallbackForm.querySelector(`.price-list-callback-form__initial-content`);
const formWrapper = priceListCallbackForm.querySelector(`.price-list-callback-form__wrap`);
const formNode = priceListCallbackForm.querySelector(`.application-form__form`);

buttonFormTrigger.addEventListener(`click`, toggleForm);
buttonFormClose.addEventListener(`click`, toggleForm);

function toggleForm(evt) {
  evt.preventDefault();
  formWrapper.classList.toggle(`hidden`);
  formInitialContent.classList.toggle(`hidden`);
}

const priceListAppointmentForm = new AppointmentForm(formNode);
priceListAppointmentForm.init();
