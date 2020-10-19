import AppointmentForm from '../classes/AppointmentForm';

const applicationFormNode = document.querySelector(`.application-form__form`);

const applicationForm = new AppointmentForm(applicationFormNode);
applicationForm.init();
