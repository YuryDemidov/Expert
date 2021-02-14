import FormSender from '../../../classes/FormSender';
import { messageManager } from '../../../utils/managers/messageManager';
import { MESSAGES } from '../../../utils/constants/messages';
import { REGEXPS } from '../../../utils/constants/regexps';

const reviewForm = document.querySelector(`.review-form__form`);
const nameInput = reviewForm.querySelector(`[name=name]`);
const emailInput = reviewForm.querySelector(`[name=email]`);
const reviewInput = reviewForm.querySelector(`[name=review]`);
const submitButton = reviewForm.querySelector(`.review-form__submit`);
const messageNode = reviewForm.querySelector(`.review-form__main-message`);

submitButton.addEventListener(`click`, submitFormHandler);
reviewForm.addEventListener(`input`, () => {
  messageManager.hideMessages(reviewForm);
  hideErrorHighlight();
});

const reviewFormManager = new FormSender({
  form: reviewForm,
  url: `/wp-admin/admin-post.php`,
  dataCollector: () => new FormData(reviewForm),
  requestFormat: `FormData`,
  responseDataHandler: data => handleResponse(data),
  errorHandler: error => messageManager.showMessage(error.message || error, `error`, messageNode)
});

function handleResponse(data) {
  if (data && data.result) {
    showSuccessMessage();
    clearForm();
  }
}

function submitFormHandler(evt) {
  evt.preventDefault();

  if (!validateForm()) {
    return;
  }

  reviewFormManager.send();
}

function validateForm() {
  const reviewTextareaWrap = reviewInput.closest(`.review-form__textarea`);
  let validity = true;

  if (!nameInput.value.trim()) {
    messageManager.showMessage(MESSAGES.ERROR.EMPTY_NAME, `error`, nameInput.closest(`.text-input`));
    highlightError(nameInput);
    validity = false;
  }
  if (!REGEXPS.EMAIL.test(emailInput.value.trim()) && emailInput.value.trim() !== ``) {
    messageManager.showMessage(MESSAGES.ERROR.WRONG_EMAIL, `error`, emailInput.closest(`.text-input`));
    highlightError(emailInput);
    validity = false;
  }
  if (!reviewInput.value.trim()) {
    messageManager.showMessage(MESSAGES.ERROR.EMPTY_REVIEW, `error`, reviewTextareaWrap);
    reviewInput.classList.add(`review-form__review_invalid`);
    validity = false;
  }
  if (REGEXPS.SPAM_SYMBOLS_COMBINATION.test(reviewInput.value)) {
    messageManager.showMessage(MESSAGES.ERROR.RESTRICTED_REVIEW_SYMBOLS, `error`, reviewTextareaWrap);
    reviewInput.classList.add(`review-form__review_invalid`);
    validity = false;
  }

  return validity;
}

function highlightError(input) {
  input.classList.add(`text-input__input_invalid`);
}

function hideErrorHighlight() {
  reviewInput.classList.remove(`review-form__review_invalid`);
  reviewForm.querySelectorAll(`.text-input__input_invalid`).forEach(input => {
    input.classList.remove(`text-input__input_invalid`);
  });
}

function showSuccessMessage() {
  messageManager.showMessage(MESSAGES.SUCCESS.REVIEW_RECEIVED, `success`, messageNode);
}

function clearForm() {
  reviewForm.forEach(input => {
    if (input.value) {
      input.value = ``;
      input.setAttribute(`value`, ``);
    }
  });
}
