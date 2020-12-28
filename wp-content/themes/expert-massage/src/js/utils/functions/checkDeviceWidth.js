import { GLOBAL_VARS } from '../constants/globalVars';

export default function checkDeviceWidth() {
  const deviceWidth = {
    isMobile: false,
    isTablet: false,
    isDesktop: false
  };

  if (globalThis.innerWidth < GLOBAL_VARS.breakpoints.tabletMinWidth) {
    deviceWidth.isMobile = true;
  } else if (globalThis.innerWidth >= GLOBAL_VARS.breakpoints.tabletMinWidth && globalThis.innerWidth < GLOBAL_VARS.breakpoints.desktopMinWidth) {
    deviceWidth.isTablet = true;
  } else {
    deviceWidth.isDesktop = true;
  }

  return deviceWidth;
}
