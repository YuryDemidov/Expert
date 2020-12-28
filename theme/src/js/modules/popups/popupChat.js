import Popup from '../../classes/Popup/Popup';
import hideCommunicationMethods from '../communicationMethods/hideCommunicationMethods';
import showCommunicationMethods from '../communicationMethods/showCommunicationMethods';
import switchPopupAnimation from '../communicationMethods/switchPopupAnimation';

const popupChat = document.querySelector(`.online-chat__popup`);

const chatPopupOptions = {
  node: popupChat,
  isBodyFixed: false,
  isOverlay: false,
  openConfig: {
    animation: switchPopupAnimation(),
    onOpen: hideCommunicationMethods
  },
  closeConfig: {
    onClose: showCommunicationMethods
  }
}

const chatPopup = new Popup(chatPopupOptions);
chatPopup.init();
globalThis.addEventListener(`resize`, () => {
  chatPopup.openAnimation = switchPopupAnimation();
});
