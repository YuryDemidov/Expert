/* eslint-disable no-undef */

ymaps.ready(() => {
  init();
  hideStaticMap();
});

function init() {
  const map = new ymaps.Map(`map`, {
    center: [55.776, 37.6177],
    zoom: 15
  });

  // Создаём макет иконки.
  const iconLayout = ymaps.templateLayoutFactory.createClass(`
    <svg class='map-block__pin' width="28" height="46" style="position: absolute; top: -46px; left: -14px;">,
      <use href="#map-pin"/>,
    </svg>
  `);

  const placemark = new ymaps.Placemark([55.773935, 37.615505], false, {
    iconLayout: iconLayout
  });

  map.geoObjects
    .add(placemark);
}

function hideStaticMap() {
  document.querySelector(`.map-block__image`).classList.add(`hidden`);
}
