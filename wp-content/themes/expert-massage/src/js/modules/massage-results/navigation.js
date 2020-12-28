import { backResultsSlider } from './backResultsSlider';
import { figureResultsSlider } from './figureResultsSlider';

export const massageResultsBlock = document.querySelector(`.massage-results`);
const navWrap = massageResultsBlock.querySelector(`.massage-results__nav`);
const navConfig = new Map();
const navLinks = navWrap.querySelectorAll(`[data-section-id]`);
let activeLink;
let activeSection;

navLinks.forEach(link => {
  navConfig.set(link, document.querySelector(`#${link.dataset.sectionId}`));

  if (link.dataset.active === ``) {
    activeLink = link;
    activeSection = navConfig.get(link);
  }
});

navWrap.addEventListener(`click`, navClickHandler);

function navClickHandler(evt) {
  evt.preventDefault();

  if (navConfig.has(evt.target) && evt.target !== activeLink) {
    switchTab(evt.target);

    if (activeSection.id === `backResults`) {
      backResultsSlider && backResultsSlider.updateSliderHeight();
    }
    if (activeSection.id === `figureResults`) {
      figureResultsSlider && figureResultsSlider.updateSliderHeight();
    }
  }
}

function switchTab(tabTrigger) {
  delete activeLink.dataset.active;
  activeSection.classList.add(`hidden`);

  activeLink = tabTrigger;
  activeSection = navConfig.get(tabTrigger);

  activeLink.dataset.active = ``;
  activeSection.classList.remove(`hidden`);
}
