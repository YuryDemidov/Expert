import { GLOBAL_VARS } from '../utils/constants/globalVars';
import scrollToAnchor from '../utils/functions/scrollToAnchor';
import throttle from '../utils/decorators/throttle';
import isPartiallyInViewport from '../utils/functions/isPartiallyInViewport';

export default class PageNav {
  constructor(selector, anchorsWrap = document.body.querySelector(`main`), sectionsWrap = document.body.querySelector(`main`)) {
    this.navConfig = {};
    this.anchors = [];
    this.sections = [];
    this.selector = selector;
    this.anchorsWrap = anchorsWrap;
    this.sectionsWrap = sectionsWrap;
    this.activeLink = this.anchorsWrap.querySelector(`[data-active]`);

    this.desktopHeaderOffset = 100;
    this.mobileHeaderOffset = 80;

    this.throttledSwitchOnScroll = null;
    this.scrollThrottlingDelay = 60;
    this.clickedLink = null;

    let i = 1;
    let section;
    do {
      section = this.sectionsWrap.querySelector(`${selector}${i}`);
      if (section) {
        const anchors = this.anchorsWrap.querySelectorAll(`[href='${selector}${i}']`)
        this.navConfig[`${selector}${i}`] = {
          section: section,
          anchors: anchors
        };
        this.sections.push(section);
        this.anchors.push(...anchors);
      }
      i++;
    } while (section);
  }

  init() {
    this.anchorsWrap.addEventListener(`click`, evt => this.navigateToSection(evt));

    this.switchOnScroll();
    this.throttledSwitchOnScroll = throttle(this.switchOnScroll.bind(this), this.scrollThrottlingDelay);
    globalThis.addEventListener(`scroll`, this.throttledSwitchOnScroll);
  }

  navigateToSection(evt) {
    if (!evt.target.href) {
      return;
    }

    const navigationHref = evt.target.getAttribute(`href`);
    if (!navigationHref || navigationHref === `#`) {
      return;
    }

    evt.preventDefault();
    this.clickedLink = evt.target;
    scrollToAnchor({
      node: this.navConfig[evt.target.getAttribute(`href`)].section,
      gap: this.getHeaderOffset()
    });
  }

  switchActive(anchor) {
    if (this.activeLink === anchor) {
      return;
    }

    delete this.activeLink.dataset.active;
    this.activeLink = anchor;
    this.activeLink.dataset.active = ``;
  }

  switchOnScroll() {
    if (!globalThis.pageYOffset) {
      return;
    }

    for (let i = 0; i < this.sections.length; i++) {
      if (isPartiallyInViewport(this.sections[i]) && this.sections[i].getBoundingClientRect().top <= this.getHeaderOffset() * 2) {
        const anchor = this.navConfig[`${this.selector}${i + 1}`].anchors[0];
        if (anchor === this.clickedLink || !this.clickedLink) {
          anchor && this.switchActive(anchor);
          this.clickedLink = null;
        }
      }
    }
  }

  getHeaderOffset() {
    return globalThis.innerWidth >= GLOBAL_VARS.breakpoints.smallDesktopMinWidth
      ? this.desktopHeaderOffset
      : this.mobileHeaderOffset;
  }
}
