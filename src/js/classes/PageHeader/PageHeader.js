import { HEADER_STATES } from '../../utils/constants/enums/headerStates';
import animateCss from '../../utils/functions/animateCss';

export default class PageHeader {
  constructor(node) {
    this.HEADER_STATE_CHANGE_OFFSET = 100; // px
    this.HEADER_STATE_CHANGE_WIDTH = 1200; // px
    this.node = node;
  }

  get state() {
    return this.node.dataset.state;
  }

  set state(state) {
    if (globalThis.innerWidth < this.HEADER_STATE_CHANGE_WIDTH) {
      return;
    }

    if (state === HEADER_STATES.fixed && this.state !== HEADER_STATES.fixed) {
      animateCss(this.node, `slide-in-down`);
    }
    this.node.dataset.state = state;
  }
}
