import Popup from '../../classes/Popup/Popup';
import AppointmentForm from '../../classes/AppointmentForm';

const popupAppointmentNode = document.querySelector(`.popup-appointment`);
const popupForm = popupAppointmentNode.querySelector(`.application-form__form`);
const formSuccessBlock = popupAppointmentNode.querySelector(`.application-form__success-message`);

const appointmentPopupOptions = {
  node: popupAppointmentNode,
  isBodyFixed: true,
  isOverlay: true,
  openConfig: {
    animation: `slide-in-down`
  },
  closeConfig: {}
}

const appointmentPopup = new Popup(appointmentPopupOptions);
appointmentPopup.init();

const appointmentPopupForm = new AppointmentForm(popupForm, formSuccessBlock);
appointmentPopupForm.init();

export { appointmentPopup };
