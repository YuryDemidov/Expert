import { appointmentPopup } from '../popups/popupAppointment';

const resultsWrapper = document.querySelector(`.massage-results`);
const appointmentButtons = resultsWrapper.querySelectorAll(`[data-massage-id]`);

appointmentButtons.forEach(button => {
  button.addEventListener(`click`, () => addMassageId(button.dataset.massageId));
});

function addMassageId(id) {
  appointmentPopup.node.querySelector(`[name=massage-id]`).value = id;
  appointmentPopup.onClose = clearMassageId;
}

function clearMassageId() {
  appointmentPopup.node.querySelector(`[name=massage-id]`).value = ``;
  appointmentPopup.onClose = null;
}

export { resultsWrapper };
