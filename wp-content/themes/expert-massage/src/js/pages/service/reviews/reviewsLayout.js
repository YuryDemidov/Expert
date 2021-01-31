import Masonry from 'masonry-layout/masonry';
import checkDeviceWidth from '../../../utils/functions/checkDeviceWidth';
import { reviewsBlock } from './reviewsBlock';

const reviewsWrap = reviewsBlock.querySelector('.reviews__wrap');

createLayout();

function createLayout() {
  if (checkDeviceWidth().isMobile) {
    return;
  }
  // eslint-disable-next-line no-unused-vars
  const masonryGrid = new Masonry(reviewsWrap, {
    itemSelector: '.review-card',
    columnWidth: '.review-card'
  });
}

export { reviewsBlock, reviewsWrap, createLayout };
