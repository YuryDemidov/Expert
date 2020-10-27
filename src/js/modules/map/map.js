/* eslint-disable no-undef */

ymaps.ready(init);
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

  const placemark = new ymaps.Placemark([55.774720281139686, 37.617739298052086], false, {
    iconLayout: iconLayout
  });

  map.geoObjects
    .add(placemark);
}
