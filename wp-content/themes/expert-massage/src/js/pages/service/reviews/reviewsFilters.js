import FormSender from '../../../classes/FormSender';
import { logManager } from '../../../utils/managers/logManager';
import { queryParamsManager } from '../../../utils/managers/queryParamsManager';
import delay from '../../../utils/functions/promiseTimeout';
import animateCss from '../../../utils/functions/animateCss';
import { reviewsBlock } from './reviewsBlock';
import { createLayout, reviewsWrap } from './reviewsLayout';
import { renderReviewsPagination } from './reviewsPagination';

const filtersWrap = reviewsBlock.querySelector(`.reviews-filters__list`);
const allReviewsFilter = filtersWrap.querySelector(`[data-type=all]`)
const massageFilters = filtersWrap.querySelectorAll(`[data-massage]`);
const specialistFilters = filtersWrap.querySelectorAll(`[data-specialist]`);
let filtersSender;

initialFiltersSetup();
filtersWrap.addEventListener(`click`, evt => handleFilterChange(evt));

function initialFiltersSetup() {
  const activeMassageFilter = filtersWrap.querySelector(`[data-massage='${
    queryParamsManager.getParamFromGET(`massage`)
  }']`);
  const activeSpecialistFilter = filtersWrap.querySelector(`[data-specialist='${
    queryParamsManager.getParamFromGET(`specialist`)
  }']`);
  activeMassageFilter && (activeMassageFilter.dataset.active = ``);
  activeSpecialistFilter && (activeSpecialistFilter.dataset.active = ``);
  (activeMassageFilter || activeSpecialistFilter) && delete allReviewsFilter.dataset.active;
}

function handleFilterChange(evt) {
  if (evt.target.type !== `button` || evt.target.dataset.active === ``) {
    return;
  }

  const dataParams = evt.target.dataset;
  if (dataParams.type === `all`) {
    setCheckedFilters(filtersWrap.querySelectorAll(`[data-active]`));
    dataParams.active = ``;
    sendChangeRequest();
  } else if (dataParams.massage) {
    enableMassageFilter(dataParams.massage);
  } else if (dataParams.specialist) {
    enableSpecialistFilter(dataParams.specialist);
  }
}

function setCheckedFilters(group, checkedFilterId = `all`) {
  const urlParts = globalThis.location.href.split('?');
  let url = urlParts[0];
  let massageParam = queryParamsManager.getParamFromGET(`massage`);
  let specialistParam = queryParamsManager.getParamFromGET(`specialist`);

  group.forEach(filter => {
    if (filter.dataset.massage === checkedFilterId || filter.dataset.specialist === checkedFilterId) {
      filter.dataset.active = ``;
      delete allReviewsFilter.dataset.active;

      if (filter.dataset.massage) {
        massageParam = checkedFilterId;
      }
      if (filter.dataset.specialist) {
        specialistParam = checkedFilterId;
      }
    } else {
      delete filter.dataset.active;
    }
  });

  if (massageParam && specialistParam) {
    url = `${url}?massage=${massageParam}&specialist=${specialistParam}`;
  } else if (massageParam || specialistParam) {
    url = `${url}?${massageParam ? `massage=${massageParam}` : `specialist=${specialistParam}`}`;
  }

  if (checkedFilterId === `all`) {
    url = urlParts[0];
  }

  history.pushState(null, ``, url);

  return url;
}

function enableMassageFilter(id) {
  const checkedFiltersUrl = setCheckedFilters(massageFilters, id);
  sendChangeRequest(checkedFiltersUrl);
}

function enableSpecialistFilter(id) {
  const checkedFiltersUrl = setCheckedFilters(specialistFilters, id);
  sendChangeRequest(checkedFiltersUrl);
}

function sendChangeRequest(url) {
  const urlSearch = url && url.split(`?`)[1];

  filtersSender = filtersSender || new FormSender({
    url: `${globalThis.PHP_DATA.ajaxUrl}?action=reviews-filters`,
    method: `get`,
    responseDataHandler: data => handleReviewsData(data),
    errorHandler: error => logManager.logError(error)
  });
  filtersSender.url = `${globalThis.PHP_DATA.ajaxUrl}?action=reviews-filters${urlSearch ? `&${urlSearch}` : ''}`;

  filtersSender.send();
}

function handleReviewsData(data) {
  if (!data) {
    return;
  }

  renderReviewsList(data.reviews);
  renderReviewsPagination(data.pagination);
}

function renderReviewsList(reviews) {
  reviewsWrap.style.visibility = `hidden`;
  reviewsWrap.textContent = ``;
  reviews.forEach(review => {
    const reviewCard = renderReviewCard(review);
    reviewsWrap.appendChild(reviewCard);
  });
  delay(150)
    .then(() => {
      reviewsWrap.style.visibility = `visible`;
      animateCss(reviewsWrap, `fade-in`);
      createLayout();
    });
}

function renderReviewCard(review) {
  const reviewCard = document.createElement(`article`);
  reviewCard.classList.add(`review-card`);

  const reviewText = document.createElement(`p`);
  reviewText.classList.add(`review-card__text`);
  reviewText.textContent = review.text

  const reviewInfo = document.createElement(`p`);
  reviewInfo.classList.add(`review-card__info`);
  reviewInfo.textContent = `${review.author}, ${review.date}`;

  // TODO To show source on review card enable this block
  /* const reviewSource = document.createElement(`p`);
  reviewSource.classList.add(`review-card__source`);
  let reviewSourceContent;
  if (review.source === `site`) {
    reviewSourceContent = document.createElement(`span`);
    reviewSourceContent.textContent = `отзыв с сайта`;
  } else {
    reviewSourceContent = document.createElement(`img`);
    reviewSourceContent.classList.add(`review-card__yandex-logo`);
    reviewSourceContent.src = `${globalThis.PHP_DATA.imagesUrl}/reviews-block/yandex-logo.svg`;
    reviewSourceContent.alt = `Отзыв из Яндекса`;
    reviewSourceContent.width = 41;
    reviewSourceContent.height = 15;
  }
  reviewSource.appendChild(reviewSourceContent); */

  reviewCard.appendChild(reviewText);
  reviewCard.appendChild(reviewInfo);
  // reviewCard.appendChild(reviewSource);

  return reviewCard;
}
