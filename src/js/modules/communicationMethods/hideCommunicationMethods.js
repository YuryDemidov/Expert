export default function hideCommunicationMethods() {
  this.openButtons.forEach(button => {
    button.closest(`.communication-methods`).dataset.hidden = ``;
  });
}
