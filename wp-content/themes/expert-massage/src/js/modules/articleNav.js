import PageNav from '../classes/PageNav';
import { GLOBAL_VARS } from '../utils/constants/globalVars';

const articlePageWrap = document.querySelector(`.article-page__wrap`);
const articleNavigation = articlePageWrap.querySelector(`.article-navigation`);
const floatingNavigationBlock = articleNavigation.querySelector(`.article-navigation__list`);
const articleNav = new PageNav(`#nav-`, articleNavigation, articlePageWrap);
let scrollTriggerPoint;
let floatingBlockTopOffset;
articleNav.init();

globalThis.addEventListener(`scroll`, () => switchNavState());
switchNavState();

function switchNavState() {
  if (globalThis.innerWidth < GLOBAL_VARS.breakpoints.smallDesktopMinWidth) {
    return;
  }
  scrollTriggerPoint = articlePageWrap.offsetHeight + articlePageWrap.offsetTop;
  floatingBlockTopOffset = floatingBlockTopOffset || floatingNavigationBlock.getBoundingClientRect().top;

  if (scrollTriggerPoint < globalThis.pageYOffset + floatingNavigationBlock.offsetHeight + floatingBlockTopOffset) {
    articleNavigation.dataset.state = `absolute`;
  } else {
    articleNavigation.dataset.state = `fixed`;
  }
}
