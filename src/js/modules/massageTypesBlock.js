import Accordion from '../classes/Accordion';

const massageTypesSection = document.querySelector(`.massage-types`);
const massageAccordionsNodes = massageTypesSection.querySelectorAll(`.accordion`);

massageAccordionsNodes.forEach(node => {
  const massageAccordion = new Accordion(node);
  massageAccordion.init();
});
