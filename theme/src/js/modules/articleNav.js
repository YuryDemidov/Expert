import PageNav from '../classes/PageNav';
import { GLOBAL_VARS } from '../utils/constants/globalVars';

const articlePageWrap = document.querySelector(`.article-page__wrap`);
const articleNavigation = articlePageWrap.querySelector(`.article-navigation`);
const articleNav = new PageNav(`#nav-`, articleNavigation, articlePageWrap);
articleNav.init();

globalThis.addEventListener(`scroll`, () => switchNavState());

function switchNavState() {
  if (globalThis.innerWidth < GLOBAL_VARS.breakpoints.smallDesktopMinWidth) {
    return;
  }

  const articleWrapBottomOffset = globalThis.innerHeight - articlePageWrap.getBoundingClientRect().bottom;
  if (articleWrapBottomOffset > 0) {
    articleNavigation.dataset.state = `absolute`;
  } else {
    articleNavigation.dataset.state = `fixed`;
  }
}
