import Accordion from '../classes/Accordion';

const faqWrap = document.querySelector(`.faq`);
const faqAccordionNodes = faqWrap.querySelectorAll(`.accordion`);

faqAccordionNodes.forEach((node, i) => {
  const faqAccordion = new Accordion(node);
  faqAccordion.init();

  if (i === 0) {
    faqAccordion.open();
  }
});
