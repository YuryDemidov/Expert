import PopupTest from '../../classes/Popup/PopupTest';

const popupOptions = {
  node: document.querySelector(`.popup-massage-test`),
  isBodyFixed: true,
  isOverlay: true,
  openConfig: {
    animation: `slide-in-down`
  },
  closeConfig: {
    animation: `slide-out-up`
  }
}

const massageChoosingTestPopup = new PopupTest(popupOptions);
massageChoosingTestPopup.init();

export { massageChoosingTestPopup };
