import Popup from '../../classes/Popup/Popup';
import AppointmentForm from '../../classes/AppointmentForm';

const popupAppointmentNode = document.querySelector(`.popup-appointment`);
const popupForm = popupAppointmentNode.querySelector(`.application-form__form`);

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

const appointmentPopupForm = new AppointmentForm(popupForm);
appointmentPopupForm.init();
