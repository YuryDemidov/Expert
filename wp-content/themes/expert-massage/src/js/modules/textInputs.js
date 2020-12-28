import TextInput from '../classes/Input/TextInput';
import PhoneInput from '../classes/Input/PhoneInput';

const phoneInputs = [];

document.querySelectorAll(`.text-input`).forEach(inputBlock => {
  const inputFieldNode = inputBlock.querySelector(`.text-input__input`);
  if (!inputFieldNode) {
    return;
  }

  const inputType = inputFieldNode.dataset?.type || inputFieldNode.type;

  let input;
  switch (inputType) {
    case `text`:
    default:
      input = new TextInput(inputBlock);
      break;
    case `tel`:
      input = new PhoneInput(inputBlock);
      phoneInputs.push(input);
      break;
  }
  input.init();
});

export { phoneInputs };
