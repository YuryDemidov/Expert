import IMask from 'imask';
import FormSender from '../classes/FormSender';
import { messageManager } from '../utils/managers/messageManager';
import { MESSAGES } from '../utils/constants/messages';
import { PHONE_MASKS } from '../utils/constants/phoneMasks';
import { REGEXPS } from '../utils/constants/regexps';

const INITIAL_PHONE_INPUT = `+7(`;
const applicationForm = document.querySelector(`.application-form__form`);
const nameInput = applicationForm.querySelector(`[name=name]`);
const phoneInput = applicationForm.querySelector(`[name=phone]`);
const personalDataCheckbox = applicationForm.querySelector(`#applicationFormPersonalData`);
const submitButton = applicationForm.querySelector(`.application-form__submit`);

submitButton.addEventListener(`click`, formSubmitHandler);
nameInput.addEventListener(`input`, hideErrors);
phoneInput.addEventListener(`input`, hideErrors);
personalDataCheckbox.addEventListener(`change`, hideErrors);

const maskedPhoneInput = IMask(phoneInput, {
  mask: toggleMaskPlaceholderOption(PHONE_MASKS),
  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, ``);

    return dynamicMasked.compiledMasks.find(function (m) {
      return number.indexOf(m.startsWith) === 0;
    });
  }
});
toggleMaskPlaceholderOption(PHONE_MASKS, false);

phoneInput.addEventListener('focus', () => {
  if (maskedPhoneInput.value === ``) {
    maskedPhoneInput.value = INITIAL_PHONE_INPUT;
  }

  maskedPhoneInput.updateCursor(maskedPhoneInput.value.length);

  maskedPhoneInput.updateOptions({
    mask: toggleMaskPlaceholderOption(maskedPhoneInput.mask, false)
  });
});

phoneInput.addEventListener('blur', () => {
  maskedPhoneInput.updateOptions({
    mask: toggleMaskPlaceholderOption(maskedPhoneInput.mask)
  });

  if (maskedPhoneInput.value === INITIAL_PHONE_INPUT || REGEXPS.NON_DIGIT.test(maskedPhoneInput.value)) {
    maskedPhoneInput.value = ``;
  }
});

function formSubmitHandler(evt) {
  evt.preventDefault();

  const validity = validateForm();
  if (!validity.isValid) {
    messageManager.showMessage(validity.error, `error`, applicationForm);
    return;
  }
  sendApplicationForm();
}

function sendApplicationForm() {
  const applicationFormManager = new FormSender({
    form: applicationForm,
    dataCollector: () => new FormData(applicationForm),
    requestFormat: `FormData`,
    responseDataHandler: data => messageManager.showMessage(`Форма отправлена и получен ответ: ${data}`, `success`, applicationForm),
    errorHandler: error => messageManager.showMessage(`Форма отправлена, но ответ не получен. Ошибка: ${error}`, `error`, applicationForm)
  })

  applicationFormManager.send();
}

function validateForm() {
  const result = {
    isValid: true,
    error: ``
  }

  if (!personalDataCheckbox.checked) {
    result.isValid = false;
    result.error = MESSAGES.ERROR.PERSONAL_DATA_AGREEMENT
    showErrorHighlight(personalDataCheckbox);
  }

  if (!maskedPhoneInput.masked.isComplete) {
    result.isValid = false;
    result.error = MESSAGES.ERROR.WRONG_PHONE;
    showErrorHighlight(phoneInput);
  }

  if (phoneInput.value.trim() === ``) {
    result.isValid = false;
    result.error = MESSAGES.ERROR.EMPTY_PHONE;
    showErrorHighlight(phoneInput);
  }

  if (nameInput.value.trim() === ``) {
    result.isValid = false;
    result.error = MESSAGES.ERROR.EMPTY_NAME;
    showErrorHighlight(nameInput);
  }

  return result;
}

function showErrorHighlight(input) {
  if (input.type === `checkbox`) {
    input.classList.add(`custom-checkbox__input_invalid`);
  } else {
    input.classList.add(`application-form__input_invalid`);
  }
}

function hideErrors(evt) {
  evt.target.classList.remove(`custom-checkbox__input_invalid`, `application-form__input_invalid`);
  messageManager.hideMessages(applicationForm);
}

function toggleMaskPlaceholderOption(mask, hide = true) {
  return mask.map(mask => {
    mask.lazy = hide;
    return mask;
  })
}
