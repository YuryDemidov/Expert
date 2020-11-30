'use strict';

import '../../../modules/popups/popupAppointment';
import { DROPDOWN_STATES } from '../../../utils/constants/enums/dropdownStates';

document.querySelectorAll(`.dropdown[data-on=click]`).forEach(dropdown => {
  dropdown.addEventListener(`click`, dropdownToggleHandler);
})

function dropdownToggleHandler(evt) {
  if (evt.target.classList.contains(`dropdown__trigger`)) {
    const dropdown = evt.target.closest(`.dropdown`);

    evt.preventDefault();
    dropdown.dataset.state = dropdown.dataset.state === DROPDOWN_STATES.closed ? DROPDOWN_STATES.opened : DROPDOWN_STATES.closed;
  }
}
