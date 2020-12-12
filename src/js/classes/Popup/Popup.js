import animateCss from '../../utils/functions/animateCss';
import { BODY_STATES } from '../../utils/constants/enums/bodyStates';

export default class Popup {
  constructor(options) {
    this.node = options.node;
    this.name = this.node.dataset.popupName;

    this.openButtons = options.openConfig.triggers || [];
    document.querySelectorAll(`[data-open-popup=${this.name}]`)
      .forEach(openTrigger => this.openButtons.push(openTrigger));

    this.closeButtons = options.closeConfig.triggers || [];
    document.querySelectorAll(`[data-close-popup=${this.name}], [data-close-popup='all']`)
      .forEach(closeTrigger => this.closeButtons.push(closeTrigger));

    this.isOverlay = options.isOverlay;
    if (!this.isOverlay) {
      this.isBodyFixed = options.isBodyFixed;
    }
    this.isOpened = false;

    this.openAnimation = options.openConfig.animation;
    this.closeAnimation = options.closeConfig.animation;
    this.onInit = options.onInit;
    this.onOpen = options.openConfig?.onOpen;
    this.onClose = options.closeConfig?.onClose;
  }

  init() {
    this._configureButtonListeners(this.openButtons, this.open);

    if (this.onInit) {
      this.onInit();
    }
  }

  open(evt) {
    if (this.node.classList.contains(`animated`)) {
      return;
    }
    this.isOpened = true;

    this.node.dataset.popup = `opened`;
    if (this.isBodyFixed) {
      document.body.dataset.state = BODY_STATES.noscroll;
    }
    if (this.isOverlay) {
      document.body.dataset.state = BODY_STATES.popup;
      animateCss(`[data-close-popup='all']`, `fade-in`);
    }
    if (!this.isOverlay && !this.isBodyFixed) {
      document.body.dataset.state = BODY_STATES.notOverlayPopup
    }

    if (this.onOpen) {
      this.onOpen(evt);
    }

    if (this.openAnimation) {
      animateCss(this.node, this.openAnimation, () => {
        this._configureButtonListeners(this.closeButtons, this.close);
      });
    } else {
      setTimeout(() => this._configureButtonListeners(this.closeButtons, this.close));
    }

    if (this.isOverlay) {
      this.boundedEscapePressHandler = this.escapePressHandler.bind(this);
      globalThis.addEventListener(`keyup`, this.boundedEscapePressHandler);
    }
  }

  close(evt) {
    if (this.node.classList.contains(`animated`)) {
      return;
    }

    if (!this.isOpened) {
      return;
    }
    this.isOpened = false;

    if (this.onClose) {
      this.onClose(evt);
    }

    if (this.closeAnimation) {
      animateCss(this.node, this.closeAnimation, () => this._popupCloseHandler());
    } else {
      setTimeout(() => this._popupCloseHandler());
    }
  }

  _popupCloseHandler() {
    this.node.dataset.popup = `closed`;
    this._configureButtonListeners(this.openButtons, this.open);
    document.body.dataset.state = BODY_STATES.initial;
    if (this.isOverlay) {
      globalThis.removeEventListener(`keyup`, this.boundedEscapePressHandler);
    }
  }

  _configureButtonListeners(buttons, action) {
    if (!buttons || !action) {
      return;
    }

    buttons.forEach(button => {
      button.onclick = evt => {
        evt.preventDefault();
        action.call(this, evt);
      }
    });
  }

  escapePressHandler(evt) {
    if (evt.key !== `Escape`) {
      return;
    }

    if (this.node.contains(document.activeElement)) {
      document.activeElement.blur();
    } else {
      this.close();
    }
  }
}
