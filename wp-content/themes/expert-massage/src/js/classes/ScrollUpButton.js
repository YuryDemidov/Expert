export default class ScrollUpButton {
  constructor(node) {
    this.node = node;
  }

  init() {
    this.node.addEventListener(`click`, evt => this.buttonClickHandler(evt));
  }

  get state() {
    return this.node.dataset.state;
  }

  set state(state) {
    this.node.dataset.state = state;
  }

  buttonClickHandler(evt) {
    evt.preventDefault();

    globalThis.scroll({
      top: 0,
      behavior: `smooth`
    });

    evt.target.blur();
  }
}
