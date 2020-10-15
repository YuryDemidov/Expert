import FormSender from '../../classes/FormSender';
import { massageChoosingTestPopup } from './popup';
import { MESSAGES } from '../../utils/constants/messages';
import { messageManager } from '../../utils/managers/messageManager';
import { phoneInputs } from '../textInputs';

const testForm = massageChoosingTestPopup.node.querySelector(`#massageChoosingTest`);
const testFormMessage = massageChoosingTestPopup.node.querySelector(`.popup-massage-test__message`);
const expandingInputs = testForm.querySelectorAll(`[name=test-question-3], [name=test-question-6]`);
const textInputs = testForm.querySelectorAll(`input[type=text], input[type=tel]`);
const negateAnswerQuestionsCheckboxes = {
  question2: testForm.querySelectorAll(`[name=test-question-2]`),
  question5: testForm.querySelectorAll(`[name=test-question-5]`)
};
const nameInput = testForm.querySelector(`#massageChoosingTestName`);
const phoneInput = testForm.querySelector(`#massageChoosingTestPhone`);
const maskedPhoneInput = phoneInputs.find(input => input.input === phoneInput);

expandingInputs.forEach(input => input.addEventListener(`change`, toggleAnswerTextarea));
textInputs.forEach(input => input.addEventListener(`input`, hideErrorHighlight));
for (const question of [2, 5]) {
  negateAnswerQuestionsCheckboxes[`question${question}`].forEach(input => {
    input.addEventListener(`change`, evt => negativeAnswerCheckboxHandler(evt, negateAnswerQuestionsCheckboxes[`question${question}`]));
  });
}
massageChoosingTestPopup.node.addEventListener(`click`, hideErrorMessage);
massageChoosingTestPopup.previousSlideButton.addEventListener(`click`, previousStepButtonClickHandler);
massageChoosingTestPopup.nextSlideButton.addEventListener(`click`, nextStepButtonClickHandler);

function validateSlideData(slide) {
  const result = {
    isValid: true,
    error: ``
  }
  const currentSlide = testForm.querySelector(`.test-slide_${slide}`);

  if (slide === 7) {
    if (!maskedPhoneInput.mask.masked.isComplete) {
      showErrorHighlight(phoneInput);
      result.isValid = false;
      result.error = MESSAGES.ERROR.WRONG_PHONE;
    }
    if (nameInput.value.trim() === ``) {
      showErrorHighlight(nameInput);
      result.isValid = false;
      result.error = MESSAGES.ERROR.EMPTY_NAME;
    }
  } else {
    const answers = currentSlide.querySelectorAll(`input:checked`);
    const textAnswers = currentSlide.querySelectorAll(`input[type=text]`);

    if (!answers.length) {
      result.isValid = false;
      result.error = MESSAGES.ERROR.NOTHING_SELECTED;
      return result;
    }

    textAnswers.forEach(input => {
      if (!input.closest(`.text-input`).classList.contains(`hidden`) && input.value.trim() === ``) {
        showErrorHighlight(input);
        result.isValid = false;
        result.error = MESSAGES.ERROR.EMPTY_FIELD;
      }
    });
  }

  return result;
}

function sendTestData() {
  const testFormManager = new FormSender({
    form: testForm,
    dataCollector: () => new FormData(testForm),
    requestFormat: `FormData`,
    responseDataHandler: data => dataSendSuccessHandler(data),
    errorHandler: error => showErrorMessage(error)
  });

  testFormManager.send();
}

function showErrorMessage(error) {
  let errorText = error;
  if (error.message) {
    errorText = error.message;
  }
  messageManager.showMessage(errorText, `error`, testFormMessage);
}

function hideErrorMessage() {
  messageManager.hideMessage(testFormMessage);
}

function toggleAnswerTextarea(evt) {
  const textInput = evt.target.closest(`.test-slide`).querySelector(`.text-input`);
  if (evt.target.value === `yes`) {
    textInput.classList.remove(`hidden`);
  } else {
    textInput.classList.add(`hidden`);
    hideErrorHighlight();
  }
}

function negativeAnswerCheckboxHandler(evt, nodeList) {
  const targetIndex = Array.prototype.indexOf.call(nodeList, evt.target);
  if (targetIndex === nodeList.length - 1) {
    nodeList.forEach(input => {
      input.checked = false;
    });
    evt.target.checked = true;
  } else {
    nodeList[nodeList.length - 1].checked = false;
  }
}

function showErrorHighlight(input) {
  input.classList.add(`text-input__input_invalid`);
}

function hideErrorHighlight() {
  testForm.querySelectorAll(`.text-input__input_invalid`).forEach(input => {
    input.classList.remove(`text-input__input_invalid`);
  });
}

function previousStepButtonClickHandler(evt) {
  evt.preventDefault();
  massageChoosingTestPopup.switchSlide(--massageChoosingTestPopup.currentSlide);
}

function nextStepButtonClickHandler(evt) {
  evt.preventDefault();
  evt.stopPropagation();

  const validity = validateSlideData(massageChoosingTestPopup.currentSlide);
  if (!validity.isValid) {
    showErrorMessage(validity.error);
    return;
  }

  if (massageChoosingTestPopup.currentSlide === massageChoosingTestPopup.slidesCount) {
    sendTestData();
    return;
  }

  massageChoosingTestPopup.switchSlide(++massageChoosingTestPopup.currentSlide);
}

function dataSendSuccessHandler(data) {
  if (data?.result) {
    massageChoosingTestPopup.showFinalSlide();
    massageChoosingTestPopup.onClose = () => {
      massageChoosingTestPopup.resetView();
      delete massageChoosingTestPopup.onClose;
    }
  }
}
