export default function hideCommunicationMethods() {
  this.openButtons.forEach(button => {
    delete button.closest(`.communication-methods`).dataset.hidden;
  });
}
