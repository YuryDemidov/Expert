import isMobileDevice from '../functions/isMobileDevice';

export const GLOBAL_VARS = {
  breakpoints: {
    phoneMinWidth: 375,
    phoneLandscapeMinWidth: 576,
    tabletMinWidth: 768,
    smallDesktopMinWidth: 1024,
    desktopMinWidth: 1200,
    largeDesktopMinWidth: 1400
  },
  initialWindowWidth: globalThis.innerWidth,
  isAnimated: false,
  isRequestSent: false,
  isMobileDevice: isMobileDevice
};
