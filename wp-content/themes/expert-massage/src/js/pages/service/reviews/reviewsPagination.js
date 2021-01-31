import { reviewsBlock } from './reviewsBlock';

const reviewsPagination = reviewsBlock.querySelector(`.pagination`);
const SCROLL_GAP = 50;

scrollPageToReviews();

reviewsPagination.addEventListener(`click`, paginationClickHandler);

function renderReviewsPagination(paginationMarkup) {
  reviewsPagination.innerHTML = paginationMarkup;
  reviewsPagination.querySelectorAll(`a.page-numbers`).forEach(link => {
    link.href = link.href.replace(`&action=reviews-filters`, ``);
  });
}

function paginationClickHandler(evt) {
  if (evt.target.href) {
    sessionStorage.setItem(`pagination`, `click`);
  }
}

function scrollPageToReviews() {
  if (sessionStorage.getItem(`pagination`) === `click`) {
    sessionStorage.removeItem(`pagination`);
    globalThis.scrollTo(0, reviewsBlock.offsetTop - SCROLL_GAP);
  }
}

export { renderReviewsPagination };
