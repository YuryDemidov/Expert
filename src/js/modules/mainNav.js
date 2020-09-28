import { pageHeader } from './pageHeader';
import { GLOBAL_VARS } from '../utils/constants/globalVars';
import animateCss from '../utils/functions/animateCss';

const mainNavTrigger = pageHeader.querySelector(`.page-header__menu-trigger`);
const mainNav = pageHeader.querySelector(`.main-menu`);
const mainNavList = mainNav.querySelector(`.main-menu__list`);
const submenu = mainNav.querySelector(`.submenu`);
const submenuTrigger = mainNav.querySelector(`.main-menu__submenu-trigger`);
const promoBanner = mainNav.querySelector(`.submenu__promo-link`);

mainNavTrigger.addEventListener(`click`, evt => toggleMobileMenu(evt));

toggleMenuContent();
window.addEventListener(`resize`, () => toggleMenuContent());

function dropdownToggleHandler(evt) {
  if (evt.target.classList.contains(`dropdown__trigger`)) {
    const dropdown = evt.target.closest(`.dropdown`);
    evt.preventDefault();
    dropdown.dataset.state = dropdown.dataset.state === `closed` ? `opened` : `closed`;
  }
}

function movePromoBannerToSubmenu() {
  const promoBannerNode = promoBanner.parentNode.removeChild(promoBanner);
  submenu.appendChild(promoBannerNode);
  mainNavList.removeChild(mainNavList.querySelector(`.main-menu__list-item:last-of-type`));
}

function movePromoBannerToMenu() {
  const promoBannerNode = promoBanner.parentNode.removeChild(promoBanner);
  const newMenuItem = document.createElement(`li`);
  newMenuItem.classList.add(`main-menu__list-item`);
  newMenuItem.appendChild(promoBannerNode);
  mainNavList.appendChild(newMenuItem);
}

function toggleMenuContent() {
  if (globalThis.innerWidth < GLOBAL_VARS.breakpoints.tabletMinWidth) {
    if (!promoBanner.parentNode.classList.contains(`main-menu__list-item`)) {
      movePromoBannerToMenu();
    }
    if (submenuTrigger.dataset.on !== `click`) {
      submenuTrigger.dataset.on = `click`;
      submenuTrigger.addEventListener(`click`, dropdownToggleHandler)
    }
  } else {
    if (!promoBanner.parentNode.classList.contains(`submenu`)) {
      movePromoBannerToSubmenu();
    }
    if (submenuTrigger.dataset.on !== `hover`) {
      submenuTrigger.dataset.on = `hover`;
      submenuTrigger.dataset.state = `closed`;
      submenuTrigger.removeEventListener(`click`, dropdownToggleHandler)
    }
  }
}

function toggleMobileMenu(evt) {
  evt.preventDefault();

  if (pageHeader.dataset.state === `menu`) {
    mainNavTrigger.dataset.state = `initial`;
    animateCss(mainNav, `slide-out-up`, () => {
      delete document.body.dataset.state;
      delete pageHeader.dataset.state;
    });
  } else {
    document.body.dataset.state = `noscroll`;
    pageHeader.dataset.state = `menu`;
    mainNavTrigger.dataset.state = `active`;
    animateCss(mainNav, `slide-in-down`);
  }
}
