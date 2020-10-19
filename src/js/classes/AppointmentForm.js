import FormSender from './FormSender';
import IMask from 'imask';
import { messageManager } from '../utils/managers/messageManager';
import { MESSAGES } from '../utils/constants/messages';
import { PHONE_MASKS } from '../utils/constants/phoneMasks';
import { REGEXPS } from '../utils/constants/regexps';
import toggleMaskPlaceholderOption from '../utils/functions/mask/toggleMaskPlaceholderOption';

export default class AppointmentForm {
  constructor(form) {
    this.INITIAL_PHONE_INPUT = `+7(`;
    this.form = form;
    this.nameInput = form.querySelector(`[name=name]`);
    this.phoneInput = form.querySelector(`[name=phone]`);
    this.personalDataCheckbox = form.querySelector(`[name=personal-data-agreement]`);
    this.submitButton = form.querySelector(`.application-form__submit`);
    this.maskedPhoneInput = null;
    this.formManager = null;
  }

  init() {
    this.formManager = new FormSender({
      form: this.form,
      dataCollector: () => new FormData(this.form),
      requestFormat: `FormData`,
      responseDataHandler: data => messageManager.showMessage(`Форма отправлена и получен ответ: ${data}`, `success`, this.form),
      errorHandler: error => messageManager.showMessage(`Форма отправлена, но ответ не получен. Ошибка: ${error}`, `error`, this.form)
    });

    this.initPhoneMask();

    this.submitButton.addEventListener(`click`, evt => this.formSubmitHandler(evt));
    this.nameInput.addEventListener(`input`, evt => this.hideErrors(evt));
    this.phoneInput.addEventListener(`input`, evt => this.hideErrors(evt));
    this.personalDataCheckbox.addEventListener(`change`, evt => this.hideErrors(evt));
  }

  formSubmitHandler(evt) {
    evt.preventDefault();

    const validity = this.validate();
    if (!validity.isValid) {
      messageManager.showMessage(validity.error, `error`, this.form);
      return;
    }

    this.formManager.send();
  }

  validate() {
    const result = {
      isValid: true,
      error: ``
    }

    if (!this.personalDataCheckbox.checked) {
      result.isValid = false;
      result.error = MESSAGES.ERROR.PERSONAL_DATA_AGREEMENT
      this.showErrorHighlight(this.personalDataCheckbox);
    }

    if (!this.maskedPhoneInput.masked.isComplete) {
      result.isValid = false;
      result.error = MESSAGES.ERROR.WRONG_PHONE;
      this.showErrorHighlight(this.phoneInput);
    }

    if (this.phoneInput.value.trim() === ``) {
      result.isValid = false;
      result.error = MESSAGES.ERROR.EMPTY_PHONE;
      this.showErrorHighlight(this.phoneInput);
    }

    if (this.nameInput.value.trim() === ``) {
      result.isValid = false;
      result.error = MESSAGES.ERROR.EMPTY_NAME;
      this.showErrorHighlight(this.nameInput);
    }

    return result;
  }

  initPhoneMask() {
    this.maskedPhoneInput = IMask(this.phoneInput, {
      mask: toggleMaskPlaceholderOption(PHONE_MASKS),
      dispatch: function (appended, dynamicMasked) {
        const number = (dynamicMasked.value + appended).replace(/\D/g, ``);

        return dynamicMasked.compiledMasks.find(function (m) {
          return number.indexOf(m.startsWith) === 0;
        });
      }
    });
    toggleMaskPlaceholderOption(PHONE_MASKS, false);

    this.phoneInput.addEventListener('focus', () => {
      if (this.maskedPhoneInput.value === ``) {
        this.maskedPhoneInput.value = this.INITIAL_PHONE_INPUT;
      }

      this.maskedPhoneInput.updateCursor(this.maskedPhoneInput.value.length);

      this.maskedPhoneInput.updateOptions({
        mask: toggleMaskPlaceholderOption(this.maskedPhoneInput.mask, false)
      });
    });

    this.phoneInput.addEventListener('blur', () => {
      this.maskedPhoneInput.updateOptions({
        mask: toggleMaskPlaceholderOption(this.maskedPhoneInput.mask)
      });

      if (this.maskedPhoneInput.value === this.INITIAL_PHONE_INPUT || REGEXPS.NON_DIGIT.test(this.maskedPhoneInput.value)) {
        this.maskedPhoneInput.value = ``;
      }
    });
  }

  showErrorHighlight(input) {
    if (input.type === `checkbox`) {
      input.classList.add(`custom-checkbox__input_invalid`);
    } else {
      input.classList.add(`application-form__input_invalid`);
    }
  }

  hideErrors(evt) {
    evt.target.classList.remove(`custom-checkbox__input_invalid`, `application-form__input_invalid`);
    messageManager.hideMessages(this.form);
  }
}
