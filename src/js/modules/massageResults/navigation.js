const massageResultsBlock = document.querySelector(`.massage-results`);
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

navWrap.addEventListener(`click`, switchTab);

function switchTab(evt) {
  evt.preventDefault();

  if (navConfig.has(evt.target) && evt.target !== activeLink) {
    delete activeLink.dataset.active;
    activeSection.classList.add(`hidden`);

    activeLink = evt.target;
    activeSection = navConfig.get(evt.target);

    activeLink.dataset.active = ``;
    activeSection.classList.remove(`hidden`);
  }
}
