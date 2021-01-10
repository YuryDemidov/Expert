import Popup from '../../classes/Popup/Popup';
import hideCommunicationMethods from '../communicationMethods/hideCommunicationMethods';
import showCommunicationMethods from '../communicationMethods/showCommunicationMethods';
import switchPopupAnimation from '../communicationMethods/switchPopupAnimation';
import { phoneInputs } from '../textInputs';
import { MESSAGES } from '../../utils/constants/messages';
import { messageManager } from '../../utils/managers/messageManager';
import FormSender from '../../classes/FormSender';

const popupCallbackForm = document.querySelector(`.popup-callback-form`);

const callbackFormPopupOptions = {
  node: popupCallbackForm,
  isBodyFixed: false,
  isOverlay: false,
  openConfig: {
    animation: switchPopupAnimation(),
    onOpen: hideCommunicationMethods
  },
  closeConfig: {
    onClose: showCommunicationMethods
  }
}

const callbackFormPopup = new Popup(callbackFormPopupOptions);
callbackFormPopup.init();
globalThis.addEventListener(`resize`, () => {
  callbackFormPopup.openAnimation = switchPopupAnimation();
});

const callbackForm = popupCallbackForm.querySelector(`.callback-form__form`);
const callbackFormSubmitter = callbackForm.querySelector(`.callback-form__submit`);
const formPhoneInput = callbackForm.querySelector(`[name=phone]`);
const maskedPhoneInput = phoneInputs.find(input => input.input === formPhoneInput);
const messageNode = callbackForm.querySelector(`.message`);
const formSender = new FormSender({
  form: callbackForm,
  url: `/wp-admin/admin-post.php`,
  dataCollector: () => new FormData(callbackForm),
  requestFormat: `FormData`,
  responseDataHandler: data => processResponse(data),
  errorHandler: error => messageManager.showMessage(error, `error`, messageNode)
});

callbackForm.addEventListener(`input`, () => {
  formPhoneInput.classList.remove(`text-input__input_invalid`);
  messageManager.hideMessages(callbackForm);
});
callbackFormSubmitter.addEventListener(`click`, evt => {
  evt.preventDefault();
  if (!validatePhone()) {
    return;
  }

  formSender.send();
});

function validatePhone() {
  if (!maskedPhoneInput.mask.masked.isComplete) {
    formPhoneInput.classList.add(`text-input__input_invalid`);
    messageManager.showMessage(MESSAGES.ERROR.WRONG_PHONE, `error`, messageNode);
    return false;
  }

  return true;
}

function processResponse(data) {
  if (data?.result) {
    messageManager.showMessage(MESSAGES.SUCCESS.CALLBACK_REQUEST_RECEIVED, `success`, messageNode);
  }
}
