import PageHeader from '../classes/PageHeader/PageHeader';

const pageHeaderNode = document.querySelector(`.page-header`);
const pageHeader = new PageHeader(pageHeaderNode);

export { pageHeader };
