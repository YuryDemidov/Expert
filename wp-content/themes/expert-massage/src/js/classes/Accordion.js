import expandBlock from '../utils/functions/expandBlock';
import collapseBlock from '../utils/functions/collapseBlock';
import { DROPDOWN_STATES } from '../utils/constants/enums/dropdownStates';

export default class Accordion {
  constructor(node) {
    this.node = node;
    this.trigger = node.querySelector(`.accordion__trigger`);
    this.body = node.querySelector(`.accordion__body`);
  }

  init() {
    this.trigger.addEventListener(`click`, evt => this.toggleState(evt));
  }

  toggleState(evt) {
    evt.preventDefault();

    if (this.node.dataset.state === DROPDOWN_STATES.closed) {
      this.open();
    } else {
      this.close();
    }
  }

  open() {
    if (this.node.dataset.state === DROPDOWN_STATES.opened) {
      return;
    }
    expandBlock(this.body, false);
    this.node.dataset.state = DROPDOWN_STATES.opened;
    this.trigger.ariaExpanded = true;
    this.body.ariaHidden = false;
  }

  close() {
    if (this.node.dataset.state === DROPDOWN_STATES.closed) {
      return;
    }
    collapseBlock(this.body, true);
    this.node.dataset.state = DROPDOWN_STATES.closed;
    this.trigger.ariaExpanded = false;
    this.body.ariaHidden = true;
  }
}
