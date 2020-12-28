export default class MessageManager {
  /**
   * Shows message of different types in specified location
   *
   * @param {string} text - message to be displayed
   * @param {string} type - type of message (error, success, info)
   * @param {Element} place - message node or node, where message node is placed
   */
  showMessage(text, type, place) {
    let messageNode = place;
    if (!place.classList.contains(`message`)) {
      messageNode = place.querySelector(`.message`);
    }
    if (!messageNode) {
      return;
    }

    messageNode.innerHTML = text;
    messageNode.classList.add(`message_${type}`);
    messageNode.classList.remove(`hidden`);
  }

  /**
   * Hides message, clears its contents and remove type classes
   *
   * @param {Element} message - node that should be hidden
   */
  hideMessage(message) {
    message.classList.add(`hidden`);
    message.classList.remove(`message_error`, `message_success`, `message_info`);
    message.textContent = ``;
  }

  /**
   * Hides all messages in specified node
   *
   * @param {Element} place - place, where all messages should be hidden
   */
  hideMessages(place) {
    place.querySelectorAll(`.message`).forEach(messageNode => {
      this.hideMessage(messageNode);
    });
  }
}
