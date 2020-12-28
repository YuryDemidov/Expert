import { appointmentPopup } from './popups/popupAppointment';

const certificateWrap = document.querySelector(`.certificate__content`);
const popupOpenButton = certificateWrap.querySelector(`.certificate__button`);

popupOpenButton.addEventListener(`click`, addCertificateField);

function addCertificateField(evt) {
  evt.preventDefault();

  appointmentPopup.node.querySelector(`[name=need-certificate]`).value = true;
  appointmentPopup.onClose = removeCertificateField;
}

function removeCertificateField() {
  appointmentPopup.node.querySelector(`[name=need-certificate]`).value = ``;
  appointmentPopup.onClose = null;
}
