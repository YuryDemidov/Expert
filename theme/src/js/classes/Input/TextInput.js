export default class TextInput {
  constructor(wrapNode) {
    this.wrapNode = wrapNode;
    this.input = this.wrapNode.querySelector(`input[type='email'], input[type='password'], input[type='search'], input[type='tel'], input[type='text'], input[type='url']`);
  }

  init() {
    if (this.input) {
      this.addEvents();
    }
  }

  addEvents() {
    this.input.addEventListener(`blur`, evt => this.changeValue(evt.target))
  }

  changeValue() {
    this.input.setAttribute(`value`, this.input.value);
  }
}
