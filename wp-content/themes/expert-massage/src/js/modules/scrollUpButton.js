import ScrollUpButton from '../classes/ScrollUpButton';

const scrollUpButtonNode = document.querySelector(`.scroll-top-button`);
const scrollUpButton = new ScrollUpButton(scrollUpButtonNode);

scrollUpButton.init();

export { scrollUpButton };
