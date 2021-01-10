import FormSender from '../../classes/FormSender';
import { massageChoosingTestPopup } from './popup';
import { MESSAGES } from '../../utils/constants/messages';
import { messageManager } from '../../utils/managers/messageManager';
import { phoneInputs } from '../textInputs';
import delay from '../../utils/functions/promiseTimeout';

const NO_DATA_PHRASE = `Ничего из этого`;
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
    url: `/wp-admin/admin-post.php`,
    dataCollector: () => collectTestFormData(),
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

function collectTestFormData() {
  const testFormData = new FormData(testForm);
  let problems;
  let expectations;

  testFormData.append(`age`, testFormData.get(`test-question-1`));

  problems = testFormData.getAll(`test-question-2`).join(`; `);
  if (problems === NO_DATA_PHRASE) {
    problems = ``;
  }

  expectations = testFormData.getAll(`test-question-4`).join('; ');
  expectations = expectations.replaceAll(/&amp;shy;/g, ``);
  testFormData.append(`expectations`, expectations);

  if (testFormData.get(`test-question-5`) !== NO_DATA_PHRASE) {
    problems += `${
      problems ? '; ' : ''
    }${
      testFormData.getAll(`test-question-5`).join(`; `)
    }`;
  }
  testFormData.append(`problems`, problems);

  testFormData.delete(`test-question-1`);
  testFormData.delete(`test-question-2`);
  testFormData.delete(`test-question-3`);
  testFormData.delete(`test-question-4`);
  testFormData.delete(`test-question-5`);
  testFormData.delete(`test-question-6`);

  return testFormData;
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
      delay(400)
        .then(() => {
          massageChoosingTestPopup.resetView();
          delete massageChoosingTestPopup.onClose;
        });
    }
  }
}
