import IMask from 'imask';
import TextInput from './TextInput';
import { PHONE_MASKS } from '../../utils/constants/phoneMasks';
import { REGEXPS } from '../../utils/constants/regexps';

export default class PhoneInput extends TextInput {
  constructor(props) {
    super(props);
    this.mask = null;
  }

  init() {
    super.init();
    this.createMask();
    this.mask.on(`accept`, () => {
      if (this.mask.value === this.input.placeholder || !REGEXPS.NUMBER.test(this.mask.value)) {
        this.input.classList.remove(`text-input__input_focused`);
      } else {
        this.input.classList.add(`text-input__input_focused`);
      }
    });
  }

  createMask() {
    this.mask = IMask(this.input, {
      mask: PHONE_MASKS,
      dispatch: function (appended, dynamicMasked) {
        const number = (dynamicMasked.value + appended).replace(/\D/g, ``);

        return dynamicMasked.compiledMasks.find(function (m) {
          return number.indexOf(m.startsWith) === 0;
        });
      }
    });
  }
}
