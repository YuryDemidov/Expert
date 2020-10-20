import AppointmentForm from '../classes/AppointmentForm';

const applicationFormNode = document.querySelector(`.application-form__form`);
const applicationFormSuccessBlock = document.querySelector(`.application-form__success-message`);

const applicationForm = new AppointmentForm(applicationFormNode, applicationFormSuccessBlock);
applicationForm.init();
